# The data transfer agreement template

Moved verbatim from CLAUDE.md on 2026-11-23, which now keeps a briefing and points here.

## The data transfer agreement template

`agreement/` builds a fillable 16-page PDF, one agreement at three tiers (feasibility, validation, model development), in the manual's style, served at
`/data-agreement` with `X-Robots-Tag: noindex` and linked from the partner and data-handling
pages. `npm run agreement` builds, fit-checks, prints and lays pdf-lib form fields over the
measured positions of every box and blank. It shares `manual/style.mjs`, the tokens and the
fit check with the manual. Read `agreement/README.md` before editing. Filled copies never
go in this repo.
