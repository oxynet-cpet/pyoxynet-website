/**
 * The data transfer agreement, one function per A4 page.
 *
 * Every choice is offered as alternatives so a partner sees the options side
 * by side, and every term that is the same in every agreement is marked
 * "Fixed term" so what is negotiable and what is not is visible at a glance.
 *
 * Factual statements about the service (how a file is handled, what is stored,
 * what persists, the regulatory status) are restated from oxynet-core and the
 * manual. Anything the repository cannot establish (the Recipient entity for a
 * given agreement, the training workstation's location) is a blank or an
 * option, never a guess.
 */

import { PAGE, D, L, GREEN, ACCENT_TEXT, WARN, MONO } from '../manual/tokens.mjs'
import { page, runhead, wide, SEP, extlink } from '../manual/lib.mjs'
import { mark, field, gradientText } from '../manual/brand.mjs'
import { VERSION, DATE, TITLE, RECIPIENT_CONTACT, HOSTING, SERVICE } from './config.mjs'
import { box, blank, line, opt, item, clause, section } from './ui.mjs'
import { TIERS, TIER_NAMES, TIER_SUMMARY, DEFAULTS } from './tiers.mjs'

export const PAGES_TOTAL = 16

/** A page's number is its position in PAGES, so inserting a page renumbers everything after it. */
const num = (fn) => PAGES.indexOf(fn) + 1

const rh = (right) => runhead(`${TITLE} ${SEP} Template v${VERSION}`, right)

/** The folio carries both parties' initials on every page, the usual way to show no page was swapped. */
function folio(n) {
  return `<div class="rf" style="color:${L.faint};align-items:flex-end">
    <span>Oxynet ${TITLE} template v${VERSION}</span>
    <span style="display:flex;gap:14px;align-items:flex-end;letter-spacing:.06em">
      <span>Initials: Provider ${blank(`init_p_${n}`, { w: 46 })}</span>
      <span>Recipient ${blank(`init_r_${n}`, { w: 46 })}</span>
      <span style="margin-left:6px">${n} / ${PAGES_TOTAL}</span>
    </span>
  </div>`
}

const g = (id) => ({ group: id })

// ------------------------------------------------------------------ 1 cover
export function cover() {
  const body = `
  <div style="position:absolute;inset:0">${field({ seed: 11 })}</div>
  <div style="position:absolute;inset:0;background:radial-gradient(58% 54% at 50% 44%, rgba(10,10,10,.92) 0%, rgba(10,10,10,.66) 46%, rgba(10,10,10,0) 78%)"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(to bottom, rgba(10,10,10,.85) 0%, rgba(10,10,10,0) 18%, rgba(10,10,10,0) 62%, rgba(10,10,10,.94) 100%)"></div>

  <div style="position:absolute;left:${PAGE.ML}px;right:${PAGE.MR}px;top:170px;display:flex;flex-direction:column;align-items:center;text-align:center">
    <div style="margin:0 0 6px">${mark({ width: 110, id: 'dta' })}</div>
    <div style="margin:0 0 30px">${gradientText('Oxynet', { size: 64, id: 'dtawm' })}</div>
    <p style="font-family:${MONO};font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:${GREEN};margin:0 0 16px">Template</p>
    <p style="font-size:38px;font-weight:600;color:${D.strong};margin:0 0 16px;letter-spacing:-.02em;line-height:1.1">${TITLE}</p>
    <p style="font-size:15.5px;line-height:1.6;color:${D.body};max-width:460px;margin:0">For sharing cardiopulmonary exercise test recordings with Oxynet. Every choice is shown with its alternatives, so both parties can see what they are agreeing to and what they are not.</p>
    <div style="width:56px;height:2px;background:${GREEN};margin:38px 0 26px"></div>
    <div style="text-align:left;width:430px;background:${L.bg};border-radius:12px;padding:18px 22px 8px">
      ${[['cover_provider', 'Data provider'], ['cover_ref', 'Agreement ref.'], ['cover_date', 'Draft date']].map(([f, k]) => `
      <div style="display:flex;align-items:flex-end;gap:12px;margin-bottom:12px">
        <span style="font-family:${MONO};font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:${L.subtle};width:118px">${k}</span>
        <span data-f="${f}" data-k="text" style="flex:1;height:18px;border-bottom:1px solid ${L.faint}"></span>
      </div>`).join('')}
    </div>
  </div>

  <div style="position:absolute;left:${PAGE.ML}px;right:${PAGE.MR}px;bottom:${PAGE.MB}px;display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid ${D.line};padding-top:18px;font-family:${MONO};font-size:7.5px;line-height:1.85;letter-spacing:.06em;color:${D.faint}">
    <div><div style="color:${D.subtle};letter-spacing:.18em">TEMPLATE VERSION</div><div>${VERSION} ${SEP} ${DATE}</div></div>
    <div style="text-align:right"><div style="color:${D.subtle};letter-spacing:.18em">CONTACT</div><div style="color:${D.body}">${RECIPIENT_CONTACT.name}</div><div>${RECIPIENT_CONTACT.email}</div></div>
  </div>`
  return page({ id: 'd1', light: false, full: true, body })
}

