/** Part Two: what the engine measures. Pages 12 to 20. */

import { L, GREEN, ACCENT_TEXT, BLUE, WARN, MONO } from '../tokens.mjs'
import {
  page, runhead, folio, grid, wide, eyebrow, h1, stand,
  railBlock, rp, callout, caption, code, table, betaChip, SEP,
} from '../lib.mjs'
import { xref } from '../toc.mjs'
import { api, preds, figThresholds, figIntegrity, figOscillation, figSubstrate, figWavelet, figProbabilities } from '../figures.mjs'

const rh = (right) => runhead(`Part Two ${SEP} What the engine measures`, right)

/** Four stat tiles under a figure. */
function tiles(items, gap = 24) {
  return `<div style="display:grid;grid-template-columns:repeat(${items.length},minmax(0,1fr));gap:18px;margin-top:${gap}px;padding-top:${gap - 6}px;border-top:1px solid ${L.line}">
    ${items.map(([k, v, sub]) => `
      <div>
        <p style="font-family:${MONO};font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:${ACCENT_TEXT};margin:0 0 6px">${k}</p>
        <p style="font-size:21px;font-weight:600;color:${L.strong};margin:0 0 3px;letter-spacing:-.01em">${v}</p>
        <p style="font-size:11.5px;line-height:1.45;color:${L.subtle};margin:0">${sub}</p>
      </div>`).join('')}
  </div>`
}

/** Three explanatory columns under a figure. */
function columns(items) {
  return `<div style="display:grid;grid-template-columns:repeat(${items.length},minmax(0,1fr));gap:24px;margin-top:24px;padding-top:18px;border-top:1px solid ${L.line}">
    ${items.map(([h, b]) => `
      <div>
        <p style="font-family:${MONO};font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:${ACCENT_TEXT};margin:0 0 7px">${h}</p>
        <p style="font-size:12.5px;line-height:1.55;color:${L.body};margin:0">${b}</p>
      </div>`).join('')}
  </div>`
}

const payloadHead = (endpoint, body) => `
  <h2 style="font-size:22px;margin-bottom:5px">What the API returned</h2>
  ${caption(`${endpoint} &nbsp;&nbsp; ${body}`, 'margin:0 0 11px')}`

// ------------------------------------------------------------------ p.12
export function technology() {
  const layer = (label, title, body) => `
    <div style="padding:10px 0;border-top:1px solid ${L.line}">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:14px">
        <span style="font-size:15px;font-weight:600;color:${L.strong}">${title}</span>
        <span style="font-family:${MONO};font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:${L.faint};flex-shrink:0">${label}</span>
      </div>
      <p style="font-size:13px;line-height:1.55;color:${L.body};margin:4px 0 0">${body}</p>
    </div>`

  const main = `
    ${eyebrow(`Part Two ${SEP} 2.1`)}
    ${h1('The technology', 'margin-bottom:16px')}
    <p style="font-size:19px;line-height:1.45;font-weight:500;color:${L.strong};margin:0 0 18px;max-width:600px">Signal processing, machine learning and deep learning, applied to a signal that has had comparatively little of it.</p>
    ${layer('Signal processing', 'Conditioning, spectral analysis, phase',
      'Sampling-aware per-channel smoothing, resampling to a common grid, continuous wavelet analysis over the oscillation band, cross-channel coherence and phase. Deterministic arithmetic, and where signal integrity is decided.')}
    ${layer('Deep learning', 'Convolutional networks over the breath series',
      'The promoted threshold models are CNNs over the detrended series, trained per cohort. Recurrent (LSTM and GRU), temporal-convolutional and transformer variants are trained and benchmarked against them; what ships is whatever clears the gate on a held-out cohort.')}
    ${layer('Representation learning', 'Structure without labels',
      'An unsupervised representation learned from the recordings themselves, in which the intensity domains appear as regions with width. A transition then has an extent that can be measured, instead of being treated as an instant.')}
    ${layer('Ablation', 'Not every channel, every time',
      'Promoted models do not all need the same inputs, and the registry records what each one requires so a caller can check before uploading. Withholding channels during evaluation is how that is established: a model needing five channels where three carry the signal cannot run on a large share of the exports in the field.')}
    ${layer('Self-supervised learning', 'In development, not deployed',
      'Pretraining on unlabelled recordings before fine-tuning on the labelled ones. The corpus is far larger than its labelled subset, so this is where the next gain is expected. It is in no promoted model today and nothing here rests on it.')}`

  const rail =
    railBlock('accent', 'Built for the agentic era',
      rp('CPET interpretation has mostly lived inside desktop software. A general-purpose assistant given a test today will tend to estimate a threshold from the numbers in its context.') +
      rp(`Through MCP it calls a model that was evaluated against expert labelling instead, and reports what came back, refusals included. See ${xref('3.4')}.`, true)) +
    railBlock('surface', 'Named, versioned, pinned',
      rp('Models carry names rather than architecture strings. Same name at a new version means the same cohort, improved; a new name means a different cohort or family.') +
      rp('The manifest wins: the version pinned server-side is served whatever a client asks for, and the response says which one answered.', true)) +
    railBlock('warn', 'Deterministic by design',
      rp('The same recording returns the same numbers, on the same model version, indefinitely. There is no sampling, no temperature, and no run-to-run variation.', true))

  return page({ id: 'p12', body: rh('2.1 The technology') + grid(main, rail) + folio('12') })
}

