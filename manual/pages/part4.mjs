/** Part Four: status, evidence and next steps. Pages 29 to 31. */

import { L, D, GREEN, ACCENT_TEXT, BLUE, WARN, MONO, SANS } from '../tokens.mjs'
import {
  page, runhead, folio, grid, wide, eyebrow, h1, stand,
  railBlock, rp, callout, caption, table, extlink, shortUrl, SEP,
} from '../lib.mjs'
import { CONTACT, LINKS, CORPUS, VERSION, DATE } from '../config.mjs'
import { xref } from '../toc.mjs'
import { mark } from '../brand.mjs'
import { groupedPublications } from '../publications.mjs'

const rh = (right) => runhead(`Part Four ${SEP} Status, evidence and next steps`, right)

// ------------------------------------------------------------------ p.29
export function whatItIsNot() {
  const NOT = [
    ['a medical device', 'Research software. No CE mark, no FDA clearance, not registered as software as a medical device in any jurisdiction, and not to be the basis of a diagnosis or a treatment decision.'],
    ['a diagnosis', 'The engine returns physiological measurements. Interpreting them for a patient is the clinician’s act, and the clinician remains the responsible party.'],
    ['calibrated against outcomes', 'No output carries a confidence score, because there is nothing to calibrate one against; an answer is marked low or normal by stated rules instead. Agreement with expert labelling is what has been measured, and it is not the same claim.'],
  ]
    .map(
      ([h, b]) => `
    <div style="display:grid;grid-template-columns:16px 1fr;gap:13px;padding:11px 0;border-top:1px solid ${L.line}">
      <span style="color:${L.faint};font-size:15px;line-height:1.5">✕</span>
      <span><span style="font-size:15px;font-weight:600;color:${L.strong}">Not ${h}.</span>
      <span style="display:block;font-size:13.5px;line-height:1.55;color:${L.body};margin-top:3px">${b}</span></span>
    </div>`
    )
    .join('')

  const chip = (label, colour, bg) =>
    `<span style="font-family:${MONO};font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:${colour};background:${bg};border-radius:3px;padding:2.5px 7px;margin-right:7px">${label}</span>`

  const main = `
    ${eyebrow(`Part Four ${SEP} 4.1`)}
    ${h1('What Oxynet is not', 'margin-bottom:12px')}
    ${stand('Stated plainly, because a capability list read by someone deciding what to build on is only useful next to its limits.', 'margin-bottom:10px')}
    ${NOT}

    <div style="margin-top:22px;padding-top:18px;border-top:1.5px solid ${L.strong}">
      <h3 style="margin-bottom:8px">Capabilities have different evidence maturity</h3>
      <p style="font-size:13.5px;line-height:1.6;margin-bottom:12px">Not everything here stands on the same ground, and a partner needs to know which is which before they build. The three states are used consistently throughout this document.</p>
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px">
        <div>
          ${chip('Production', ACCENT_TEXT, '#00dc8214')}
          <p style="font-size:12.5px;line-height:1.55;color:${L.body};margin:8px 0 0">Answering on the live API, with the evaluation that let each model ship stored beside it. Threshold detection carries the longest record.</p>
        </div>
        <div>
          ${chip('Available', BLUE, '#1557991a')}
          <p style="font-size:12.5px;line-height:1.55;color:${L.body};margin:8px 0 0">Shipped and usable. These are the interfaces and the deployment options; the science behind them sits in the first column.</p>
        </div>
        <div>
          ${chip('Research', WARN, '#92400e14')}
          <p style="font-size:12.5px;line-height:1.55;color:${L.body};margin:8px 0 0">Running, and not yet shown to transport. Oscillation analysis sits here on one cohort, and says so wherever it appears.</p>
        </div>
      </div>
    </div>

    <div style="margin-top:20px;padding-top:16px;border-top:1px solid ${L.line}">
      <h3 style="margin-bottom:8px">Current status</h3>
      <p style="font-size:13.5px;line-height:1.6;margin:0">Oxynet is operated by ${CONTACT.name} as an independent technology platform. The computational engine, the models, the software interfaces and the research record are established and in use. Commercial incorporation and partnership structures are under development, and this document is not an offer of securities or a solicitation to invest.</p>
    </div>`

  return page({ id: 'p29', body: rh('4.1 What Oxynet is not') + wide(main) + folio('29') })
}

