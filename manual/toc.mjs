/**
 * The table of contents, and the single source of truth for page numbers.
 *
 * Every folio, every cross-reference and the contents page read from here, so a
 * page cannot print one number while the contents claim another. If you add or
 * remove a page, renumber here and nowhere else.
 *
 * `anchorFor` maps a page to the id of the <section> that renders it, so the
 * contents and every cross-reference is a real internal link in the PDF.
 */

export const PARTS = [
  {
    n: 'One',
    numeral: '01',
    title: 'What Oxynet is',
    divider: 4,
    blurb: 'What it looks like, what is production today, where it sits, and the cycle behind it. Six pages, no physiology required.',
    sections: [
      { id: '1.1', title: 'The mission', page: 5 },
      { id: '1.2', title: 'What Oxynet does today', page: 6 },
      { id: '1.3', title: 'Where it sits, and what it is not', page: 7 },
      { id: '1.4', title: 'One engine, three doors', page: 8 },
      { id: '1.5', title: 'Research, development, deployment', page: 9 },
      { id: '1.6', title: 'Why build on Oxynet', page: 10 },
    ],
  },
  {
    n: 'Two',
    numeral: '02',
    title: 'What the engine measures',
    divider: 11,
    blurb: 'Four capabilities on one real recording, each with the payload the API returned and the caveat that travels with it.',
    sections: [
      { id: '2.1', title: 'The technology', page: 12 },
      { id: '2.2', title: 'Signal quality and phase recognition', page: 13 },
      { id: '2.3', title: 'Ventilatory thresholds', page: 15 },
      { id: '2.4', title: 'Exercise oscillatory ventilation', page: 17, beta: true },
      { id: '2.5', title: 'Substrate use and FATMAX', page: 19 },
    ],
  },
  {
    n: 'Three',
    numeral: '03',
    title: 'How it is integrated',
    divider: 21,
    blurb: 'What the engine needs, what it returns, and the three architectures it can be deployed as.',
    sections: [
      { id: '3.1', title: 'The one architectural rule', page: 22 },
      { id: '3.2', title: 'What the engine needs', page: 23 },
      { id: '3.3', title: 'REST', page: 24 },
      { id: '3.4', title: 'MCP, and what an assistant may do', page: 25 },
      { id: '3.5', title: 'Cloud, local, embedded', page: 26 },
      { id: '3.6', title: 'Limits, retention and governance', page: 27 },
    ],
  },
  {
    n: 'Four',
    numeral: '04',
    title: 'Status, evidence and next steps',
    divider: 28,
    blurb: 'The limits, stated plainly, and a concrete way to start.',
    sections: [
      { id: '4.1', title: 'What Oxynet is not', page: 29 },
      { id: '4.2', title: 'The evidence record', page: 30 },
      { id: '4.3', title: 'References', page: 31 },
      { id: '4.4', title: 'Routes to market, and the next step', page: 32 },
    ],
  },
]

export const LAST_PAGE = 32

/**
 * Page number to the id of the section that renders it. Front matter and the
 * dividers have their own ids; every body page is `p<number>`.
 */
export function anchorFor(page) {
  if (page === 1) return 'cover'
  if (page === 2) return 'colophon'
  if (page === 3) return 'contents'
  const part = PARTS.find((p) => p.divider === page)
  if (part) return `divider-${part.numeral}`
  return `p${page}`
}

/** Look up a section by id, for cross-references in the copy. */
export function ref(id) {
  for (const p of PARTS) {
    const s = p.sections.find((x) => x.id === id)
    if (s) return s
  }
  throw new Error(`toc: unknown section ${id}`)
}

/**
 * "4.1 on page 29", the house form for a cross-reference, as a live link.
 * Deliberately not underlined and not recoloured: a reader in 2026 expects a
 * contents entry to be clickable without being told that it is.
 */
export function xref(id) {
  const s = ref(id)
  return `<a href="#${anchorFor(s.page)}" style="color:inherit;text-decoration:none">${s.id} on page ${s.page}</a>`
}

/** An internal link to a page, for the contents and the part dividers. */
export function link(page, inner, block = true) {
  return `<a href="#${anchorFor(page)}" style="color:inherit;text-decoration:none${block ? ';display:block' : ''}">${inner}</a>`
}
