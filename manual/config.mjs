/**
 * What this edition of the manual says about itself.
 *
 * Bump VERSION and DATE together, and write the change into CHANGELOG below.
 * The version appears on the cover, in the folio of every page, and in the
 * output filename, so a copy someone forwarded can always be identified.
 *
 * ENGINE is what the API reported when the numbers in Part Two were taken. It
 * is deliberately a snapshot rather than a live lookup: this document is not
 * regenerated on every release, and a stale claim is worse than a dated one.
 * The live API reference at app.oxynet.net/docs is authoritative where the two
 * differ, and the manual says so on its last page.
 */

import { groupedPublications } from './publications.mjs'
import { VENDOR_FORMATS } from './generated/registry.mjs'

export const VERSION = '2.2.1'
export const DATE = 'November 2026'

export const ENGINE = {
  api: 'v1',
  host: 'app.oxynet.net',
  analysisVersion: '2026.08',
  models: ['bilbo v0.1.1', 'samwise v0.1.2', 'rosie v0.1.0', 'gandalf v0.1.0'],
}

export const CONTACT = {
  name: 'Andrea Zignoli',
  // Used where the document is signed rather than where the person is merely
  // referred to: the cover, the colophon and the contact card. Not in running
  // prose, where a credential after every mention reads as insecurity.
  credited: 'Andrea Zignoli, MEng, PhD',
  email: 'andrea.zignoli@unitn.it',
}

export const LINKS = {
  app: 'https://app.oxynet.net',
  apiDocs: 'https://app.oxynet.net/docs',
  openapi: 'https://app.oxynet.net/v1/openapi.json',
  llms: 'https://app.oxynet.net/llms.txt',
  mcp: 'https://app.oxynet.net/oxynet-mcp',
  site: 'https://www.oxynet.net',
  pypi: 'https://pypi.org/project/pyoxynet/',
}

/**
 * Corpus figures. Deliberately not an exact test count: the number moves every
 * time a cohort lands, a stale figure is worse than a general one, and no
 * reader of this document is buying a specific integer.
 */
export const CORPUS = {
  tests: 'thousands of expert-labelled exercise tests',
  // Generated from oxynet-core's parser; the site reads the same value.
  formats: VENDOR_FORMATS,
  // Counted from src/content/publications.ts at build time, never asserted.
  // The same list also holds a preprint and four blog or Medium pieces, which
  // are writing about the work and not evidence for it. The site counts from
  // the same file, so the two properties cannot disagree.
  get papers() {
    return groupedPublications().peer.length
  },
}

export const OUTPUT = {
  // One file, overwritten every build. The version lives inside the document,
  // on the cover and in every folio, so a copy someone forwarded can still be
  // identified. Keeping a versioned filename per edition would fill the
  // directory with 2 MB PDFs that nobody deletes.
  dir: 'public/manual',
  file: 'oxynet-manual.pdf',
}