// ------------------------------------------------------------------ p.30
export function evidence() {
  const status = (label, colour, bg, items) => `
    <div style="border:1px solid ${L.line};border-radius:11px;padding:15px 16px">
      <span style="font-family:${MONO};font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:${colour};background:${bg};border-radius:3px;padding:2.5px 7px">${label}</span>
      <div style="margin-top:11px">
        ${items.map((i) => `<p style="font-size:12.5px;line-height:1.5;color:${L.body};margin:0 0 6px">${i}</p>`).join('')}
      </div>
    </div>`

  const main = `
    ${eyebrow(`Part Four ${SEP} 4.2`)}
    ${h1('The evidence record', 'margin-bottom:12px')}
    ${stand('What has been shown, how a model is held to it, and what has not been shown.', 'margin-bottom:18px')}
    <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px">
      ${status('Validated', ACCENT_TEXT, '#00dc8214', [
        'Threshold detection against expert labelling, across cohorts differing in population, protocol, ergometer and metabolimeter.',
        `${CORPUS.papers} peer-reviewed papers on the methodology and its evaluation.`,
        'Parts of the corpus carry several independent raters per test, so agreement with the engine can be read against agreement between two humans.',
      ])}
      ${status('Operational', BLUE, '#1557991a', [
        'Everything marked Production on page 6 is answering on the live API now.',
        'Every promoted model ships with the evaluation that let it through the gate, so a result can be re-checked without re-running inference.',
        'Deterministic inference: the same recording returns the same numbers on the same model version.',
      ])}
      ${status('Research', WARN, '#92400e14', [
        'Oscillation analysis, developed on one heart-failure cohort of 44 patients. Transportability to a second population is unknown.',
        'Self-supervised pretraining, in development and in no promoted model.',
        'Nothing is calibrated against a clinical outcome. No result predicts mortality, hospitalisation or response to treatment.',
      ])}
    </div>
    <div style="display:grid;grid-template-columns:1fr 300px;gap:30px;margin-top:22px;padding-top:18px;border-top:1px solid ${L.line};align-items:start">
      <div>
        <h3>The landmarks corroborate, they do not adjudicate</h3>
        <p style="font-size:13.5px;line-height:1.6;margin:0 0 9px">The engine can also compute the classical criteria: the V-slope and respiratory compensation break points, the ventilatory equivalent nadir, the end-tidal carbon dioxide peak. They are textbook rules evaluated on the file's own signal. They carry no confidence and they never override a model.</p>
        <p style="font-size:13.5px;line-height:1.6;margin:0">On the reference recording the automated V-slope fit returned slopes of 1.30 and 1.42 either side of its break point. Slopes that barely differ mean no break point was found, and the response reports the fit so a reader can see it instead of being handed a number to trust.</p>
      </div>
      <div>${railBlock('accent', 'Promotion gate',
        rp('Evaluated on a cohort it never saw, on both axes, and all four must clear:') +
        `<p style="font-family:${MONO};font-size:11.5px;line-height:1.72;color:${L.strong};margin:0">V̇O₂ bias ≤ 120 mL/min<br>V̇O₂ correlation ≥ 0.80<br>time bias ≤ 60 s<br>time correlation ≥ 0.80</p>`)}</div>
    </div>
    <div style="margin-top:14px">${callout(`The publication list is maintained at <b style="color:${L.strong}">${extlink(LINKS.site)}</b>, and the open-source Python package at <b style="color:${L.strong}">${extlink(LINKS.pypi)}</b> covers local inference and synthetic data generation.`)}</div>`

  return page({ id: 'p30', body: rh('4.2 The evidence record') + wide(main) + folio('30') })
}

