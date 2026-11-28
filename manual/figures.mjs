/**
 * Every figure in the manual, drawn as inline SVG from the reference recording
 * in `data/reference-test.json` and the recorded API responses in
 * `data/api-results.json`.
 *
 * Two rules hold throughout, and both are load bearing:
 *
 *   No dual axes. Two measures of different scale get two stacked panels on a
 *   shared time axis, never two y-scales on one plot. A reader cannot tell
 *   which curve belongs to which axis, and the apparent crossing point of two
 *   differently-scaled curves is an artefact of the scaling.
 *
 *   The intensity-domain hues sit in the 6 to 8 band for protanopia, so every
 *   band painted with them is directly labelled. Never draw them bare.
 *
 * Nothing here computes physiology. Smoothing is for legibility and is said so
 * in the caption; every quoted number comes back from the API.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { L, GREEN, BLUE, ACCENT_TEXT, DOMAIN, SANS, MONO, WARN, WARN_DARK } from './tokens.mjs'
import { morletPower, logPeriods, rasterURI, magma } from './wavelet.mjs'
import { CORPUS } from './config.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const test = JSON.parse(readFileSync(join(here, 'data/reference-test.json'), 'utf8'))
export const api = JSON.parse(readFileSync(join(here, 'data/api-results.json'), 'utf8'))

const t = test.data.map((r) => r.t)
const ch = (name) => test.data.map((r) => r[name])
const TEND = api.upload.sampling.duration_s

/** Rolling mean. Legibility only, and every caption says so. */
function smooth(y, k = 9) {
  return y.map((_, i) => {
    const a = Math.max(0, i - (k >> 1))
    const b = Math.min(y.length, i + (k >> 1) + 1)
    return y.slice(a, b).reduce((s, v) => s + v, 0) / (b - a)
  })
}

const fmt = (n, d = 1) => Number(n).toFixed(d)

/** A panel: a scale pair plus the furniture that goes with it. */
function panel({ x0, x1, y0, y1, vmin, vmax, tmin, tmax }) {
  const sx = (v) => x0 + ((v - tmin) / (tmax - tmin)) * (x1 - x0)
  const sy = (v) => y1 - ((v - vmin) / (vmax - vmin)) * (y1 - y0)
  const line = (xs, ys, stroke, w = 2, dash = '') =>
    `<path d="M ${xs.map((x, i) => `${fmt(sx(x))} ${fmt(sy(ys[i]))}`).join(' L ')}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`
  return { sx, sy, line }
}

const gridline = (x0, x1, y, v, unitless = false) =>
  `<line x1="${x0}" y1="${fmt(y)}" x2="${x1}" y2="${fmt(y)}" stroke="${L.line}" stroke-width="1"/>` +
  `<text x="${x0 - 8}" y="${fmt(y + 3.5)}" font-family="${MONO}" font-size="9" fill="${L.faint}" text-anchor="end">${unitless ? v : v}</text>`

const axisLabel = (x, y, text, anchor = 'end', colour = L.subtle) =>
  `<text x="${x}" y="${y}" font-family="${SANS}" font-size="10.5" font-weight="500" fill="${colour}" text-anchor="${anchor}">${text}</text>`

const unitLabel = (x, y, text) =>
  `<text x="${x}" y="${y}" font-family="${MONO}" font-size="9" fill="${L.faint}" text-anchor="end">${text}</text>`

const svg = (w, h, label, inner) =>
  `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${inner}</svg>`

// ============================================================== 2.3  THRESHOLDS
/**
 * The thresholds against oxygen uptake, which is the axis a physiologist reads
 * them on, in the two panels the diagnosis is actually made from.
 *
 * Above: ventilation against oxygen uptake, every breath coloured by the domain
 * the model assigned it. Below: the ventilatory equivalents, where the textbook
 * criteria live. VT1 sits at the nadir of the equivalent for oxygen while the
 * one for carbon dioxide is still flat; VT2 sits where the carbon dioxide
 * equivalent turns up too. Both are drawn from the file's own columns, and the
 * vertical lines are what the model returned, so the reader can see whether the
 * two agree instead of being told that they do.
 */
export function figThresholds({ W = 670 } = {}) {
  const AX = 52
  const X1 = W - 6
  const A = { y0: 46, y1: 158 }
  const B = { y0: 198, y1: 300 }
  const H = B.y1 + 38
  const { vt1_time_s: VT1, vt2_time_s: VT2, vt1_vo2_ml_min: v1, vt2_vo2_ml_min: v2 } = api.vt.findings
  const vo2 = ch('VO2')
  const XMAX = 2500

  const pa = panel({ x0: AX, x1: X1, y0: A.y0, y1: A.y1, vmin: 0, vmax: 130, tmin: 0, tmax: XMAX })
  const pb = panel({ x0: AX, x1: X1, y0: B.y0, y1: B.y1, vmin: 20, vmax: 60, tmin: 0, tmax: XMAX })
  const domainOf = (tv) => (tv < VT1 ? DOMAIN.moderate : tv < VT2 ? DOMAIN.heavy : DOMAIN.severe)

  const bands = [
    [0, v1, DOMAIN.moderate, 'moderate'],
    [v1, v2, DOMAIN.heavy, 'heavy'],
    [v2, XMAX, DOMAIN.severe, 'severe'],
  ]
    .map(([a, b, c, lab]) => {
      const x = pa.sx(a)
      const w = pa.sx(b) - x
      return (
        `<rect x="${fmt(x)}" y="${A.y0}" width="${fmt(w)}" height="${B.y1 - A.y0}" fill="${c}" opacity=".05"/>` +
        `<rect x="${fmt(x)}" y="${A.y0 - 26}" width="${fmt(w)}" height="3" fill="${c}"/>` +
        `<text x="${fmt(x + w / 2)}" y="${A.y0 - 32}" font-family="${MONO}" font-size="9.5" letter-spacing=".1em" fill="${c}" text-anchor="middle">${lab}</text>`
      )
    })
    .join('')

  const veDots = t
    .map((tv, i) =>
      vo2[i] > XMAX ? '' :
      `<circle cx="${fmt(pa.sx(vo2[i]))}" cy="${fmt(pa.sy(ch('VE')[i]))}" r="2.1" fill="${domainOf(tv)}" fill-opacity=".62"/>`)
    .join('')

  const eqO2 = ch('VE/VO2')
  const eqCO2 = ch('VE/VCO2')
  const eqDots = t
    .map((tv, i) => {
      if (vo2[i] > XMAX) return ''
      const x = fmt(pb.sx(vo2[i]))
      return (
        (eqO2[i] <= 60 ? `<circle cx="${x}" cy="${fmt(pb.sy(eqO2[i]))}" r="1.9" fill="${BLUE}" fill-opacity=".5"/>` : '') +
        (eqCO2[i] <= 60 ? `<circle cx="${x}" cy="${fmt(pb.sy(eqCO2[i]))}" r="1.9" fill="${ACCENT_TEXT}" fill-opacity=".5"/>` : '')
      )
    })
    .join('')

  const marks = [[v1, 'VT1'], [v2, 'VT2']]
    .map(([v, name]) => {
      const x = pa.sx(v)
      return (
        `<line x1="${fmt(x)}" y1="${A.y0}" x2="${fmt(x)}" y2="${B.y1}" stroke="${L.strong}" stroke-width="1.4" stroke-dasharray="4 3"/>` +
        `<rect x="${fmt(x - 38)}" y="${A.y0 + 5}" width="76" height="17" rx="3" fill="${L.strong}"/>` +
        `<text x="${fmt(x)}" y="${A.y0 + 17}" font-family="${MONO}" font-size="9.5" fill="${L.bg}" text-anchor="middle">${name} ${v.toFixed(0)}</text>`
      )
    })
    .join('')

  const grids =
    [40, 80, 120].map((v) => gridline(AX, X1, pa.sy(v), v)).join('') +
    [30, 40, 50].map((v) => gridline(AX, X1, pb.sy(v), v)).join('')

  const ticks = [500, 1000, 1500, 2000]
    .map((v) => `<text x="${fmt(pa.sx(v))}" y="${B.y1 + 16}" font-family="${MONO}" font-size="9" fill="${L.faint}" text-anchor="middle">${v}</text>`)
    .join('')

  const key = (x, y, colour, text) =>
    `<circle cx="${x}" cy="${y}" r="3.4" fill="${colour}" fill-opacity=".75"/>` +
    `<text x="${x + 9}" y="${y + 3.4}" font-family="${MONO}" font-size="9.5" fill="${L.subtle}">${text}</text>`

  return svg(W, H,
    'Ventilation and the ventilatory equivalents against oxygen uptake, breath by breath, coloured by intensity domain, with the model thresholds marked',
    bands + grids + veDots + eqDots + marks +
      axisLabel(0, A.y0 - 8, 'Ventilation', 'start') +
      unitLabel(X1, A.y0 - 8, 'L/min') +
      axisLabel(0, B.y0 - 8, 'Ventilatory equivalents', 'start') +
      key(AX + 150, B.y0 - 11, BLUE, 'V̇E/V̇O₂') +
      key(AX + 232, B.y0 - 11, ACCENT_TEXT, 'V̇E/V̇CO₂') +
      ticks +
      `<text x="${fmt((AX + X1) / 2)}" y="${B.y1 + 30}" font-family="${SANS}" font-size="10.5" font-weight="500" fill="${L.subtle}" text-anchor="middle">V̇O₂ (mL/min)</text>`)
}

