/**
 * What Oxynet computes, by evidence maturity.
 *
 * Status follows the manual's capability table (Part One, 1.3) and its
 * definitions (Part Four, 4.1). Inputs, outputs, names and limits are from
 * oxynet-core: the analyze runners in oxynet/api/v1.py, the metric registry in
 * oxynet/analysis/registry.py, and the MCP tool text. A row that is not on the
 * public API says where it is available instead.
 */

import type { Maturity } from './maturity'

export interface Capability {
  name: string
  status: Maturity
  what: string
  inputs: string
  output: string
  evidence: string
  limits: string
  /** How to call it. Absent when it is not exposed on the API. */
  call?: string
  /** Where it is available when not on /v1. */
  where?: string
}

export const CAPABILITIES: Capability[] = [
  {
    name: 'Ventilatory thresholds (VT1, VT2)',
    status: 'production',
    what: 'The first and second ventilatory thresholds. With no model named, a committee answers: gradient-boosted trees (treebeard) and convolutional networks over the breath series, combined. When the committee cannot run, a single method answers, treebeard first.',
    inputs: 'V̇O₂, V̇CO₂ and V̇E are enough: treebeard needs only those, so a file without end-tidal gases is still analysed. The networks also read PetO₂ and PetCO₂ where the file has them. The channels each method needs are checked before it runs.',
    output: 'vt1_time_s, vt2_time_s, vt1_vo2_ml_min, vt2_vo2_ml_min, a confidence category (low or normal), and the method and version that answered, with provenance.selection saying why.',
    evidence: 'Agreement with expert labelling across cohorts that differ in population, protocol, ergometer and metabolimeter, in peer-reviewed work. The longest record of any capability. The routed method is the one with the best measured agreement on that kind of test, and the evidence travels in provenance.selection.',
    limits: 'Agreement with expert raters, not calibration against outcomes: no numeric confidence is returned. The confidence category is set by stated rules, such as a threshold placed at rest. A recording with no exercise, under 2 minutes of it, no incremental load or gas values that cannot be gas exchange is refused with the reason.',
    call: 'POST /v1/cpet/{id}/analyze  {"analyses": ["vt"]}  (or POST /v1/cpet/{id}/assess for every analysis at once)',
  },
  {
    name: 'Exercise intensity domains',
    status: 'production',
    what: 'Moderate, heavy and severe: the domains VT1 and VT2 bound.',
    inputs: 'As for thresholds.',
    output: 'Every breath coloured by its domain in the web application, drawn from the thresholds of the routed answer. Per-second domain probabilities exist only when a single network is named there.',
    evidence: 'As for thresholds: the domains follow from them.',
    limits: 'Not returned by /v1 or MCP, which return the thresholds; a routed answer has no per-second probabilities of its own.',
    where: 'Drawn in the web application at app.oxynet.net.',
  },
  {
    name: 'Substrate use and FATMAX',
    status: 'production',
    what: 'Fat and carbohydrate oxidation by indirect calorimetry, FATMAX, the crossover to carbohydrate, and gross efficiency.',
    inputs: 'V̇O₂ and V̇CO₂. A work-rate channel adds a wattage axis and gross efficiency; without one it runs against %V̇O₂peak.',
    output: 'Windowed oxidation rates, FATMAX (a fitted turning point, not a measured sample), crossover, efficiency, and flags.',
    evidence: 'Standard stoichiometry (Frayn 1983; Jeukendrup and Wallis 2005), with the equations returned in the response.',
    limits: 'Above RER 1.0 the fat rate is an upper bound, not a measurement. A ramp never reaches steady state, so FATMAX reads high and is not comparable with a graded test. Both are flagged.',
    call: 'POST /v1/cpet/{id}/analyze  {"analyses": ["substrate"]}  (or the substrate_summary metric)',
  },
  {
    name: 'Derived CPET quantities',
    status: 'production',
    what: 'Peak values, O₂ pulse, the V̇E/V̇CO₂ slope profile, rest / warm-up / exercise / recovery phases, and classical landmarks.',
    inputs: 'Per metric; GET /v1/metrics states each one’s required channels and minimum duration.',
    output: 'vo2max, vemax, rermax, o2_pulse, ve_vco2_slope (over 25/50/75/100 % of exercise, with intervals), phases, landmarks, substrate_summary.',
    evidence: 'Deterministic computations on the recording’s own signal.',
    limits: 'Landmarks (V-slope, respiratory compensation, V̇E/V̇CO₂ nadir, PetCO₂ peak) corroborate and never override a model. Phase boundaries carry an error of tens of seconds.',
    call: 'POST /v1/cpet/{id}/compute  {"metrics": [...]}',
  },
  {
    name: 'Signal integrity',
    status: 'production',
    what: 'Whether the recording can support a measurement at all: cross-channel agreement of the gas analysis, the band the sampling can resolve, and clock repair.',
    inputs: 'Any parsed recording.',
    output: 'gas_quality, sampling_adequacy, clock_integrity; channel presence, coverage and parser flags in the upload summary.',
    evidence: 'Physiological consistency checks: CO₂ output against ventilation, end-tidal O₂ against CO₂.',
    limits: 'An absent check is not a passed one: n_checks says how many were runnable.',
    call: 'GET /v1/cpet/{id}  and  POST /v1/cpet/{id}/compute',
  },
  {
    name: 'Vendor format parsing',
    status: 'production',
    what: 'Reads the export as the cart wrote it, with each format’s units, clock resets and decimal conventions.',
    inputs: 'The unchanged export file.',
    output: 'A cpet_id, and a summary of what was parsed and what is absent, with reasons.',
    evidence: 'Detection is scored from content and refuses when no candidate is clearly best.',
    limits: 'Some formats rest on few example files; the formats page says which. A different software version may not parse.',
    call: 'POST /v1/cpet',
  },
  {
    name: 'Oscillatory ventilation (EOV) and the ventilatory control loop',
    status: 'research',
    what: 'A continuous wavelet detector for oscillatory breathing, its grade and burden, and the loop gain of the chemoreflex behind it.',
    inputs: 'V̇E and PetCO₂ (at least 80 % coverage) over at least 128 s. Breathing frequency separates rate from volume drive.',
    output: 'Grade and burden, events with period and amplitude, CO₂ coupling, the loop-gain margin, gas quality.',
    evidence: 'Developed on a single heart-failure cohort of 44 patients.',
    limits: 'Beta. Transportability to any other population is untested. Treat every output as a research finding.',
    call: 'POST /v1/cpet/{id}/analyze  {"analyses": ["eov"]}',
  },
  {
    name: 'Alternative threshold engine',
    status: 'research',
    what: 'A second threshold model that first asks whether each threshold is in the test at all, offered as a second opinion.',
    inputs: 'As for thresholds.',
    output: 'VT1 and VT2, each detectable, equivocal or not detectable, with a position unless it is not detectable.',
    evidence: 'Built and checked on clinical tests from a single centre, most of them stopped for symptoms.',
    limits: 'Not tested anywhere else. Deliberately not on the API or MCP.',
    where: 'In the web application only, marked beta.',
  },
  {
    name: 'Self-supervised pretraining',
    status: 'research',
    what: 'Pretraining on unlabelled recordings.',
    inputs: 'Not applicable.',
    output: 'None exposed.',
    evidence: 'In development.',
    limits: 'In no promoted model, and not reachable from any interface.',
  },
]

/** The interfaces and deployment options. Their status is about availability, not evidence. */
export const INTERFACES: { name: string; status: Maturity | 'arrangement'; note: string }[] = [
  { name: 'REST API (v1)', status: 'production', note: 'Key per caller, analyses granted per key.' },
  { name: 'MCP endpoint', status: 'available', note: 'Streamable HTTP at /oxynet-mcp, for any MCP client.' },
  { name: 'OpenAPI 3.0 schema', status: 'available', note: 'Public, for client generation and agent actions.' },
  { name: 'Web application', status: 'available', note: 'app.oxynet.net, for results without building anything.' },
  { name: 'Python package (pyoxynet)', status: 'available', note: 'Open source, local research inference. Not a client for the API.' },
  { name: 'Local and embedded deployment', status: 'arrangement', note: 'Scoped per partner. Not a self-service product.' },
]
