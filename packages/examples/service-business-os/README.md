# @lssm/example.service-business-os

Website: https://contractspec.lssm.tech/


Service Business OS reference example (clients → quotes → jobs → invoices → payments).

Highlights:

- Multi-tenant clients with role-based access via `@lssm/lib.identity-rbac`
- Quote lifecycle (draft → sent → accepted/rejected)
- Jobs scheduling and completion with reminders via `@lssm/lib.jobs`
- Invoicing and payments with audit trail + notifications
- Attachments for proposals and receipts via `@lssm/lib.files`

Use this as a spec-first starting point for field services, agencies, or professional services teams.