// ============================================================== 2.2  INTEGRITY
/**
 * Signal quality, which is a signal-processing question and is drawn as one.
 *
 * No intensity domains here on purpose: domains are physiology, and this page
 * is about whether the trace can be believed before any physiology is claimed.
 * What it shows is what conditioning has to deal with: a raw breath series, the
 * conditioned trace through it, the breaths a robust rule flags as outliers,
 * and where the engine placed the exercise phase.
 */
export function figIntegrity({ W = 670 } = {}) {
  const AX = 52
  const X1 = W - 6
  const PANELS = [
    { key: 'VE', label: 'Ventilation', unit: 'L/min', max: 130, ticks: [40, 80, 120] },
    { key: 'VO2', label: 'Oxygen uptake', unit: 'mL/min', max: 2600, ticks: [1000, 2000] },
  ]
  const PH = 118
  const GAP = 44
  const TOP = 42
  const H = TOP + PANELS.length * (PH + GAP) + 4

  // The engine reported that 37 resting samples were dropped before the
  // substrate windows were taken. That boundary is the start of exercise as
  // far as this recording is concerned, so it is drawn rather than guessed.
  const restEnd = t[37]

  /** Rolling median, and the robust deviation from it. */
  const rollingMedian = (y, k = 9) =>
    y.map((_, i) => {
      const a = Math.max(0, i - (k >> 1))
      const b = Math.min(y.length, i + (k >> 1) + 1)
      return [...y.slice(a, b)].sort((p, q) => p - q)[(b - a) >> 1]
    })

  const panels = PANELS.map((cfg, pi) => {
    const y0 = TOP + pi * (PH + GAP)
    const y1 = y0 + PH
    const v = ch(cfg.key)
    const med = rollingMedian(v)
    const resid = v.map((x, i) => Math.abs(x - med[i]))
    const sorted = [...resid].sort((a, b) => a - b)
    const mad = sorted[sorted.length >> 1] || 1
    const p = panel({ x0: AX, x1: X1, y0, y1, vmin: 0, vmax: cfg.max, tmin: 0, tmax: TEND })

    const rest =
      `<rect x="${AX}" y="${y0}" width="${fmt(p.sx(restEnd) - AX)}" height="${PH}" fill="${L.surface}" opacity=".7"/>` +
      `<text x="${fmt((AX + p.sx(restEnd)) / 2)}" y="${y0 + 13}" font-family="${MONO}" font-size="8.5" fill="${L.faint}" text-anchor="middle">rest, excluded</text>` +
      `<line x1="${fmt(p.sx(restEnd))}" y1="${y0}" x2="${fmt(p.sx(restEnd))}" y2="${y1}" stroke="${L.faint}" stroke-width="1" stroke-dasharray="3 3"/>` +
      (pi === 0
        ? `<text x="${fmt(p.sx(restEnd) + 6)}" y="${y0 + 13}" font-family="${MONO}" font-size="8.5" fill="${L.subtle}">exercise, ${restEnd} to ${TEND} s</text>`
        : '')

    const grids = cfg.ticks.map((tv) => gridline(AX, X1, p.sy(tv), tv)).join('')
    const dots = v
      .map((x, i) => `<circle cx="${fmt(p.sx(t[i]))}" cy="${fmt(p.sy(x))}" r="1.7" fill="${L.faint}" fill-opacity=".55"/>`)
      .join('')
    const line = p.line(t, med, L.strong, 1.6)
    const flags = v
      .map((x, i) =>
        resid[i] > 4 * mad
          ? `<circle cx="${fmt(p.sx(t[i]))}" cy="${fmt(p.sy(x))}" r="4.2" fill="none" stroke="${WARN}" stroke-width="1.4"/>`
          : '')
      .join('')
    const nFlagged = resid.filter((r) => r > 4 * mad).length

    const ticks = pi === PANELS.length - 1
      ? [0, 200, 400, 600, 800].map((tv) =>
          `<text x="${fmt(p.sx(tv))}" y="${y1 + 15}" font-family="${MONO}" font-size="9" fill="${L.faint}" text-anchor="middle">${tv}</text>`).join('') +
        unitLabel(X1, y1 + 15, 'seconds')
      : ''

    return (
      rest + grids + dots + line + flags +
      axisLabel(0, y0 - 8, cfg.label, 'start') +
      unitLabel(X1, y0 - 8, cfg.unit) +
      `<text x="${fmt(X1)}" y="${y1 + 15}" font-family="${MONO}" font-size="8.5" fill="${WARN}" text-anchor="end">${pi === 1 ? '' : nFlagged + ' breaths beyond 4 MAD'}</text>` +
      ticks
    )
  }).join('')

  return svg(W, H,
    'Two raw breath series with the conditioned trace through them, the breaths a robust rule flags as outliers, and the excluded resting phase',
    panels)
}

// ============================================================== 2.4  OSCILLATION
export function figOscillation({ W = 670, COMPACT = false } = {}) {
  const AX = 46
  const X1 = W - 6
  const A = COMPACT ? { y0: 44, y1: 116 } : { y0: 46, y1: 170 }
  const B = COMPACT ? { y0: 148, y1: 214 } : { y0: 208, y1: 312 }
  const H = B.y1 + 30
  const ev = api.eov.event
  const T0 = 520
  const T1 = 700

  const idx = t.map((v, i) => [v, i]).filter(([v]) => v >= T0 && v <= T1).map(([, i]) => i)
  const tw = idx.map((i) => t[i])
  const ve = idx.map((i) => ch('VE')[i])
  const co2 = idx.map((i) => ch('PetCO2')[i])

  const pa = panel({ x0: AX, x1: X1, y0: A.y0, y1: A.y1, vmin: 35, vmax: 80, tmin: T0, tmax: T1 })
  const pb = panel({ x0: AX, x1: X1, y0: B.y0, y1: B.y1, vmin: 30, vmax: 38, tmin: T0, tmax: T1 })

  const evX = pa.sx(ev.t_start)
  const evW = pa.sx(ev.t_end) - evX
  const band =
    `<rect x="${fmt(evX)}" y="${A.y0}" width="${fmt(evW)}" height="${B.y1 - A.y0}" fill="${WARN}" opacity="0.07"/>` +
    `<rect x="${fmt(evX)}" y="${A.y0 - 26}" width="${fmt(evW)}" height="3" fill="${WARN}"/>` +
    `<text x="${fmt(evX + evW / 2)}" y="${A.y0 - 32}" font-family="${MONO}" font-size="9.5" letter-spacing=".08em" fill="${WARN}" text-anchor="middle">flagged, not graded</text>`

  const grids =
    [40, 55, 70].map((v) => gridline(AX, X1, pa.sy(v), v)).join('') +
    [31, 34, 37].map((v) => gridline(AX, X1, pb.sy(v), v)).join('')

  const ticks = [540, 580, 620, 660]
    .map((v) => `<text x="${fmt(pa.sx(v))}" y="${B.y1 + 16}" font-family="${MONO}" font-size="9" fill="${L.faint}" text-anchor="middle">${v}</text>`)
    .join('')

  // The period, drawn to scale so the reader can measure it off the page.
  const pStart = ev.t_start + 4
  const per =
    `<line x1="${fmt(pa.sx(pStart))}" y1="${A.y0 + 12}" x2="${fmt(pa.sx(pStart + ev.period_peak_s))}" y2="${A.y0 + 12}" stroke="${L.strong}" stroke-width="1"/>` +
    `<line x1="${fmt(pa.sx(pStart))}" y1="${A.y0 + 8}" x2="${fmt(pa.sx(pStart))}" y2="${A.y0 + 16}" stroke="${L.strong}" stroke-width="1"/>` +
    `<line x1="${fmt(pa.sx(pStart + ev.period_peak_s))}" y1="${A.y0 + 8}" x2="${fmt(pa.sx(pStart + ev.period_peak_s))}" y2="${A.y0 + 16}" stroke="${L.strong}" stroke-width="1"/>` +
    `<text x="${fmt(pa.sx(pStart + ev.period_peak_s) + 6)}" y="${A.y0 + 15.5}" font-family="${MONO}" font-size="9.5" fill="${L.strong}">${fmt(ev.period_peak_s, 0)} s</text>`

  return svg(
    W,
    H,
    'Ventilation and end-tidal carbon dioxide through the flagged oscillation, with carbon dioxide moving in antiphase',
    band +
      grids +
      pa.line(tw, ve, BLUE) +
      pb.line(tw, co2, ACCENT_TEXT) +
      per +
      axisLabel(AX - 8, A.y0 - 8, 'V̇E') +
      unitLabel(X1, A.y0 - 8, 'L/min') +
      axisLabel(AX - 8, B.y0 - 8, 'PetCO₂') +
      unitLabel(X1, B.y0 - 8, 'mmHg') +
      unitLabel(X1, B.y1 + 16, 'seconds') +
      ticks
  )
}