// ------------------------------------------------------------------ 2 how to use
export function howTo() {
  const legend = (glyph, title, text) => `
    <div style="display:grid;grid-template-columns:22px 1fr;gap:10px;padding:8px 0;border-top:1px solid ${L.line}">
      <span>${glyph}</span>
      <span><b style="color:${L.strong};font-size:13px">${title}</b><span style="display:block;font-size:12.5px;line-height:1.5;color:${L.body}">${text}</span></span>
    </div>`
  const main = `
    <p class="eyebrow" style="color:${ACCENT_TEXT}">Before you start</p>
    <h1 style="margin-bottom:12px">How this template works</h1>
    <p class="stand" style="margin-bottom:16px">One document, filled in together. Where there is a choice, all the alternatives are printed, so nothing is decided by what was left out.</p>
    ${legend(box('', { radio: true, live: false }), 'Choose one', 'Mutually exclusive alternatives. Tick exactly one.')}
    ${legend(box('', { live: false }), 'Tick all that apply', 'Independent options. Tick as many as are true.')}
    ${legend(`<span style="display:inline-block;width:14px;border-bottom:1px solid ${L.faint};height:12px"></span>`, 'Fill in', 'Write the answer on the line or in the box.')}
    ${legend(`<span style="font-family:${MONO};font-size:6.5px;color:${L.faint}">FIX</span>`, 'Fixed term', 'The same in every agreement Oxynet signs. Shown so you know it is there, not to be ticked.')}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:26px;margin-top:20px">
      <div>
        <h3>Filling it in</h3>
        <p style="font-size:12.5px;line-height:1.55">The PDF is fillable: open it in any PDF reader, tick and type, save, and send it back. It also prints cleanly for pen and paper. Each item has a number (2.1, 4.3), so a reply can say &ldquo;agreed except 5.1&rdquo; without redrafting anything.</p>
        <p style="font-size:12.5px;line-height:1.55;margin:0">Annex A lists every item with a column for each party, so the state of the negotiation is visible on one page.</p>
      </div>
      <div>
        <h3>If you have your own template</h3>
        <p style="font-size:12.5px;line-height:1.55">Many institutions require their own data transfer or data processing agreement. That is fine: we will work from yours. This document can still serve as the checklist of what needs deciding.</p>
        <p style="font-size:12.5px;line-height:1.55">A model built specifically for the Provider, or a joint development project, needs a separate model development agreement. This one covers sharing the Data.</p>
        <p style="font-size:12.5px;line-height:1.55;margin:0">Each party should have the completed agreement reviewed by its own legal counsel or data protection officer before signature.</p>
      </div>
    </div>
    <div style="margin-top:18px;background:${L.surface};border-radius:10px;padding:14px 17px">
      <p style="font-family:${MONO};font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:${L.subtle};margin:0 0 8px">Definitions used throughout</p>
      <p style="font-size:12px;line-height:1.55;margin:0 0 5px"><b style="color:${L.strong}">Provider</b>: the organisation sharing the Data. <b style="color:${L.strong}">Recipient</b>: the party receiving the Data on behalf of Oxynet, identified in 1.4.</p>
      <p style="font-size:12px;line-height:1.55;margin:0 0 5px"><b style="color:${L.strong}">Data</b>: the cardiopulmonary exercise test recordings and associated variables described in Section 3.</p>
      <p style="font-size:12px;line-height:1.55;margin:0"><b style="color:${L.strong}">Oxynet</b>: the computational platform for CPET analysis, including its software, models and hosted service at app.oxynet.net.</p>
    </div>`
  return page({ id: 'd2', body: rh('How to use') + wide(main) + folio(num(howTo)) })
}

// ------------------------------------------------------------------ 3 scope
function squares(t) {
  return `<span style="display:inline-flex;gap:3px;vertical-align:middle">${[1, 2, 3]
    .map((n) => `<span style="width:9px;height:9px;border-radius:1.5px;${n >= t ? `background:${ACCENT_TEXT}` : `border:1px solid ${L.faint};box-sizing:border-box`}"></span>`)
    .join('')}</span>`
}

export function scope() {
  const tier = (n) => opt('0.1', `t${n}`, `<b style="color:${L.strong}">Tier ${n} ${SEP} ${TIER_NAMES[n]}</b>`, { group: '0.1', note: TIER_SUMMARY[n] })
  const main = `
    <p class="eyebrow" style="color:${ACCENT_TEXT}">Before you start</p>
    <h1 style="margin-bottom:10px">Choose the scope</h1>
    <p class="stand" style="margin-bottom:12px">One agreement, three depths. Fill in only what the project needs: items above the chosen tier are skipped, and the defaults below apply to them.</p>
    ${item('0.1', 'Scope of this agreement', 'one', `${tier(1)}${tier(2)}${tier(3)}`)}
    <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:14px 0 6px">
      ${[[1, 'Every tier'], [2, 'Tier 2 and 3'], [3, 'Tier 3 only']].map(([t, l]) => `
        <div style="background:${L.surface};border-radius:8px;padding:9px 12px;display:flex;gap:10px;align-items:center">${squares(t)}<span style="font-size:12px;color:${L.body}">${l}</span></div>`).join('')}
    </div>
    <p style="font-size:12px;line-height:1.5;color:${L.subtle};margin:0 0 14px">The squares under each item number say which tiers it belongs to. A project can move up a tier later: complete the items the new tier adds, mark them in Annex A, and sign the amendment.</p>
    <h3 style="margin-bottom:4px">Defaults for skipped items</h3>
    <div>
      ${DEFAULTS.map(([k, v]) => `
      <div style="display:grid;grid-template-columns:90px 1fr;gap:12px;padding:5px 0;border-top:1px solid ${L.line}">
        <span style="font-family:${MONO};font-size:8.5px;color:${ACCENT_TEXT}">${k}</span>
        <span style="font-size:12px;line-height:1.45;color:${L.body}">${v}</span>
      </div>`).join('')}
    </div>
    <p style="font-size:9.5px;line-height:1.5;color:${L.subtle};margin:10px 0 0">Fixed terms apply at every tier where they are marked, filled in or not. A skipped item that is not listed here is simply not recorded.</p>`
  return page({ id: 'd2b', body: rh('Scope') + wide(main) + folio(num(scope)) })
}

