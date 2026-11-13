/** Part Three: how it is integrated. Pages 22 to 27. */

import { L, GREEN, ACCENT_TEXT, BLUE, WARN, MONO, SANS } from '../tokens.mjs'
import {
  page, runhead, folio, grid, wide, eyebrow, h1, stand,
  railBlock, rp, callout, caption, code, table, extlink, SEP,
} from '../lib.mjs'
import { LINKS, CORPUS } from '../config.mjs'
import { xref } from '../toc.mjs'
import { api } from '../figures.mjs'
import { icons } from '../icons.mjs'

const rh = (right) => runhead(`Part Three ${SEP} How it is integrated`, right)

// ------------------------------------------------------------------ p.22
export function rule() {
  const main = `
    ${eyebrow(`Part Three ${SEP} 3.1`)}
    ${h1('Hand Oxynet the file, work with the handle', 'margin-bottom:14px')}
    ${stand('One architectural rule shapes the whole API, and everything else follows from it.', 'margin-bottom:12px')}
    <p style="margin-bottom:8px">The caller posts the vendor file exactly as the cart exported it and receives a handle. Every later operation names the handle, and the signals never pass back through the caller unless a picture is being drawn.</p>
    <div>
      ${[
        ['The parsing stays where the knowledge is', `${CORPUS.formats} vendor formats, each with its own column names, unit conventions and clock quirks. A caller that normalises the file first has to reimplement all of it, and will lose information doing so.`],
        ['The measurement runs at full resolution', 'Every analysis runs on the complete record, never on a decimated copy, so a narrow feature cannot fall between two kept samples.'],
        ['A cohort becomes possible', 'A 360 KB export is roughly ninety thousand tokens inlined into a conversation. Through a handle, an assistant works through a hundred recordings holding only the structured results.'],
      ].map(([h, b]) => `
      <div style="padding:8px 0;border-top:1px solid ${L.line}">
        <p style="font-size:15px;font-weight:600;color:${L.strong};margin:0 0 2px">${h}</p>
        <p style="font-size:13.5px;line-height:1.55;color:${L.body};margin:0">${b}</p>
      </div>`).join('')}
    </div>
    <p style="margin-top:12px;margin-bottom:8px">The lifecycle is four calls, whether the caller is a hospital integration, a script or an assistant.</p>
    ${code(`get_capabilities()             # what may this key do
create_upload()                # -> a one-shot upload URL
$ curl -F "file=@test.csv" URL # -> cpet_id
analyze_vt(id), analyze_eov(id)
compute_metrics(id, ["vo2max"])
get_cpet_series(id, ["VE"])    # only to draw a picture`)}`

  const rail =
    railBlock('accent', 'Check what the key allows',
      rp('Analyses are sold separately, so a key holding thresholds does not necessarily hold oscillation.') +
      rp(`<span class="mono" style="font-size:11.5px">get_capabilities</span> reports what the key may do, which models it can reach and what the limits are. Checking is cheaper than handling a refusal.`, true)) +
    railBlock('surface', 'Ephemeral by default',
      rp(`Uploaded bytes are parsed and discarded, never stored. The parsed record is deleted after ${api.capabilities.limits.retention_hours} hours unless the caller asks for longer, up to ${api.capabilities.limits.max_retain_hours} hours.`, true))

  return page({ id: 'p22', body: rh('3.1 The architectural rule') + grid(main, rail) + folio('22') })
}