// ============================================================== 2.5  SUBSTRATE
export function figSubstrate({ W = 670 } = {}) {
  const AX = 58
  const X1 = W - 6
  // Three panels on one intensity axis. The gases go on top because they are
  // where the fat number comes from and where it stops being a measurement:
  // once carbon dioxide output passes oxygen uptake, the stoichiometry is gone.
  const G = { y0: 44, y1: 138 }
  const A = { y0: 182, y1: 276 }
  const B = { y0: 316, y1: 402 }
  const H = B.y1 + 46
  const s = api.substrate
  const w = s.windows
  const XMIN = 38
  const XMAX = 102

  const pg = panel({ x0: AX, x1: X1, y0: G.y0, y1: G.y1, vmin: 0.8, vmax: 3.0, tmin: XMIN, tmax: XMAX })
  const pa = panel({ x0: AX, x1: X1, y0: A.y0, y1: A.y1, vmin: -0.9, vmax: 0.3, tmin: XMIN, tmax: XMAX })
  const pb = panel({ x0: AX, x1: X1, y0: B.y0, y1: B.y1, vmin: 0, vmax: 5.5, tmin: XMIN, tmax: XMAX })

  const boundX = pg.sx(w.find((d) => !d.fat_valid).pct_vo2peak)
  const bound =
    `<rect x="${fmt(boundX)}" y="${G.y0}" width="${fmt(X1 - boundX)}" height="${B.y1 - G.y0}" fill="${WARN}" opacity=".055"/>` +
    `<line x1="${fmt(boundX)}" y1="${G.y0 - 26}" x2="${fmt(boundX)}" y2="${B.y1}" stroke="${WARN}" stroke-width="1" stroke-dasharray="4 3"/>` +
    `<rect x="${fmt(boundX)}" y="${G.y0 - 26}" width="${fmt(X1 - boundX)}" height="3" fill="${WARN}"/>` +
    `<text x="${fmt(boundX + 7)}" y="${G.y0 - 32}" font-family="${MONO}" font-size="9.5" fill="${WARN}">V̇CO₂ above V̇O₂: RER over 1.0, fat becomes a bound</text>`

  const grids =
    [1, 2, 3].map((v) => gridline(AX, X1, pg.sy(v), v)).join('') +
    [-0.8, -0.4, 0, 0.2].map((v) => gridline(AX, X1, pa.sy(v), v)).join('') +
    [0, 2, 4].map((v) => gridline(AX, X1, pb.sy(v), v)).join('')
  const zero = `<line x1="${AX}" y1="${fmt(pa.sy(0))}" x2="${X1}" y2="${fmt(pa.sy(0))}" stroke="${L.surface}" stroke-width="1.5"/>`

  const ticks = [40, 50, 60, 70, 80, 90, 100]
    .map((v) => `<text x="${fmt(pg.sx(v))}" y="${B.y1 + 16}" font-family="${MONO}" font-size="9" fill="${L.faint}" text-anchor="middle">${v}</text>`)
    .join('')

  const dot = (pnl, d, key, colour, open, r = 4.5) =>
    `<circle cx="${fmt(pnl.sx(d.pct_vo2peak))}" cy="${fmt(pnl.sy(d[key]))}" r="${r}" fill="${open ? L.bg : colour}" stroke="${colour}" stroke-width="2"/>`

  const ordered = [...w].sort((a, b) => a.pct_vo2peak - b.pct_vo2peak)
  const gasLine = (key, colour) =>
    `<path d="M ${ordered.map((d) => `${fmt(pg.sx(d.pct_vo2peak))} ${fmt(pg.sy(d[key]))}`).join(' L ')}" fill="none" stroke="${colour}" stroke-width="1.4" opacity=".55"/>`

  const gases =
    gasLine('vo2', BLUE) + gasLine('vco2', ACCENT_TEXT) +
    w.map((d) => dot(pg, d, 'vo2', BLUE, false, 3.6)).join('') +
    w.map((d) => dot(pg, d, 'vco2', ACCENT_TEXT, false, 3.6)).join('')

  const fatDots = w.map((d) => dot(pa, d, 'fat_g_min', ACCENT_TEXT, !d.fat_valid)).join('')
  const choDots = w.map((d) => dot(pb, d, 'cho_g_min', BLUE, false)).join('')

  const fm = s.fatmax
  const fx = pa.sx(fm.pct_vo2peak)
  const fy = pa.sy(fm.fat_g_min)
  const fatmax =
    `<line x1="${fmt(fx)}" y1="${G.y0}" x2="${fmt(fx)}" y2="${B.y1}" stroke="${L.strong}" stroke-width="1.4" stroke-dasharray="4 3"/>` +
    `<circle cx="${fmt(fx)}" cy="${fmt(fy)}" r="6.5" fill="none" stroke="${L.strong}" stroke-width="2"/>` +
    `<rect x="${fmt(fx + 10)}" y="${fmt(pa.sy(-0.55))}" width="108" height="18" rx="3" fill="${L.strong}"/>` +
    `<text x="${fmt(fx + 18)}" y="${fmt(pa.sy(-0.55) + 13)}" font-family="${MONO}" font-size="10" fill="${L.bg}">FATMAX ${fmt(fm.pct_vo2peak)} %</text>`

  const key = (x, y, colour, text) =>
    `<circle cx="${x}" cy="${y}" r="3.6" fill="${colour}"/>` +
    `<text x="${x + 9}" y="${y + 3.4}" font-family="${MONO}" font-size="9.5" fill="${L.subtle}">${text}</text>`

  return svg(W, H,
    'Oxygen uptake and carbon dioxide output, then fat and carbohydrate oxidation, all against percentage of peak oxygen uptake, with FATMAX marked and the region above RER 1.0 shaded',
    bound + grids + zero + gases + fatDots + choDots + fatmax +
      axisLabel(0, G.y0 - 8, 'Gas exchange', 'start') +
      key(AX + 96, G.y0 - 11, BLUE, 'V̇O₂') +
      key(AX + 150, G.y0 - 11, ACCENT_TEXT, 'V̇CO₂') +
      unitLabel(X1, G.y0 - 8, 'L/min') +
      axisLabel(0, A.y0 - 8, 'Fat', 'start') +
      unitLabel(X1, A.y0 - 8, 'g/min') +
      axisLabel(0, B.y0 - 8, 'Carbohydrate', 'start') +
      unitLabel(X1, B.y0 - 8, 'g/min') +
      `<text x="${fmt((AX + X1) / 2)}" y="${B.y1 + 38}" font-family="${SANS}" font-size="10.5" font-weight="500" fill="${L.subtle}" text-anchor="middle">Percentage of peak V̇O₂</text>` +
      ticks)
}

