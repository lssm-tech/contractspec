# @lssm/lib.jobs

Background jobs and scheduler module for ContractSpec applications.

## Purpose

Provides a generic system for asynchronous and scheduled work. Supports multiple queue backends (memory, Redis, GCP Cloud Tasks) and cron-like scheduling for recurring jobs.

## Features

- **Job Queue**: Async job processing with retry policies
- **Scheduler**: Cron-like scheduling for recurring jobs
- **Multiple Backends**: Memory, Redis, GCP Cloud Tasks, GCP Pub/Sub
- **Type Safety**: Typed job definitions with Zod schemas
- **Dead Letter Queue**: Automatic handling of failed jobs
- **Entity Specs**: Prisma schema generation for job persistence

## Installation

```bash
bun add @lssm/lib.jobs
```

## Usage

### Define a Job Type

```typescript
import { defineJobType } from '@lssm/lib.jobs';
import * as z from "zod";

const SendEmailJob = defineJobType({
  type: 'email.send',
  version: 1,
  payload: z.object({
    to: z.string().email(),
    subject: z.string(),
    body: z.string(),
  }),
  options: {
    maxRetries: 3,
    backoffMs: 5000,
    timeoutMs: 30000,
  },
});
```

### Create a Queue

```typescript
import { MemoryJobQueue, RedisJobQueue } from '@lssm/lib.jobs/queue';

// In-memory for development
const queue = new MemoryJobQueue();

// Redis for production
const queue = new RedisJobQueue({
  redis: redisClient,
  prefix: 'jobs:',
});
```

### Enqueue and Process Jobs

```typescript
// Enqueue
await queue.enqueue('email.send', {
  to: 'user@example.com',
  subject: 'Welcome!',
  body: 'Thanks for signing up.',
});

// Register handler
queue.register('email.send', async (job) => {
  await sendEmail(job.payload);
});

// Start processing
queue.start();
```

### Schedule Recurring Jobs

```typescript
import { JobScheduler } from '@lssm/lib.jobs/scheduler';

const scheduler = new JobScheduler(queue);

// Run daily at midnight
scheduler.schedule('daily-cleanup', '0 0 * * *', async () => {
  await cleanupOldRecords();
});

// Run every 5 minutes
scheduler.schedule('sync-data', '*/5 * * * *', async () => {
  await syncExternalData();
});

scheduler.start();
```

## Entity Specs (for schema generation)

```typescript
import { jobsSchemaContribution } from '@lssm/lib.jobs/entities';

// Use in schema composition
const config = {
  modules: [jobsSchemaContribution],
};
```

## Events

| Event | Trigger |
|-------|---------|
| job.enqueued | Job added to queue |
| job.started | Job processing started |
| job.completed | Job finished successfully |
| job.failed | Job failed after retries |
| job.retrying | Job is being retried |
| scheduler.tick | Scheduler checked for due jobs |

