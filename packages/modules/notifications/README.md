# @lssm/module.notifications

Website: https://contractspec.lssm.tech/


Notification center module for ContractSpec applications.

## Purpose

Provides a unified notification system supporting multiple delivery channels (email, in-app, push, webhook). Handles notification preferences, templates, and delivery tracking.

## Features

- **Multi-Channel Delivery**: Email, in-app, push notifications, webhooks
- **User Preferences**: Per-user notification preferences by type and channel
- **Templates**: Template-based notifications with variable substitution
- **Delivery Tracking**: Track delivery status and read receipts
- **Batching**: Digest and batch notifications to reduce noise

## Installation

```bash
bun add @lssm/module.notifications
```

## Usage

### Entity Specs (for schema generation)

```typescript
import { notificationsSchemaContribution } from '@lssm/module.notifications/entities';

// Use in schema composition
const config = {
  modules: [notificationsSchemaContribution],
};
```

### Send Notifications

```typescript
import { NotificationService } from '@lssm/module.notifications';

const service = new NotificationService({
  channels: {
    email: emailChannel,
    inApp: inAppChannel,
    push: pushChannel,
  },
  defaultChannel: 'inApp',
});

// Send a notification
await service.send({
  userId: 'user-123',
  templateId: 'welcome',
  variables: {
    name: 'John',
    actionUrl: 'https://app.example.com/onboarding',
  },
  channels: ['email', 'inApp'],
});
```

### Configure Templates

```typescript
import { defineTemplate } from '@lssm/module.notifications/templates';

const welcomeTemplate = defineTemplate({
  id: 'welcome',
  name: 'Welcome Email',
  channels: {
    email: {
      subject: 'Welcome to {{appName}}, {{name}}!',
      body: `
        <h1>Welcome, {{name}}!</h1>
        <p>Thanks for joining. Get started by clicking below.</p>
        <a href="{{actionUrl}}">Get Started</a>
      `,
    },
    inApp: {
      title: 'Welcome to {{appName}}!',
      body: 'Click here to complete your profile.',
      actionUrl: '{{actionUrl}}',
    },
  },
});
```

### User Preferences

```typescript
// Get user preferences
const prefs = await service.getPreferences('user-123');

// Update preferences
await service.updatePreferences('user-123', {
  email: { marketing: false, transactional: true },
  push: { mentions: true, updates: false },
});
```

## Entity Overview

| Entity | Description |
|--------|-------------|
| Notification | Individual notification instance |
| NotificationTemplate | Notification templates |
| NotificationPreference | User notification preferences |
| DeliveryLog | Delivery attempt tracking |

## Channels

| Channel | Description |
|---------|-------------|
| email | Email delivery (SMTP, SendGrid, etc.) |
| inApp | In-application notifications |
| push | Push notifications (FCM, APNs) |
| webhook | Webhook delivery for integrations |

