# The developer and partner hub

Moved verbatim from CLAUDE.md on 2026-11-23, which now keeps a briefing and points here.

## The developer and partner hub (`/developers`)

Self-service technical onboarding: overview, quick start, API v1 reference, Python, MCP,
formats, analysis catalogue, outputs, data handling, integration patterns, downloads,
partner onboarding. Docs-style layout in `src/app/developers/layout.tsx`, primitives in
`src/components/developers/doc.tsx`, content in `src/content/developers/`. The sidebar,
mobile menu and `sitemap.ts` all read `content/developers/nav.ts`.

**Nothing on these pages is a second copy of something core owns.**

- The endpoint list on `/developers/api/v1` is read from the live `/v1/openapi.json` at
  build and revalidated hourly (`src/lib/openapi.ts`). `content/developers/api-v1.ts` holds
  only what the schema cannot say (notes, errors, limits, envelope), restated from core's
  `oxynet/api/v1.py`, `store.py`, `auth.py`, `usage.py`. Where served docs and code
  disagree, the code wins.
- Formats come from the generated `FORMATS`; `content/developers/formats.ts` gives each id
  a public description typed `satisfies Record<FormatId, ...>`, so a new core format fails
  `tsc` until it is described. Public wording omits cohort codes and institution names.
- MCP tools come from `MCP_TOOLS`, typed the same way on the MCP page.
- Recorded JSON is imported from `manual/data/api-results.json` and labelled as the
  manual's abridged recording. Never hand-edit it for the site.
- Downloadable examples and the two synthetic samples live once in `public/developers/`,
  and the pages render them from the same bytes via `src/lib/examples.ts`. The samples are
  `GET /v1/sample` output; refresh them from the API, never edit them.
- Maturity uses the manual's three words only: Production, Available, Research
  (`content/developers/maturity.ts`). Local and embedded deployment carry "By arrangement",
  an availability label, not a fourth maturity state.
- Unknowns are shown as `<Callout tone="todo">`, never filled with a plausible guess.
- `DOCS.version` / `DOCS.updated` in `content/developers/meta.ts` are stamped on every page.
  Bump them when a change would matter to an integrator. A v2 API gets
  `/developers/api/v2` beside v1; `/developers/api` redirects to the current version.