// ============================================================== 1.5  THE LOOP
export function figLoop({ W = 670 } = {}) {
  const H = 218
  const NODES = [
    ['Cohort', 'a laboratory\ncontributes tests'],
    ['Canonicalise', `${CORPUS.formats} formats into\none representation`],
    ['Label', 'experts mark\nthe thresholds'],
    ['Train', 'a model per\ncohort and family'],
    ['Evaluate', 'held-out cohort,\nboth axes'],
    ['Promote', 'only past\nthe gate'],
    ['Serve', 'the API, and\nthe next cohort'],
  ]
  const n = NODES.length
  const boxW = 82
  const gap = (W - 12 - n * boxW) / (n - 1)
  const Y = 62
  const boxH = 56

  const boxes = NODES.map(([title, sub], i) => {
    const x = 6 + i * (boxW + gap)
    const lines = sub.split('\n')
    return (
      `<rect x="${fmt(x)}" y="${Y}" width="${boxW}" height="${boxH}" rx="7" fill="${L.bg}" stroke="${i === 4 ? GREEN : L.line}" stroke-width="${i === 4 ? 2 : 1}"/>` +
      `<text x="${fmt(x + boxW / 2)}" y="${Y + 21}" font-family="${SANS}" font-size="11" font-weight="600" fill="${L.strong}" text-anchor="middle">${title}</text>` +
      lines
        .map(
          (ln, j) =>
            `<text x="${fmt(x + boxW / 2)}" y="${Y + 34 + j * 11}" font-family="${SANS}" font-size="8.5" fill="${L.subtle}" text-anchor="middle">${ln}</text>`
        )
        .join('')
    )
  }).join('')

  const arrows = NODES.slice(0, -1)
    .map((_, i) => {
      const x = 6 + i * (boxW + gap) + boxW
      return `<line x1="${fmt(x + 3)}" y1="${Y + boxH / 2}" x2="${fmt(x + gap - 6)}" y2="${Y + boxH / 2}" stroke="${L.faint}" stroke-width="1.2" marker-end="url(#ar)"/>`
    })
    .join('')

  const lastX = 6 + (n - 1) * (boxW + gap) + boxW / 2
  const firstX = 6 + boxW / 2
  const returnY = Y + boxH + 44
  const back =
    `<path d="M ${fmt(lastX)} ${Y + boxH} L ${fmt(lastX)} ${returnY} L ${fmt(firstX)} ${returnY} L ${fmt(firstX)} ${Y + boxH + 4}" fill="none" stroke="${L.faint}" stroke-width="1.2" stroke-dasharray="4 3" marker-end="url(#ar)"/>` +
    `<text x="${fmt((lastX + firstX) / 2)}" y="${returnY - 7}" font-family="${SANS}" font-size="9.5" fill="${L.subtle}" text-anchor="middle">what the engine cannot yet do sets what is collected next</text>`

  const evalX = 6 + 4 * (boxW + gap) + boxW / 2
  const pubY = 22
  const publish =
    `<path d="M ${fmt(evalX)} ${Y} L ${fmt(evalX)} ${pubY + 16}" fill="none" stroke="${GREEN}" stroke-width="1.4" marker-end="url(#arg)"/>` +
    // Width from the label rather than a guess, so the pill always contains it.
    (() => {
      const label = 'Manuscript, peer review'
      const w = label.length * 5.9 + 26
      return (
        `<rect x="${fmt(evalX - w / 2)}" y="${pubY - 7}" width="${fmt(w)}" height="25" rx="6" fill="${GREEN}" opacity=".12"/>` +
        `<text x="${fmt(evalX)}" y="${pubY + 9}" font-family="${SANS}" font-size="10.5" font-weight="600" fill="${ACCENT_TEXT}" text-anchor="middle">${label}</text>`
      )
    })()

  const defs =
    `<defs>` +
    `<marker id="ar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="${L.faint}"/></marker>` +
    `<marker id="arg" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="${GREEN}"/></marker>` +
    `</defs>`

  return svg(W, H, 'The development loop: cohort, canonicalise, label, train, evaluate, promote, serve, and back to the next cohort, with peer review branching from evaluation', defs + publish + arrows + boxes + back)
}

// ============================================================== 2.4  WAVELET MAP
/**
 * The wavelet map, drawn the way the Oxynet application draws it: time against
 * log period, coloured by oscillation strength, with the detected episode boxed
 * and dashed because it was flagged rather than graded.
 *
 * See the note at the top of wavelet.mjs: the raster is computed here from the
 * same ventilation trace, the box and everything quantitative about it came
 * back from the API, and the caption has to say so.
 */
const SEPDOT = '·'
export function figWavelet({ W = 670, H: HEIGHT = 276 } = {}) {
  const AX = 46
  const X1 = W - 6
  const P = { y0: 30, y1: HEIGHT - 62 }
  const H = HEIGHT
  const ev = api.eov.event
  const PLO = 15
  const PHI = 200
  const periods = logPeriods(PLO, PHI, 44)
  const power = morletPower(t, ch('VE'), { dt: 2, periods })
  const uri = rasterURI(power)

  const tMax = (power.n - 1) * power.dt
  const xOf = (v) => AX + (v / tMax) * (X1 - AX)
  const lp = (v) => Math.log(v)
  const yOf = (v) => P.y0 + ((lp(PHI) - lp(v)) / (lp(PHI) - lp(PLO))) * (P.y1 - P.y0)

  const pTicks = [20, 30, 50, 80, 120, 200]
    .map((p) =>
      `<line x1="${AX - 3}" y1="${fmt(yOf(p))}" x2="${AX}" y2="${fmt(yOf(p))}" stroke="${L.faint}" stroke-width="1"/>` +
      `<text x="${AX - 7}" y="${fmt(yOf(p) + 3)}" font-family="${MONO}" font-size="9" fill="${L.faint}" text-anchor="end">${p}</text>`)
    .join('')

  const tTicks = [0, 200, 400, 600, 800]
    .map((v) =>
      `<line x1="${fmt(xOf(v))}" y1="${P.y1}" x2="${fmt(xOf(v))}" y2="${P.y1 + 3}" stroke="${L.faint}" stroke-width="1"/>` +
      `<text x="${fmt(xOf(v))}" y="${P.y1 + 15}" font-family="${MONO}" font-size="9" fill="${L.faint}" text-anchor="middle">${v}</text>`)
    .join('')

  // The episode, exactly as the application boxes it: dashed because not graded.
  const bx = xOf(ev.t_start)
  const bw = xOf(ev.t_end) - bx
  const by = yOf(ev.period_hi_s)
  const bh = yOf(ev.period_lo_s) - by
  const box = (() => {
    // The episode sits low on a log period axis, so the label goes ABOVE the
    // box, and its width comes from the text rather than a guess.
    const label = `${ev.t_start.toFixed(0)} to ${ev.t_end.toFixed(0)} s ${SEPDOT} ${ev.period_lo_s.toFixed(0)} to ${ev.period_hi_s.toFixed(0)} s ${SEPDOT} not graded`
    const lw = label.length * 5.5 + 18
    const lx = Math.max(AX + 2, Math.min(bx + bw / 2 - lw / 2, X1 - lw - 2))
    const ly = by - 26
    return (
      `<rect x="${fmt(bx)}" y="${fmt(by)}" width="${fmt(bw)}" height="${fmt(bh)}" fill="none" stroke="${WARN_DARK}" stroke-width="1.8" stroke-dasharray="5 3"/>` +
      `<line x1="${fmt(bx + bw / 2)}" y1="${fmt(by)}" x2="${fmt(bx + bw / 2)}" y2="${fmt(ly + 17)}" stroke="${WARN_DARK}" stroke-width="1"/>` +
      `<rect x="${fmt(lx)}" y="${fmt(ly)}" width="${fmt(lw)}" height="17" rx="3" fill="${L.strong}"/>` +
      `<text x="${fmt(lx + lw / 2)}" y="${fmt(ly + 12)}" font-family="${MONO}" font-size="9" fill="${L.bg}" text-anchor="middle">${label}</text>`
    )
  })()

  // The band the graded definitions cover, so the reader can see the episode
  // sitting outside it rather than being told.
  const gLo = yOf(140)
  const gHi = yOf(40)
  const band =
    `<line x1="${AX}" y1="${fmt(gLo)}" x2="${X1}" y2="${fmt(gLo)}" stroke="${L.bg}" stroke-width="1" stroke-dasharray="3 3" opacity=".7"/>` +
    `<line x1="${AX}" y1="${fmt(gHi)}" x2="${X1}" y2="${fmt(gHi)}" stroke="${L.bg}" stroke-width="1" stroke-dasharray="3 3" opacity=".7"/>` +
    `<rect x="${AX + 6}" y="${fmt(gLo - 15)}" width="228" height="14" rx="3" fill="#00000099"/>` +
    `<text x="${AX + 12}" y="${fmt(gLo - 5)}" font-family="${MONO}" font-size="9" fill="#ffffff">the 40 to 140 s band the definitions cover</text>`

  const barW = 120
  const barX = AX
  const barY = P.y1 + 34
  const bar =
    `<defs><linearGradient id="magma" x1="0" y1="0" x2="1" y2="0">` +
    Array.from({ length: 7 }, (_, i) => {
      const [r, g, b] = magma(i / 6)
      return `<stop offset="${((i / 6) * 100).toFixed(0)}%" stop-color="rgb(${r | 0},${g | 0},${b | 0})"/>`
    }).join('') +
    `</linearGradient></defs>` +
    `<rect x="${barX}" y="${barY}" width="${barW}" height="7" rx="2" fill="url(#magma)"/>` +
    `<text x="${barX + barW + 8}" y="${barY + 7}" font-family="${MONO}" font-size="9" fill="${L.faint}">oscillation strength, weak to strong</text>`

  return svg(
    W,
    H,
    'A wavelet map of ventilation, time against oscillation period, with the detected episode boxed and the band the graded definitions cover marked',
    `<image href="${uri}" x="${AX}" y="${P.y0}" width="${fmt(X1 - AX)}" height="${P.y1 - P.y0}" preserveAspectRatio="none"/>` +
      `<rect x="${AX}" y="${P.y0}" width="${fmt(X1 - AX)}" height="${P.y1 - P.y0}" fill="none" stroke="${L.line}" stroke-width="1"/>` +
      band +
      box +
      pTicks +
      tTicks +
      axisLabel(0, P.y0 - 8, 'Oscillation period', 'start') +
      unitLabel(X1, P.y0 - 8, 'seconds, log scale') +
      unitLabel(X1, P.y1 + 15, 'seconds') +
      bar
  )
}

