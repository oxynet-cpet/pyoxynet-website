# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

This is the Oxynet marketing site — a Next.js 14 site for Oxynet, a computational layer
that turns cardiopulmonary exercise test (CPET) signals into structured physiological
measurements.

- **Branch:** `main` (active development; ahead of `next`, which is stale)
- **Legacy:** `gh-pages` (old Jekyll site, kept for reference)
- **Domain:** `www.oxynet.net` (DNS pointed to Vercel)

## The sister repo: this is not the only Oxynet property

`app.oxynet.net` is the product; this site is the front door to it. It is built from
`../oxynet-core/ui` (React + Vite) in a separate repository, and the two are
deliberately indistinguishable to a visitor who moves between them.

**The shared values are generated, not hand-copied.** Since 2026-09-16 their source is the
orchestration repo (`~/oxynet`, the parent of this checkout): `registry/brand.toml` for the
tokens and domain colours, and `registry/core-surface.json`, extracted from the app repo, for
the format count, the MCP tool list and the mark. `python3 harness/registry.py sync` there
writes `src/generated/registry.ts` and `manual/generated/registry.mjs`; never edit either,
and commit both, because Vercel builds from this repo alone. `globals.css` cannot import a
module, so `registry.py check` compares its dark-theme values instead. The table below is
where each value lands:

| Token | Value | Here | App |
|---|---|---|---|
| Background | `#0a0a0a` | `--background` in `globals.css` | `ink-950` |
| Card / surface | `#121212` | `--card` | `ink-900` |
| Border | `#242424` | `--border` | `ink-800` |
| Muted text | `#8c8c8c` | `--muted-foreground` | `ink-500` |
| Accent | `#00dc82` | `accent.DEFAULT` | `brand-400` |
| Gradient | `#00dc82 → #155799` | `.gradient-text` | `.gradient-text` |
| Type | Geist Sans + Geist Mono | `geist/font` | Google Fonts |
| Intensity domains | moderate `#34d399`, heavy `#fbbf24`, severe `#f87171` | `content/demos/mcp-demo.ts` | `CpetScatterChart.tsx` |

`.glass` is defined identically in both repos. The **mark** is generated from
`oxynet/api/assets/oxynet-icon.svg` in the app repo into `src/components/shared/duck-mark.tsx`
here. It is inlined rather than an `<img>` because the path is drawn with `currentColor`,
which cannot inherit across document boundaries. Regenerate rather than hand-edit.

## Positioning: read before writing copy

The narrative is **measurement, not classification**. Oxynet is sold as a computational
layer that extracts physiological structure from CPET signals; VT1/VT2 is the entry
product, not the ceiling. Six rules that have been decided:

1. **Do not sell the AI.** Deep learning, Keras, TensorFlow and TFLite are the mechanism.
   A hospital or a device manufacturer is buying a new capability to interpret CPET, not
   a model architecture. Keep the stack talk in the package section, where researchers
   are the audience.
2. **The app is the destination.** Every product CTA points at `app.oxynet.net`.
   Exercise Thresholds remains credited in the footer acknowledgments and nowhere else.
3. **No em dashes in anything a user or an agent reads.** Not in the site copy, not in
   the app UI, not in the served text documents. Use a full stop, a comma, a colon or
   parentheses. The one exception is the bare dash used as an empty-cell placeholder in a
   data table, which is a symbol rather than punctuation. This is a standing house-style
   rule and applies to the sister repo too.
4. **Keep the copy punchy.** "A computational layer for CPET", "Physiological intelligence
   for exercise testing", "One engine, three doors" and similar lines are wanted. Plainer
   is not automatically better here. Cut a line when it claims something untrue, not
   because it has energy.
5. **The model must not improvise physiology.** An LLM asked to read a CPET will
   estimate a threshold from the trace, and it will sound right. The reason the MCP
   server exists is to stop that: the assistant routes the question and explains the
   answer, the validated models decide the physiology. Copy about agents should say
   which of the two did what, and never imply the assistant worked it out.
