import type { DemoScript } from './types'

/**
 * Demo two of the three doors: Oxynet as an API.
 *
 * The first attempt at this reused the transcript layout and was unreadable,
 * because it looked exactly like the MCP demo with different words in it. The
 * audience here is a developer, and what a developer recognises is somebody
 * writing a file: one block on screen at a time, being typed, replaced by the
 * next, and finally run. Hence `layout: 'editor'`.
 *
 * Plain `fetch` on purpose. There is no JavaScript SDK to point at, and
 * inventing one would be inventing a product. What is shown is the real `/v1`
 * surface from `oxynet/api/v1.py`, callable from anything that speaks HTTP.
 * The response is shaped the way `analyze` really answers: `cpet_id` and one
 * envelope per analysis, with the envelope's own field names (findings in
 * seconds and mL/min, quality, confidence, notes, provenance), abridged to fit
 * the window. With no model named the committee answers, so provenance.model
 * is "fellowship" and the first note is the committee's. The key goes in
 * X-API-Key, the only header the API reads. The values are invented, as the
 * disclosure says.
 */
export const apiDemo: DemoScript = {
  slug: 'api',
  title: 'Oxynet as an API',
  label: 'REST API',
  statusText: 'v1',
  layout: 'editor',
  blurb:
    'Twenty lines against the REST API. Post the recording, read the measurements back, keep them in your own product.',
  disclosure:
    'Simulated run. The endpoint, the payload and the response fields are the live Oxynet REST API, abridged. The values are representative, not measured.',

  // Unused by this demo: there is no MCP server in the story. The shape is
  // required by the script type and only the connect and tool-list events read
  // it, neither of which appears here.
  server: {
    id: 'oxynet',
    namespace: 'oxynet',
    title: 'Oxynet REST API',
    transport: 'https',
    endpoint: 'app.oxynet.net/v1',
    tools: [],
  },

  startDelayMs: 600,

  events: [
    // ── Enough setup to make the call read, and no more ────────────────────
    // The first cut opened with an eleven-line fetch helper. It is the least
    // interesting code on screen and it pushed the round trip, which is the
    // part worth watching, past the halfway mark of the video.
    {
      id: 'setup',
      kind: 'code',
      chapter: 'Setup',
      filename: 'analyze.js',
      speed: 11,
      code: `const BASE = 'https://app.oxynet.net/v1'
const file = './subject_042.xlsx'

// goes straight to Oxynet, never through
// your own server
const { cpet_id } = await upload(file)`,
      durationMs: 3600,
    },

    // ── The one call that matters ──────────────────────────────────────────
    {
      id: 'analyze',
      kind: 'code',
      chapter: 'Analyse',
      filename: 'analyze.js',
      speed: 11,
      code: `// the validated models decide the physiology
const res = await fetch(
  \`\${BASE}/cpet/\${cpet_id}/analyze\`,
  {
    method: 'POST',
    headers: {
      'X-API-Key': KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ analyses: ['vt'] }),
  },
)`,
      durationMs: 4600,
    },

    // ── Out, inference, back ───────────────────────────────────────────────
    {
      id: 'run',
      kind: 'run',
      chapter: 'Response',
      filename: 'analyze.js',
      command: 'node analyze.js',
      request: `{ "analyses": ["vt"] }`,
      endpoint: '/v1/cpet/{cpet_id}/analyze',
      inference: 'fellowship',
      runMs: 3800,
      response: `{
  "cpet_id": "cpet_8f3a91c4",
  "results": [
    {
      "analysis": "vt",
      "status": "ok",
      "findings": {
        "vt1_time_s": 418.0,
        "vt2_time_s": 652.0,
        "vt1_vo2_ml_min": 1420.0,
        "vt2_vo2_ml_min": 2310.0
      },
      "quality": "good",
      "confidence": { "level": "normal", "reasons": [] },
      "notes": ["Thresholds combine 4 models ..."],
      "provenance": { "model": "fellowship", ... }
    }
  ]
}`,
      durationMs: 9000,
    },

    // ── The reveal, aimed at whoever is integrating ────────────────────────
    {
      id: 'final',
      kind: 'final',
      chapter: 'Oxynet',
      headline: 'Your product, your reporting, our physiology.',
      accentWord: 'our physiology.',
      wordmark: 'Oxynet',
      channels: ['Interface', 'API', 'MCP'],
      activeChannel: 'API',
      site: 'oxynet.net',
      durationMs: 4200,
    },
  ],
}