// ============================================================== 1.3  THE LAYER
/**
 * Where the engine sits: the workflow as it runs today beside the same
 * workflow with a computational layer in it. This is the one diagram an
 * integrator should be able to understand without reading anything else.
 */
export function figLayer({ W = 670 } = {}) {
  const colW = 286
  const gapX = W - 14 - colW - colW
  const H = 366
  const boxH = 34
  const gapY = 16
  const top = 46

  const column = (x, title, tone, steps) => {
    const accent = tone === 'accent'
    let out =
      `<text x="${x}" y="26" font-family="${MONO}" font-size="9.5" letter-spacing=".16em" fill="${accent ? ACCENT_TEXT : L.faint}">${title}</text>`
    steps.forEach((s, i) => {
      const y = top + i * (boxH + gapY)
      const isEngine = s.engine
      const fill = isEngine ? '#00dc820f' : L.bg
      const stroke = isEngine ? GREEN : L.line
      out +=
        `<rect x="${x}" y="${y}" width="${colW}" height="${boxH}" rx="7" fill="${fill}" stroke="${stroke}" stroke-width="${isEngine ? 2 : 1}"/>` +
        `<text x="${x + 14}" y="${y + (s.note ? 15 : 21)}" font-family="${SANS}" font-size="${isEngine ? 12.5 : 11.5}" font-weight="${isEngine ? 700 : 500}" fill="${isEngine ? ACCENT_TEXT : L.strong}">${s.label}</text>` +
        (s.note
          ? `<text x="${x + 14}" y="${y + 27}" font-family="${SANS}" font-size="9" fill="${L.subtle}">${s.note}</text>`
          : '') +
        (s.flag
          ? `<text x="${x + colW - 12}" y="${y + 21}" font-family="${MONO}" font-size="8.5" fill="${WARN}" text-anchor="end">${s.flag}</text>`
          : '')
      if (i < steps.length - 1) {
        const ax = x + colW / 2
        out += `<line x1="${ax}" y1="${y + boxH}" x2="${ax}" y2="${y + boxH + gapY - 3}" stroke="${L.faint}" stroke-width="1.1" marker-end="url(#lay)"/>`
      }
    })
    return out
  }

  const frame =
    `<rect x="${colW + gapX - 14}" y="6" width="${colW + 27}" height="${H - 12}" rx="12" fill="#00dc8207" stroke="${GREEN}" stroke-width="1.5"/>`

  const left = column(0, 'HOW IT USUALLY WORKS', 'muted', [
    { label: 'Exercise test', note: 'the cart records it' },
    { label: 'Acquisition software', note: 'vendor format, vendor conventions' },
    { label: 'Export', note: `a file, in one of ${CORPUS.formats} dialects`, flag: 'heterogeneous' },
    { label: 'A person reads it', note: 'plots, judgment, experience', flag: 'operator dependent' },
    { label: 'Thresholds by eye', note: 'the number, not the reasoning', flag: 'hard to reproduce' },
    { label: 'Report', note: 'peak oxygen uptake, and little else' },
  ])

  const right = column(colW + gapX, 'WITH OXYNET IN THE LOOP', 'accent', [
    { label: 'Exercise test', note: 'unchanged' },
    { label: 'Acquisition software', note: 'unchanged' },
    { label: 'Oxynet', note: 'parse, condition, measure, describe', engine: true },
    { label: 'Structured measurements', note: 'one shape, whatever produced the file' },
    { label: 'Your software', note: 'your interface, your report, your brand' },
    { label: 'Report, database, API, agent', note: 'the same numbers, everywhere' },
  ])

  const defs =
    `<defs><marker id="lay" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto">` +
    `<path d="M0 0 L8 4 L0 8 z" fill="${L.faint}"/></marker></defs>`

  return svg(W, H, 'The exercise testing workflow today, beside the same workflow with Oxynet as a computational layer inside it', defs + frame + left + right)
}

// ============================================================== SIGNATURE
/**
 * The signature view: carbon dioxide output against oxygen uptake, breath by
 * breath, on the dark ground, with every breath coloured by the intensity
 * domain the model assigned it.
 *
 * Square, with identical scales on both axes, because the interesting thing
 * about this plot is the slope: below the first threshold carbon dioxide rises
 * more slowly than oxygen uptake, above it more steeply. A non-square panel or
 * unequal scales makes that break an artefact of the aspect ratio.
 */
const DARK_DOMAIN = { moderate: '#10b981', heavy: '#f59e0b', severe: '#f43f5e' }

export function figSignature({ S = 386 } = {}) {
  const AX = 52
  const PAD = 16
  const X1 = S - PAD
  const Y0 = 30
  const Y1 = S - 46
  // One scale for both axes, so a slope of one is a line at 45 degrees.
  const MAX = 3000
  const { vt1_time_s: VT1, vt2_time_s: VT2, vt1_vo2_ml_min: v1, vt2_vo2_ml_min: v2 } = api.vt.findings
  const vo2 = ch('VO2')
  const vco2 = ch('VCO2')

  const sx = (v) => AX + (v / MAX) * (X1 - AX)
  const sy = (v) => Y1 - (v / MAX) * (Y1 - Y0)
  const domainOf = (tv) => (tv < VT1 ? 'moderate' : tv < VT2 ? 'heavy' : 'severe')

  const bands =
    `<rect x="${AX}" y="${Y0}" width="${fmt(sx(v1) - AX)}" height="${Y1 - Y0}" fill="${DARK_DOMAIN.moderate}" opacity=".05"/>` +
    `<rect x="${fmt(sx(v1))}" y="${Y0}" width="${fmt(sx(v2) - sx(v1))}" height="${Y1 - Y0}" fill="${DARK_DOMAIN.heavy}" opacity=".05"/>` +
    `<rect x="${fmt(sx(v2))}" y="${Y0}" width="${fmt(X1 - sx(v2))}" height="${Y1 - Y0}" fill="${DARK_DOMAIN.severe}" opacity=".05"/>`

  const grid = [1000, 2000, 3000]
    .map((v) =>
      `<line x1="${fmt(sx(v))}" y1="${Y0}" x2="${fmt(sx(v))}" y2="${Y1}" stroke="#242424" stroke-width=".8"/>` +
      `<text x="${fmt(sx(v))}" y="${Y1 + 14}" text-anchor="middle" fill="#666" font-size="8.5" font-family="${MONO}">${v}</text>` +
      `<line x1="${AX}" y1="${fmt(sy(v))}" x2="${X1}" y2="${fmt(sy(v))}" stroke="#242424" stroke-width=".8"/>` +
      `<text x="${AX - 7}" y="${fmt(sy(v) + 3)}" text-anchor="end" fill="#666" font-size="8.5" font-family="${MONO}">${v}</text>`)
    .join('')

  // The line of identity. Where the cloud leaves it is the physiology.
  const identity = `<line x1="${fmt(sx(0))}" y1="${fmt(sy(0))}" x2="${fmt(sx(MAX))}" y2="${fmt(sy(MAX))}" stroke="#333333" stroke-width="1" stroke-dasharray="3 4"/>`

  const dots = t
    .map((tv, i) => {
      if (vo2[i] > MAX || vco2[i] > MAX) return ''
      const c = DARK_DOMAIN[domainOf(tv)]
      const x = fmt(sx(vo2[i]))
      const y = fmt(sy(vco2[i]))
      const r = 2.3 + (i / t.length) * 1.6
      return (
        `<circle cx="${x}" cy="${y}" r="${(r * 1.7).toFixed(2)}" fill="#ffffff" fill-opacity=".07"/>` +
        `<circle cx="${x}" cy="${y}" r="${r.toFixed(2)}" fill="${c}" fill-opacity=".55"/>`
      )
    })
    .join('')

  const marks = [[v1, 'VT1', DARK_DOMAIN.moderate], [v2, 'VT2', DARK_DOMAIN.severe]]
    .map(([v, label, c]) =>
      `<line x1="${fmt(sx(v))}" y1="${Y0}" x2="${fmt(sx(v))}" y2="${Y1}" stroke="${c}" stroke-width="1" stroke-dasharray="4 3" opacity=".6"/>` +
      `<text x="${fmt(sx(v))}" y="${Y0 - 7}" text-anchor="middle" fill="${c}" font-size="9.5" font-family="${MONO}">${label}</text>`)
    .join('')

  return `<div style="background:#0d0d0d;border-radius:12px;width:${S}px;margin:0 auto">
  ${svg(S, S, 'Carbon dioxide output against oxygen uptake, breath by breath on identical scales, each breath coloured by the intensity domain the model assigned',
    bands + grid + identity + dots + marks +
    `<text x="${fmt((AX + X1) / 2)}" y="${S - 10}" text-anchor="middle" fill="#888" font-size="9.5" font-family="${MONO}">V̇O₂ (mL/min)</text>` +
    `<text x="13" y="${fmt((Y0 + Y1) / 2)}" text-anchor="middle" fill="#888" font-size="9.5" font-family="${MONO}" transform="rotate(-90,13,${fmt((Y0 + Y1) / 2)})">V̇CO₂ (mL/min)</text>` +
    `<text x="${X1}" y="${Y0 - 7}" text-anchor="end" fill="#00dc82" font-size="10" font-family="${MONO}" font-weight="600">Oxynet</text>`)}
  </div>`
}

