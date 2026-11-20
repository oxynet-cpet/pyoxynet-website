/**
 * Part One: what Oxynet is. Pages 5 to 10.
 *
 * These pages are deliberately sparse and lead with pictures. A reader who has
 * never heard of Oxynet should be able to look at page 5 and know what kind of
 * thing this is before reading a sentence. Detail belongs in Part Two, and if a
 * page here starts growing paragraphs the material is in the wrong place.
 */

import { L, D, GREEN, ACCENT_TEXT, BLUE, WARN, MONO, SANS } from '../tokens.mjs'
import {
  page, runhead, folio, grid, wide, eyebrow, h1, stand,
  railBlock, rp, callout, caption, extlink, SEP,
} from '../lib.mjs'
import { CORPUS, LINKS } from '../config.mjs'
import { api } from '../figures.mjs'
import { xref, link, PARTS } from '../toc.mjs'
import { figTransform, figCollective, figLayer, figLifecycle } from '../figures.mjs'
import { icons } from '../icons.mjs'

const rh = (right) => runhead(`Part One ${SEP} What Oxynet is`, right)

/** The big statement these pages are built from. */
function lead(text, style = '') {
  return `<p style="font-size:23px;line-height:1.4;font-weight:500;color:${L.strong};letter-spacing:-.012em;margin:0 0 22px;max-width:620px;text-wrap:pretty;${style}">${text}</p>`
}

// ------------------------------------------------------------------ p.5
export function mission() {
  const main = `
    ${eyebrow(`Part One ${SEP} 1.1`)}
    ${h1('The mission', 'margin-bottom:16px')}
    ${lead('CPET data is abundant. Physiological interpretation is still fragmented.', 'margin-bottom:14px')}
    <p style="font-size:17px;line-height:1.5;color:${L.body};margin:0 0 18px;max-width:620px">Oxynet is the computational layer that turns cardiopulmonary exercise test signals into structured, reproducible physiological measurements, independent of device, protocol or software.</p>
    <div>${figTransform()}</div>
    ${caption(`Every point is one breath of one real test. On the left, the file as the cart exported it. In the middle, the same breaths placed into intensity domains with both thresholds located, ${api.vt.provenance.latency_ms.toFixed(0)} milliseconds of model time later. On the right, a ventilatory rhythm the file was never asked about.`, 'max-width:620px')}
    <div style="margin-top:18px;padding-top:16px;border-top:1px solid ${L.line};display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px">
      ${[
        ['Machine learning', 'Gradient-boosted trees and convolutional networks over the breath series, combined, with recurrent and transformer variants benchmarked against them.'],
        ['Signal processing', 'Continuous wavelet analysis for the ventilatory rhythms, cross-channel coherence and phase for whether the trace can be believed.'],
        ['Learned representation', `Structure recovered without labels, and self-supervised pretraining in development. Named in full in ${xref('2.1')}.`],
      ].map(([h, b]) => `
      <div>
        <p style="font-family:${MONO};font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:${ACCENT_TEXT};margin:0 0 7px">${h}</p>
        <p style="font-size:12.5px;line-height:1.55;color:${L.body};margin:0">${b}</p>
      </div>`).join('')}
    </div>
    <p style="font-size:14.5px;line-height:1.6;color:${L.subtle};margin:16px 0 0;max-width:620px">The mission is to make that content readable by any system that needs it, consistently, wherever and on whatever it was recorded.</p>`

  return page({ id: 'p5', body: rh('1.1 The mission') + wide(main) + folio('5') })
}