// ------------------------------------------------------------------ p.13
export function qualityLeft() {
  const m = api.metrics
  const main = `
    ${eyebrow(`Part Two ${SEP} 2.2 ${SEP} Worked example`)}
    ${h1('Whether the numbers can be believed', 'max-width:560px;margin-bottom:14px')}
    ${stand('Before any physiology is reported, the engine establishes whether the recording can support it, in terms that describe the file, not the patient.', 'max-width:600px;margin-bottom:8px')}
    <div style="margin-top:20px">${figIntegrity()}</div>
    ${caption(`Two raw breath series exactly as the cart wrote them, with a conditioned trace running through each. The ringed breaths sit more than four median absolute deviations from the local median: that rule is applied here, to show what conditioning has to contend with, and is not a flag the API returns. The shaded span at the start is the resting portion the substrate analysis dropped before taking its windows, ${api.substrate.flags[0].detail.match(/(\d+) resting samples/)[1]} samples of it. The intensity domains are not drawn on this figure. They are a physiological result, and this page is about whether the recording can support one.`, 'max-width:620px')}
    ${columns([
      ['Gas agreement', 'Do the channels behave as the physiology requires? A cart with a drifting analyser fails here while every individual trace still looks plausible.'],
      ['Sampling adequacy', 'Which oscillation periods can this file resolve at all? Coarse sampling narrows the searchable band; it does not invalidate the recording, and the narrowing is reported.'],
      ['Clock integrity', 'Many carts restart the clock at each phase transition, which makes the raw duration meaningless. A repair is always reported, never silently applied.'],
    ])}`

  return page({ id: 'p13', body: rh('2.2 Signal quality') + wide(main) + folio('13') })
}