// ============================================================== TRANSFORM
/**
 * The story in one strip: a file arrives as an undifferentiated cloud of
 * breaths, and comes back structured. The latency between them is the real
 * one the API reported.
 */
export function figTransform({ OUTER = 670, PAD = 16 } = {}) {
  const W = OUTER - PAD * 2
  const H = 200
  const panelW = (W - 2 * 46) / 3
  const panelH = 148
  const Y = 26
  const { vt1_time_s: VT1, vt2_time_s: VT2, vt1_vo2_ml_min: v1 } = api.vt.findings
  const vo2 = ch('VO2')
  const vco2 = ch('VCO2')
  const MAX = 3000

  const scatter = (x0, coloured) => {
    const sx = (v) => x0 + 10 + (v / MAX) * (panelW - 20)
    const sy = (v) => Y + panelH - 12 - (v / MAX) * (panelH - 26)
    return t
      .map((tv, i) => {
        if (vo2[i] > MAX || vco2[i] > MAX) return ''
        const c = coloured
          ? DARK_DOMAIN[tv < VT1 ? 'moderate' : tv < VT2 ? 'heavy' : 'severe']
          : '#6b6b6b'
        return `<circle cx="${fmt(sx(vo2[i]))}" cy="${fmt(sy(vco2[i]))}" r="1.7" fill="${c}" fill-opacity="${coloured ? 0.7 : 0.5}"/>`
      })
      .join('')
  }

  const panel = (i, label, sub) => {
    const x = i * (panelW + 46)
    return (
      `<rect x="${fmt(x)}" y="${Y}" width="${fmt(panelW)}" height="${panelH}" rx="8" fill="#111111" stroke="#242424"/>` +
      `<text x="${fmt(x)}" y="${Y - 8}" font-family="${MONO}" font-size="8.5" letter-spacing=".14em" fill="${i === 1 ? '#00dc82' : '#8c8c8c'}">${label}</text>` +
      (sub ? `<text x="${fmt(x)}" y="${Y + panelH + 16}" font-family="${SANS}" font-size="9.5" fill="#8c8c8c">${sub}</text>` : '')
    )
  }

  const arrow = (i, label) => {
    const x = i * (panelW + 46) + panelW
    const cy = Y + panelH / 2
    return (
      `<line x1="${fmt(x + 10)}" y1="${cy}" x2="${fmt(x + 36)}" y2="${cy}" stroke="#00dc82" stroke-width="1.4" marker-end="url(#tr)"/>` +
      `<text x="${fmt(x + 23)}" y="${cy - 9}" text-anchor="middle" font-family="${MONO}" font-size="8" fill="#00dc82">${label}</text>`
    )
  }

  const periods = logPeriods(15, 200, 24)
  const uri = rasterURI(morletPower(t, ch('VE'), { dt: 2, periods }))
  const wx = 2 * (panelW + 46)

  const defs = `<defs><marker id="tr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#00dc82"/></marker></defs>`

  return `<div style="background:#0d0d0d;border-radius:12px;padding:14px ${PAD}px 8px">
  ${svg(W, H, 'A file of undifferentiated breaths, the same breaths classified into intensity domains, and the oscillation map of the same recording',
    defs +
      panel(0, 'RAW CPET', 'what you have') + scatter(0, false) +
      arrow(0, 'OXYNET') +
      panel(1, 'PHYSIOLOGICAL INTELLIGENCE', 'what you can get') + scatter(panelW + 46, true) +
      arrow(1, 'same call') +
      panel(2, 'AND WHAT WAS HIDDEN IN IT', 'without asking for it') +
      `<image href="${uri}" x="${fmt(wx + 8)}" y="${Y + 8}" width="${fmt(panelW - 16)}" height="${panelH - 16}" preserveAspectRatio="none"/>` +
      '')}
  </div>`
}

// ============================================================== PRODUCT VIEW
/**
 * A browser frame around a compact product view. The point of this figure is
 * recognition: a reader who has never seen Oxynet should look at it and know
 * immediately what kind of thing it is.
 */