// ------------------------------------------------------------------ p.6
export function today() {
  const STATUS = {
    production: ['Production', ACCENT_TEXT, '#00dc8214'],
    available: ['Available', BLUE, '#1557991a'],
    research: ['Research', WARN, '#92400e14'],
  }
  const row = (capability, status, note) => {
    const [label, colour, bg] = STATUS[status]
    return `
      <tr>
        <td style="padding:9px 0;border-bottom:1px solid ${L.line};font-size:14px;color:${L.strong};font-weight:500">${capability}</td>
        <td style="padding:9px 0;border-bottom:1px solid ${L.line};white-space:nowrap">
          <span style="font-family:${MONO};font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:${colour};background:${bg};border-radius:3px;padding:2.5px 7px">${label}</span>
        </td>
        <td style="padding:9px 0;border-bottom:1px solid ${L.line};font-size:12.5px;line-height:1.45;color:${L.subtle}">${note}</td>
      </tr>`
  }
  const th = (t) =>
    `<th style="text-align:left;padding-bottom:7px;border-bottom:1.5px solid ${L.strong};font-family:${MONO};font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:${L.subtle};font-weight:400">${t}</th>`

  const main = `
    ${eyebrow(`Part One ${SEP} 1.2`)}
    ${h1('What Oxynet does today', 'margin-bottom:18px')}
    ${lead('Everything below answers on the live API now, and the note says what is behind each one.')}
    <table style="width:100%;border-collapse:collapse">
      <tr>${th('Capability')}${th('Status')}${th('Note')}</tr>
      ${row('VT1 and VT2 detection', 'production', 'Trees and networks combined. V̇O₂, V̇CO₂ and V̇E suffice')}
      ${row('Intensity domains', 'production', 'Bounded by the thresholds, drawn breath by breath in the browser')}
      ${row('Signal integrity checks', 'production', 'Cross-channel coherence and phase, sampling and clock analysis')}
      ${row('Derived CPET quantities', 'production', 'Peaks, O₂ pulse, ventilatory equivalent slope profile')}
      ${row('Substrate use and FATMAX', 'production', 'Indirect calorimetry from gas exchange, load channel optional')}
      ${row('Vendor format parsing', 'production', `${CORPUS.formats} formats, detected automatically`)}
      ${row('REST API', 'production', 'Key per caller, products gated per key')}
      ${row('MCP endpoint', 'available', 'Native connector for any MCP client')}
      ${row('OpenAPI 3.0 schema', 'available', 'Client generation, agent actions, integration platforms')}
      ${row('Browser application', 'available', `${extlink(LINKS.app)}, for producing results without building`)}
      ${row('Python package', 'available', 'Open source, local inference')}
      ${row('Oscillation analysis', 'research', 'Continuous wavelet detector. One cohort, transportability untested')}
      ${row('Self-supervised pretraining', 'research', 'Pretraining on unlabelled recordings. In no promoted model')}
      ${row('Local and embedded deployment', 'available', `Discussed in ${xref('3.5')}`)}
    </table>`

  return page({ id: 'p6', body: rh('1.2 What Oxynet does today') + wide(main) + folio('6') })
}

// ------------------------------------------------------------------ p.7
export function layer() {
  const main = `
    ${eyebrow(`Part One ${SEP} 1.3`)}
    ${h1('Where it sits, and what it is not', 'margin-bottom:14px')}
    <p style="font-size:17px;line-height:1.5;color:${L.strong};font-weight:500;margin:0 0 18px;max-width:620px">Oxynet is a computational layer between the machine that recorded the test and whatever is going to use the result. It replaces neither end.</p>
    ${figLayer()}
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:26px;margin-top:22px;padding-top:18px;border-top:1px solid ${L.line}">
      <div>
        <p style="font-family:${MONO};font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:${L.faint};margin:0 0 8px">Oxynet is not</p>
        <p style="font-size:13px;line-height:1.6;color:${L.body};margin:0">An acquisition system. A metabolic cart. A replacement for the software you already ship. A patient-management system. A general-purpose assistant. A competitor for the customer relationship.</p>
      </div>
      <div>
        <p style="font-family:${MONO};font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:${ACCENT_TEXT};margin:0 0 8px">Oxynet is</p>
        <p style="font-size:13px;line-height:1.6;color:${L.body};margin:0">A device-independent platform for CPET interpretation, reachable over an API, deployable in your cloud or inside your product, that leaves the interface, the report and the clinical judgment where they already are.</p>
      </div>
    </div>`

  return page({ id: 'p7', body: rh('1.3 Where it sits') + wide(main) + folio('7') })
}

