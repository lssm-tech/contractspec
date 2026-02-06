---
id: INT-005
source_type: interview
synthetic: true
date: 2026-01-18
product_area: onboarding
persona:
  role: SupportLead
  company_size: 50-200
  industry: SaaS
segment: midmarket
channel: call-notes
jobs_to_be_done:
  - "Reduce repetitive support tickets"
  - "Enable users to self‑serve during onboarding"
pains:
  - tag: "step_two_friction"
    severity: 5
    frequency: 4
  - tag: "validation_missing"
    severity: 4
    frequency: 3
desired_outcomes:
  - metric: support_ticket_volume
    direction: down
  - metric: activation_rate
    direction: up
constraints:
  - "Limited team size"
signals:
  - "mentions churn risk"
---

SupportLead: Half of our tickets are "I'm stuck on step two". Users start setup, hit step two, and can't progress.
Interviewer: What's step two?
SupportLead: It's the part where they need to connect an integration and set up a custom field. The UI doesn't explain what the field is for. People type random data and then our system rejects it with a vague error.
SupportLead: There is no inline validation. Users don't know the required format until they submit and get an error. By then they're frustrated.
Interviewer: How often does this happen?
SupportLead: Six tickets a week mention the exact same error message. It might not sound like a lot, but for a small support team that's huge.
SupportLead: We could save so much time by adding proper defaults or making the field optional for SMBs. Enterprise can configure it later.
Interviewer: Have you tried adding documentation?
SupportLead: We have an article, but nobody reads it. People open tickets instead. We need help in the product itself. A tooltip or example value would go a long way.
SupportLead: Another common ticket is "I completed onboarding but can't find feature X". They think onboarding finished when the progress bar hit 100%, but there are still hidden steps.
SupportLead: So I'd like an end‑of‑setup confirmation that summarises what was actually configured and what remains.
Interviewer: Anything else you'd change?
SupportLead: Self‑serve data import. Right now people email us CSVs. If we had an import wizard, support would not need to do manual migrations.
Interviewer: That seems like a product change.
SupportLead: Yes, but the number of tickets for "please import my data" is growing. Automating that would help both support and customers.