# Talent Harbor

A polished Vite + React recruitment directory for browsing frontend engineering candidates and reviewing individual profiles.

## Setup

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run build
npm run test
```

## Feature checklist

- Two routes only: `/` and `/candidate/:id`
- Recruitment landing section with product name, CTA, and stats
- Candidate directory with cards, score, status, skills, facts, and profile links
- Search by name, headline, or skill
- Filters for location, skill, availability, status, and minimum experience
- Sorting by recently updated, highest score, and most experience
- Results count, active filter chips, and one-click reset
- Loading skeletons, empty state, and retryable error state
- Candidate profile with summary, skills, experience, projects, metadata, and links
- Shortlist and Reject actions that update profile UI and persist back to the directory
- Responsive layouts for mobile and desktop

## Technical focus

1. URL-driven state: directory search, filters, and sort are stored in query params.
2. State management: candidate actions are managed through a small React context and persisted in `localStorage`.
3. Data layer and caching: candidate fetching lives in `src/services/candidatesApi.ts` with simulated latency and a simple in-memory cache.
4. Reusable component system: shared `Button`, `Badge`, `Tag`, `Stat`, cards, filters, and state blocks.
5. Testing: Vitest coverage for filtering, query-param helpers, and badge rendering.
6. Accessibility basics: semantic landmarks, labeled controls, keyboard-friendly links/buttons, focus states, and ARIA labels.

## Data approach

The app uses the provided candidate dataset as mock data at `src/data/candidates.json`. The service layer simulates API latency so loading states are visible and realistic.

To see the error state, open the directory with:

```text
/?simulateError=1
```

## Tradeoffs and next improvements

- The data cache is intentionally simple; React Query or SWR would be a good next step for a production app.
- Shortlist/reject state is local to the browser. A backend mutation layer would be needed for collaboration.
- Tests focus on core logic and one UI primitive. Broader integration tests could cover route navigation and profile actions.