// ------------------------------------------------------------------ 3 parties
export function parties() {
  const main = `
    ${section(1, 'The parties')}
    ${item('1.1', 'Provider', 'fill', `
      ${line('p_org', 'Organisation (legal name)')}
      ${line('p_dept', 'Department / unit')}
      ${line('p_addr', 'Registered address')}
      <div style="display:grid;grid-template-columns:1fr 1fr;column-gap:18px">${line('p_vat', 'VAT / registration no.')}${line('p_country', 'Country')}</div>`)}
    ${item('1.2', 'Type of organisation', 'one', `
      ${opt('1.2', 'hospital', 'Public hospital or health authority', g('1.2'))}
      ${opt('1.2', 'university', 'University or research institute', g('1.2'))}
      ${opt('1.2', 'clinic', 'Private clinic or laboratory', g('1.2'))}
      ${opt('1.2', 'company', 'Company (device, software, services)', g('1.2'))}
      ${opt('1.2', 'sport', 'Sport or performance organisation', g('1.2'))}
      ${opt('1.2', 'other', 'Other:', { ...g('1.2'), other: true, otherW: 120 })}`, { cols: 2 })}
    ${item('1.3', 'Nature of the Provider', 'one', `
      ${opt('1.3', 'nonprofit', 'Non-profit', g('1.3'))}
      ${opt('1.3', 'forprofit', 'For-profit', g('1.3'))}
      ${opt('1.3', 'public', 'Public body', g('1.3'))}`, { cols: 3 })}
    ${item('1.4', 'Recipient (on behalf of Oxynet)', 'one', `
      ${opt('1.4', 'individual', `${RECIPIENT_CONTACT.name}, ${RECIPIENT_CONTACT.form} (VAT ${RECIPIENT_CONTACT.vat}, ${RECIPIENT_CONTACT.city}), as operator of Oxynet until an Oxynet legal entity is established (see 8.3)`, g('1.4'))}
      ${opt('1.4', 'university', 'University of Trento, department:', { ...g('1.4'), other: true, otherW: 200, note: 'For research collaborations run through the university.' })}
      ${opt('1.4', 'entity', 'Other legal entity:', { ...g('1.4'), other: true, otherW: 260 })}`)}
    ${item('1.5', 'Contact points', 'fill', `
      <div style="display:grid;grid-template-columns:1fr 1fr;column-gap:22px">
        <div>
          <p style="font-family:${MONO};font-size:9px;letter-spacing:.14em;color:${L.subtle};margin:0 0 7px">PROVIDER</p>
          ${line('c_p_sign', 'Signatory')}
          ${line('c_p_sci', 'Scientific / technical')}
          ${line('c_p_dpo', 'Data protection officer')}
          ${line('c_p_email', 'Email')}
        </div>
        <div>
          <p style="font-family:${MONO};font-size:9px;letter-spacing:.14em;color:${L.subtle};margin:0 0 7px">RECIPIENT</p>
          ${line('c_r_sign', 'Signatory')}
          <p style="font-size:12px;margin:0 0 9px;color:${L.body}"><span style="color:${L.subtle}">Scientific / technical</span> ${RECIPIENT_CONTACT.name}</p>
          ${line('c_r_dpo', 'Data protection officer')}
          <p style="font-size:12px;margin:0 0 9px;color:${L.body}"><span style="color:${L.subtle}">Email</span> ${RECIPIENT_CONTACT.email}</p>
        </div>
      </div>`)}`
  return page({ id: 'd3', body: rh('1 Parties') + wide(main) + folio(num(parties)) })
}

// ------------------------------------------------------------------ 4 purpose
export function purpose() {
  const main = `
    ${section(2, 'Purpose', 'The Data may be used for the purposes ticked here and for nothing else.')}
    ${item('2.1', 'Purposes', 'many', `
      ${opt('2.1', 'feasibility', 'Feasibility: check that the Provider’s export format is read correctly and report what the analyses return')}
      ${opt('2.1', 'integration', 'Integration: develop and test a connection between the Provider’s systems and Oxynet')}
      ${opt('2.1', 'validation', 'Validation: compare Oxynet outputs with the Provider’s own labels or measurements')}
      ${opt('2.1', 'research', 'Research collaboration: establish a new capability or its evidence (for example a second population for oscillation analysis, which is beta)')}
      ${opt('2.1', 'development', 'Model development: train or evaluate models, on the terms chosen in Section 5')}
      ${opt('2.1', 'service', 'Service: routine analysis of the Provider’s recordings through the Oxynet service')}
      ${opt('2.1', 'other', 'Other:', { other: true, otherW: 420 })}`)}
    ${item('2.2', 'Context of use', 'one', `
      ${opt('2.2', 'noncommercial', 'Non-commercial research only', g('2.2'))}
      ${opt('2.2', 'commercial', 'Commercial product or service development', g('2.2'))}
      ${opt('2.2', 'both', 'Both, as described in 2.3', g('2.2'))}`, { cols: 3 })}
    ${item('2.3', 'Description of the project', 'fill', blank('2.3_text', { w: 'full', lines: 5 }))}
    ${item('2.4', 'Uses that are excluded', 'fixed', `
      ${clause('The Recipient will not attempt to identify any individual in the Data, or link the Data with other information for that purpose.')}
      ${clause('This agreement does not authorise any clinical use of the Data, or of outputs derived from it, beyond the status and intended use set out in 9.1 or otherwise agreed in writing.')}
      ${clause('The Data will not be sold, and will not be disclosed to third parties except as set out in 4.5.')}`)}`
  return page({ id: 'd4', body: rh('2 Purpose') + wide(main) + folio(num(purpose)) })
}