export const CHANGELOG = [
  ['2.2.1', 'November 2026',
    'The caption on the substrate page cited Jeukendrup and Wallis as 2001; the paper is 2005 (Int J Sports Med 26 Suppl 1:S28-S37). The publications page follows the site and now dates the European Journal of Sport Science paper by its issue, 2022, as the site has since 29 October. No other change.'],
  ['2.2', 'October 2026',
    'The assistant tools now run one analysis each: analyze_vt, analyze_eov and analyze_substrate replace analyze_cpet, which took a list, so the lifecycle code and the agent transcript name them. The REST API is unchanged. No other change.'],
  ['2.1', 'September 2026',
    'The format count on 3.1 was typed as twenty-one and is now generated from the parser, like every other statement of it. No other change.'],
  ['1.0', 'September 2026', 'First edition.'],
  ['2.0', 'September 2026',
    'Tenth round, plainer prose. The document leaned on contrastive framing (this, not that) 25 times; it is down to eight, all of them substantive distinctions such as a fitted point against a measured one. Removed the hypotheticals about what another system would do and replaced them with what this one does. Dropped the knowing section labels ("why they matter", "the third column is the one worth reading", "two fields people misread", "ask first, do not discover") for plain ones. Softened the claims about how a general-purpose assistant behaves. No content removed, and no caveat weakened.'],
  ['1.9', 'September 2026',
    'Ninth round, an editorial pass over the whole text. Four accuracy corrections: the outlier rule on the signal-quality figure is applied for the figure and is not an API flag, and now says so; the shaded span there is the substrate window trim, not a general phase annotation; the substrate page cites settled on the windows instead of attributing steady_state to the wrong response; and the ablation paragraph now states what the registry can show instead of asserting a programme of studies. Clarity is quoted as 6.7 times throughout instead of drifting to seven. Softened several absolutes and generalisations, including the claim about where research programmes stop. The interface and engine line appeared six times and now appears once. Uses of "rather than" cut from 29 to 12.'],
  ['1.8', 'September 2026',
    'Eighth review round. Every URL is a real anchor carrying the full target: they were printed as plain text, so the PDF viewer was linkifying the shortened visible string and producing links to truncated addresses that failed. All 18 external links and 25 internal anchors checked. Three publication URLs moved to their DOIs, two of them because the journal changed publisher. The lifecycle figure no longer accents deployment alone: all three stages are Oxynet and the accent is on the cycle, with the research stage described as where the physiology comes from rather than as what somebody else does. Softened several claims about the status quo and the field.'],
  ['1.7', 'September 2026',
    'Seventh review round, three corrections. Determinism on the AI-era page now says the result is reproducible on the same model version, rather than implying the answer is equally valid anywhere. The research-to-product contrast credits academic work as the source of the physiology instead of dismissing it. The peer-reviewed count is derived from src/content/publications.ts at build time on both the site and the manual, so the two cannot drift, and the site no longer counts blog posts as papers.'],
  ['1.6', 'September 2026',
    'Sixth review round. The mission page names the technology (convolutional networks, wavelet analysis, learned representation and self-supervised pretraining) instead of deferring all of it to 2.1, and the capability table now says what is behind each row. Line icons on the access cards and the deployment options, drawn on one 20 px grid, no emoji. Fixed the unreadable arrow label on the AI-era figure. The author is credited with post-nominals on the cover, the colophon and the contact card, and nowhere else.'],
  ['1.5', 'September 2026',
    'Fifth review round, commercial signal rather than substance. The mission page opens on the opportunity (CPET data is abundant, interpretation is fragmented) and the strip reads raw CPET to physiological intelligence. Platform is used deliberately alongside layer and engine. 1.6 became "Why build on Oxynet", four audiences and what each stops having to build, replacing a capability list the Part Two divider already carries. "Not a company, yet" became a Current status statement, and "not uniformly mature" became a maturity model with the three states used throughout. The partnership page is now four routes to market with the one-file entry boxed as the call to action. No pages added.'],
  ['1.4', 'September 2026',
    'Fourth review round. The mission page leads with one graph: what you have, what you can get, and what was hidden in it. "Built for the AI era" is now the encode-model-interpret path, with the collective-intelligence fan behind the model. The loop is restated with Oxynet named. Signal quality is drawn as signal processing, raw breaths with the conditioned trace, flagged outliers and the excluded resting phase, with no intensity colouring. The threshold page carries the per-second class probabilities the network emits, obtained from the model directly. The oscillation trace now sits above the wavelet map, and the substrate page leads with the two gases that produce the fat number.'],
  ['1.3', 'September 2026',
    'Third review round, figures. The signature scatter is square with identical axes and a line of identity. Added the transform strip on the mission page: exported, returned, and the rhythm in it, with the real model latency between them. Rebuilt the signal-quality figure as domain-coloured ventilation with the returned landmarks, over the two cross-channel checks drawn as the relationships they test. Rebuilt the threshold figure against oxygen uptake with the ventilatory equivalents beneath it. Fixed the layer diagram frame running off the page, and rebuilt the input table so its notes have room.'],
  ['1.2', 'September 2026',
    'Second review round. Part One rebuilt again to lead with pictures: the signature breath-by-breath domain scatter on the mission page, a product view in a browser frame for "built for the AI era", and the loop restated as research, development, deployment. Removed the classification-to-measurement page and the front-matter explainers. Every figure is breath by breath, with no smoothing anywhere. Added a references page generated from the site publication list, and an ablation note in the technology section. The peer-reviewed count is now seven, counted from that list, not twelve. One PDF, overwritten per build.'],
  ['1.1', 'September 2026',
    'Restructured after first review. Part One rebuilt as six sparse pages that reach the four capabilities by page 10 instead of 15, with a capability and status table and a before-and-after layer diagram. Part Three gained an input-requirements table, three deployment architectures and a governance page. Added the wavelet map from the application. Contents and cross-references are now internal links. Corpus figures made general; model names removed from the cover.'],
]
