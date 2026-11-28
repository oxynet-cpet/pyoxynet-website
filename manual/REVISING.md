# Revising the manual

One round of review produces one version. That is the whole rule, and everything
below exists to make it hold.

The failure mode this prevents: feedback arrives in fragments, each fragment
gets its own rebuild, and after a week nobody knows which PDF is on which
laptop or what changed between them. A version that means something is a
version that changed once, for a stated reason, with a record.

## The round

**1. Read the whole thing before commenting.** Feedback on page 6 often
dissolves once page 20 is read, and the document is arranged so that detail
arrives later on purpose.

**2. Collect every note first, then send them together.** Number them. A note
is most useful as *page, what is wrong, and why it matters*:

> 7) The contents entries are not clickable, and in 2026 a reader expects them
> to be. Do not underline them or change the colour.

That is a good note: it locates the problem, states the fix, and fences the fix
so it does not turn into a restyle.

**3. One rebuild.** All the notes are applied, the version is bumped once, the
changelog gets one entry, and the PDF is regenerated once.

**4. The next round starts from the new version.** Do not reopen notes that were
applied; raise the new thing they revealed instead.

## Which number moves

| Change | Bump | Example |
|---|---|---|
| A typo, a colour, a caption, a figure label | patch, `1.1.1` | Axis label was clipped |
| Copy rewritten, a page added or removed, a section reordered, a new figure | minor, `1.2` | Part One restructured; wavelet map added |
| The argument changes, or the document is aimed at a different reader | major, `2.0` | Reframed as an OEM integration dossier |

If a round contains a mix, the largest one wins. A round is never split across
two versions to make the numbers tidier.

## What the writer does, in order

```bash
npm run manual:check    # rebuild and prove every page still fits
npm run manual          # + print the PDF
```

Then, before calling the round done:

- [ ] Every note in the round is applied, or answered in writing with a reason.
- [ ] `VERSION` and `DATE` in `config.mjs` bumped, and `CHANGELOG` has one entry
      naming what this round changed.
- [ ] `npm run manual` exits clean: no page overflows, and no `code line is N
      chars` warnings, which mean a payload is being cut off at the right edge.
- [ ] Page numbers in `toc.mjs` match the folios, which they do automatically
      unless a page was added without renumbering.
- [ ] **Every page looked at, not just the ones that changed.** The fit checker
      catches overflow. It does not catch a label sitting on a data point, an
      SVG element clipped outside its viewBox, a series flattened by a shared
      axis, or a caption that no longer describes its figure. Read the PDF.
- [ ] House style holds: no em dashes, no confidence or percentage attached to
      a physiological result, oscillation analysis marked beta with its single
      cohort wherever it is named.
- [ ] The refreshed `public/manual/oxynet-manual.pdf` is committed.

## What is allowed to change without a round

Nothing that reaches a reader. Fixing the build, refactoring a page module,
adding a comment: those are ordinary commits and do not move the version,
because the PDF they produce is byte-identical in substance.

## Refreshing the numbers

Every figure and every quantity in Part Two comes from
`data/api-results.json`, recorded against `data/reference-test.json`. Page 2
tells the reader that nothing in the document is simulated, so those numbers are
refreshed by re-running the API, never by editing the file:

1. `create_upload()`, then POST `data/reference-test.json` to the URL returned.
2. `analyze_vt`, `analyze_eov` and `analyze_substrate` on that `cpet_id`.
3. `compute_metrics(cpet_id, [...])` for the metrics block.
4. Paste the responses in, keep `_provenance` accurate, rebuild.

A refresh that changes a printed number is a minor bump, because the document
now says something different.

The one exception to "everything is from the API" is the wavelet raster on the
oscillation page: the MCP surface returns the episode list without the map
behind it, so the map is computed in `wavelet.mjs` from the same ventilation
trace. Its caption says so. Everything quantitative on that figure, including
the box and its period band, is still the API's.

## Giving the document to someone else

`/manual` on the site always resolves to the current edition, so send that link
rather than a file. Only the current edition is published: every page carries
its version in the folio, so a forwarded copy can be identified, and earlier
editions are in git history.
