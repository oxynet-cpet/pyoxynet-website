/**
 * The guides that answer "how do I get VT1 and VT2 out of my CPET file": one
 * general page and one per vendor whose exports Oxynet was built on.
 *
 * Why they exist: on 2026-10-28 a web search for the questions a person puts
 * to an assistant ("AI tool to find VT1 VT2 from CPET file", "analyse COSMED
 * CPET export ventilatory thresholds") returned the Oxynet papers and never
 * this site, so the assistant concluded that no ready-made tool exists. The
 * baseline and the monthly re-check are in the orchestration repo,
 * docs/visibility.md.
 *
 * A vendor gets a page only when core's parser was built and checked on that
 * vendor's real exports. PNOE and VO2 Master are named in FORMAT_INFO but have
 * no example file in core's corpus or tests (UNVERIFIED_FORMATS in
 * tests/test_parser_formats.py), and a VO2 Master export carries no CO2
 * channel, so the thresholds cannot run on it. Vyaire is unconfirmed. None of
 * the three gets a page until a real file proves it.
 *
 * `handles` is restated from the comments in core's loaders
 * (oxynet/data/parser.py: _load_cosmed, _load_cosmed_no_subject_block and the _load_cortex*
 * family). Public wording omits cohort codes and institution names, as
 * content/developers/formats.ts does.
 */

import { PUBLIC_FORMATS, type FormatId, type FORMAT_INFO } from '@/content/developers/formats'

/** A vendor exactly as FORMAT_INFO names it, so a guide cannot select no formats by a typo. */
type Vendor = (typeof FORMAT_INFO)[FormatId]['vendor']

export interface VendorGuide {
  slug: string
  vendor: Vendor
  /** <title> and the card on the general page. */
  title: string
  description: string
  lede: string
  /** What the file is called in "attach the export and ask". */
  fileNoun: string
  /** What the parser deals with in this vendor's exports, from the loader comments. */
  handles: string[]
}

export const VENDOR_GUIDES: VendorGuide[] = [
  {
    slug: 'cosmed',
    vendor: 'COSMED',
    title: 'VT1 and VT2 from a COSMED Omnia export',
    description:
      'Upload a COSMED Omnia CPET export as it is. Oxynet reads its clock, channels and load the way Omnia writes them and returns both ventilatory thresholds, from an AI assistant, the browser or the API.',
    lede: "Export the test from Omnia, COSMED's CPET software, and hand Oxynet the file. Oxynet reads the layout, the clock and the channels the way Omnia writes them, and returns VT1 and VT2 located by models trained on tests that experts labelled.",
    fileNoun: 'the Omnia export',
    handles: [
      'The clock as Omnia wrote it: an Excel time of day, a fraction of a day, or plain seconds where the column was rebuilt in Excel. The unit is decided once for the whole column, never cell by cell.',
      'Channel names that differ between Omnia revisions and languages: heart rate as HR, HF or HR (bpm), respiratory rate as Rf, F.R or Af.',
      'The external load under the name the installation was configured with: Power or Carico1 for a cycle ergometer in watts, Speed and Grade for a treadmill. Second and third ergometer channels, speed markers and GPS speed are ignored, because in real exports they are empty or measure something other than the ergometer.',
      'SpO2 when the export carries it. When the column is missing it is reported as absent, not as zero.',
      'The full export with the subject block in the leading columns, and an exercise-only export with the subject block stripped.',
    ],
  },
  {
    slug: 'cortex',
    vendor: 'CORTEX',
    title: 'VT1 and VT2 from a CORTEX export',
    description:
      "Upload a CORTEX CPET export as it is, including MetaSoft Studio's .xml workbook. Oxynet reads its tables, units and clocks and returns both ventilatory thresholds, from an AI assistant, the browser or the API.",
    lede: "Export the test from CORTEX's software and hand Oxynet the file. Oxynet reads the CORTEX layouts it was built on, with English, German and French headers, and returns VT1 and VT2 located by models trained on tests that experts labelled.",
    fileNoun: 'the CORTEX export',
    handles: [
      "MetaSoft Studio's Excel-2003 workbook (SpreadsheetML, .xml), read directly: the breath-by-breath table is found inside it, with the work rate in watts.",
      'Oxygen uptake and carbon dioxide output written in L/min, converted to mL/min.',
      "Header variants in English, German ('Messzeit') and French ('Marqueur'), and a layout headed 'Patient'.",
      "The 'Metabolic Edit' workbook with its tables side by side: a clock that restarts at each stage is rebuilt into one time axis, decimal separators lost in the export are repaired, and respiratory rate, which the workbook does not carry, is derived from inspiratory and expiratory time.",
    ],
  },
]

export const guideHref = (g: VendorGuide) => `/ventilatory-thresholds/${g.slug}`

/** The format ids a guide covers, in the formats page's order. */
export const formatsFor = (g: VendorGuide) => PUBLIC_FORMATS.filter((f) => f.vendor === g.vendor)