// ------------------------------------------------------------------ p.23
export function inputs() {
  // Three states, and the distinction that matters is between "the analysis
  // cannot run without it" and "the analysis is poorer without it".
  const MARK = {
    req: [`<span style="color:${ACCENT_TEXT};font-weight:700">●</span>`, 'required'],
    pref: [`<span style="color:${BLUE}">◐</span>`, 'preferred'],
    opt: [`<span style="color:${L.faint}">○</span>`, 'optional'],
    no: [`<span style="color:${L.line}">·</span>`, 'not used'],
  }

  const CHANNELS = [
    ['Time', 's', 'req', 'req', 'req', 'Seconds from the start of the recording. Does not need a uniform grid'],
    ['V̇O₂', 'mL/min', 'req', 'req', 'req', 'The axis thresholds and substrate use are both reported against'],
    ['V̇CO₂', 'mL/min', 'req', 'req', 'req', 'Without it there is no substrate analysis at all'],
    ['V̇E', 'L/min', 'req', 'req', 'pref', 'The channel the oscillation is measured in'],
    ['PetO₂', 'mmHg', 'req', 'pref', 'no', 'Half of the end-tidal closure check'],
    ['PetCO₂', 'mmHg', 'req', 'req', 'no', 'Without it an oscillation cannot be corroborated, and the analysis says so instead of guessing'],
    ['Heart rate', 'bpm', 'opt', 'opt', 'opt', 'Needed for O₂ pulse, and for nothing else'],
    ['Breathing frequency', 'min⁻¹', 'opt', 'pref', 'no', 'Separates a rhythm driven by rate from one driven by volume'],
    ['Work rate', 'W', 'opt', 'opt', 'pref', 'Without it there is no gross efficiency, and FATMAX is an intensity rather than a wattage'],
  ]

  const rows = CHANNELS.map(([name, unit, vt, eov, sub, note]) => `
    <div style="padding:9px 0;border-top:1px solid ${L.line}">
      <div style="display:grid;grid-template-columns:170px 62px 62px 62px 1fr;gap:10px;align-items:baseline">
        <span>
          <span style="font-size:13.5px;font-weight:600;color:${L.strong}">${name}</span>
          <span style="font-family:${MONO};font-size:9.5px;color:${L.faint};margin-left:6px">${unit}</span>
        </span>
        <span style="text-align:center;font-size:13px">${MARK[vt][0]}</span>
        <span style="text-align:center;font-size:13px">${MARK[eov][0]}</span>
        <span style="text-align:center;font-size:13px">${MARK[sub][0]}</span>
        <span style="font-size:11.5px;line-height:1.45;color:${L.subtle}">${note}</span>
      </div>
    </div>`).join('')

  const head = `
    <div style="display:grid;grid-template-columns:170px 62px 62px 62px 1fr;gap:10px;padding-bottom:7px;border-bottom:1.5px solid ${L.strong}">
      ${['Channel', 'Thresholds', 'Oscillation', 'Substrate', 'Notes'].map((h, i) => `
        <span style="font-family:${MONO};font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:${L.subtle};text-align:${i > 0 && i < 4 ? 'center' : 'left'}">${h}</span>`).join('')}
    </div>`

  const legend = Object.values(MARK)
    .map(([glyph, word]) => `<span style="margin-right:16px;font-size:11px;color:${L.subtle}">${glyph} ${word}</span>`)
    .join('')

  const main = `
    ${eyebrow(`Part Three ${SEP} 3.2`)}
    ${h1('What the engine needs', 'margin-bottom:12px')}
    ${stand('The three analyses have different appetites. A file that supports thresholds does not necessarily support oscillation, and the API says which before anything is attempted.', 'margin-bottom:14px')}
    ${head}${rows}
    <p style="margin:10px 0 0">${legend}</p>
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:26px;margin-top:20px;padding-top:16px;border-top:1px solid ${L.line}">
      <div>
        <h3>Sampling</h3>
        <p style="font-size:13px;line-height:1.55;color:${L.body};margin:0 0 8px">Breath by breath or interval averaged, both accepted, and records do not have to sit on a uniform grid: the engine resamples before inference and reports the interval it received.</p>
        <p style="font-size:13px;line-height:1.55;color:${L.body};margin:0">The raw interval sets which oscillation periods can be resolved at all, so a coarse export narrows the searchable band. The narrowing is reported rather than being allowed to look like an absence.</p>
      </div>
      <div>
        <h3>What is not inferred</h3>
        <p style="font-size:13px;line-height:1.55;color:${L.body};margin:0 0 8px">A channel that was not recorded is reported as absent, with the reason, and nothing is substituted for it.</p>
        <p style="font-size:13px;line-height:1.55;color:${L.body};margin:0">Work rate is the case that matters commercially: watts can be back-calculated from oxygen uptake only by assuming the efficiency such a calculation is meant to measure. The engine reports the channel as absent instead.</p>
      </div>
    </div>`

  return page({ id: 'p23', body: rh('3.2 What the engine needs') + wide(main) + folio('23') })
}