// ------------------------------------------------------------------ 5 data
export function data() {
  const main = `
    ${section(3, 'The Data')}
    ${item('3.1', 'Volume and source', 'fill', `
      <div style="display:grid;grid-template-columns:1fr 1fr;column-gap:18px">
        ${line('3.1_n', 'Number of recordings')}${line('3.1_period', 'Period collected')}
      </div>
      ${line('3.1_device', 'Metabolimeter and software (make, model, version)')}
      ${line('3.1_format', 'Export format and file type')}`)}
    ${item('3.2', 'Population', 'many', `
      ${opt('3.2', 'healthy', 'Healthy adults')}
      ${opt('3.2', 'athletes', 'Athletes')}
      ${opt('3.2', 'paediatric', 'Paediatric')}
      ${opt('3.2', 'clinical', 'Clinical population:', { other: true, otherW: 150 })}`, { cols: 2 })}
    ${item('3.3', 'Variables included', 'many', `
      ${opt('3.3', 'gas', 'Breath-by-breath or averaged gas exchange (V̇O₂, V̇CO₂, V̇E)')}
      ${opt('3.3', 'endtidal', 'End-tidal gases (PetO₂, PetCO₂)')}
      ${opt('3.3', 'rf', 'Breathing frequency')}
      ${opt('3.3', 'hr', 'Heart rate')}
      ${opt('3.3', 'load', 'Work rate or speed, protocol')}
      ${opt('3.3', 'labels', 'Expert threshold labels (VT1, VT2)')}
      ${opt('3.3', 'demo', 'Age (or age band), sex, height, body mass')}
      ${opt('3.3', 'clinicalvars', 'Clinical variables (diagnosis, medication)')}
      ${opt('3.3', 'outcomes', 'Outcomes or follow-up')}
      ${opt('3.3', 'other', 'Other:', { other: true, otherW: 170 })}`, { cols: 2 })}
    ${item('3.4', 'Identification status of the Data as shared', 'one', `
      ${opt('3.4', 'anonymous', 'Anonymised: the Provider holds no means of re-identifying individuals', { ...g('3.4'), note: 'The only option at Tier 1.' })}
      ${opt('3.4', 'pseudonymous', 'Pseudonymised: coded, with the key held only by the Provider and never shared', g('3.4'))}
      ${opt('3.4', 'other', 'Other:', { ...g('3.4'), other: true, otherW: 380 })}
      <div style="margin-top:6px">${clause('<b style="color:' + L.strong + '">Fixed.</b> Before transfer the Provider removes direct identifiers from the files and the filenames: names, dates of birth, record and hospital numbers, addresses. Oxynet needs none of them.')}</div>`)}
    ${item('3.5', 'Ethics and consent', 'many', `
      ${opt('3.5', 'ethics', 'Covered by ethics approval, reference:', { other: true, otherW: 220 })}
      ${opt('3.5', 'consent', 'Participants consented to this use or to secondary research use')}
      ${opt('3.5', 'notreq', 'Not required, in the Provider’s assessment, because:', { other: true, otherW: 170 })}`)}
    ${item('3.6', 'Right to share', 'fixed', clause('The Provider confirms that it is entitled to share the Data with the Recipient for the purposes in Section 2, and that doing so is consistent with the information given to the individuals concerned.'))}`
  return page({ id: 'd5', body: rh('3 The Data') + wide(main) + folio(num(data)) })
}

// ------------------------------------------------------------------ 7 transfer + retention
export function transfer() {
  const main = `
    ${section(4, 'Transfer, storage and use', 'How the Data reaches Oxynet, where it is held, what happens to it when it is analysed, and how long any of it is kept. This section is the heart of the agreement.')}
    ${item('4.1', 'How the Data reaches the Recipient', 'many', `
      ${opt('4.1', 'drive', 'A private cloud-drive link the Provider shares (Google Drive, OneDrive, Dropbox or similar), which the Recipient downloads')}
      ${opt('4.1', 'sft', 'Another secure transfer agreed between the parties:', { other: true, otherW: 230 })}
      ${opt('4.1', 'api', 'Upload to the hosted Oxynet service over HTTPS, with an API key issued to the Provider')}
      ${opt('4.1', 'local', 'No transfer: Oxynet runs on the Provider\u2019s infrastructure')}`)}
    ${item('4.2', 'Where the Data is held, step by step', 'fixed', `
      ${clause('<b style="color:' + L.strong + '">A dataset shared by link or file transfer.</b> The Recipient downloads it to a workstation under the Recipient\u2019s control, then uploads it to Oxynet\u2019s storage, where the research corpus is held. Training runs read from that storage and write models and results back to it. The provider of that storage, its region and its security measures are in Annex C. The local copy on the workstation is deleted on the same timetable as the rest (4.6).')}
      ${clause('<b style="color:' + L.strong + '">A recording sent to the hosted service for analysis.</b> The file is written to a temporary file on the service instance, parsed and deleted; it never reaches storage. What is stored is the parsed record, under the Provider\u2019s own API key, which no other key can read. It is deleted as set out in 4.6, and it does not reach the research corpus.')}`)}
    ${item('4.3', 'Recordings sent to the service for analysis', 'one', `
      ${clause('Analysis itself changes no model: the models are fixed files, and a recording sent for analysis teaches them nothing. The choice here is only whether the recording is kept afterwards.')}
      ${opt('4.3', 'transient', 'Not kept. Each recording passes through: parsed, analysed, the result returned, the record deleted on the timetable in 4.6, and nothing of it is used for anything else', { ...g('4.3'), note: 'The default, and what the hosted service does today.' })}
      ${opt('4.3', 'unlabelled', 'Kept without labels. The parsed recordings are retained with no expert labels attached (thresholds a cart wrote into its export stay in the record, unused), and may be used as chosen in Section 5', { ...g('4.3'), note: 'Tier 2 and 3.' })}
      ${opt('4.3', 'labelled', 'Kept with any labels the Provider supplies, and may be used as chosen in Section 5', { ...g('4.3'), note: 'Tier 2 and 3.' })}
      <div style="margin-top:7px">${clause('This choice governs recordings sent to the service and prevails over Section 5. Where they are not kept, nothing in Section 5 applies to them, and Section 5 then governs only a dataset shared under 4.1.')}</div>`)}
`
  return page({ id: 'd7', body: rh('4 Transfer, storage and use') + wide(main) + folio(num(transfer)) })
}