// ------------------------------------------------------------------ p.14
export function qualityRight() {
  const m = api.metrics
  const payload = `{
  "gas_quality": {
    "verdict": "confirmed",
    "n_checks": ${m.gas_quality.n_checks},
    "n_passed": ${m.gas_quality.n_passed},
    "vco2_coherence": ${m.gas_quality.vco2_coherence},
    "vco2_phase_error_deg": ${m.gas_quality.vco2_phase_error_deg.toFixed(2)}
  },
  "sampling_adequacy": {
    "raw_interval_s": ${m.sampling_adequacy.raw_interval_s},
    "period_floor_s": ${m.sampling_adequacy.period_floor_s},
    "period_ceiling_s": ${m.sampling_adequacy.period_ceiling_s},
    "band_narrowed": false
  },
  "clock_integrity": {
    "raw_span_s": ${m.clock_integrity.raw_span_s},
    "repair_applied": false
  }
}`

  const main = `
    ${payloadHead('POST /v1/cpet/&#123;id&#125;/compute', '&#123;"metrics": [...]&#125;')}
    ${code(payload)}
    <div style="margin-top:20px;padding-top:16px;border-top:1px solid ${L.line}">
      <h3>Phase recognition, and the error it carries</h3>
      <p style="font-size:14px;line-height:1.6;margin-bottom:10px">A recording is not all exercise. It contains rest, a warm-up, the test and a recovery, and most measurements are meaningless taken across the wrong one. The engine annotates the phases rather than cropping to them, so a consumer can see what was excluded.</p>
      <p style="font-size:14px;line-height:1.6;margin:0">The boundaries are estimated and the estimate carries a mean error of about thirty-four seconds. That number is published rather than hidden, and it propagates: peak oxygen uptake is taken over the whole record instead of the detected exercise phase, because the peak sits at the boundary where that error bites.</p>
    </div>
    <div style="margin-top:14px">${callout(`These describe the recording, not the patient. A file can fail every check and come from a healthy subject. <b style="color:${L.strong}">An absent check is not a passed check:</b> <span class="mono" style="font-size:11.5px">n_checks</span> reports how many were runnable.`)}</div>
`

  return page({ id: 'p14', body: rh('2.2 Signal quality') + wide(main) + folio('14') })
}

// ------------------------------------------------------------------ p.15
export function thresholdsLeft() {
  const main = `
    ${eyebrow(`Part Two ${SEP} 2.3 ${SEP} Worked example`)}
    ${h1('Where VT1 and VT2 sit, and whether they are there at all', 'max-width:560px;margin-bottom:14px')}
    ${stand('The entry product, and the part most often read differently by two competent people looking at the same test.', 'max-width:600px;margin-bottom:4px')}
    <div style="margin-top:14px">${figThresholds()}</div>
    ${caption('Both panels against oxygen uptake, which is the axis these are read on, breath by breath and unsmoothed. Above, ventilation. Below, the ventilatory equivalents, where the textbook criteria live: VT1 sits at the nadir of the equivalent for oxygen while the one for carbon dioxide is still flat, and VT2 where the carbon dioxide equivalent turns up as well. The equivalents come from the file\'s own columns and the dashed lines are what the model returned, so the reader can judge whether the two agree.', 'max-width:620px')}
    <div style="margin-top:14px;padding-top:12px;border-top:1px solid ${L.line}">
      <h3 style="margin-bottom:6px">What the network actually emits</h3>
      ${figProbabilities()}
      ${caption(`Three class probabilities every second, stacked, straight from the model. The thresholds are a detector run over these curves rather than a separate model, which is why a subject who never leaves the moderate domain simply never produces a crossing. Taken by calling the same model on the breath records directly: that path conditions the file slightly differently from the upload path used opposite, so it places the thresholds at ${preds._provenance.vt1_time_s} and ${preds._provenance.vt2_time_s} seconds against ${api.vt.findings.vt1_time_s} and ${api.vt.findings.vt2_time_s}. Same weights, different conditioning, and both figures are reported.`, 'max-width:620px')}
    </div>`

  return page({ id: 'p15', body: rh('2.3 Ventilatory thresholds') + wide(main) + folio('15') })
}