// ------------------------------------------------------------------ p.24
export function rest() {
  const ep = (method, path, body) => `
    <div style="padding:9px 0;border-top:1px solid ${L.line}">
      <p style="font-family:${MONO};font-size:12px;color:${L.strong};margin:0 0 4px">
        <span style="color:${ACCENT_TEXT};font-weight:500">${method}</span> ${path}</p>
      <p style="font-size:13px;line-height:1.5;color:${L.body};margin:0">${body}</p>
    </div>`

  const main = `
    ${eyebrow(`Part Three ${SEP} 3.3`)}
    ${h1('REST', 'margin-bottom:12px')}
    ${stand('The surface a clinical system or a data pipeline integrates against. Authentication is an API key in a header; models and analyses are granted per key.', 'margin-bottom:10px')}
    ${ep('GET', '/v1/capabilities', 'What this key may do: licensed analyses, reachable models, the metric registry, limits and the retention policy.')}
    ${ep('POST', '/v1/cpet', 'Upload a recording. The format is detected; the response says what was parsed and which channels are absent, with a reason for each.')}
    ${ep('POST', '/v1/cpet/{id}/analyze', 'Run models. One envelope per analysis, and one that cannot run does not stop the others.')}
    ${ep('POST', '/v1/cpet/{id}/compute', 'Derived quantities from the metric registry: peaks, the slope profile, classical landmarks, input-quality checks.')}
    ${ep('GET', '/v1/cpet/{id}/series', 'A decimated slice of the signals, for plotting only. Never for computing.')}
    <div style="margin-top:12px">
      <h3>The envelope</h3>
      <p style="font-size:13.5px;line-height:1.55;margin-bottom:9px">Every analysis returns the same shape, so a consumer writes one parser and not three.</p>
      ${code(`{
  "status":     "ok" | "not_analysable",
  "findings":   { ... } | null,
  "quality":    "good" | "acceptable"
                | "poor" | "unusable",
  "notes":      [ "plain-language caveats" ],
  "provenance": { "model", "model_version",
                  "analysis_version",
                  "latency_ms" }
}`)}
    </div>`

  const rail =
    railBlock('warn', 'Two fields to read carefully',
      rp(`<span class="mono" style="font-size:11.5px">quality</span> describes the INPUT recording. It is not a confidence in the answer, and there is no field that is.`) +
      rp(`<span class="mono" style="font-size:11.5px">notes</span> is not decoration. It carries the caveats that must travel with the numbers into any report built on them.`, true)) +
    railBlock('surface', 'Machine-readable',
      rp(`OpenAPI 3.0 at <b style="color:${L.strong}">${extlink(LINKS.openapi, '/v1/openapi.json')}</b>, importable into a client generator, an agent action or an integration platform.`) +
      rp(`Plain-text integration guide at <b style="color:${L.strong}">${extlink(LINKS.llms, '/llms.txt')}</b>, so an agent reads the documentation in one request.`, true)) +
    railBlock('accent', 'Provenance on every result',
      rp('Which model, which version, which analysis version, and how long it took. A result can always be traced to the thing that produced it.', true))

  return page({ id: 'p24', body: rh('3.3 REST') + grid(main, rail) + folio('24') })
}

