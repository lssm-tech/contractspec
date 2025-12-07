// worker-dlq.ts
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';

async function main() {
  const region = process.env.SCW_REGION ?? 'par';
  const endpoint =
    process.env.SCW_SQS_ENDPOINT ?? 'https://sqs.mnq.fr-par.scaleway.com';

  const accessKeyId = process.env.SCALEWAY_ACCESS_KEY_QUEUE;
  const secretAccessKey = process.env.SCALEWAY_SECRET_KEY_QUEUE;

  const dlqUrl = process.env.SCALEWAY_SQS_QUEUE_DLQ_URL;
  const mainQueueUrl = process.env.SCALEWAY_SQS_QUEUE_URL;

  const replay = process.argv.includes('--replay');

  if (!accessKeyId || !secretAccessKey) {
    console.error(
      'Missing SCALEWAY_ACCESS_KEY_QUEUE / SCALEWAY_SECRET_KEY_QUEUE in env'
    );
    process.exit(1);
  }

  if (!dlqUrl) {
    console.error('SCALEWAY_SQS_QUEUE_DLQ_URL is not set');
    process.exit(1);
  }

  if (replay && !mainQueueUrl) {
    console.error('SCALEWAY_SQS_QUEUE_URL is required for --replay');
    process.exit(1);
  }

  const sqs = new SQSClient({
    region,
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  console.log('[dlq] DLQ worker started');
  console.log('[dlq] DLQ URL:', dlqUrl);
  if (replay) {
    console.log('[dlq] Replay enabled, main queue URL:', mainQueueUrl);
  }

  while (true) {
    const res = await sqs.send(
      new ReceiveMessageCommand({
        QueueUrl: dlqUrl,
        MaxNumberOfMessages: 5,
        WaitTimeSeconds: 10,
      })
    );

    const messages = res.Messages ?? [];
    if (messages.length === 0) {
      console.log('[dlq] No more messages, exiting');
      break;
    }

    for (const msg of messages) {
      if (!msg.Body || !msg.ReceiptHandle) {
        console.warn('[dlq] Malformed message', msg.MessageId);
        continue;
      }

      console.log(
        '[dlq] Message id=%s body=%s',
        msg.MessageId,
        msg.Body.slice(0, 500)
      );

      if (replay && mainQueueUrl) {
        await sqs.send(
          new SendMessageCommand({
            QueueUrl: mainQueueUrl,
            MessageBody: msg.Body,
          })
        );
        console.log('[dlq] Replayed to main queue:', msg.MessageId);
      }

      await sqs.send(
        new DeleteMessageCommand({
          QueueUrl: dlqUrl,
          ReceiptHandle: msg.ReceiptHandle,
        })
      );
      console.log('[dlq] Deleted from DLQ:', msg.MessageId);
    }
  }

  console.log('[dlq] Done');
}

main().catch((err) => {
  console.error('[dlq] Fatal error', err);
  process.exit(1);
});