// ------------------------------------------------------------------ p.16
export function thresholdsRight() {
  const f = api.vt.findings
  const p = api.vt.provenance
  const s = api.stored_labels
  const payload = `{
  "analysis": "vt",
  "status": "ok",
  "findings": {
    "vt1_time_s": ${f.vt1_time_s},
    "vt2_time_s": ${f.vt2_time_s},
    "vt1_vo2_ml_min": ${f.vt1_vo2_ml_min},
    "vt2_vo2_ml_min": ${f.vt2_vo2_ml_min}
  },
  "quality": "good",
  "provenance": {
    "model": "${p.model}",
    "model_version": "${p.model_version}",
    "analysis_version": "${p.analysis_version}",
    "latency_ms": ${p.latency_ms}
  }
}`
  const rows = [
    ['VT1', '1,540', '1,605', '+65'],
    ['VT2', '1,940', '2,029', '+89'],
  ]

  const main = `
    ${payloadHead('POST /v1/cpet/&#123;id&#125;/analyze', '&#123;"analyses": ["vt"]&#125;')}
    ${code(payload)}
    <div style="display:grid;grid-template-columns:428px 212px;gap:30px;margin-top:20px;align-items:start">
      <div>
        <h3>Against the label the file carried</h3>
        <p style="font-size:13.5px;line-height:1.55;margin-bottom:12px">This export arrived with thresholds already stored in it, set by the clinician who ran the test. They were not shown to the model.</p>
        ${table(['', 'Stored label', 'Oxynet', '&#916;'], rows, { align: ['left', 'right', 'right', 'right'] })}
        ${caption('Oxygen uptake in mL/min. One test is an illustration, not an evaluation: the promotion gate is what a model is held to.')}
      </div>
      <div>${railBlock('accent', 'Promotion gate',
        rp('No model reaches the registry without clearing, on a held-out cohort:') +
        `<p style="font-family:${MONO};font-size:11.5px;line-height:1.72;color:${L.strong};margin:0">V̇O₂ bias ≤ 120 mL/min<br>V̇O₂ correlation ≥ 0.80<br>time bias ≤ 60 s<br>time correlation ≥ 0.80</p>`)}</div>
    </div>
    <div style="margin-top:16px;padding-top:14px;border-top:1px solid ${L.line}">
      <h3>A threshold that is not there</h3>
      <p style="font-size:14px;line-height:1.6;margin:0">In a symptom-limited clinical cohort a subject may stop before a threshold is crossed, and a model constrained to return two numbers will place them somewhere. The current generation answers the presence question separately from the location question. In a development cohort of 103 clinical tests, 22 had no threshold at all; reporting them as located would have been the more confident output and the wrong one.</p>
    </div>
    <div style="margin-top:14px">${callout(`<b style="color:${L.strong}">No result carries a confidence score.</b> Nothing in Oxynet is calibrated against clinical outcomes, so a percentage would be a number without a meaning. The <span class="mono" style="font-size:11.5px">quality</span> field describes the recording, not the certainty of the answer.`)}</div>
`

  return page({ id: 'p16', body: rh('2.3 Ventilatory thresholds') + wide(main) + folio('16') })
}

// ------------------------------------------------------------------ p.17
export function oscillationLeft() {
  const e = api.eov.event
  const main = `
    ${eyebrow(`Part Two ${SEP} 2.4 ${SEP} Worked example`)}
    ${h1(`Oscillation, measured rather than declared${betaChip()}`, 'max-width:580px;margin-bottom:14px')}
    ${stand('Conventionally reported as present or absent. What the engine returns is the rhythm itself, the evidence that it is real, and the reason it was not graded.', 'max-width:600px;margin-bottom:4px')}
    <div style="margin-top:10px">${figOscillation({ COMPACT: true })}</div>
    ${caption(`The episode in the raw traces first: ventilation cycling while end-tidal carbon dioxide moves against it, ${Math.abs(e.phase_deg).toFixed(0)} degrees out of phase, which is what a disturbance in the ventilatory control loop does and what a movement artefact does not.`, 'max-width:620px;margin-bottom:8px')}
    <div>${figWavelet({ H: 194 })}</div>
    ${caption(`The same view the Oxynet application draws: a wavelet map of ventilation, time against oscillation period, brighter where the rhythm is stronger, with the detected episode boxed and dashed because it was flagged and not graded. The box, its period band and everything quantitative about it came back from the API. The map behind it is computed from the same ventilation trace for this figure, because the detector returns the episode list without the raster behind it.`, 'max-width:620px')}
    ${tiles([
      ['Period', `${e.period_peak_s.toFixed(0)} s`, `band ${e.period_lo_s.toFixed(0)} to ${e.period_hi_s.toFixed(0)} s`],
      ['Amplitude', `${e.amplitude_pct_ve.toFixed(0)} %`, `of ventilation, ${e.amplitude_l_min.toFixed(1)} L/min`],
      ['Clarity', `${e.clarity.toFixed(1)}×`, 'above this recording’s own background'],
      ['Driven by', 'Rate', `${(e.drive_rf_fraction * 100).toFixed(0)} % breathing frequency`],
    ], 14)}`

  return page({ id: 'p17', body: rh('2.4 Oscillatory ventilation') + wide(main) + folio('17') })
}

