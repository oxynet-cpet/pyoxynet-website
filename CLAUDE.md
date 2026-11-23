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

## Where the rest lives: read before touching

Claude Code loads only this file. The topic notes below are not loaded by themselves:
before changing anything in the left column, read the file on the right. A pointer
elsewhere to "CLAUDE.md, rule N" or to a heading means that rule or heading, unchanged,
in the file this table names.

| Before touching | Read |
|---|---|
| `manual/` (the PDF manual, its figures and API numbers) | `docs/claude/manual.md` |
| `agreement/` (the data transfer agreement template) | `docs/claude/agreement.md` |
| the three doors section and its demos (`src/content/demos/`, `src/components/demo/`, `doors-section.tsx`), sharing a result | `docs/claude/demos.md` |
| `/developers` (the developer and partner hub) | `docs/claude/developer-hub.md` |
| `/ventilatory-thresholds` (the threshold guides) | `docs/claude/threshold-guides.md` |
| the directory structure, design tokens, the key architecture decisions | `docs/claude/architecture.md` |
| `src/app/llms.txt/route.ts` | `docs/claude/llms-txt.md` |

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

### Before a merge to `main`: check alignment, not after

A merge here is a release, so the orchestration repo's "Before any release, in any repo"
applies (its CLAUDE.md loads only when this checkout sits under `~/oxynet`, not from a
worktree elsewhere). The founder, 2026-11-20: check before, not after.

First, from the orchestration repo: `python3 harness/align.py website` (`--at PATH` for the
branch checked out here). It runs the registry check, compares the facts copied from core
(terms version, retention, the agreement's numbers and provider) and `PYOXYNET` with what is
live, and blocks on a finding that names this repo. The points below are what it cannot read.

1. **The site states only what the API ships.** Read every changed claim about the API, MCP,
   formats, models or retention against core at the commit that is live
   (`https://app.oxynet.net/llms-full.txt`, `/v1/capabilities`), never against a core branch.
2. **Facts with one home are imported, never retyped:** provider, VAT, courts and terms
   version from `src/content/legal.ts`; formats and MCP tools from the generated registry
   (`python3 harness/registry.py check` in the orchestration repo must pass); pyoxynet's
   version from `PYOXYNET`, which follows a release only once PyPI has it.
3. **The agreement and the manual are partner documents.** Before the template changes, and
   before any copy is filled for a partner, its facts are diffed against `legal.ts` and what
   core keeps and logs (`store.py`, `retention.py`). A corrected draft sent minutes after the
   first looks unprofessional. The manual's API numbers are re-recorded on the live API.
4. **Proportionate:** fix what is false about the service, money, data or terms; minor wording
   drift is noted once and left.