// ------------------------------------------------------------------ p.25
export function mcp() {
  const turn = (label, colour, inner) => `
    <div style="display:grid;grid-template-columns:48px 1fr;gap:13px;padding:8px 0">
      <span style="font-family:${MONO};font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:${colour};padding-top:3px">${label}</span>
      <span>${inner}</span></div>`
  const tool = (call, result) =>
    turn('Tool', ACCENT_TEXT,
      `<span style="display:inline-block;font-family:${MONO};font-size:11.5px;color:${L.strong};background:${L.surface};border:1px solid ${L.line};border-radius:5px;padding:3px 9px">${call}</span>
       <span style="display:block;font-family:${MONO};font-size:11px;line-height:1.6;color:${L.subtle};margin-top:6px;white-space:pre-wrap">${result}</span>`)

  const transcript =
    turn('You', L.faint, `<span style="font-size:14.5px;line-height:1.55;color:${L.strong};font-weight:500">Analyse the test in ~/exports/R5-T3.json. Is there oscillatory ventilation?</span>`) +
    tool('create_upload() &nbsp;→&nbsp; $ curl -F "file=@R5-T3.json"',
      'cpet_id: cpet_7485262aa3f7 · canonical_json (detected)\n353 breaths · 969 s · Work: absent, and nothing is inferred from V̇O₂') +
    tool('analyze_vt(cpet_id) · analyze_eov(cpet_id)',
      'vt  → VT1 619 s / 1605 mL/min · VT2 763 s / 2029 mL/min · quality good\neov → grade "none" · 1 event flagged, not graded · gas quality confirmed') +
    turn('Agent', L.faint,
      `<span style="font-size:14.5px;line-height:1.6;color:${L.body}"><b style="color:${L.strong}">Not by the graded definition, and that is not the whole answer.</b>
       Oxynet found one rhythm, from 9.8 to 10.5 minutes: breathing cycled every 21 seconds, swinging 17 % of ventilation,
       6.7 times above this recording&rsquo;s own background, with end-tidal CO₂ moving in antiphase to corroborate it.
       That period is faster than the 40 to 140 seconds the EOV definitions cover, so it is flagged and not graded.
       <span style="display:block;margin-top:8px;color:${L.subtle};font-size:13.5px">Oscillation analysis is beta and was developed on a single heart-failure cohort, so treat this as a research finding. There is no work-rate channel in this export, so nothing here is read against a work rate.</span></span>`)

  const main = `
    ${eyebrow(`Part Three ${SEP} 3.4`)}
    ${h1('MCP, and what an assistant may do', 'margin-bottom:12px')}
    ${stand('A native connector for Claude, Gemini CLI and any MCP client. The assistant orchestrates and explains. It does not do the physiology.', 'margin-bottom:14px')}
    <div style="border:1px solid ${L.line};border-radius:12px;padding:4px 18px 10px;background:${L.bg}">
      <p style="font-family:${MONO};font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:${L.faint};margin:12px 0 2px">Reproduced session ${SEP} abridged</p>
      ${transcript}
    </div>`

  const rail =
    railBlock('accent', 'The rule',
      rp('The file goes from disk to Oxynet and only the summary comes back. The signals never travel through the conversation, which is what makes a cohort tractable at all.', true)) +
    railBlock('surface', 'One line to connect',
      `<p style="font-family:${MONO};font-size:10px;line-height:1.75;color:${L.strong};margin:0;overflow-wrap:break-word">claude mcp add --transport http oxynet ${LINKS.mcp} --header "X-API-Key: ..."</p>`) +
    railBlock('warn', 'Why this matters',
      rp('A general-purpose assistant given a CPET will tend to estimate a threshold from the numbers in its context. Through MCP it calls the model that was evaluated against expert labelling, and reports what came back.', true)) +
    railBlock('surface', 'When an analysis cannot run',
      rp('Where a recording cannot support an analysis the API says so and says why, and the assistant is instructed to report it. It is also instructed not to attach a confidence to a result that has none.', true))

  return page({ id: 'p25', body: rh('3.4 MCP') + grid(main, rail) + folio('25') })
}

// ------------------------------------------------------------------ p.26
export function deployment() {
  const option = (letter, title, chain, pros, cons, note, icon) => `
    <div style="border:1px solid ${letter === 'C' ? '#00dc8233' : L.line};background:${letter === 'C' ? '#00dc820a' : L.bg};border-radius:11px;padding:16px 17px">
      <div style="display:flex;align-items:center;gap:9px;margin-bottom:9px;color:${ACCENT_TEXT}">
        ${icon({ size: 18 })}
        <span style="font-family:${MONO};font-size:9.5px;letter-spacing:.14em">${letter}</span>
        <span style="font-size:15px;font-weight:600;color:${L.strong}">${title}</span>
      </div>
      <p style="font-family:${MONO};font-size:10px;line-height:1.75;color:${L.subtle};margin:0 0 10px;white-space:pre-line">${chain}</p>
      <p style="font-size:12px;line-height:1.5;color:${L.body};margin:0 0 6px"><b style="color:${L.strong}">For:</b> ${pros}</p>
      <p style="font-size:12px;line-height:1.5;color:${L.body};margin:0 0 8px"><b style="color:${L.strong}">Against:</b> ${cons}</p>
      <p style="font-size:11.5px;line-height:1.5;color:${L.subtle};margin:0;padding-top:8px;border-top:1px solid ${L.line}">${note}</p>
    </div>`

  const main = `
    ${eyebrow(`Part Three ${SEP} 3.5`)}
    ${h1('Cloud, local, embedded', 'margin-bottom:12px')}
    ${stand('The same engine, deployed three ways. Which one fits is a product, regulatory and infrastructure decision more than a technical one, and one to work through together.', 'margin-bottom:18px')}
    <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px">
      ${option('A', 'Hosted API',
        'your software\n   ↓ HTTPS\nOxynet, hosted\n   ↓ JSON\nyour software',
        'the fastest route to a working integration, central model updates, nothing to deploy or keep current',
        'recordings leave the local environment, and connectivity becomes a dependency',
        'Live today. This is what the worked examples in Part Two were run against.', icons.cloud)}
      ${option('B', 'Local engine',
        'your software\n   ↓\nOxynet, on your\ninfrastructure\n   ↓\nyour software',
        'recordings never leave the institution, low latency, suits restricted clinical environments',
        'you own deployment and update management, and models have to be shipped to you',
        'The Python package already performs local inference. A packaged server deployment is scoped per partner.', icons.local)}
      ${option('C', 'Embedded',
        'your product\n ┌─────────────┐\n │   Oxynet    │\n │   engine    │\n └─────────────┘',
        'interpretation inside the product, available during the test rather than after it, no network at all',
        'the tightest coupling, and the longest conversation about versioning and support',
        'Models are small convolutional networks and export to on-device runtimes. Real-time and edge deployment is a direction the architecture supports, and a joint scoping exercise, not a shipping product.', icons.device)}
    </div>
    <div style="margin-top:20px">${callout(`The engine is the same in all three. What changes is where it runs and who operates it, so a partnership can start on the hosted API and move inward without the interpretation changing underneath the customer.`)}</div>`

  return page({ id: 'p26', body: rh('3.5 Cloud, local, embedded') + wide(main) + folio('26') })
}

