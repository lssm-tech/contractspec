## Lifecycle Dashboard Example (Next.js)

This example shows a minimal App Router page that calls the lifecycle managed bundle via `/api/lifecycle/*` routes and renders a mobile-friendly status card.

### Structure

- `app/page.tsx` – client component with tabs for Stage, Actions, Libraries.
- Expected API routes:
  - `POST /api/lifecycle/assessments` → proxies to `LifecycleAssessmentService.runAssessment`
  - `GET /api/lifecycle/playbooks/:stage` → proxies to `service.getStagePlaybook`

### Run

```bash
cd packages/contractspec/examples/lifecycle-dashboard
bunx next dev
```

Make sure you register the API routes in your actual Next.js app; the page assumes they exist.*** End Patch





