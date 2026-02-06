---
id: INT-002
source_type: interview
synthetic: true
date: 2026-01-16
product_area: onboarding
persona:
  role: PM
  company_size: 50-200
  industry: SaaS
segment: midmarket
channel: call-notes
jobs_to_be_done:
  - "Improve activation rate"
  - "Define clear milestones for onboarding"
pains:
  - tag: "activation_unknown"
    severity: 5
    frequency: 4
  - tag: "blind_experiments"
    severity: 4
    frequency: 3
desired_outcomes:
  - metric: activation_rate
    direction: up
  - metric: time_to_value
    direction: down
constraints:
  - "Limited analytics instrumentation"
  - "No dedicated growth team"
signals:
  - "mentions churn risk"
  - "mentions competitor"
---

PM: We have about one hundred signups a week, and only around twenty users make it past setup. That's an 18–20% activation rate. It's unacceptable.
Interviewer: How do you define “activated” at the moment?
PM: Honestly, we don't have a shared definition. Some people say it's when the workspace is created, others think it's when the first project is completed. It changes depending on who you ask.
PM: Without a definition, it's hard to improve anything. We're shipping onboarding tweaks blind. Sometimes we rename a field and hope it works.
Interviewer: What do you think would help improve activation?
PM: We need clear milestones. For example, Step 1: Create workspace. Step 2: Invite at least two teammates. Step 3: Complete first task. Then we can say a customer is activated when they do X or Y.
PM: I'd like to be able to nudge users if they stall. A simple checklist with percentages would let us intervene when someone hasn't reached Step 2.
Interviewer: How are you currently gathering feedback?
PM: Mostly through support tickets and qualitative interviews. We don't have good telemetry. We track signups and logins, but nothing between.
PM: I'd love to export events into our analytics tool. Right now, if we change the onboarding flow, the backend isn't aware. It's decoupled.
PM: Another issue is that we roll out changes to everyone at once. I'd like to experiment on a subset of users. Without feature flags it's hard.
Interviewer: Have you looked at any competitors?
PM: Competitor X uses an activation dashboard. You can see where users drop off. They set success metrics and track them automatically. We need that.
PM: Activation should be tied to metrics. If we improve time to value by 20%, that's huge. But we can't measure it.
Interviewer: Anything else you'd like to see in an onboarding tool?
PM: Flexibility. Each segment might require different steps. SMBs could skip some settings; enterprise needs more security checks. The product should adapt instead of giving everyone the same flow.
PM: Also, I'd like the ability to embed tips or videos at each step. But I know our support team is drowning, so maybe this is a longer‑term idea.