// ------------------------------------------------------------------ p.31
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']

export function references() {
  const { peer, preprint, other } = groupedPublications()

  const entry = (p, i) => `
    <div style="display:grid;grid-template-columns:22px 1fr;gap:14px;padding:9px 0;border-top:1px solid ${L.line}">
      <span style="font-family:${MONO};font-size:10px;color:${L.faint};padding-top:3px">${String(i + 1).padStart(2, '0')}</span>
      <span>
        <span style="display:block;font-size:13.5px;font-weight:600;color:${L.strong};line-height:1.4">${p.title}</span>
        <span style="display:block;font-family:${MONO};font-size:10.5px;color:${L.subtle};margin-top:3px">${p.journal ?? ''}${p.year ? ` ${SEP} ${p.year}` : ''}</span>
        <span style="display:block;font-family:${MONO};font-size:9.5px;color:${L.faint};margin-top:2px;overflow-wrap:anywhere">${extlink(p.url, shortUrl(p.url, 44))}</span>
      </span>
    </div>`

  const small = (p) => `
    <div style="padding:7px 0;border-top:1px solid ${L.line}">
      <span style="font-size:12.5px;color:${L.body}">${p.title}</span>
      <span style="display:block;font-family:${MONO};font-size:9.5px;color:${L.faint};margin-top:2px;overflow-wrap:anywhere">${extlink(p.url, shortUrl(p.url, 44))}</span>
    </div>`

  const main = `
    ${eyebrow(`Part Four ${SEP} 4.3`)}
    ${h1('References', 'margin-bottom:12px')}
    ${stand(`${WORDS[peer.length] ? WORDS[peer.length][0].toUpperCase() + WORDS[peer.length].slice(1) : peer.length} peer-reviewed journal articles behind the methods described here, one preprint, and the writing that explains them.`, 'margin-bottom:16px')}
    <div style="display:grid;grid-template-columns:1fr 240px;gap:30px;align-items:start">
      <div>
        <p style="font-family:${MONO};font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:${ACCENT_TEXT};margin:0 0 4px">Peer reviewed</p>
        ${peer.map(entry).join('')}
      </div>
      <div>
        <p style="font-family:${MONO};font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:${L.subtle};margin:0 0 4px">Preprint</p>
        ${preprint.map(small).join('')}
        <p style="font-family:${MONO};font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:${L.subtle};margin:16px 0 4px">Also written</p>
        ${other.map(small).join('')}
      </div>
    </div>
    <div style="margin-top:16px">${callout(`The list is maintained at <b style="color:${L.strong}">${extlink(LINKS.site)}</b> and this page is generated from it, so the two cannot disagree. Blog and Medium pieces are listed because they explain the work, not as evidence for it.`)}</div>`

  return page({ id: 'p31', body: rh('4.3 References') + wide(main) + folio('31') })
}