// ------------------------------------------------------------------ p.18
export function oscillationRight() {
  const e = api.eov.event
  const payload = `{
  "analysis": "eov",
  "grade": "none",
  "findings": {
    "period_peak_s": ${e.period_peak_s.toFixed(2)},
    "amplitude_pct_ve": ${e.amplitude_pct_ve.toFixed(2)},
    "clarity": ${e.clarity.toFixed(2)},
    "co2_coupling": "${e.co2_coupling}",
    "phase_deg": ${e.phase_deg.toFixed(1)},
    "corroborated": true,
    "graded": false
  }
}`

  const main = `
    ${payloadHead('POST /v1/cpet/&#123;id&#125;/analyze', '&#123;"analyses": ["eov"]&#125;')}
    <div style="display:grid;grid-template-columns:300px 1fr;gap:26px;align-items:start">
      <div>${code(payload, { size: 10.5, width: 300 })}</div>
      <div>
        <h3>Not graded, and not normal either</h3>
        <p style="font-size:13.5px;line-height:1.6;margin-bottom:9px">The published definitions cover periods between roughly forty and one hundred and forty seconds. This rhythm ran at twenty-one, so it falls outside them and the engine declines to grade it. The burden is returned as zero, which is the correct answer to the question that was asked.</p>
        <p style="font-size:13.5px;line-height:1.6;margin:0">The rhythm is reported alongside the grade, so a corroborated oscillation 6.7 times above this recording’s background is not lost behind a negative answer. Which of the two matters in a given case is a clinical judgement.</p>
      </div>
    </div>
    <div style="margin-top:16px;border-left:2px solid ${WARN};padding-left:16px">
      <p style="font-family:${MONO};font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:${WARN};margin:0 0 8px">The caveat that travels with this</p>
      <p style="font-size:13.5px;line-height:1.6;color:${L.body};margin:0">Oscillation analysis is beta. It was developed on a single heart-failure cohort of 44 patients and has not been tested for transportability to a second population. It is offered for research use on that basis, and finding that second cohort is one of the collaborations sought in ${xref('4.4')}.</p>
    </div>`

  return page({ id: 'p18', body: rh('2.4 Oscillatory ventilation') + wide(main) + folio('18') })
}