export function figProductView({ W = 670 } = {}) {
  const H = 292
  const chromeH = 30
  const pad = 12
  const innerW = W - pad * 2
  const panelY = chromeH + pad
  const panelH = H - panelY - pad

  // A miniature of the signature scatter, and a strip of the wavelet map.
  const sc = { x: pad, y: panelY, w: innerW * 0.5 - 6, h: panelH }
  const wv = { x: pad + innerW * 0.5 + 6, y: panelY, w: innerW * 0.5 - 6, h: panelH * 0.52 }
  const tiles = { x: wv.x, y: wv.y + wv.h + 10, w: wv.w, h: panelH - wv.h - 10 }

  const { vt1_vo2_ml_min: v1, vt2_vo2_ml_min: v2 } = api.vt.findings
  const vo2 = ch('VO2')
  const vco2 = ch('VCO2')
  const XMAX = 2600
  const YMAX = 3000
  const sx = (v) => sc.x + 26 + (v / XMAX) * (sc.w - 34)
  const sy = (v) => sc.y + sc.h - 18 - (v / YMAX) * (sc.h - 30)
  const dom = (tv) => (tv < api.vt.findings.vt1_time_s ? 'moderate' : tv < api.vt.findings.vt2_time_s ? 'heavy' : 'severe')

  const mini = t
    .map((tv, i) => {
      if (vo2[i] > XMAX || vco2[i] > YMAX) return ''
      return `<circle cx="${fmt(sx(vo2[i]))}" cy="${fmt(sy(vco2[i]))}" r="1.9" fill="${DARK_DOMAIN[dom(tv)]}" fill-opacity=".65"/>`
    })
    .join('')

  const periods = logPeriods(15, 200, 26)
  const uri = rasterURI(morletPower(t, ch('VE'), { dt: 2, periods }))

  const tile = (i, label, value) => {
    const w = (tiles.w - 12) / 2
    const x = tiles.x + (i % 2) * (w + 12)
    const y = tiles.y + Math.floor(i / 2) * 40
    return (
      `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="34" rx="6" fill="#161616" stroke="#242424"/>` +
      `<text x="${fmt(x + 9)}" y="${fmt(y + 13)}" font-family="${MONO}" font-size="6.5" letter-spacing=".1em" fill="#8c8c8c">${label}</text>` +
      `<text x="${fmt(x + 9)}" y="${fmt(y + 27)}" font-family="${SANS}" font-size="12" font-weight="600" fill="#cecece">${value}</text>`
    )
  }

  const chrome =
    `<rect x="0" y="0" width="${W}" height="${H}" rx="10" fill="#0d0d0d" stroke="#242424"/>` +
    `<line x1="0" y1="${chromeH}" x2="${W}" y2="${chromeH}" stroke="#242424"/>` +
    [0, 1, 2].map((i) => `<circle cx="${18 + i * 14}" cy="${chromeH / 2}" r="4" fill="#2a2a2a"/>`).join('') +
    `<rect x="66" y="${chromeH / 2 - 8}" width="240" height="16" rx="8" fill="#161616"/>` +
    `<text x="78" y="${chromeH / 2 + 4}" font-family="${MONO}" font-size="8.5" fill="#8c8c8c">app.oxynet.net</text>` +
    `<text x="${W - 16}" y="${chromeH / 2 + 4}" text-anchor="end" font-family="${MONO}" font-size="8.5" fill="#00dc82">Oxynet</text>`

  return svg(W, H, 'A browser window showing the Oxynet application: the intensity-domain scatter, the oscillation map, and the measured quantities beside them',
    chrome +
      `<rect x="${fmt(sc.x)}" y="${fmt(sc.y)}" width="${fmt(sc.w)}" height="${fmt(sc.h)}" rx="7" fill="#111111" stroke="#242424"/>` +
      `<rect x="${fmt(sx(0))}" y="${fmt(sc.y + 10)}" width="${fmt(sx(v1) - sx(0))}" height="${fmt(sc.h - 28)}" fill="${DARK_DOMAIN.moderate}" opacity=".05"/>` +
      `<rect x="${fmt(sx(v1))}" y="${fmt(sc.y + 10)}" width="${fmt(sx(v2) - sx(v1))}" height="${fmt(sc.h - 28)}" fill="${DARK_DOMAIN.heavy}" opacity=".05"/>` +
      `<rect x="${fmt(sx(v2))}" y="${fmt(sc.y + 10)}" width="${fmt(sx(XMAX) - sx(v2))}" height="${fmt(sc.h - 28)}" fill="${DARK_DOMAIN.severe}" opacity=".05"/>` +
      mini +
      `<text x="${fmt(sc.x + 10)}" y="${fmt(sc.y + 14)}" font-family="${MONO}" font-size="7" letter-spacing=".1em" fill="#8c8c8c">V̇CO₂ / V̇O₂ · DOMAINS</text>` +
      `<rect x="${fmt(wv.x)}" y="${fmt(wv.y)}" width="${fmt(wv.w)}" height="${fmt(wv.h)}" rx="7" fill="#111111" stroke="#242424"/>` +
      `<image href="${uri}" x="${fmt(wv.x + 4)}" y="${fmt(wv.y + 16)}" width="${fmt(wv.w - 8)}" height="${fmt(wv.h - 22)}" preserveAspectRatio="none"/>` +
      `<text x="${fmt(wv.x + 10)}" y="${fmt(wv.y + 12)}" font-family="${MONO}" font-size="7" letter-spacing=".1em" fill="#8c8c8c">VENTILATORY OSCILLATION MAP</text>` +
      tile(0, 'VT1', '1605 mL/min') +
      tile(1, 'VT2', '2029 mL/min') +
      tile(2, 'PEAK VO2', '2307 mL/min') +
      tile(3, 'FATMAX', '42.3 %')
  )
}

// ============================================================== LIFECYCLE
/** Research, development, deployment: the cycle, as three stages. */
export function figLifecycle({ W = 670 } = {}) {
  const H = 196
  const boxW = (W - 2 * 34) / 3
  const boxH = 108
  const Y = 30

  const stage = (i, num, title, items) => {
    const x = i * (boxW + 34)
    return (
      `<rect x="${fmt(x)}" y="${Y}" width="${fmt(boxW)}" height="${boxH}" rx="9" fill="#00dc8209" stroke="${GREEN}" stroke-width="1.4"/>` +
      `<text x="${fmt(x + 16)}" y="${Y + 22}" font-family="${MONO}" font-size="10" fill="${ACCENT_TEXT}">${num}</text>` +
      `<text x="${fmt(x + 16)}" y="${Y + 41}" font-family="${SANS}" font-size="15" font-weight="600" fill="${L.strong}">${title}</text>` +
      items
        .map((it, j) => `<text x="${fmt(x + 16)}" y="${Y + 61 + j * 14}" font-family="${SANS}" font-size="10.5" fill="${L.body}">${it}</text>`)
        .join('') +
      (i < 2
        ? `<line x1="${fmt(x + boxW + 6)}" y1="${Y + boxH / 2}" x2="${fmt(x + boxW + 28)}" y2="${Y + boxH / 2}" stroke="${L.faint}" stroke-width="1.2" marker-end="url(#lc)"/>`
        : '')
    )
  }

  const back =
    `<path d="M ${fmt(W - boxW / 2)} ${Y + boxH} L ${fmt(W - boxW / 2)} ${Y + boxH + 34} L ${fmt(boxW / 2)} ${Y + boxH + 34} L ${fmt(boxW / 2)} ${Y + boxH + 5}" fill="none" stroke="${GREEN}" stroke-width="1.4" stroke-dasharray="4 3" marker-end="url(#lcg)"/>` +
    `<text x="${fmt(W / 2)}" y="${Y + boxH + 29}" font-family="${SANS}" font-size="10.5" fill="${ACCENT_TEXT}" text-anchor="middle">what the product cannot yet do sets the next research question</text>`

  const defs =
    `<defs><marker id="lc" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="${L.faint}"/></marker>` +
    `<marker id="lcg" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="${GREEN}"/></marker></defs>`

  return svg(W, H, 'Research, development and deployment as one cycle, with the product feeding the next research question',
    defs +
      stage(0, '01', 'Research', ['Cohorts and expert labels', 'Model training and evaluation', 'Manuscript and peer review']) +
      stage(1, '02', 'Development', ['Gate, then promotion', 'Versioned, pinned models', 'Shipped to production']) +
      stage(2, '03', 'Deployment', ['API, MCP, Desktop, pyoxynet', 'Hosted or local', 'A product people use']) +
      back)
}

// ============================================================== PROBABILITIES
export const preds = JSON.parse(readFileSync(join(here, 'data/predictions.json'), 'utf8'))

/**
 * What the network actually emits: three class probabilities every second.
 * The thresholds are a detector run over these curves, not a separate model,
 * and this is the panel that shows it.
 */
export function figProbabilities({ W = 670 } = {}) {
  const AX = 46
  const X1 = W - 6
  const Y0 = 24
  const Y1 = 118
  const H = Y1 + 34
  const p = preds.predictions
  const tmax = p[p.length - 1][0]
  const sx = (v) => AX + (v / tmax) * (X1 - AX)
  const sy = (v) => Y1 - v * (Y1 - Y0)

  // Stacked, because the three sum to one and the eye should read the
  // transition rather than three curves crossing.
  const areas = [
    [1, DOMAIN.moderate, 'moderate'],
    [2, DOMAIN.heavy, 'heavy'],
    [3, DOMAIN.severe, 'severe'],
  ].map(([idx, colour]) => {
    const lower = p.map((r) => r.slice(1, idx).reduce((a, b) => a + b, 0))
    const upper = p.map((r) => r.slice(1, idx + 1).reduce((a, b) => a + b, 0))
    const top = p.map((r, i) => `${fmt(sx(r[0]))} ${fmt(sy(upper[i]))}`).join(' L ')
    const bot = p.map((r, i) => `${fmt(sx(r[0]))} ${fmt(sy(lower[i]))}`).reverse().join(' L ')
    return `<path d="M ${top} L ${bot} Z" fill="${colour}" fill-opacity=".62"/>`
  }).join('')

  const marks = [[preds._provenance.vt1_time_s, 'VT1'], [preds._provenance.vt2_time_s, 'VT2']]
    .map(([tv, name]) =>
      `<line x1="${fmt(sx(tv))}" y1="${Y0}" x2="${fmt(sx(tv))}" y2="${Y1}" stroke="${L.strong}" stroke-width="1.3" stroke-dasharray="4 3"/>` +
      `<text x="${fmt(sx(tv))}" y="${Y0 - 6}" font-family="${MONO}" font-size="9" fill="${L.strong}" text-anchor="middle">${name} ${tv} s</text>`)
    .join('')

  const ticks = [0, 200, 400, 600, 800]
    .map((v) => `<text x="${fmt(sx(v))}" y="${Y1 + 15}" font-family="${MONO}" font-size="9" fill="${L.faint}" text-anchor="middle">${v}</text>`)
    .join('')

  const key = [['moderate', DOMAIN.moderate], ['heavy', DOMAIN.heavy], ['severe', DOMAIN.severe]]
    .map(([lab, c], i) => {
      const x = AX + 8 + i * 84
      return `<rect x="${x}" y="${Y1 + 24}" width="9" height="9" rx="2" fill="${c}" fill-opacity=".62"/>` +
             `<text x="${x + 14}" y="${Y1 + 32}" font-family="${MONO}" font-size="9" fill="${L.subtle}">${lab}</text>`
    }).join('')

  return svg(W, H, 'The three intensity-domain probabilities the network emits every second, stacked, with the detected thresholds marked',
    `<line x1="${AX}" y1="${Y0}" x2="${X1}" y2="${Y0}" stroke="${L.line}"/>` +
    `<line x1="${AX}" y1="${Y1}" x2="${X1}" y2="${Y1}" stroke="${L.surface}"/>` +
    areas + marks +
    `<text x="${AX - 8}" y="${Y0 + 4}" font-family="${MONO}" font-size="9" fill="${L.faint}" text-anchor="end">1.0</text>` +
    `<text x="${AX - 8}" y="${Y1 + 3}" font-family="${MONO}" font-size="9" fill="${L.faint}" text-anchor="end">0</text>` +
    axisLabel(0, Y0 - 8, 'Class probability, every second', 'start') +
    unitLabel(X1, Y1 + 15, 'seconds') + ticks + key)
}

