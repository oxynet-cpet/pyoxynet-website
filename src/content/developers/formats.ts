/**
 * The public description of every format id core parses.
 *
 * The ids come from the generated registry (core's SUPPORTED_FORMATS), and
 * this map is typed `satisfies Record<FormatId, ...>`: a format added to or
 * removed from core's parser fails `tsc` here after `registry.py sync`, so the
 * page cannot silently list 23 while core reads 24.
 *
 * Every fact below is restated from core's FORMAT_LABELS
 * (oxynet/data/parser.py), which is what /v1/formats serves. Two things are
 * deliberately left out of the public wording: internal cohort codes
 * (`lab_06` and the like) and the names of the institutions the example files
 * came from. Where core says a vendor is unconfirmed, so does this page.
 * Nothing here extends compatibility beyond what the parser was built on:
 * another software version of the same vendor may or may not parse, and the
 * only honest test is a real file.
 */

import { FORMATS } from '@/generated/registry'

export type FormatId = (typeof FORMATS)[number]['id']

/**
 * What the repository can say about the vendor behind a format.
 * - named: the label names the vendor.
 * - unconfirmed: core itself marks the vendor as unconfirmed.
 * - lab: a laboratory export whose metabolimeter is not recorded. Named by its layout.
 * - oxynet: one of Oxynet's own file shapes, not a vendor's.
 * - reader: not a format; how a table no format matches is read.
 */
export type VendorEvidence = 'named' | 'unconfirmed' | 'lab' | 'oxynet' | 'reader'

export interface PublicFormat {
  vendor: string
  description: string
  /** Only where the label states it. Detection reads content, not the extension. */
  container?: string
  evidence: VendorEvidence
  note?: string
}

