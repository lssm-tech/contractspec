# Open Questions

## Product and packaging

1. When should Builder remain Studio-embedded versus become a distinct app?
2. Which app classes deserve first-class templates?
3. Will provider credentials be tenant-supplied, platform-supplied, or both?

## Runtime modes

4. What minimum local runtime form factor is supported first: daemon, Docker bundle, appliance, desktop app?
5. How much evidence should be allowed to leave local runtime in hybrid mode?
6. Should managed runtime be allowed to orchestrate local-only provider calls through a relay?

## Mobile parity

7. Which actions are allowed fully inside Telegram/WhatsApp and which require secure mobile deep-link?
8. What is the minimum acceptable offline / low-bandwidth mobile behavior?
9. How should we handle long diff review on messaging channels without degrading comprehension?

## Provider layer

10. Which provider becomes the first default coding provider?
11. Should comparison mode be opt-in by workspace, by risk level, or by policy?
12. How should cost ceilings be expressed in routing policy?

## Governance

13. Which approval strengths are acceptable for local runtime operations triggered from mobile?
14. How are suspicious channel events or compromised bindings surfaced to admins?
15. What default retention policy applies to transcripts, provider receipts, and preview artifacts?

## Delivery

16. Which part lands first as working code: provider contracts or mobile control?
17. Which harness suites are mandatory in the first release versus staged later?
18. How do we package example templates without creating a second incompatible spec system?
