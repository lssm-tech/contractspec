# @lssm/lib.logger

This library builds with tsdown using the shared `@lssm/tool.tsdown` presets.

A comprehensive logging library optimized for Bun with **first-class ElysiaJS integration**, distributed tracing, context management, and beautiful development output.

## Features

- 🚀 **Optimized for Bun** - Uses Bun's native performance APIs and optimized for Bun runtime
- 🦋 **ElysiaJS Native** - Seamless integration with [ElysiaJS](https://elysiajs.com) lifecycle and context
- 🔍 **Distributed Tracing** - Track operations across HTTP, WebSocket, cron, and queue processing
- ⏱️ **Performance Timing** - Built-in high-precision timing for operations
- 🔄 **Context Management** - Maintain context across async operations (like cls-hooked/nestjs-cls)
- 🎨 **Environment-aware Output** - Pretty logs in dev, structured JSON in production
- 🔌 **Easy Integrations** - Built-in middleware for HTTP, WebSocket, cron, and queues

## Installation

```bash
bun add @lssm/lib.logger
# If using ElysiaJS
bun add elysia @lssm/lib.logger
```

## Quick Start

```typescript
import { logger, Logger, LogLevel } from "@lssm/lib.logger";

// Basic logging
logger.info("Server started", { port: 3000 });
logger.error("Database error", { table: "users" }, error);

// Create a custom logger
const customLogger = new Logger({
  level: LogLevel.DEBUG,
  environment: "production",
  enableTracing: true,
});
```

## Core Logging

```typescript
import { logger } from "@lssm/lib.logger";

// Different log levels
logger.trace("Detailed debug info"); // TRACE level
logger.debug("Debug information"); // DEBUG level
logger.info("General information"); // INFO level
logger.warn("Warning message"); // WARN level
logger.error("Error occurred", {}, err); // ERROR level
logger.fatal("Critical error", {}, err); // FATAL level
```

## Context Management

The logger maintains context across async operations using AsyncLocalStorage:

```typescript
import { logger } from "@lssm/lib.logger";

// Run code within a context
logger.withContext({ userId: "123", requestId: "abc" }, () => {
  logger.info("Processing user request"); // Will include userId and requestId

  someAsyncOperation(); // Context is maintained across async calls
});

// Extend existing context
logger.extendContext({ operation: "payment" }, () => {
  logger.info("Processing payment"); // Includes all previous context + operation
});

// Set individual context values
logger.setContext("sessionId", "xyz789");
logger.info("User action"); // Will include sessionId

// Get current context
const context = logger.getContext();
console.log(context); // { userId: '123', requestId: 'abc', sessionId: 'xyz789' }
```

## Distributed Tracing

Track operations across your application with automatic span management:

```typescript
import { logger } from "@lssm/lib.logger";

// Trace an operation
await logger.trace(
  {
    operationType: "http",
    operationName: "GET /api/users",
    metadata: { userId: "123" },
    tags: ["api", "users"],
    autoTiming: true,
  },
  async () => {
    // Your operation code here
    const users = await fetchUsers();
    return users;
  }
);

// Manual span management
const span = logger.startSpan({
  operationType: "database",
  operationName: "user-query",
});

try {
  const result = await database.query("SELECT * FROM users");
  logger.addTraceMetadata("rowCount", result.length);
  logger.addTraceTags("database", "users");
  return result;
} finally {
  logger.finishSpan(span.spanId);
}
```

## Performance Timing

Measure execution times with high precision:

```typescript
import { logger } from "@lssm/lib.logger";

// Start a timer
const timer = logger.startTimer("database-operation");

// ... do some work ...

const duration = timer.stop();
console.log(`Operation took ${duration}ms`);

// Profile function execution
const result = await logger.profile(
  "expensive-calculation",
  async () => {
    return await someExpensiveOperation();
  },
  { logResult: true, logLevel: LogLevel.INFO }
);

// Manual timing with laps
const timer2 = logger.startTimer("multi-step-process");
timer2.lap("step-1-complete");
// ... more work ...
timer2.lap("step-2-complete");
const total = timer2.stop();
```

## ElysiaJS Integration

### Basic Setup

```typescript
import { Elysia } from "elysia";
import { elysiaLogger } from "@lssm/lib.logger";

const app = new Elysia()
  .use(
    elysiaLogger({
      logRequests: true,
      logResponses: true,
      excludePaths: ["/health", "/metrics"],
    })
  )
  .get("/", ({ logInfo }) => {
    logInfo("Processing request");
    return "Hello World";
  })
  .listen(3000);
```

The plugin automatically:

- ✅ Logs all incoming requests with timing
- ✅ Logs responses with status codes and duration
- ✅ Traces operations with correlation IDs
- ✅ Maintains context across async operations
- ✅ Provides helper functions in route context

### Advanced ElysiaJS Usage

```typescript
import { Elysia } from "elysia";
import {
  elysiaLogger,
  createDatabaseUtils,
  Logger,
  LogLevel,
} from "@lssm/lib.logger";

const customLogger = new Logger({
  level: LogLevel.DEBUG,
  environment: "production",
});

const db = createDatabaseUtils(customLogger);

const app = new Elysia()
  .use(
    elysiaLogger({
      logger: customLogger,
      maskSensitiveData: true,
    })
  )
  .derive(() => ({ db }))
  .get("/users", async ({ logInfo, traceOperation, db }) => {
    logInfo("Fetching users from database");

    const users = await traceOperation("fetch-users", async () => {
      return db.query("select-users", () =>
        // Your database query here
        Promise.resolve([{ id: 1, name: "John" }])
      );
    });

    return users;
  })
  .listen(3000);
```

### ElysiaJS WebSocket Logging

```typescript
import { Elysia } from "elysia";
import { elysiaLogger, createWebSocketUtils } from "@lssm/lib.logger";

const wsLogger = createWebSocketUtils();

const app = new Elysia()
  .use(elysiaLogger())
  .ws("/chat", {
    open(ws) {
      const connectionId = crypto.randomUUID();
      wsLogger.logConnection(connectionId, {
        userAgent: ws.data.headers?.["user-agent"],
      });
    },
    message(ws, message) {
      wsLogger.logMessage(ws.id, typeof message, message.length);
      ws.send(`Echo: ${message}`);
    },
    close(ws, code, reason) {
      wsLogger.logDisconnection(ws.id, code, reason);
    },
  })
  .listen(3000);
```

### ElysiaJS with Authentication Logging

```typescript
import { Elysia } from "elysia";
import { elysiaLogger, createAuthUtils } from "@lssm/lib.logger";

const authLogger = createAuthUtils();

const app = new Elysia()
  .use(elysiaLogger())
  .derive(() => ({ authLogger }))
  .post("/auth/login", async ({ body, authLogger }) => {
    try {
      // Your authentication logic
      const user = await authenticateUser(body.email, body.password);

      authLogger.logLogin(user.id, {
        email: body.email,
        ip: request.headers.get("x-forwarded-for"),
      });

      return { success: true, token: generateToken(user) };
    } catch (error) {
      authLogger.logAuthFailure("invalid_credentials", {
        email: body.email,
      });
      throw error;
    }
  })
  .listen(3000);
```

### Production Configuration for ElysiaJS

```typescript
import { Elysia } from "elysia";
import { elysiaLogger, Logger, LogLevel } from "@lssm/lib.logger";

const productionLogger = new Logger({
  level: LogLevel.INFO,
  environment: "production",
  enableTracing: true,
  enableTiming: true,
});

const app = new Elysia()
  .use(
    elysiaLogger({
      logger: productionLogger,
      logRequests: true,
      logResponses: true,
      excludePaths: ["/health", "/metrics", "/favicon.ico"],
      maskSensitiveData: true,
    })
  )
  .get("/health", () => ({ status: "ok" })) // This won't be logged
  .get("/api/*", ({ logInfo, traceOperation }) => {
    // All API routes automatically logged and traced
    return traceOperation("business-logic", async () => {
      // Your business logic here
      return { success: true };
    });
  })
  .listen(3000);
```

## HTTP Integration (Non-ElysiaJS)

### Express/Hono Middleware

```typescript
import { createHttpMiddleware } from "@lssm/lib.logger";
import express from "express";

const app = express();

// Add logging middleware
app.use(createHttpMiddleware()); // Uses default logger

// All subsequent requests will have context and tracing
app.get("/api/users", (req, res) => {
  logger.info("Fetching users"); // Automatically includes request context
  // ... handle request
});
```

### Bun HTTP Server

```typescript
import { createBunHttpHandler } from "@lssm/lib.logger";

const handler = createBunHttpHandler(async (req) => {
  // Request is automatically traced and timed
  logger.info("Processing request"); // Includes request context

  return new Response("Hello World");
});

Bun.serve({
  fetch: handler,
  port: 3000,
});
```

## WebSocket Integration

```typescript
import { createWebSocketMiddleware } from "@lssm/lib.logger";

const wsMiddleware = createWebSocketMiddleware();

// WebSocket server setup
const server = Bun.serve({
  websocket: {
    open: wsMiddleware.onOpen,
    message: wsMiddleware.onMessage,
    close: wsMiddleware.onClose,
    error: wsMiddleware.onError,
  },
});
```

## Cron Job Integration

```typescript
import { createCronWrapper } from "@lssm/lib.logger";

const cronWrapper = createCronWrapper();

// Wrap your cron jobs
const wrappedJob = cronWrapper("daily-cleanup", async () => {
  logger.info("Starting daily cleanup");
  await cleanupOldData();
  logger.info("Cleanup completed");
});

// Schedule with your preferred cron library
schedule.scheduleJob("0 2 * * *", wrappedJob);
```

## Queue Processing Integration

```typescript
import { createQueueWrapper } from "@lssm/lib.logger";

const queueWrapper = createQueueWrapper();

// Wrap queue processors
const processEmailJob = queueWrapper.wrapProcessor(
  "email-queue",
  async (job: EmailJob, jobId: string) => {
    logger.info("Processing email job", { recipient: job.recipient });
    await sendEmail(job);
    return { success: true };
  }
);

// Log queue events
queueWrapper.logEnqueue("email-queue", "job-123", emailData);
queueWrapper.logDequeue("email-queue", "job-123");
queueWrapper.logRetry("email-queue", "job-123", 2, 5);
```

## Database Integration

```typescript
import { createDatabaseWrapper } from "@lssm/lib.logger";

const dbWrapper = createDatabaseWrapper();

// Wrap database operations
const users = await dbWrapper.wrapQuery(
  "fetch-users",
  () => prisma.user.findMany(),
  { table: "users", operation: "findMany" }
);
```

## Configuration

```typescript
import { Logger, LogLevel } from "@lssm/lib.logger";

const logger = new Logger({
  level: LogLevel.INFO, // Minimum log level
  environment: "production", // 'development' | 'production' | 'test'
  enableTracing: true, // Enable distributed tracing
  enableTiming: true, // Enable performance timing
  enableContext: true, // Enable context management
  enableColors: true, // Enable colors in dev output
  maxContextDepth: 10, // Max nested context depth
  timestampFormat: "iso", // 'iso' | 'epoch' | 'relative'
});
```

## Custom Formatters

```typescript
import {
  Logger,
  CustomFormatter,
  DevFormatter,
  ProductionFormatter,
} from "@lssm/lib.logger";

// Use custom formatter
const customFormatter = new CustomFormatter(
  "{timestamp} [{level}] {traceId} {message}",
  (date) => date.toLocaleDateString()
);

const logger = new Logger();
logger.setFormatter(customFormatter);

// Or create your own
class MyFormatter implements Formatter {
  format(entry: LogEntry): string {
    return `${entry.timestamp} - ${entry.message}`;
  }
}
```

## Example Output

### Development Mode (Pretty)

```
14:32:15.123 ● INFO  [trace:a1b2c3d4|span:e5f6g7h8] HTTP request started (12.34ms)
Context: { userId: "123", requestId: "req-456" }
Metadata: { method: "GET", url: "/api/users", userAgent: "Mozilla/5.0..." }

14:32:15.135 ✖ ERROR Database connection failed (156.78ms)
Error: ConnectionError: Unable to connect to database
  at DatabaseClient.connect (database.js:45:12)
  at UserService.fetchUsers (user-service.js:23:8)
  at ApiHandler.getUsers (api-handler.js:67:15)
```

### Production Mode (JSON)

```json
{"timestamp":"2024-01-15T14:32:15.123Z","level":"info","message":"HTTP request started","traceId":"a1b2c3d4e5f6g7h8","spanId":"e5f6g7h8","duration":12.34,"context":{"userId":"123","requestId":"req-456"},"metadata":{"method":"GET","url":"/api/users"}}

{"timestamp":"2024-01-15T14:32:15.135Z","level":"error","message":"Database connection failed","traceId":"a1b2c3d4e5f6g7h8","duration":156.78,"error":{"name":"ConnectionError","message":"Unable to connect to database","stack":"ConnectionError: Unable to connect to database\n    at DatabaseClient.connect..."}}
```

## Best Practices

1. **Use context for request correlation**:

   ```typescript
   logger.withContext({ requestId, userId }, () => {
     // All logs in this scope will include requestId and userId
   });
   ```

2. **Trace important operations**:

   ```typescript
   await logger.trace(
     {
       operationType: "database",
       operationName: "user-creation",
     },
     () => createUser(userData)
   );
   ```

3. **Profile performance-critical code**:

   ```typescript
   const result = await logger.profile("data-processing", () => {
     return processLargeDataset(data);
   });
   ```

4. **Use appropriate log levels**:

   - `trace`: Very detailed debugging (typically disabled in production)
   - `debug`: Debugging information
   - `info`: General application flow
   - `warn`: Warning conditions
   - `error`: Error conditions
   - `fatal`: Critical errors that might cause the application to exit

5. **Clean up in production**:
   ```typescript
   process.on("SIGTERM", async () => {
     await logger.flush();
     process.exit(0);
   });
   ```

## License

MIT