export const FORMAT_INFO = {
  cosmed: {
    vendor: 'COSMED',
    description: 'COSMED Omnia export, subject block in the leading columns.',
    evidence: 'named',
  },
  cosmed_no_subject_block: {
    vendor: 'COSMED',
    description: 'COSMED Omnia export trimmed to the exercise phase, channels from the first column (no subject block).',
    evidence: 'named',
  },
  cortex: {
    vendor: 'CORTEX',
    description: "CORTEX export opening with a 'CPET Results' banner.",
    evidence: 'named',
  },
  cortex_metasoft: {
    vendor: 'CORTEX',
    description: 'MetaSoft Studio export.',
    container: 'Excel-2003 SpreadsheetML (.xml)',
    evidence: 'named',
  },
  cortex_side_by_side: {
    vendor: 'CORTEX',
    description: "'Metabolic Edit' workbook with three tables side by side and a clock that restarts at each stage.",
    container: 'Workbook',
    evidence: 'named',
  },
  cortex_csv_german: {
    vendor: 'CORTEX',
    description: "CORTEX export with German headers ('Messzeit').",
    evidence: 'named',
  },
  cortex_csv_patient: {
    vendor: 'CORTEX',
    description: "CORTEX export, 'Patient' header variant.",
    evidence: 'named',
  },
  cortex_csv_french: {
    vendor: 'CORTEX',
    description: "CORTEX export with French headers ('Marqueur').",
    evidence: 'named',
  },
  vintus: {
    vendor: 'Vyntus / Vyaire',
    description: "Export with Italian headers ('Polso O2').",
    evidence: 'unconfirmed',
  },
  vyiare: {
    vendor: 'Vyaire (probable)',
    description: 'Tab-delimited text with a Height / Weight / Gender banner.',
    container: 'Tab-delimited .txt',
    evidence: 'unconfirmed',
  },
  VO2Master: {
    vendor: 'VO2 Master',
    description: 'VO2 Master portable analyser export.',
    evidence: 'named',
  },
  pnoe_csv: {
    vendor: 'PNOE',
    description: 'PNOE export with the clock in seconds and a PHASE column.',
    container: 'Semicolon-delimited text',
    evidence: 'named',
  },
  csv_german_underscore: {
    vendor: 'Not recorded',
    description: 'German-headed export with Zeit / Watt / V_E channels.',
    container: 'CSV',
    evidence: 'lab',
  },
  csv_time_load: {
    vendor: 'Not recorded',
    description: "Export opening with Time and Load columns, a units row and V'E / V'O2 channel names.",
    container: 'CSV',
    evidence: 'lab',
  },
  csv_temps_in_rows: {
    vendor: 'Not recorded',
    description: "Export with a subject header row, channel names in a data row ('Temps') and the clock in decimal minutes.",
    evidence: 'lab',
  },
  csv_nom_banner: {
    vendor: 'Not recorded',
    description: "Export with a French subject banner ('NOM :') and the clock in decimal minutes.",
    evidence: 'lab',
  },
  csv_temps_header: {
    vendor: 'Not recorded',
    description: "Export with a 'TEMPS' clock column and a bracketed units row.",
    evidence: 'lab',
  },
  csv_work_third_column: {
    vendor: 'Not recorded',
    description: "Export with 'Work' as the third column header.",
    evidence: 'lab',
    note: 'No example file in the corpus to verify the parser against. Send one before relying on it.',
  },
  xlsx_marker_rows: {
    vendor: 'Not recorded',
    description: 'Breath-by-breath workbook with a units row and phase marker rows; a missing clock is rebuilt from the breathing rate.',
    container: 'Workbook',
    evidence: 'lab',
  },
  sectioned_bxb: {
    vendor: 'Unconfirmed',
    description:
      'Stacked named tables (5 s averaged, blood pressure, breath by breath), V′E-style channel names, gases in kPa.',
    container: 'Tab-delimited text',
    evidence: 'unconfirmed',
  },
  canonical_json: {
    vendor: 'Oxynet',
    description:
      'Oxynet canonical JSON: an id and a list of samples {t, VO2, VCO2, VE, ...}. The format to convert into when nothing else reads a file.',
    container: 'JSON',
    evidence: 'oxynet',
  },
  generated_pyoxynet: {
    vendor: 'Oxynet',
    description: 'A synthetic recording generated by Oxynet.',
    evidence: 'oxynet',
  },
  oxynet_phase_csv: {
    vendor: 'Oxynet',
    description: 'An Oxynet-derived research file: one subject per file, breath by breath, with a phase column.',
    evidence: 'oxynet',
  },
  generic_table: {
    vendor: 'Any',
    description:
      'Any other table whose columns carry standard channel names (time, VO2, VCO2, VE and more, in common languages and notations). Each column is identified by its header and checked against the recording itself; a file that does not hold together is refused, with the reason.',
    evidence: 'reader',
    note: 'Not a vendor format, so not in the count above. The detected columns and their units are listed in the parse flags.',
  },
} as const satisfies Record<FormatId, PublicFormat>

export const EVIDENCE_LABEL: Record<VendorEvidence, string> = {
  named: 'Vendor named',
  unconfirmed: 'Vendor unconfirmed',
  lab: 'Lab export',
  oxynet: 'Oxynet format',
  reader: 'Read by channel names',
}

/** The fallback shape, from core's CANONICAL_JSON_SHAPE and CANONICAL_JSON_UNITS. */
export const CANONICAL_UNITS: [string, string][] = [
  ['t', 'seconds from the start of the recording'],
  ['VO2', 'mL/min (not L/min)'],
  ['VCO2', 'mL/min'],
  ['VE', 'L/min'],
  ['RF', 'breaths/min (optional)'],
  ['PetO2', 'mmHg (optional)'],
  ['PetCO2', 'mmHg (optional; required for oscillation analysis)'],
  ['HR', 'bpm (optional)'],
]

const EVIDENCE_ORDER: VendorEvidence[] = ['named', 'unconfirmed', 'lab', 'oxynet', 'reader']

/** Grouped the way a partner scans: named vendors first, then by vendor, then by id. */
export const PUBLIC_FORMATS = FORMATS.map((f) => ({ id: f.id, ...(FORMAT_INFO[f.id] as PublicFormat) })).sort(
  (a, b) =>
    EVIDENCE_ORDER.indexOf(a.evidence) - EVIDENCE_ORDER.indexOf(b.evidence) ||
    a.vendor.localeCompare(b.vendor) ||
    a.id.localeCompare(b.id)
)
