/** Cover, colophon and contents. */

import { PAGE, D, L, GREEN, MONO, WARN } from '../tokens.mjs'
import { page, runhead, folio, wide, betaChip, extlink, SEP } from '../lib.mjs'
import { VERSION, DATE, ENGINE, CONTACT, LINKS, CORPUS } from '../config.mjs'
import { PARTS, link, xref } from '../toc.mjs'
import { mark, field, gradientText } from '../brand.mjs'

export function cover() {
  const body = `
  <div style="position:absolute;inset:0">${field()}</div>
  <div style="position:absolute;inset:0;background:radial-gradient(58% 54% at 50% 44%, rgba(10,10,10,.90) 0%, rgba(10,10,10,.62) 46%, rgba(10,10,10,0) 78%)"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(to bottom, rgba(10,10,10,.85) 0%, rgba(10,10,10,0) 18%, rgba(10,10,10,0) 62%, rgba(10,10,10,.92) 100%)"></div>

  <div style="position:absolute;left:${PAGE.ML}px;right:${PAGE.MR}px;top:150px;display:flex;flex-direction:column;align-items:center;text-align:center">
    <p style="font-family:${MONO};font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:${GREEN};margin:0 0 34px">A computational layer for CPET</p>
    <div style="margin:0 0 6px">${mark({ width: 150 })}</div>
    <div style="margin:0 0 22px">${gradientText('Oxynet', { size: 96, id: 'wordmark' })}</div>
    <p style="font-size:22px;font-weight:600;color:${D.strong};margin:0 0 14px;letter-spacing:-.01em">Physiological intelligence for exercise testing.</p>
    <p style="font-size:15.5px;line-height:1.6;color:${D.body};max-width:452px;margin:0">Structured physiological measurement from cardiopulmonary exercise test signals, consistent across protocols, populations and devices, over one API that people, clinical software and AI agents all call.</p>
    <div style="width:56px;height:2px;background:${GREEN};margin:38px 0 22px"></div>
    <p style="font-family:${MONO};font-size:12.5px;letter-spacing:.24em;text-transform:uppercase;color:${D.strong};margin:0">The Manual</p>
    <p style="font-family:${MONO};font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:${D.subtle};margin:10px 0 0">Version ${VERSION} ${SEP} ${DATE}</p>
  </div>

  <div style="position:absolute;left:${PAGE.ML}px;right:${PAGE.MR}px;bottom:${PAGE.MB}px;display:flex;justify-content:space-between;align-items:flex-end;gap:40px;border-top:1px solid ${D.line};padding-top:18px">
    <div style="font-family:${MONO};font-size:9.5px;line-height:1.85;letter-spacing:.06em;color:${D.faint}">
      <div style="color:${D.subtle};letter-spacing:.18em">A COMPUTATIONAL LAYER FOR CPET</div>
      <div>${extlink(LINKS.site)} ${SEP} ${extlink(LINKS.app)}</div>
    </div>
    <div style="text-align:right;font-family:${MONO};font-size:9.5px;line-height:1.85;letter-spacing:.06em;color:${D.faint};flex-shrink:0">
      <div style="color:${D.subtle};letter-spacing:.18em">PREPARED BY</div>
      <div style="color:${D.body}">${CONTACT.credited}</div>
      <div>${CONTACT.email}</div>
    </div>
  </div>`
  return page({ id: 'cover', light: false, full: true, body })
}

export function colophon() {
  const row = (k, v) => `
    <div style="display:grid;grid-template-columns:150px 1fr;gap:18px;padding:9px 0;border-top:1px solid ${L.line}">
      <span style="font-family:${MONO};font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:${L.subtle};padding-top:3px">${k}</span>
      <span style="font-size:13.5px;line-height:1.55;color:${L.body}">${v}</span>
    </div>`

  const body =
    runhead('Oxynet Manual', `Version ${VERSION}`) +
    wide(`
    <p class="eyebrow" style="color:#046c45">About this document</p>
    <h1 style="margin-bottom:14px">What this is, and what it is for</h1>
    <p class="stand" style="max-width:600px;margin-bottom:22px">A description of the Oxynet engine written to be read end to end by someone deciding whether to build on it, fund it, or run their laboratory's tests through it.</p>

    <div style="margin-top:8px">
      ${row('Version', `${VERSION}, ${DATE}`)}
      ${row('Engine described', `API ${ENGINE.api} at ${ENGINE.host}, analysis version ${ENGINE.analysisVersion}`)}
      ${row('Authoritative source', `This manual is not regenerated on every release. The API reference at <b style="color:${L.strong}">${extlink(LINKS.apiDocs)}</b> is generated from the running service and wins wherever the two differ.`)}
      ${row('Status', `Research software. Not a medical device, and not a diagnosis. See ${xref('4.1')}.`)}
      ${row('Contact', `${CONTACT.credited}, <b style="color:${L.strong}">${CONTACT.email}</b>, in a private capacity. See ${xref('4.4')}.`)}
    </div>

    <div style="margin-top:28px;border-left:2px solid ${WARN};padding-left:16px;max-width:600px">
      <p style="font-family:${MONO};font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:${WARN};margin:0 0 8px">Before circulating</p>
      <p style="font-size:13.5px;line-height:1.6;color:${L.body};margin:0">This document describes capabilities and states their limits. It is not an offer of securities, a solicitation to invest, a clinical claim, or a regulatory submission. Nothing in it has been reviewed by a notified body or a regulator.</p>
    </div>`) +
    folio('2')
  return page({ id: 'colophon', body })
}