// ------------------------------------------------------------------ retention
export function retention() {
  const main = `
    ${section(4, 'Transfer, storage and use, continued', 'One timetable, covering every copy: the workstation, Oxynet\u2019s storage, the research corpus and the service\u2019s own records.')}
    ${item('4.4', 'Who at the Recipient may access the Data', 'one', `
      ${opt('4.4', 'named', `${RECIPIENT_CONTACT.name} only`, g('4.4'))}
      ${opt('4.4', 'list', 'The following named people:', { ...g('4.4'), other: true, otherW: 330 })}`)}
    ${item('4.5', 'Third parties', 'fixed', clause('The Data is disclosed to no one except the infrastructure providers listed in Annex C, used only to host the storage and the service.'))}
    ${item('4.6', 'How long the Recipient keeps the Data', 'one', `
      ${opt('4.6', 'service', `Only as long as the hosted service keeps a record: ${SERVICE.retainHours} hours after upload, or up to ${SERVICE.retainMaxDays} days if the Provider asks for longer at upload, or sooner on request. Nothing is kept beyond that`, g('4.6'))}
      ${opt('4.6', 'purpose', 'Until the purposes in Section 2 are complete, then every copy is deleted', g('4.6'))}
      ${opt('4.6', 'date', 'Until this date, then every copy is deleted:', { ...g('4.6'), other: true, otherW: 140 })}
      ${opt('4.6', 'term', 'For the term of this agreement, then every copy is deleted', g('4.6'))}
      ${opt('4.6', 'corpus', 'In the Oxynet research corpus on the terms in Section 5, for this period:', { ...g('4.6'), other: true, otherW: 120, note: 'Tier 3 only.' })}`)}
    ${item('4.7', 'Deletion', 'many', `
      ${opt('4.7', 'confirm', 'The Recipient confirms deletion in writing when it takes place')}
      ${opt('4.7', 'ondemand', 'The Provider may require deletion at any time, carried out within 30 days, with the effect set out in 5.6')}`)}
    ${item('4.8', 'What is kept whatever is chosen above', 'fixed', `
      ${clause(`For a call to the hosted service: per API key, a monthly count of analyses with the key\u2019s name and a timestamp, and hourly counts of requests by kind, analysis, client, detected format and outcome, kept per key for ${SERVICE.usageDetailMonths} months and then only as totals across all keys. Log lines hold the record id, the key\u2019s fingerprint, the detected format, the file size, the number of samples and the duration, and the web server\u2019s access lines hold the path and a network address; logs are deleted after ${SERVICE.logDays} days. None of these holds anything from a recording, and none is used for model development.`)}
      ${clause('Results are returned to the caller and are not stored by the service.')}`)}`
  return page({ id: 'd7b', body: rh('4 Retention') + wide(main) + folio(num(retention)) })
}

// ------------------------------------------------------------------ 8 model development
export function models() {
  const main = `
    ${section(5, 'Use in model development', 'The choice with the most consequence for both parties, so every level is listed, and every way the Data could be used is named.')}
    ${item('5.1', 'May the Data be used to develop Oxynet models?', 'one', `
      ${clause('This section governs a dataset shared under 4.1, and recordings kept under 4.3. It does not reach recordings that 4.3 says are not kept.')}
      ${opt('5.1', 'no', 'No. The Data is used only for the purposes in Section 2 and never enters a training corpus', { ...g('5.1'), note: 'This is the default, and what happens to anything uploaded through the hosted service.' })}
      ${opt('5.1', 'evaluate', 'For evaluation only: to test or benchmark existing models, never to train them', g('5.1'))}
      ${opt('5.1', 'research', 'To train and evaluate research models, not offered in any Oxynet service', { ...g('5.1'), note: 'Tier 3 only.' })}
      ${opt('5.1', 'commercial', 'To train and evaluate models, including models offered in Oxynet services, commercial ones included', { ...g('5.1'), note: 'Tier 3 only.' })}`)}
    ${item('5.2', 'Which parts of the Data may be used', 'many', `
      ${opt('5.2', 'signals', 'The recorded signals, without the labels')}
      ${opt('5.2', 'labels', 'The expert threshold labels and annotations')}
      ${opt('5.2', 'meta', 'Demographics and clinical variables shared under 3.3')}
      ${opt('5.2', 'derived', 'Representations derived from the above (encoders, embeddings, scaling constants)')}`, { cols: 2 })}
    ${item('5.3', 'Which kinds of use are permitted', 'many', `
      ${opt('5.3', 'ssl', 'Representation learning with no labels: an encoder is trained to reconstruct the signals')}
      ${opt('5.3', 'init', 'Initialisation only: the Data pretrains a model that is then fine-tuned on another cohort, and no reported result derives from the Data', { note: 'Uses the labels where they exist.' })}
      ${opt('5.3', 'supervised', 'Supervised training or fine-tuning of a detector on the labels')}
      ${opt('5.3', 'eval', 'Evaluation and benchmarking of existing models, including per-recording result rows')}
      ${opt('5.3', 'generation', 'Training generative models that produce artificial recordings, which Oxynet may publish as synthetic sample data', { note: 'No real recording is published; the generator learns from real ones.' })}
      ${opt('5.3', 'stats', 'Aggregate reference statistics kept in configuration and model metadata: scaling constants, cohort percentiles, benchmark tables')}
      ${opt('5.3', 'figures', 'Figures in publications and documentation, subject to Section 6')}`)}`
  return page({ id: 'd8', body: rh('5 Model development') + wide(main) + folio(num(models)) })
}

// ------------------------------------------------------------------ 9 who the models reach
export function modelsReach() {
  const main = `
    ${section(5, 'Use in model development, continued')}
    ${item('5.4', 'Who may be offered a model trained on the Data', 'one', `
      ${clause('A model trained on the Data is the Recipient\u2019s (6.1). This item limits who it may be offered to, and is enforced by restricting the model to named API keys.')}
      ${opt('5.4', 'anyone', 'Anyone. No restriction', g('5.4'))}
      ${opt('5.4', 'except', 'Anyone except the organisations named here, for this many months:', { ...g('5.4'), other: true, otherW: 70 })}
      <div style="margin:0 0 6px 20px">${line('5.4_except_who', 'Organisations')}</div>
      ${opt('5.4', 'provider_then', 'The Provider only, for this many months, then anyone:', { ...g('5.4'), other: true, otherW: 70 })}
      ${opt('5.4', 'provider_only', 'The Provider only, until the parties agree otherwise in writing', g('5.4'))}`)}
    ${item('5.5', 'Conditions, where the Data is used for models', 'many', `
      ${opt('5.5', 'pseudo', 'Pseudonymised before it enters the corpus, if it is not already')}
      ${opt('5.5', 'ack', 'The Provider is acknowledged as the source cohort in the documentation of any model trained on the Data, subject to 6.5')}
      ${opt('5.5', 'optout', 'The Provider may withdraw the Data from future model development, with the effect set out in 5.6')}
      ${opt('5.5', 'report', 'The Recipient reports the evaluation results obtained on the Data to the Provider')}
      ${opt('5.5', 'list', 'On request, the Recipient states which models were trained or initialised on the Data')}
      ${opt('5.5', 'other', 'Other:', { other: true, otherW: 400 })}`)}
    ${item('5.6', 'What withdrawal and deletion mean', 'fixed', `
      ${clause('On withdrawal or deletion the Recipient deletes, within the period in 4.7, the Data and everything derived from it that still describes individual recordings: the conditioned training files, cached training tensors, held-out file lists, per-recording evaluation rows and prediction arrays. Training runs that start after the notice exclude the Data, which the training tools do by cohort and by file format.')}
      ${clause('What is not affected, and need not be retrained, deleted or withdrawn from use: model weights and encoders already trained, aggregate statistics already measured, results already reported, and figures and publications already produced.')}`)}`
  return page({ id: 'd8b', body: rh('5 Model development') + wide(main) + folio(num(modelsReach)) })
}