// ============================================================== COLLECTIVE
/**
 * How a recording becomes an interpretation: signal, tensor, model, meaning.
 * The point of the last panel is that the interpretation is not the opinion of
 * one algorithm. It is trained on thousands of expert-labelled tests.
 */
export function figCollective({ OUTER = 670, PAD = 16 } = {}) {
  const W = OUTER - PAD * 2
  const H = 212
  const n = 4
  const gap = 38
  const pw = (W - gap * (n - 1)) / n
  const Y = 30
  const ph = 128

  const frame = (i, label) => {
    const x = i * (pw + gap)
    return (
      `<rect x="${fmt(x)}" y="${Y}" width="${fmt(pw)}" height="${ph}" rx="8" fill="#111111" stroke="#242424"/>` +
      `<text x="${fmt(x)}" y="${Y - 9}" font-family="${MONO}" font-size="8" letter-spacing=".14em" fill="#8c8c8c">${label}</text>`
    )
  }
  const arrow = (i, label) => {
    const x = i * (pw + gap) + pw
    const cy = Y + ph / 2
    return (
      `<line x1="${fmt(x + 7)}" y1="${cy}" x2="${fmt(x + gap - 7)}" y2="${cy}" stroke="#00dc82" stroke-width="1.3" marker-end="url(#co)"/>` +
      `<text x="${fmt(x + gap / 2)}" y="${cy - 9}" text-anchor="middle" font-family="${MONO}" font-size="9" fill="#00dc82">${label}</text>`
    )
  }

  // 1 — the signal
  const ve = ch('VE')
  const vmax = Math.max(...ve)
  const sig = t
    .map((tv, i) => `${fmt(6 + (tv / TEND) * (pw - 12))} ${fmt(Y + ph - 14 - (ve[i] / vmax) * (ph - 30))}`)
    .join(' L ')
  const signal = `<path d="M ${sig}" fill="none" stroke="#4de9ac" stroke-width="1" opacity=".85"/>`

  // 2 — the same thing as a tensor: five channels down, time across
  const rows = ['VO2', 'VCO2', 'VE', 'PetO2', 'PetCO2']
  const cols = 26
  const cell = []
  rows.forEach((name, r) => {
    const v = ch(name)
    const lo = Math.min(...v)
    const hi = Math.max(...v)
    for (let c = 0; c < cols; c++) {
      const i = Math.floor((c / cols) * v.length)
      const u = (v[i] - lo) / (hi - lo)
      const cw = (pw - 16) / cols
      const chh = (ph - 30) / rows.length
      cell.push(
        `<rect x="${fmt(pw + gap + 8 + c * cw)}" y="${fmt(Y + 14 + r * chh)}" width="${fmt(cw - 0.8)}" height="${fmt(chh - 0.8)}" fill="#00dc82" fill-opacity="${(0.08 + u * 0.72).toFixed(2)}"/>`
      )
    }
  })
  const tensor = cell.join('') +
    `<text x="${fmt(pw + gap + 8)}" y="${Y + ph - 6}" font-family="${MONO}" font-size="6.5" fill="#6b6b6b">5 channels × time, normalised</text>`

  // 3 — the model, and the experts behind it
  const mx = 2 * (pw + gap) + pw / 2
  const my = Y + ph / 2
  const fan = Array.from({ length: 26 }, (_, i) => {
    const a = -Math.PI / 2 + (i / 25 - 0.5) * Math.PI * 1.25
    const r = 44 + (i % 4) * 7
    const x = mx + Math.cos(a) * r
    const y = my + Math.sin(a) * r * 0.62
    return (
      `<line x1="${fmt(x)}" y1="${fmt(y)}" x2="${fmt(mx)}" y2="${fmt(my)}" stroke="#00dc82" stroke-width=".5" opacity=".22"/>` +
      `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="1.7" fill="#4de9ac" fill-opacity=".75"/>`
    )
  }).join('')
  const model =
    fan +
    `<circle cx="${fmt(mx)}" cy="${fmt(my)}" r="20" fill="#0d0d0d" stroke="#00dc82" stroke-width="1.4"/>` +
    `<text x="${fmt(mx)}" y="${fmt(my + 3.5)}" text-anchor="middle" font-family="${MONO}" font-size="8" fill="#00dc82">model</text>` +
    `<text x="${fmt(mx)}" y="${Y + ph - 6}" text-anchor="middle" font-family="${MONO}" font-size="6.5" fill="#6b6b6b">expert-labelled tests</text>`

  // 4 — the interpretation
  const ix = 3 * (pw + gap)
  const { vt1_time_s: VT1, vt2_time_s: VT2 } = api.vt.findings
  const vo2 = ch('VO2')
  const vmx = 2600
  const interp = t
    .map((tv, i) => {
      if (vo2[i] > vmx) return ''
      const c = DARK_DOMAIN[tv < VT1 ? 'moderate' : tv < VT2 ? 'heavy' : 'severe']
      return `<circle cx="${fmt(ix + 8 + (vo2[i] / vmx) * (pw - 16))}" cy="${fmt(Y + ph - 14 - (ch('VCO2')[i] / 3000) * (ph - 30))}" r="1.4" fill="${c}" fill-opacity=".75"/>`
    })
    .join('') +
    `<text x="${fmt(ix + 8)}" y="${Y + ph - 6}" font-family="${MONO}" font-size="6.5" fill="#6b6b6b">VT1 · VT2 · domains · quality</text>`

  const defs = `<defs><marker id="co" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#00dc82"/></marker></defs>`

  const caption = (i, text) => {
    const x = i * (pw + gap)
    return `<text x="${fmt(x)}" y="${Y + ph + 24}" font-family="${SANS}" font-size="9.5" fill="#8c8c8c">${text}</text>`
  }

  return `<div style="background:#0d0d0d;border-radius:12px;padding:14px ${PAD}px 10px">
  ${svg(W, H, 'A recording becomes a tensor, the tensor goes to a model trained on thousands of expert-labelled tests, and what comes back is an interpretation',
    defs +
      frame(0, 'YOUR RECORDING') + signal +
      arrow(0, 'encode') +
      frame(1, 'AS TENSORS') + tensor +
      arrow(1, 'one call') +
      frame(2, 'COLLECTIVE INTELLIGENCE') + model +
      arrow(2, 'in ms') +
      frame(3, 'INTERPRETED') + interp +
      caption(0, 'Breath by breath,') + caption(1, 'Stacked into channels,') +
      caption(2, 'Read by a model carrying') + caption(3, 'And returned as meaning.') +
      `<text x="0" y="${Y + ph + 38}" font-family="${SANS}" font-size="9.5" fill="#8c8c8c">as the cart wrote it.</text>` +
      `<text x="${fmt(pw + gap)}" y="${Y + ph + 38}" font-family="${SANS}" font-size="9.5" fill="#8c8c8c">not columns in a file.</text>` +
      `<text x="${fmt(2 * (pw + gap))}" y="${Y + ph + 38}" font-family="${SANS}" font-size="9.5" fill="#8c8c8c">thousands of expert labels.</text>` +
      `<text x="${fmt(3 * (pw + gap))}" y="${Y + ph + 38}" font-family="${SANS}" font-size="9.5" fill="#8c8c8c">carried into one answer.</text>`)}
  </div>`
}
