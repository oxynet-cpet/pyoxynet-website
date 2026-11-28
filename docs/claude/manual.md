# The manual

Moved verbatim from CLAUDE.md on 2026-11-23, which now keeps a briefing and points here.

## The manual

`manual/` builds a 32-page A4 PDF describing the engine, published at `/manual`
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