// ------------------------------------------------------------------ p.8
export function aiEra() {
  const who = (label, title, body, tone, icon) => `
    <div style="border:1px solid ${tone ? '#00dc8233' : L.line};background:${tone ? '#00dc820a' : L.bg};border-radius:10px;padding:14px 15px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:9px;color:${tone ? ACCENT_TEXT : L.subtle}">
        ${icon({ size: 18 })}
        <span style="font-family:${MONO};font-size:9px;letter-spacing:.16em;text-transform:uppercase">${label}</span>
      </div>
      <p style="font-size:14.5px;font-weight:600;color:${L.strong};margin:0 0 4px">${title}</p>
      <p style="font-size:12px;line-height:1.5;color:${L.body};margin:0">${body}</p>
    </div>`

  const where = (title, body, icon) => `
    <div style="display:grid;grid-template-columns:112px 1fr;gap:16px;padding:9px 0;border-top:1px solid ${L.line}">
      <span style="display:flex;align-items:center;gap:8px;color:${ACCENT_TEXT}">${icon({ size: 16 })}
        <span style="font-family:${MONO};font-size:9.5px;letter-spacing:.14em;text-transform:uppercase">${title}</span></span>
      <span style="font-size:12.5px;line-height:1.5;color:${L.body}">${body}</span>
    </div>`

  const main = `
    ${eyebrow(`Part One ${SEP} 1.4`)}
    ${h1('Built for the AI era', 'margin-bottom:14px')}
    <p style="font-size:17px;line-height:1.5;color:${L.strong};font-weight:500;margin:0 0 18px;max-width:620px">Agents and human operators, in the cloud, on a local network and on the device alike. One engine, reached whichever way the caller works.</p>
    ${figCollective()}
    ${caption('The recording is encoded as tensors, not read as columns. What comes back carries the judgment of every expert who ever labelled a test in the corpus. The result is reproducible: the same recording, on the same model version, returns the same answer next year and in another country.', 'max-width:620px')}
    <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:20px">
      ${who('Humans', 'The browser', 'A clinician or a researcher opens a test and reads it. No integration, no build.', false, icons.human)}
      ${who('Software', 'REST and OpenAPI', 'Your product calls the engine and renders the result in your own interface.', false, icons.software)}
      ${who('Agents', 'MCP', 'An assistant calls the physiological models directly, and the signals never enter the conversation.', true, icons.agent)}
    </div>
    <div style="margin-top:18px">
      ${where('Cloud', 'The hosted API. Nothing to deploy, models always current.', icons.cloud)}
      ${where('Local', 'Inside the institution, where recordings must not leave the network.', icons.local)}
      ${where('Device', 'Small convolutional models that export to on-device runtimes, for interpretation during the test rather than after it.', icons.device)}
    </div>`

  return page({ id: 'p8', body: rh('1.4 Built for the AI era') + wide(main) + folio('8') })
}

