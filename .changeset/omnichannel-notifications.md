---
"@contractspec/module.notifications": minor
---

Add concrete omnichannel notification channels for email, SMS, Telegram, and WhatsApp.

`@contractspec/module.notifications` now ships provider-backed channel adapters instead of leaving email as an abstract stub. The module also expands its contract/entity/template channel surface so notification flows can represent `SMS`, `TELEGRAM`, and `WHATSAPP` alongside the existing email, in-app, push, and webhook paths.
