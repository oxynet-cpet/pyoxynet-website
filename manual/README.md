# The Oxynet manual

A 32-page A4 PDF describing the Oxynet engine, written to be read end to end by
someone deciding whether to build on it, fund it, or run their laboratory's
tests through it. It is published at `/manual` on the site and is meant to be
forwarded.

```bash
npm run manual          # build, check every page fits, print the PDF
npm run manual:html     # just the HTML, to proof a page in a browser
npm run manual:check    # build + the overflow check, no PDF
npm run manual:pdf      # print the PDF from the last build
```

Output lands in `public/manual/`:

| File | What it is |
|---|---|
| `oxynet-manual.pdf` | the current edition, overwritten by each build, what `/manual` rewrites to. The version is on the cover and in every folio, so a forwarded copy can be identified; earlier editions are in git history |

**Revising it is a defined process.** One round of review produces one version.
See [REVISING.md](REVISING.md) before starting a round, and follow its checklist
before calling one done.

## Editing

Everything is plain ES modules producing HTML strings. There is no framework
and no build step beyond node.

| File | What lives there |
|---|---|
| `config.mjs` | version, date, engine snapshot, contact, links, corpus figures |
| `toc.mjs` | **the page numbers, and the only place they live.** Folios, cross-references and the contents page all read from here |
| `tokens.mjs` | the palette, the page geometry, the type ramp |
| `lib.mjs` | page furniture: running head, folio, the two-column grid, rail blocks, code blocks, tables |
| `brand.mjs` | the mark, the particle field, gradient lettering |
| `figures.mjs` | every figure, drawn as SVG from the reference recording |
| `wavelet.mjs` | the Morlet transform and PNG encoder behind the oscillation map |
| `pages/*.mjs` | the copy, one module per part |
| `data/reference-test.json` | the de-identified recording every figure is drawn from |
| `data/api-results.json` | the recorded API responses every number in Part Two comes from |
| `data/predictions.json` | the per-second class probabilities, from `predict_cpet` on the raw records |

To change copy, edit the relevant `pages/*.mjs` and run `npm run manual`.

## The two rules that will bite you

**Every page must finish above y=1050.** A page is 1123 px tall and the folio
band starts at 1050. `fit.mjs` renders the document in headless Chrome, walks
each page for the lowest element that is not furniture, and fails the build if
anything runs past the line. It exists because the first draft printed body
copy straight through the footer on five pages, and estimating this by eye does
not work. If a page overflows, cut copy or tighten spacing; do not raise the
limit.

**Do not use `-webkit-background-clip: text`.** Chrome rasterises the gradient
box and drops the text clip when printing, so the cover wordmark came out as a
solid rectangle. Gradient lettering goes through `gradientText()` in
`brand.mjs`, which draws SVG text with a gradient paint.

## House style

The site's rules apply here in full, and three matter most:

- **No em dashes.** Anywhere. A comma, a colon, a full stop or parentheses.
- **No confidence, ever.** Nothing in Oxynet is calibrated against clinical
  outcomes, so no output carries a percentage or a confidence score, and no
  copy may imply one. `quality` describes the recording, not the answer.
- **Oscillation analysis is beta wherever it is named**, with the single
  heart-failure cohort said next to it rather than in a footnote.

## Bumping the version

The full process is [REVISING.md](REVISING.md). In short: bump `VERSION` and
`DATE` in `config.mjs`, add one `CHANGELOG` entry for the round,
`npm run manual`, and commit the refreshed `oxynet-manual.pdf`.

`/manual` always resolves to the current edition, so a link shared today keeps
working. The rewrite is in `next.config.mjs`.

## Refreshing the worked examples

Every number in Part Two is a real API response, recorded in
`data/api-results.json`. Nothing is simulated, and the manual says so on page 2,
so the numbers must not be hand-edited. To refresh them:

1. `create_upload()`, then POST `data/reference-test.json` to the URL it returns.
2. `analyze_vt`, `analyze_eov` and `analyze_substrate` on that `cpet_id` (one
   tool per analysis since 2026-10-21; REST `analyze` still takes the list).
3. `compute_metrics(cpet_id, [...])` for the metrics block.
4. Paste the responses into `data/api-results.json`, keeping `_provenance`
   accurate, and rebuild.

The figures redraw themselves from that file plus the reference recording, so
correct data is all they need.

## Known gaps, in priority order

- **The API reference is a link, not generated.** Part Three describes the
  surface in prose and points at `app.oxynet.net/docs` as authoritative. A CI
  job that pulls `/v1/openapi.json` and renders an endpoint appendix into the
  PDF is the obvious next step, and `config.mjs` already isolates the engine
  snapshot so it can be swapped for a live fetch.
- **Phase boundaries are not exposed.** The signal-quality figure marks the
  resting span the engine excluded, which it does report, but the full
  rest / warm-up / exercise / recovery annotation is not on the MCP surface.
  Draw the bands when the API returns them.
- **Two answers, both printed.** With no model named, `analyze_vt` answers
  with the committee (600 and 761 s on the reference test since v86);
  `predict_cpet` runs gandalf alone on the raw records (613 and 768 s).
  Section 2.3 states both. When either changes, refresh both data files
  together.
- **Menlo appears in the PDF font table.** A handful of glyphs (`≤ ≥ →`) are
  missing from Geist Mono and fall back. Cosmetically fine, off-brand in
  principle. Fix by drawing those as SVG or substituting characters Geist has.
- **A COSMED-specific cut does not exist yet.** This edition is deliberately
  vendor-neutral so it can go to any partner or investor. A named variant, with
  their product flows in the integration diagrams, would be a fork of Part Three
  and Part Four off the same source.
