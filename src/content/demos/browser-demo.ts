import type { DemoScript } from './types'
import { VENDOR_FORMATS } from '../facts'
import { DOMAINS } from '../../generated/registry'

/**
 * Demo three of the three doors: Oxynet in a browser.
 *
 * The plainest of the three and the one most visitors are. No conversation, no
 * code: a person drops a test in and reads physiology out. It uses the editor
 * layout for the same reason the API demo does, one thing on screen at a time,
 * because a person working through a screen is not accumulating a log.
 *
 * The upload copy is the app's own, from `ui/src/pages/Home.tsx` and
 * `ui/src/components/ui/file-upload.tsx`, and the four tabs are the app's
 * `FileBar`. Somebody who watches this and then opens app.oxynet.net should
 * arrive somewhere they recognise. The crossing is the same component the API
 * demo uses, because it is the same journey seen from a different chair.
 *
 * The values are invented, as the disclosure says.
 */

const MODERATE = DOMAINS.moderate
const HEAVY = DOMAINS.heavy
const SEVERE = DOMAINS.severe

export const browserDemo: DemoScript = {
  slug: 'browser',
  title: 'Oxynet in the browser',
  label: 'app.oxynet.net',
  statusText: 'live',
  layout: 'editor',
  blurb:
    'Drop a cardiopulmonary exercise test into the browser and read structured physiology back. No install, no pipeline.',
  disclosure:
    'Simulated run. The upload screen and the analyses are the live Oxynet app. The values are representative, not measured.',

  // Unused by this demo: there is no MCP server in the story. The shape is
  // required by the script type and only the connect and tool-list events read
  // it, neither of which appears here.
  server: {
    id: 'oxynet',
    namespace: 'oxynet',
    title: 'Oxynet',
    transport: 'https',
    endpoint: 'app.oxynet.net',
    tools: [],
  },

  startDelayMs: 600,

  events: [
    // ── A file, and somewhere to put it ────────────────────────────────────
    {
      id: 'drop',
      kind: 'drop',
      chapter: 'Upload',
      title: 'Upload a CPET export',
      subtitle: 'Drag and drop, or click to choose a file',
      filename: 'subject_042.xlsx',
      meta: '2.1 MB',
      note: `${VENDOR_FORMATS} vendor formats detected automatically. Nothing is stored beyond your session.`,
      landMs: 1500,
      durationMs: 4200,
    },

    // ── Thresholds are the entry point, not the whole engine ───────────────
    {
      id: 'tabs',
      kind: 'tabs',
      chapter: 'Read',
      filename: 'subject_042.xlsx',
      tabs: ['Data', 'Thresholds', 'Oscillation', 'Substrate'],
      active: 'Thresholds',
      note: 'Oxynet reads the file first and shows you what is in it.',
      durationMs: 3200,
    },

    // ── The same crossing the API demo draws ───────────────────────────────
    {
      id: 'transit',
      kind: 'transit',
      chapter: 'Analyse',
      from: 'your browser',
      to: 'Oxynet',
      fromGlyph: 'browser',
      inference: 'fellowship',
      runMs: 3800,
      captions: {
        out: 'the recording goes up',
        infer: 'the models decide the physiology',
        back: 'the measurements come back',
      },
      durationMs: 4200,
    },

    // ── The answer, drawn the way the app draws it ─────────────────────────
    {
      id: 'thresholds',
      kind: 'metrics',
      chapter: 'Result',
      title: 'Ventilatory thresholds',
      caption:
        'Every breath coloured by the domain VT1 and VT2 bound, as the app draws it from the answer. The curves beneath are illustrative and cross at the thresholds.',
      metrics: [
        {
          label: 'VT1',
          value: '1.42',
          unit: 'L/min VO₂',
          sub: 'HR 128 bpm',
          color: MODERATE,
        },
        {
          label: 'VT2',
          value: '2.31',
          unit: 'L/min VO₂',
          sub: 'HR 161 bpm',
          color: SEVERE,
        },
        { label: 'VO₂peak', value: '3.18', unit: 'L/min', sub: 'HR 184 bpm' },
      ],
      chart: {
        xLabel: 'VO₂ (L/min)',
        yLabel: 'VE (L/min)',
        vo2Start: 0.42,
        vo2Peak: 3.18,
        markers: [
          { label: 'VT1', vo2: 1.42, color: MODERATE },
          { label: 'VT2', vo2: 2.31, color: SEVERE },
        ],
        domains: [
          { label: 'Moderate', color: MODERATE },
          { label: 'Heavy', color: HEAVY },
          { label: 'Severe', color: SEVERE },
        ],
      },
      durationMs: 5400,
    },

    // ── The reveal, aimed at whoever just wants an answer ──────────────────
    {
      id: 'final',
      kind: 'final',
      chapter: 'Oxynet',
      headline: 'Drop a test in. Read the physiology out.',
      accentWord: 'Read the physiology out.',
      wordmark: 'Oxynet',
      channels: ['Interface', 'API', 'MCP'],
      activeChannel: 'Interface',
      site: 'oxynet.net',
      durationMs: 4200,
    },
  ],
}