// ------------------------------------------------------------------ p.9
export function lifecycle() {
  const main = `
    ${eyebrow(`Part One ${SEP} 1.5`)}
    ${h1('Research, development, deployment', 'margin-bottom:14px')}
    ${lead('Oxynet is not a set of algorithms written once. It is a platform whose cycle runs continuously, and the cycle is the asset.')}
    ${figLifecycle()}
    <div style="margin-top:20px;padding-top:18px;border-top:1px solid ${L.line}">
      <p style="font-size:16px;line-height:1.55;color:${L.strong};font-weight:500;margin:0 0 12px;max-width:620px">All three stages are Oxynet. The research is not a credential attached to a product; it is where the physiology comes from, and it is maintained rather than cited.</p>
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px">
        ${[
          ['Research', 'Cohorts arrive from laboratories that do this work for its own sake. Experts label them. Models are trained and evaluated, and what is learned is written up and put through peer review, which is the part of the process we do not control.'],
          ['Development', 'A model that clears the gate on a cohort it never saw is promoted, versioned and pinned, with the evaluation that let it through stored beside the weights.'],
          ['Deployment', 'It answers on an endpoint, in a package, or inside a partner’s product. What it then cannot yet do is the next research question, and the cycle closes.'],
        ].map(([h, b]) => `
        <div>
          <p style="font-family:${MONO};font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:${ACCENT_TEXT};margin:0 0 7px">${h}</p>
          <p style="font-size:12.5px;line-height:1.55;color:${L.body};margin:0">${b}</p>
        </div>`).join('')}
      </div>
      <p style="font-size:14px;line-height:1.6;margin:16px 0 0;max-width:620px">A research programme normally ends at the first stage, because a published result is what it is funded to produce. Oxynet carries the same standard of evidence through to something a laboratory can call and a manufacturer can ship, and returns what that use reveals to the beginning of the cycle.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin-top:18px;padding-top:16px;border-top:1px solid ${L.line}">
      ${[
        [`${CORPUS.papers} peer-reviewed papers`, 'on the methods and their evaluation, the first in 2019 and the most recent in 2026.'],
        ['Four continents', 'Cohorts contributed by laboratories in Europe, North and South America and Oceania.'],
        ['In production today', 'Every capability marked Production on page 6 is answering on a live endpoint.'],
      ].map(([h, b]) => `
      <div>
        <p style="font-size:15.5px;font-weight:600;color:${L.strong};margin:0 0 3px">${h}</p>
        <p style="font-size:12.5px;line-height:1.5;color:${L.body};margin:0">${b}</p>
      </div>`).join('')}
    </div>`

  return page({ id: 'p9', body: rh('1.5 Research, development, deployment') + wide(main) + folio('9') })
}

// ------------------------------------------------------------------ p.10
export function whyBuildOnIt() {
  const who = (label, headline, body) => `
    <div style="padding:14px 0;border-top:1px solid ${L.line}">
      <p style="font-family:${MONO};font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:${ACCENT_TEXT};margin:0 0 6px">${label}</p>
      <p style="font-size:16px;font-weight:600;color:${L.strong};margin:0 0 4px">${headline}</p>
      <p style="font-size:13.5px;line-height:1.55;color:${L.body};margin:0">${body}</p>
    </div>`

  const main = `
    ${eyebrow(`Part One ${SEP} 1.6`)}
    ${h1('Why build on Oxynet', 'margin-bottom:16px')}
    ${lead('The layer sits underneath what is already there. Nothing upstream has to change for it to be useful.')}
    ${who('For device manufacturers', 'Computational interpretation, without building a physiology stack',
      'Add advanced interpretation to the product you already ship, with no change to acquisition hardware and no physiology team to hire. The numbers stay comparable across an installed base that spans a dozen markets.')}
    ${who('For clinical software', 'Raw exports become structured, reproducible outputs',
      'Turn whatever the cart wrote into the same shape every time, in your own interface and your own report. One integration covers twenty-one vendor formats.')}
    ${who('For laboratories and researchers', 'Heterogeneous data, processed consistently',
      'Pool cohorts across devices, protocols and years without pooling the readers with them. A method section a reviewer can reproduce, and a result that does not shift when the staff do.')}
    ${who('For AI systems', 'Physiological computation an agent can call',
      'An assistant reaches the validated models directly instead of estimating a threshold from numbers in its context. The agent orchestrates and explains. It does not do the physiology.')}
    <div style="margin-top:20px">${callout(`The four capabilities behind all of this are shown on one real recording over the next ten pages, each with the payload the API returned and the caveat that travels with it. They begin on page ${PARTS[1].divider + 1}.`)}</div>`

  return page({ id: 'p10', body: rh('1.6 Why build on Oxynet') + wide(main) + folio('10') })
}

export const PART_ONE = [mission, today, layer, aiEra, lifecycle, whyBuildOnIt]