6. **Never invent confidence.** Nothing is calibrated against clinical outcomes, so no
   percentage confidence appears anywhere. Oscillation analysis is beta, developed on a
   single heart-failure cohort, with transportability untested. Say so wherever it is
   mentioned rather than in one buried footnote.

## The manual

`manual/` builds a 31-page A4 PDF describing the engine, published at `/manual`
and linked from the navbar and the footer. It is a separate pipeline from the
site: plain ES modules producing HTML strings, printed by the Chrome already on
the machine, so there is no bundled browser to download.

```bash
npm run manual        # build, check every page fits, print the PDF
npm run manual:check  # build + the overflow check, no PDF
```

**Read `manual/README.md` before editing it, and `manual/REVISING.md` before
starting a round of revision: one round of feedback produces exactly one version
bump, with one changelog entry.** Three things there are not
guessable: page numbers live only in `manual/toc.mjs`; every page must finish
above y=1050 and `manual/fit.mjs` fails the build if one does not; and
`-webkit-background-clip: text` must never be used, because Chrome drops the
text clip when printing and the wordmark comes out as a solid rectangle.

Every number in Part Two is a real response from the live API, recorded in
`manual/data/api-results.json` against the de-identified recording in
`manual/data/reference-test.json`. Page 2 states that nothing in the document is
simulated, so those numbers must be refreshed from the API rather than edited by
hand. The API reference is deliberately a link rather than generated content;
the CI job that would render an endpoint appendix is noted as a gap in the
README and `config.mjs` isolates the engine snapshot ready for it.

## The data transfer agreement template

`agreement/` builds a fillable 16-page PDF, one agreement at three tiers (feasibility, validation, model development), in the manual's style, served at
`/data-agreement` with `X-Robots-Tag: noindex` and linked from the partner and data-handling
pages. `npm run agreement` builds, fit-checks, prints and lays pdf-lib form fields over the
measured positions of every box and blank. It shares `manual/style.mjs`, the tokens and the
fit check with the manual. Read `agreement/README.md` before editing. Filled copies never
go in this repo.

## The demos

Three scripted demos, one per door: the browser (`browser-demo.ts`), the REST
API (`api-demo.ts`) and the MCP server (`mcp-demo.ts`). On the landing page they
live in the **three doors section** (`doors-section.tsx`, `#doors`): a flow map
(export → engine → Browser / API / MCP) that is also the tab selector, and a
panel under it with the chosen door's copy and its demo. The map is drawn in one
1000 x 400 frame shared by the SVG viewBox and the percentage-positioned HTML
nodes, in a box held at the same 5:2 ratio, so rails always meet their nodes;
below `lg` it becomes a vertical stack. `doors-section.tsx` is a server component
so the scripts travel as props, not in the client bundle. Old anchors still
land: `#agents` and `#agent-demo` select the MCP door, `#how-it-works`,
`#deployment` and `#audience` sit on the section, `#demo` is the slider inside
`#about`, `#usage` the code tabs inside `#package`.

The demos are built as a player plus a script rather than as animations:

- `src/content/demos/types.ts` is the contract: a demo is a list of `DemoEvent`s,
  each carrying its own `durationMs`. Nothing in `src/components/demo/` knows what
  a ventilatory threshold is.
- `src/content/demos/mcp-demo.ts` is the whole story: dialogue, tool calls,
  latencies, results, threshold values, pacing. A second demo is a second file
  registered in `src/content/demos/index.ts` and rendered by the same player.
- `src/hooks/use-demo-timeline.ts` reveals event `i` at the sum of the durations
  before it, and knows nothing else.
- `src/lib/demo-invoker.ts` holds the seam. Tool results arrive through a
  `ToolInvoker` promise, so replacing the scripted one with a live MCP client is a
  prop on `<DemoPlayer>`, not a rewrite.

**The agent never discovers anything.** The narrative is: connect your provider
to the Oxynet MCP server, then ask it to analyse a CPET with Oxynet
capabilities. The run opens on the reader attaching a spreadsheet and asking,
and the connected server appears *inside the agent's turn*, after it says it
will look at what tools it has. No copy anywhere may suggest the assistant went
looking for a physiological engine and happened to find one. Someone chose
Oxynet; everything after that is what the choice buys.