// ------------------------------------------------------------------ p.27
export function governance() {
  const lim = api.capabilities.limits
  const main = `
    ${eyebrow(`Part Three ${SEP} 3.6`)}
    ${h1('Limits, retention and governance', 'margin-bottom:12px')}
    ${stand('What an integrator needs before a pilot, and what a data protection officer needs before signing one.', 'margin-bottom:16px')}
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:26px">
      <div>
        <h3>Operational limits</h3>
        ${table(['', 'Value'], [
          ['Upload size', `${(lim.max_upload_bytes / 1024 / 1024).toFixed(0)} MB`],
          ['Retention, default', `${lim.retention_hours} h`],
          ['Retention, maximum', `${lim.max_retain_hours} h`],
          ['Upload ticket life', '5 min'],
          ['Record length', '40 to 4,800 samples'],
          ['Formats read', `${CORPUS.formats}, auto-detected`],
        ], { align: ['left', 'right'] })}
      </div>
      <div>
        <h3>Access</h3>
        <p style="font-size:13px;line-height:1.55;color:${L.body};margin:0 0 8px">An API key per caller, in a header. Analyses and models are granted per key, so a key that holds thresholds does not hold oscillation unless it was sold.</p>
        <p style="font-size:13px;line-height:1.55;color:${L.body};margin:0">The upload URL carries its own short-lived credential, so the shell command that posts a file handles no API key at all.</p>
      </div>
    </div>
    <div style="margin-top:20px;padding-top:16px;border-top:1px solid ${L.line}">
      <h3>Data handling, stated exactly</h3>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:26px;margin-top:8px">
        <div>
          <p style="font-size:13.5px;line-height:1.6;margin:0 0 9px">Uploaded bytes are parsed and discarded. They are never written to storage. What persists is the parsed record, deleted after ${lim.retention_hours} hours unless the caller asks for longer.</p>
          <p style="font-size:13.5px;line-height:1.6;margin:0">Nothing a customer uploads enters the training corpus. Research cohorts that do are pseudonymised at the point they are emitted, before they reach it.</p>
        </div>
        <div>
          <p style="font-size:13.5px;line-height:1.6;margin:0 0 9px">Option B on the previous page exists for environments where identifiable data must not leave the institution at all.</p>
          <p style="font-size:13.5px;line-height:1.6;margin:0">These are the technical characteristics of the system. Whether a given deployment satisfies a given jurisdiction is a compliance assessment, and one no vendor document can perform on your behalf.</p>
        </div>
      </div>
    </div>
    <div style="margin-top:16px">${callout(`This manual is a snapshot. The API reference at <b style="color:${L.strong}">${extlink(LINKS.apiDocs)}</b> is generated from the running service and is authoritative wherever the two differ, and <b style="color:${L.strong}">${extlink(LINKS.openapi)}</b> is the machine-readable form of the same thing.`)}</div>`

  return page({ id: 'p27', body: rh('3.6 Limits and governance') + wide(main) + folio('27') })
}

export const PART_THREE = [rule, inputs, rest, mcp, deployment, governance]