// ------------------------------------------------------------------ 9 rights
export function rights() {
  const who = (label, items) => `
    <div style="border:1px solid ${L.line};border-radius:9px;padding:10px 12px">
      <p style="font-family:${MONO};font-size:6.5px;letter-spacing:.14em;text-transform:uppercase;color:${ACCENT_TEXT};margin:0 0 6px">${label}</p>
      ${items.map((t) => `<p style="font-size:9.5px;line-height:1.45;color:${L.body};margin:0 0 3px">${t}</p>`).join('')}
    </div>`
  const main = `
    ${section(6, 'Rights, results and publication')}
    ${item('6.1', 'Who holds what', 'fixed', `
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:8px">
        ${who('The Provider keeps', ['The Data as provided, including its own labels and annotations'])}
        ${who('The Recipient keeps', ['Oxynet software, algorithms and methods', 'Oxynet models and model weights, including those trained or improved using the Data under Section 5', 'General know-how gained from the work'])}
        ${who('The Provider receives', ['The outputs, on the terms in 6.3', 'The publication rights in 6.4'])}
      </div>
      ${clause('Neither party acquires any right in the other’s material except as stated here. A model built specifically for the Provider, or any other allocation, requires a separate model development agreement.')}`)}
    ${item('6.2', 'No exclusivity', 'fixed', clause('Sharing Data with the Recipient gives the Provider no ownership of, and no exclusive right to, any Oxynet model, method, software or service. Exclusivity, if wanted, is agreed separately in writing.'))}
    ${item('6.3', 'Outputs of the analysis', 'one', `
      ${opt('6.3', 'provider', 'The Provider may use the outputs Oxynet returns on its Data freely', g('6.3'))}
      ${opt('6.3', 'shared', 'Both parties may use the outputs, for the purposes in Section 2', g('6.3'))}
      ${opt('6.3', 'other', 'Other:', { ...g('6.3'), other: true, otherW: 380 })}`)}
    ${item('6.4', 'Publication', 'one', `
      ${opt('6.4', 'joint', 'Joint publication, with authorship following ICMJE criteria', g('6.4'))}
      ${opt('6.4', 'provider', 'The Provider may publish; Oxynet is cited as the analysis method', g('6.4'))}
      ${opt('6.4', 'recipient', 'The Recipient may publish; the Provider is cited as the source of the data and of the expert labelling', g('6.4'))}
      ${opt('6.4', 'consent', 'No publication without both parties’ written consent', g('6.4'))}
      ${opt('6.4', 'none', 'No publication is planned', g('6.4'))}`)}
    ${item('6.5', 'Naming the Provider in Oxynet materials', 'one', `
      ${opt('6.5', 'named', 'May be named (website, manual, presentations)', g('6.5'))}
      ${opt('6.5', 'anon', 'Described without the name ("a hospital laboratory")', g('6.5'))}
      ${opt('6.5', 'no', 'Not mentioned', g('6.5'))}`)}`
  return page({ id: 'd9', body: rh('6 Rights and publication') + wide(main) + folio(num(rights)) })
}

// ------------------------------------------------------------------ 10 commercial + term
export function term() {
  const main = `
    ${section(7, 'Commercial terms')}
    ${item('7.1', 'Consideration', 'many', `
      ${opt('7.1', 'none', 'No payment in either direction')}
      ${opt('7.1', 'access', 'The Provider receives access to the Oxynet service, on these terms:', { other: true, otherW: 170 })}
      ${opt('7.1', 'fee', 'Fees, as set out in a separate document')}
      ${opt('7.1', 'share', 'A share of revenue from services using models trained on the Data, as set out in a separate document')}
      ${opt('7.1', 'other', 'Other:', { other: true, otherW: 380 })}`)}
    ${section(8, 'Term, termination and transfer')}
    ${item('8.1', 'Duration', 'one', `
      ${opt('8.1', '12', '12 months', g('8.1'))}
      ${opt('8.1', '24', '24 months', g('8.1'))}
      ${opt('8.1', 'purpose', 'Until the purposes are complete', g('8.1'))}
      ${opt('8.1', 'other', 'Other:', { ...g('8.1'), other: true, otherW: 90 })}`, { cols: 2 })}
    ${item('8.2', 'Dates and notice', 'fill', `
      <div style="display:grid;grid-template-columns:1fr 1fr;column-gap:18px">${line('8.2_start', 'Effective from')}${line('8.2_notice', 'Notice to terminate (days)')}</div>
      ${clause('On termination the Data is deleted as set out in Sections 4 and 5.6. Sections 2.4, 6 and 9 continue to apply.')}`)}
    ${item('8.3', 'Transfer to an Oxynet legal entity', 'one', `
      ${clause('Where the Recipient is not yet the legal entity that operates Oxynet, this agreement, with the Data and every right and obligation under it, may pass to that entity once established:')}
      ${opt('8.3', 'notice', 'On written notice to the Provider, provided the entity takes on every obligation under this agreement', g('8.3'))}
      ${opt('8.3', 'consent', 'With the Provider’s written consent, which is not unreasonably withheld', g('8.3'))}
      ${opt('8.3', 'na', 'Not applicable: the Recipient already operates Oxynet', g('8.3'))}`)}`
  return page({ id: 'd10', body: rh('7 Commercial, 8 Term') + wide(main) + folio(num(term)) })
}