**The reader's line is set larger than the agent's**, and there is no standing
tool inventory beside the transcript. Both were tried the other way. A rail
listing ten tools and their summaries was the most detailed thing on screen and
the least important, and it pulled the eye out of the conversation, which is
the only thing the section is selling.

**The player is lazily mounted and must stay that way.** It pulls in Framer
Motion, the chart and the script, which put about 32 kB on the landing page's
First Load JS (229 kB to 261 kB) for a section several screens down that does
not animate until scrolled to. `demo-player-lazy.tsx` fetches it once the
reader is within 600 px and holds the space with a skeleton until then, which
puts the page back to 231 kB. Import `DemoPlayerLazy` on the landing page, not
`DemoPlayer`.

**The window is 4:5 (34rem wide), not a wide console.** It is meant to be
screen-recorded and posted, and a 16:9 developer console crops to nothing in a
LinkedIn feed. On a wide page the copy sits beside it and takes the space the
window gives back. Anything added to the stage has to survive at 544px.

**The MCP surface in the script is checked against `scripts/mcp_server.py` in
the app repo and must stay that way.** The tool list is typed
`satisfies Record<McpToolName, string>`, and `McpToolName` is generated from the
server, so a tool added or removed there fails `tsc` here; `registry.py check`
covers the individual `tool:` calls. Three things there are easy to get wrong and are wrong in
any script that guesses: `get_capabilities` is called first, because the
analyses are licensed separately; a file named by path goes through
`create_upload` and then a **curl**, because Oxynet mints a one-shot URL rather
than taking bytes through the conversation; and `analyze_vt` returns a
`quality` that describes the recording, never a confidence in the answer. The
demo says so out loud, and the values are invented, which is what the
"simulated interaction" line under the window is for.

The chart is the app's VT view, not a new picture. Two panels share one VO2
axis: breath-by-breath VE on top, every point coloured by the domain the model
assigned it, and the un-stacked zone probabilities underneath, drawn as
`ProbabilityTraceChart` draws them. There is deliberately **no fitted line**
through the scatter, because a regression a reader could have drawn themselves
would say the opposite of what the section says. The dashed threshold lines run
through both panels, because the point of stacking them is that the crossings
are the thresholds: moderate meets heavy at VT1, heavy meets severe at VT2. One
probability function feeds both the point colours and the traces, and the
marker positions come from the VO2 numbers in the script, so editing a
threshold moves the crossing, the colour change and the label together. The rest of the stage uses the fixed `demo.*`
palette in `tailwind.config.ts` rather than the themed ink ramp, so it stays
dark when the page is in the light theme.

### Sharing it

Three surfaces, one script and one component behind all of them:

```bash
npm run build && npm run clip   # writes oxynet-mcp-demo.mp4, 1080x1372
CLIP_WIDTH=1080 CLIP_MS=48000 npm run clip
```

- `/demo` is the link to send someone. It carries its own OpenGraph card at
  `public/og-agent-demo.png`, so pasting the URL into LinkedIn or an email
  unfurls with the chart rather than with the site's default hero.
- `/demo/clip` is the recording stage: no navbar, no page ground, no disclosure
  line, the window pinned to a fixed height and rendered at 2x. Nobody should
  land on it, hence `robots: noindex`.
- `scripts/record-clip.mjs` serves the production build, takes a CDP
  screencast, and encodes with the ffmpeg on the machine. It **measures** the
  window and crops to it, so the output ratio follows the component: change the
  header and the clip still frames correctly. Frames arrive on paint rather than
  on a clock, so ffmpeg gets a concat list with real per-frame durations; a
  fixed frame rate drifts against the animation.

To screenshot rather than record, drive Chrome over CDP on the wall clock and
scroll the section into view first (the player starts on `useInView`).
`--virtual-time-budget` fast-forwards the timers but leaves Framer Motion
unstarted, so the capture comes back blank. And never pipe `next build` into
`head`: the SIGPIPE kills it mid-write and leaves `.next` unusable.

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