// ------------------------------------------------------------------ p.32
export function offer() {
  const route = (i, title, body) => `
    <div style="display:grid;grid-template-columns:26px 1fr;gap:14px;padding:11px 0;border-top:1px solid ${L.line}">
      <span style="font-family:${MONO};font-size:10.5px;color:${ACCENT_TEXT};padding-top:3px">0${i}</span>
      <span><span style="font-size:15.5px;font-weight:600;color:${L.strong}">${title}</span>
      <span style="display:block;font-size:13px;line-height:1.55;color:${L.body};margin-top:2px">${body}</span></span>
    </div>`

  const step = (n, title, body, last) => `
    <div style="display:grid;grid-template-columns:22px 1fr;gap:11px;padding:7px 0">
      <span style="font-family:${MONO};font-size:9.5px;color:${last ? ACCENT_TEXT : L.faint};padding-top:3px">${n}</span>
      <span><span style="font-size:12.5px;font-weight:600;color:${L.strong}">${title}</span>
      <span style="display:block;font-size:11px;line-height:1.45;color:${L.subtle};margin-top:1px">${body}</span></span>
    </div>`

  const main = `
    ${eyebrow(`Part Four ${SEP} 4.4`)}
    ${h1('Routes to market, and the next step', 'margin-bottom:12px')}
    ${stand('Four ways to build on the platform. They are the same engine reached at different depths, not four different products.', 'max-width:600px;margin-bottom:12px')}
    <div style="display:grid;grid-template-columns:1fr 268px;gap:30px;align-items:start">
      <div>
        ${route(1, 'Integrate', 'Call Oxynet from software you already ship. Your interface, your reporting, your customer relationship, our physiology, kept current.')}
        ${route(2, 'Embed', 'Make it part of the product itself, on your infrastructure or on the device, for interpretation during the test rather than after it.')}
        ${route(3, 'Validate', 'Run cohorts through the engine to establish new capabilities and the evidence behind them. Oscillation analysis needs a second population before it can leave research, and that would be a collaboration.')}
        ${route(4, 'Partner', 'A broader commercial relationship around distribution, licensing or joint product development.')}
        <p style="font-size:12.5px;line-height:1.55;color:${L.subtle};margin:12px 0 0">Commercial and licensing structure follows from the route, the deployment and the scope of rights, so it is deliberately not fixed here. Investment conversations are welcome and are a separate one.</p>
      </div>
      <div style="border:2px solid ${GREEN};border-radius:12px;padding:16px 17px;background:#00dc8207">
        <p style="font-family:${MONO};font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:${ACCENT_TEXT};margin:0 0 4px">Start here</p>
        <p style="font-size:15px;font-weight:600;color:${L.strong};margin:0 0 10px;line-height:1.35">Send one representative file.</p>
        ${step('01', 'One dataset', 'You send a representative export. We run it and return the structured result.')}
        ${step('02', 'Feasibility note', 'What worked, what the format needed, what the engine refused and why.')}
        ${step('03', 'Integration prototype', 'Against the hosted API, in a sandbox, on your side.')}
        ${step('04', 'Workflow and validation', 'Your cohort, your acceptance criteria, your regulatory position.')}
        ${step('05', 'Deployment', 'Hosted, local or embedded, per 3.5.', true)}
        <p style="font-size:11.5px;line-height:1.5;color:${L.body};margin:10px 0 0;padding-top:9px;border-top:1px solid #00dc8233"><b style="color:${L.strong}">Phase one needs one file and no commitment.</b></p>
      </div>
    </div>
    <div style="margin-top:18px;background:${D.bg};border-radius:14px;padding:24px 30px;display:grid;grid-template-columns:1fr auto;gap:30px;align-items:center">
      <div>
        <p style="font-family:${MONO};font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:${GREEN};margin:0 0 9px">Commercial enquiries</p>
        <p style="font-size:21px;font-weight:600;color:${D.strong};margin:0 0 4px;letter-spacing:-.01em">${CONTACT.credited}</p>
        <p style="font-family:${MONO};font-size:13.5px;color:${GREEN};margin:0 0 9px">${CONTACT.email}</p>
        <p style="font-size:12px;line-height:1.55;color:${D.subtle};margin:0;max-width:400px">Responsible for the commercial use of these tools. Licensing, pilots, integration and partnership all come to this address.</p>
      </div>
      <div style="opacity:.9">${mark({ width: 66, paint: GREEN, id: 'ofr' })}</div>
    </div>
    ${caption(`Acknowledgments: the Exercise Thresholds application, and the laboratories whose cohorts made this work possible. Oxynet Manual v${VERSION}, ${DATE}. The API reference at ${extlink(LINKS.apiDocs)} is generated from the running service and is authoritative wherever it differs from this document.`, 'margin-top:10px;max-width:620px')}`

  return page({ id: 'p32', body: rh('4.4 Routes to market') + wide(main) + folio('32') })
}

export const PART_FOUR = [whatItIsNot, evidence, references, offer]