export function contents() {
  const blocks = PARTS.map((p) => {
    const rows = p.sections
      .map(
        (s) => link(s.page, `
      <div style="display:grid;grid-template-columns:34px 1fr auto;gap:12px;align-items:baseline;padding:3.5px 0">
        <span style="font-family:${MONO};font-size:11px;color:${L.faint}">${s.id}</span>
        <span style="font-size:15px;color:${L.body};border-bottom:1px dotted ${L.line};padding-bottom:4px">${s.title}${s.beta ? betaChip() : ''}</span>
        <span style="font-family:${MONO};font-size:11.5px;color:${L.subtle}">${s.page}</span>
      </div>`)
      )
      .join('')
    return `
    <div style="margin-bottom:17px">
      ${link(p.divider, `<div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:1.5px solid ${L.strong};padding-bottom:7px;margin-bottom:5px">
        <span><span style="font-family:${MONO};font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#046c45;margin-right:12px">Part ${p.n}</span><span style="font-size:19px;font-weight:600;color:${L.strong};letter-spacing:-.01em">${p.title}</span></span>
        <span style="font-family:${MONO};font-size:11.5px;color:${L.subtle}">${p.divider}</span>
      </div>`)}${rows}
    </div>`
  }).join('')

  const body =
    runhead('Oxynet Manual', `Version ${VERSION}`) +
    wide(`<h1 style="margin-bottom:22px">Contents</h1>${blocks}`) +
    folio('3')
  return page({ id: 'contents', body })
}

/** A part divider. Dark, full bleed, with the part's sections listed. */
export function divider(part) {
  const rows = part.sections
    .map(
      (s) => link(s.page, `
    <div style="display:grid;grid-template-columns:44px 1fr 34px;gap:18px;align-items:baseline;padding:13px 0;border-bottom:1px solid ${D.line}">
      <span style="font-family:${MONO};font-size:11px;letter-spacing:.1em;color:${GREEN}">${s.id}</span>
      <span><span style="font-size:17px;font-weight:600;color:${D.strong}">${s.title}</span>${s.beta ? betaChip(true) : ''}</span>
      <span style="font-family:${MONO};font-size:12px;color:${D.faint};text-align:right">${s.page}</span>
    </div>`)
    )
    .join('')

  const body = `
  <div style="position:absolute;inset:0;opacity:.5">${field({ seed: 11 + Number(part.numeral), cx: 0.3, cy: 0.3 })}</div>
  <div style="position:absolute;inset:0;background:radial-gradient(70% 60% at 30% 30%, rgba(10,10,10,.86) 0%, rgba(10,10,10,.55) 50%, rgba(10,10,10,.92) 100%)"></div>
  <div style="position:absolute;right:${PAGE.MR}px;top:96px;opacity:.20">${gradientText(part.numeral, { size: 210, tracking: -0.05, id: `num${part.numeral}` })}</div>
  <div style="position:absolute;left:${PAGE.ML}px;right:${PAGE.MR}px;top:250px">
    <p style="font-family:${MONO};font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:${GREEN};margin:0 0 20px">Part ${part.n}</p>
    <div style="font-size:52px;font-weight:600;letter-spacing:-.028em;line-height:1.08;color:${D.strong};max-width:560px;margin:0 0 20px">${part.title}</div>
    <p style="font-size:16.5px;line-height:1.6;color:${D.body};max-width:520px;margin:0">${part.blurb}</p>
    <div style="margin-top:40px;border-top:1px solid ${D.line}">${rows}</div>
  </div>
  <div style="position:absolute;left:${PAGE.ML}px;right:${PAGE.MR}px;bottom:${PAGE.MB}px;display:flex;justify-content:space-between;align-items:baseline">
    ${part.numeral === '02' ? `<span style="font-size:15px;color:${D.subtle};font-style:italic">The figures are the interface. The payloads are the engine.</span>` : ''}
    <span style="font-family:${MONO};font-size:9.5px;letter-spacing:.1em;color:${D.faint}">${part.divider}</span>
  </div>`
  return page({ id: `divider-${part.numeral}`, light: false, full: true, body })
}