## The threshold guides (`/ventilatory-thresholds`)

Written for the person holding a CPET file and for the assistant answering them, so they sit
outside the developer hub: `/ventilatory-thresholds` answers "how do I get VT1 and VT2 out of
my file", and one page per vendor (`/ventilatory-thresholds/cosmed`, `/cortex`) says which of
that vendor's exports are read and what the parser deals with in them. They exist because on
2026-10-28 a web search for those questions found the papers and never this site (baseline in
the orchestration repo, `docs/visibility.md`).

- **A vendor gets a page only when core's parser was checked on that vendor's real files.**
  PNOE and VO2 Master are in core's `UNVERIFIED_FORMATS` and VO2 Master carries no CO2, so the
  thresholds cannot run on it; Vyaire is unconfirmed. Adding a guide is an entry in
  `content/thresholds.ts`. The route, the sitemap, the cards on the general page and `/llms.txt` follow from it.
- The formats on a vendor page are `PUBLIC_FORMATS` filtered by vendor, so they cannot
  disagree with `/developers/formats`. The `handles` bullets are restated from the comments in
  core's loaders and carry no cohort codes or institution names.
- Each vendor page names the vendor descriptively and says Oxynet is not affiliated with it.
  Shared frame and sections are in `components/thresholds/guide.tsx`.

**Getting a new page fetched.** The site is a verified Domain property in Google Search
Console, and Bing Webmaster Tools imported it from there (2026-10-28). After a deploy that adds
or substantially changes a page, run `scripts/indexnow.sh <path> ...` (no arguments submits the
whole live sitemap). That tells Bing and the other IndexNow engines; Google does not read
IndexNow, so request indexing in Search Console's URL Inspection instead. The key file
`public/1b409840bb393cb886a19730b82a760b.txt` is public by design and must stay deployed,
because IndexNow verifies ownership by fetching it.

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS + custom design tokens (dark theme)
- **UI Components:** shadcn/ui (Button, Badge, Tabs, Separator) — Radix UI primitives
- **Animations:** Framer Motion (scroll-triggered entrance animations)
- **Syntax Highlighting:** Shiki (server-side, `github-dark-dimmed` theme)
- **Font:** Geist (sans + mono, from Vercel)
- **Deployment:** Vercel (`vercel.json` configured)

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npx tsc --noEmit     # TypeScript check
```

## Architecture

### Directory Structure

```
src/
  app/
    layout.tsx          # Root layout: Geist fonts, metadata, Navbar
    page.tsx            # Home page: assembles all section components
    globals.css         # Tailwind base + CSS vars + .glass + .gradient-text utilities
    not-found.tsx       # 404 page
    demo/
      page.tsx          # The standalone, shareable demo page
      clip/page.tsx     # Bare recording stage for `npm run clip` (noindex)
  components/
    demo/
      demo-player-lazy.tsx # Mounts the player only within 600px of the viewport
      demo-player.tsx      # The demo shell: timing, tool status, transport
      chat-message.tsx     # User prompt and agent reply
      thinking-indicator.tsx
      mcp-panel.tsx        # The connected server and its tool list, in the transcript
      tool-call.tsx        # One call, from issue to answer, via ToolInvoker
      tool-result.tsx
      metrics-panel.tsx    # The prominent result, with the chart
      physiological-chart.tsx  # Abstract VE against VO2, markers from the script
      final-screen.tsx     # The reveal
      attachment.tsx       # The + press, and the file chip in the header
      shell-step.tsx       # A curl the agent runs, not a tool it calls
      demo-text.tsx        # Typewriter, **bold** parser, eyebrow
    layout/
      navbar.tsx        # Fixed glassmorphism nav ('use client')
      footer.tsx        # Disclaimer, acknowledgments, links
    sections/
      hero-section.tsx        # Full-viewport hero, duck mark + CTAs ('use client')
      about-section.tsx       # Problem / solution pair, then the slider
      compare-demo.tsx        # Before/after compare slider + domain legend (#demo)
      doors-section.tsx       # One engine, three doors: Browser / API / MCP (#doors)
      doors-explorer.tsx      # The flow map, the tab state, the door panel + demo
      outputs-section.tsx     # Output families incl. oscillation + signal integrity
      validation-section.tsx  # Evidence, with the beta caveat
      custom-models-section.tsx # Fine-tuned models for labs, clinics, universities
      package-section.tsx     # async: pyoxynet package + Shiki code tabs (#usage)
      usage-tabs.tsx          # Radix Tabs client component
      publications-section.tsx # Publication cards
      contact-section.tsx     # Three contact intents with mailto links
      measurement-section.tsx # NOT MOUNTED: "From classification to measurement"
    shared/
      duck-mark.tsx        # The Oxynet mark, inlined (generated from the app repo)
      section-wrapper.tsx  # Framer Motion useInView entrance animation ('use client')
      glass-card.tsx       # Glassmorphism card with hover animation ('use client')
      gradient-text.tsx    # Gradient text span
      code-block.tsx       # async Server Component wrapping Shiki highlight()
    ui/                  # shadcn/ui components (button, badge, tabs, separator)
  content/
    code-examples.ts     # Typed code snippet strings (install, usage, generation)
    publications.ts      # Typed array of all 11 publications
    demos/
      types.ts           # The DemoEvent contract and the ToolInvoker seam
      mcp-demo.ts        # The MCP demo script: every word, value and pause
      index.ts           # The demo registry, live and planned
  hooks/
    use-demo-timeline.ts # Walks a script on wall-clock timers
  lib/
    shiki.ts             # Module-level Shiki singleton + highlight() helper
    demo-invoker.ts      # Scripted ToolInvoker + tool-input JSON formatting
    utils.ts             # shadcn cn() helper
  types/
    index.ts             # Publication, CodeExample, NavItem types