// ------------------------------------------------------------------ 11 general
export function general() {
  const main = `
    ${section(9, 'General terms')}
    ${item('9.1', 'Status of Oxynet and permitted use of outputs', 'fixed', `
      ${clause('At the date of this agreement Oxynet is research software. It is not a medical device, carries no CE mark or FDA clearance, its outputs are not a diagnosis, and no output is calibrated against clinical outcomes. Outputs are provided as they are, without warranty of fitness for a clinical purpose.')}
      ${clause('This describes the status on that date, not a permanent one. The use of outputs permitted by this agreement follows it, and a change of status or intended use is recorded by written amendment.')}`)}
    ${item('9.2', 'Confidentiality', 'fixed', clause('Each party keeps the other’s non-public information confidential and uses it only for this agreement.'))}
    ${item('9.3', 'Security incidents', 'one', `
      ${clause('The Recipient notifies the Provider of any breach affecting the Data without undue delay and at the latest within:')}
      <div style="display:flex;gap:26px">${opt('9.3', '24', '24 hours', g('9.3'))}${opt('9.3', '48', '48 hours', g('9.3'))}${opt('9.3', '72', '72 hours', g('9.3'))}</div>`)}
    ${item('9.4', 'Indirect loss', 'many', opt('9.4', 'exclude', 'Neither party is liable to the other for indirect or consequential loss, including lost profit'))}
    ${item('9.5', 'Governing law and courts', 'one', `
      ${opt('9.5', 'italy', `Italian law; courts of ${RECIPIENT_CONTACT.courts}`, g('9.5'))}
      ${opt('9.5', 'provider', 'The law and courts of the Provider’s country', g('9.5'))}
      ${opt('9.5', 'other', 'Other:', { ...g('9.5'), other: true, otherW: 330 })}`)}
    ${item('9.6', 'Entire agreement', 'fixed', clause('This agreement, with its annexes, is the whole agreement on the Data. Changes are valid only in writing signed by both parties. Where an item is left unticked, the parties have not agreed it, and it does not apply.'))}`
  return page({ id: 'd11', body: rh('9 General') + wide(main) + folio(num(general)) })
}

// ------------------------------------------------------------------ 10 signatures
export function signatures() {
  const party = (who, p) => `
    <div style="border:1px solid ${L.line};border-radius:11px;padding:18px 20px">
      <p style="font-family:${MONO};font-size:7.5px;letter-spacing:.16em;text-transform:uppercase;color:${ACCENT_TEXT};margin:0 0 14px">${who}</p>
      ${line(`${p}_org`, 'Organisation')}
      ${line(`${p}_name`, 'Name')}
      ${line(`${p}_role`, 'Role')}
      ${line(`${p}_place`, 'Place')}
      ${line(`${p}_date`, 'Date')}
      <p style="font-size:12px;color:${L.subtle};margin:16px 0 4px">Signature</p>
      <div style="height:78px;border-bottom:1px solid ${L.faint}"></div>
    </div>`
  const main = `
    ${section(10, 'Signatures')}
    <p style="font-size:13px;line-height:1.55;margin-bottom:18px">Signed by the authorised representatives of the parties. The agreement may be signed in counterparts and electronically.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px">${party('For the Provider', 'sig_p')}${party('For the Recipient', 'sig_r')}</div>
    <div style="margin-top:26px">
      <h3>Annexes</h3>
      <div style="padding:8px 0;border-top:1px solid ${L.line};font-size:12.5px"><b style="color:${L.strong}">Annex A</b> ${SEP} Item tracker (page ${num(tracker)})</div>
      <div style="padding:8px 0;border-top:1px solid ${L.line};font-size:12.5px;display:flex;gap:9px;align-items:flex-start">${box('annexB')}<span><b style="color:${L.strong}">Annex B</b> ${SEP} A data processing agreement, where the Provider\u2019s institution requires one: ${blank('annexB_title', { w: 230 })}</span></div>
      <div style="padding:8px 0;border-top:1px solid ${L.line};font-size:12.5px"><b style="color:${L.strong}">Annex C</b> ${SEP} Hosting, storage and security (page ${num(hosting)})</div>
    </div>`
  return page({ id: 'd12', body: rh('10 Signatures') + wide(main) + folio(num(signatures)) })
}

// ------------------------------------------------------------------ 11 tracker
export const ITEMS = [
  ['0.1', 'Scope (tier)'],
  ['1.1', 'Provider'], ['1.2', 'Type of organisation'], ['1.3', 'Nature of the Provider'], ['1.4', 'Recipient'], ['1.5', 'Contact points'],
  ['2.1', 'Purposes'], ['2.2', 'Context of use'], ['2.3', 'Project description'],
  ['3.1', 'Volume and source'], ['3.2', 'Population'], ['3.3', 'Variables'], ['3.4', 'Identification status'], ['3.5', 'Ethics and consent'],
  ['4.1', 'How the Data arrives'], ['4.3', 'Recordings sent for analysis'], ['4.4', 'Access'],
  ['4.6', 'Retention'], ['4.7', 'Deletion'],
  ['5.1', 'Model development'], ['5.2', 'Parts of the Data'], ['5.3', 'Kinds of use'],
  ['5.4', 'Who may be offered the model'], ['5.5', 'Model conditions'],
  ['6.3', 'Outputs'], ['6.4', 'Publication'], ['6.5', 'Naming the Provider'],
  ['7.1', 'Consideration'], ['8.1', 'Duration'], ['8.2', 'Dates and notice'], ['8.3', 'Transfer to Oxynet entity'],
  ['9.3', 'Security incidents'], ['9.4', 'Indirect loss'], ['9.5', 'Governing law'],
  ['Ann.', 'Annexes B and C'],
]