// ------------------------------------------------------------------ p.19
export function substrateLeft() {
  const s = api.substrate
  const main = `
    ${eyebrow(`Part Two ${SEP} 2.5 ${SEP} Worked example`)}
    ${h1('Which fuel, at which intensity', 'max-width:560px;margin-bottom:14px')}
    ${stand('Fat and carbohydrate oxidation read from gas exchange by indirect calorimetry, so it runs on any test with oxygen uptake and carbon dioxide output, with or without an ergometer channel.', 'max-width:600px;margin-bottom:8px')}
    <div style="margin-top:18px">${figSubstrate()}</div>
    ${caption(`Twelve 60-second windows from the reference recording, each one a measurement, not a fitted point. FATMAX at ${s.fatmax.pct_vo2peak} per cent of peak oxygen uptake is the turning point of a fitted cubic, not a measured sample. Beyond RER 1.0 the shaded region begins: there the exhaled carbon dioxide includes a non-metabolic part, the stoichiometry stops holding, and the fat figure is an upper bound that reads low and can read negative. Open markers are those bounds, drawn because hiding them would make the curve look better than the measurement is.`, 'max-width:620px')}
    ${tiles([
      ['FATMAX', `${s.fatmax.pct_vo2peak} %`, 'of peak oxygen uptake'],
      ['Peak fat rate', `${s.fatmax.fat_g_min} g/min`, `${s.fatmax.pct_ee_fat} % of energy`],
      ['Windows', `${s.n_windows}`, `${s.window_s} s clock bins`],
      ['Bounds, not rates', `${s.windows.filter((w) => !w.fat_valid).length} of ${s.n_windows}`, 'windows above RER 1.0'],
    ])}`

  return page({ id: 'p19', body: rh('2.5 Substrate use and FATMAX') + wide(main) + folio('19') })
}

// ------------------------------------------------------------------ p.20
export function substrateRight() {
  const payload = `{
  "analysis": "substrate",
  "findings": {
    "fatmax": { "found": true, "pct_vo2peak": 42.3,
                "fat_g_min": 0.182, "load": null },
    "crossover": {
      "found": false,
      "reason": "Carbohydrate was already the larger fuel
                 at the lowest intensity measured."
    },
    "efficiency": {
      "available": false,
      "reason": "Needs a work rate in watts. This test
                 recorded no external load."
    }
  }
}`

  const main = `
    ${payloadHead('POST /v1/cpet/&#123;id&#125;/analyze', '&#123;"analyses": ["substrate"]&#125;')}
    ${code(payload, { size: 11 })}
    <div style="margin-top:18px;padding-top:16px;border-top:1px solid ${L.line}">
      <h3>Two refusals</h3>
      <p style="font-size:14px;line-height:1.6;margin-bottom:10px">The crossover was not found, and the engine says why: carbohydrate was already the larger fuel at the lowest intensity this protocol reached, so the crossover lies below anything the test covered. That is a fact about the protocol, not a missing value, Returning the lowest measured point as the crossover would report something this test cannot support.</p>
      <p style="font-size:14px;line-height:1.6;margin:0">Gross efficiency was refused outright. It is mechanical work over metabolic energy and this export carries no work rate. Watts could be back-calculated from oxygen uptake, but only by assuming the efficiency the calculation is meant to measure, so the engine declines instead of returning a circular number.</p>
    </div>
    <div style="margin-top:14px">${callout(`One more caveat rides in the response and belongs in any report built on it: these windows are clock bins on a ramp, not steady-state stages. Nothing settled, so FATMAX reads high and is not comparable with a value from a graded test. Every window in the response is marked <span class="mono" style="font-size:11.5px">settled: false</span>, and the summary metric reports the same thing as <span class="mono" style="font-size:11.5px">steady_state</span>, so the caveat travels with the number.`)}</div>
    <p class="cap" style="margin-top:12px">Method: fat and carbohydrate rates from Frayn (1983) and Jeukendrup and Wallis (2005), assuming negligible protein oxidation; energy at 9.75 and 4.18 kcal per gram. FATMAX is the peak of a cubic through the origin fitted after Achten and Jeukendrup, a fitted turning point that carries no confidence.</p>
    `

  return page({ id: 'p20', body: rh('2.5 Substrate use and FATMAX') + wide(main) + folio('20') })
}

export const PART_TWO = [
  technology, qualityLeft, qualityRight, thresholdsLeft, thresholdsRight,
  oscillationLeft, oscillationRight, substrateLeft, substrateRight,
]