public/
  hero-bg.jpg            # Hero background image (from Unsplash / Pawel Czerwinski)
```

### Key Architecture Decisions

**Server/Client boundary for code tabs:**
`package-section.tsx` is an async Server Component that pre-renders all Shiki HTML and passes the strings to `usage-tabs.tsx` (Client Component with Radix Tabs). Shiki never ships to the client.

**Shiki singleton:**
`src/lib/shiki.ts` creates one `Highlighter` instance reused across requests. Theme: `github-dark-dimmed`, langs: `python`, `sh`, `bash`.

**Glass morphism utility:**
The `.glass` class is defined in `globals.css` — `background: rgba(255,255,255,0.04)` + `backdrop-filter: blur(12px)`.

### Design Tokens
- Background: `#0a0a0a` (CSS var `--background`)
- Accent green: `#00dc82` (Tailwind `accent.DEFAULT`)
- Secondary blue: `#155799` (Tailwind `accent.blue`)
- Gradient text: `#00dc82 → #155799`

## Deployment

Vercel deploys production from **`main`**: a push to `main` is a release, live in about
90 seconds. Settled on 2026-10-15 from GitHub's deployment records (`gh api
repos/oxynet-cpet/pyoxynet-website/deployments`), where every production deployment is a
`main` commit; `579ba5b` went live that way. The project was originally wired to `next`,
which is stale and deploys nothing.

To run locally:
```bash
npm run dev   # http://localhost:3000
```

To deploy:
```bash
git push origin main   # Vercel picks it up automatically
```

## `/llms.txt`

`src/app/llms.txt/route.ts` serves www.oxynet.net/llms.txt as a static text route (added
2026-10-15; the address was a 404 before). It says what Oxynet is and links to the app's
`llms.txt` and `llms-full.txt` for the API rather than restating them. Nothing in it is
typed: the format count is `VENDOR_FORMATS`, the documentation list is `DEV_NAV`, and the
publications are filtered with `isPeerReviewed` from `content/publications.ts`, the rule
the site and the manual count by. A new developer page appears there automatically.

### DNS / Domain
Point `www.oxynet.net` to Vercel using the A records or CNAME provided in the Vercel dashboard under "Domains".