export function tracker() {
  const half = Math.ceil(ITEMS.length / 2)
  const col = (rows) => `
    <div>
      <div style="display:grid;grid-template-columns:34px 1fr 32px 30px 30px 52px;gap:6px;padding-bottom:5px;border-bottom:1.5px solid ${L.strong}">
        ${['Item', '', 'Tier', 'Prov.', 'Rec.', 'Changed'].map((h) => `<span style="font-family:${MONO};font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:${L.subtle}">${h}</span>`).join('')}
      </div>
      ${rows.map(([id, name]) => {
        const k = id.replace('.', '_')
        return `<div style="display:grid;grid-template-columns:34px 1fr 32px 30px 30px 52px;gap:6px;align-items:center;padding:1.5px 0;border-bottom:1px solid ${L.line}">
          <span style="font-family:${MONO};font-size:10px;color:${ACCENT_TEXT}">${id}</span>
          <span style="font-size:9.5px;color:${L.body}">${name}</span>
          <span>${TIERS[id] ? squares(TIERS[id]) : ''}</span>
          <span style="display:flex">${box(`trk_${k}_p`)}</span>
          <span style="display:flex">${box(`trk_${k}_r`)}</span>
          <span style="display:flex">${box(`trk_${k}_c`)}</span>
        </div>`
      }).join('')}
    </div>`
  const main = `
    <p class="eyebrow" style="color:${ACCENT_TEXT}">Annex A</p>
    <h1 style="margin-bottom:10px">Item tracker</h1>
    <p style="font-size:12.5px;line-height:1.55;margin-bottom:14px">Each party ticks an item once it agrees with how it is filled in. <b style="color:${L.strong}">Changed</b> marks an item amended since the previous draft, so a returned copy shows at a glance what moved. When both columns are ticked on every row, the agreement is ready to sign.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">${col(ITEMS.slice(0, half))}${col(ITEMS.slice(half))}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:14px">
      ${line('trk_draft', 'Draft no.')}${line('trk_date', 'Date of this draft')}
    </div>
    <div style="margin-top:10px">
      <h3 style="margin-bottom:4px">Requested changes</h3>
      <p style="font-size:12px;line-height:1.5;margin:0 0 8px">Any change to the wording, including a fixed term, with the item number and the text you propose. We will answer each one in the next draft.</p>
      ${blank('changes', { w: 'full', lines: 3 })}
    </div>
    <p style="font-size:8.5px;line-height:1.5;color:${L.faint};margin:6px 0 0">Template v${VERSION}, ${DATE}. The current template is always at ${extlink('https://www.oxynet.net/data-agreement', 'oxynet.net/data-agreement')}.</p>`
  return page({ id: 'd13', body: rh('Annex A Item tracker') + wide(main) + folio(num(tracker)) })
}

// ------------------------------------------------------------------ 14 annex C
export function hosting() {
  const row = (k, v) => `
    <div style="display:grid;grid-template-columns:170px 1fr;gap:16px;padding:6px 0;border-top:1px solid ${L.line}">
      <span style="font-family:${MONO};font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:${L.subtle};padding-top:2px">${k}</span>
      <span style="font-size:12px;line-height:1.45;color:${L.body}">${v}</span>
    </div>`
  const main = `
    <p class="eyebrow" style="color:${ACCENT_TEXT}">Annex C</p>
    <h1 style="margin-bottom:10px">Hosting, storage and security</h1>
    <p style="font-size:12.5px;line-height:1.55;margin-bottom:9px">Where the Data and the models are held on the date of this template, and how. Every entry below is a fixed term.</p>
    <h3 style="margin:2px 0 0">Where things live</h3>
    ${row('Infrastructure', `${HOSTING.provider}, region ${HOSTING.region}. The only infrastructure provider that holds the Data.`)}
    ${row('Analysis service', `${HOSTING.compute}, ${HOSTING.region}, reached at app.oxynet.net over HTTPS.`)}
    ${row('Uploaded files', 'Never stored. Parsed in a temporary file on the service instance and discarded.')}
    ${row('Parsed records', `${HOSTING.storage}, ${HOSTING.region}, in a storage area partitioned per API key.`)}
    ${row('Models and weights', `${HOSTING.storage}, ${HOSTING.region}, loaded by the service when first used, then kept in memory.`)}
    ${row('Research corpus', `Only where 5.1 allows it. ${HOSTING.storage}, ${HOSTING.region}, pseudonymised, in the same bucket as the service\u2019s records, under separate folders.`)}
    ${row('Model training', `Runs on a workstation controlled by the Recipient, or on the service\u2019s own infrastructure in the region above, reading a copy of the research corpus. No third-party training service is used. Workstation location: ${blank('c_training_loc', { w: 175 })}`)}
    <h3 style="margin:10px 0 0">How it is protected</h3>
    ${row('In transit', 'HTTPS between the Provider and the service. Service and storage run in the same AWS region.')}
    ${row('At rest', `${HOSTING.atRest} on all stored records, models and corpus files.`)}
    ${row('Public access', 'Blocked on the storage bucket: nothing in it can be made public.')}
    ${row('Access', 'API access by a key issued per caller, which reaches only its own records. Storage and administration only by the people named in 4.4, through their own credentials.')}
    ${row('Deletion', 'The service deletes a parsed record at expiry (4.6) or on request. The storage keeps a version history of the files written to it: automatic rules remove earlier versions of the service\u2019s records one day after they are replaced or deleted, and the Recipient purges those of a dataset when deleting it, confirming in writing where 4.7 asks for confirmation.')}
    ${row('Analysis results', 'Returned to the caller and not stored. What persists for a call through the service is set out in 4.8: counts per API key and log lines, none holding data from any recording.')}
    ${row('Backups and copies', 'No backup, replica or copy of the Data is kept outside the storage described here, other than the training copy above where 5.1 allows it. The service instance keeps a working copy of records it has written or read until it restarts.')}
    ${row('Changes', 'The Recipient notifies the Provider in writing before moving the Data or the models to another provider or outside the EU / EEA.')}
    <p style="font-size:8.5px;line-height:1.5;color:${L.faint};margin:12px 0 0">Taken from the live service configuration for template v${VERSION}, ${DATE}.</p>`
  return page({ id: 'd14', body: rh('Annex C Hosting and security') + wide(main) + folio(num(hosting)) })
}

export const PAGES = [cover, howTo, scope, parties, purpose, data, transfer, retention, models, modelsReach, rights, term, general, signatures, tracker, hosting]
