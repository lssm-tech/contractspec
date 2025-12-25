# @lssm/lib.bus

Website: https://contractspec.lssm.tech/


A lightweight, type-safe event bus for in-memory and distributed event handling.

## Purpose

To decouple components and services by allowing them to communicate via typed events. This library provides the core `EventBus` interface and implementations for local (in-memory) and potentially remote communication.

## Installation

```bash
npm install @lssm/lib.bus
# or
bun add @lssm/lib.bus
```

## Key Concepts

- **EventBus Interface**: A standard contract for `publish` and `subscribe`.
- **Type Safety**: leveraging `@lssm/lib.contracts` event definitions for payload validation.
- **Decoupling**: Producers and consumers don't need to know about each other.

## Exports

- `EventBus`: The core interface.
- `InMemoryEventBus`: A simple, synchronous/asynchronous in-memory implementation.
- `NoOpEventBus`: A placeholder implementation for testing or disabling events.

## Usage

```tsx
import { InMemoryEventBus } from '@lssm/lib.bus';

// 1. Create the bus
const bus = new InMemoryEventBus();

// 2. Subscribe to an event
const unsubscribe = bus.subscribe('user.created', async (payload) => {
  console.log('New user:', payload.userId);
});

// 3. Publish an event
await bus.publish('user.created', { userId: '123', email: 'test@example.com' });

// 4. Cleanup
unsubscribe();
```


































