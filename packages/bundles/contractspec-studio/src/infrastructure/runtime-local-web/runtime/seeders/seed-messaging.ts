import type { LocalDatabase } from '../../database/sqlite-wasm';
import { SEED_TIME_ISO } from './seed-constants';

export async function seedMessaging(params: {
  projectId: string;
  db: LocalDatabase;
}): Promise<void> {
  const { projectId, db } = params;
  const existing = await db.exec(
    `SELECT COUNT(*) as count FROM template_conversation WHERE projectId = ?`,
    [projectId]
  );
  if ((existing[0]?.count as number) > 0) return;

  const conversationId = 'msg_conversation_1';
  await db.run(
    `INSERT INTO template_conversation (id, projectId, name, isGroup, updatedAt)
     VALUES (?, ?, ?, ?, ?)`,
    [conversationId, projectId, 'Studio Core Team', 1, SEED_TIME_ISO]
  );

  const participants = [
    {
      id: 'msg_participant_1',
      userId: 'theo',
      displayName: 'Théo',
      role: 'Builder',
    },
    {
      id: 'msg_participant_2',
      userId: 'claire',
      displayName: 'Claire',
      role: 'Lifecycle',
    },
    {
      id: 'msg_participant_3',
      userId: 'amir',
      displayName: 'Amir',
      role: 'Ops',
    },
  ] as const;

  for (const p of participants) {
    await db.run(
      `INSERT INTO template_conversation_participant (id, conversationId, projectId, userId, displayName, role, joinedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [p.id, conversationId, projectId, p.userId, p.displayName, p.role, SEED_TIME_ISO]
    );
  }

  const messages = [
    {
      id: 'msg_message_1',
      senderId: 'claire',
      senderName: 'Claire',
      content:
        'Morning! Just ran the lifecycle scan, team is still in MVP→PMF crossover.',
    },
    {
      id: 'msg_message_2',
      senderId: 'amir',
      senderName: 'Amir',
      content: 'Copy that. I will prep the deployment ceremony in Sandbox.',
    },
    {
      id: 'msg_message_3',
      senderId: 'theo',
      senderName: 'Théo',
      content:
        'Great — I will stitch the new example bundles before the demo.',
    },
  ] as const;

  for (const message of messages) {
    await db.run(
      `INSERT INTO template_message (id, conversationId, projectId, senderId, senderName, content, attachments, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        message.id,
        conversationId,
        projectId,
        message.senderId,
        message.senderName,
        message.content,
        JSON.stringify([]),
        'SENT',
      ]
    );
  }
}




