import type { DemoScript } from './types'
import { DOMAINS, type McpToolName } from '../../generated/registry'

/**
 * Demo one of the family: an AI agent reaching Oxynet over MCP.
 *
 * The tool names, their argument names and the order they are called in are
 * checked against `scripts/mcp_server.py` in the interpreter repo, which is
 * what app.oxynet.net/oxynet-mcp actually serves. Three things there drive the
 * shape of this script and are easy to get wrong:
 *
 *   - the server is connected before any of this runs. An agent does not go
 *     looking for a physiological engine, and the demo must not imply it did:
 *     someone pointed their provider at Oxynet, then asked for Oxynet.
 *   - `get_capabilities` says "call this first, before anything else", because
 *     the analyses are licensed separately.
 *   - a file named by path goes through `create_upload`, which mints a one-shot
 *     URL, and the bytes then travel by curl. Reading a 360 KB export into the
 *     conversation costs about 97,000 tokens and gains nothing, so the upload
 *     is a shell step, not a tool call.
 *   - `analyze_vt` returns `quality`, which describes the RECORDING. It is
 *     not a confidence in the answer, and the docstring is explicit that no
 *     numeric confidence exists to quote. The interpretation says so.
 *
 * The values are invented. That is what the disclosure under the window is
 * for. To retell the story, edit this file: nothing in `components/demo` knows
 * what a ventilatory threshold is.
 */

const CPET_ID = 'cpet_8f3a91c4'

// The intensity-domain palette, generated from the shared registry that the
// app's charts are painted from too.
const MODERATE = DOMAINS.moderate
const HEAVY = DOMAINS.heavy
const SEVERE = DOMAINS.severe

// Every tool the server serves, in the order this demo lists them. The type is
// generated from scripts/mcp_server.py, so a tool added to or removed from the
// server fails the build here until the list is updated.
const TOOL_SUMMARIES = {
  get_capabilities: 'What this key is licensed for',
  get_sample_cpet: 'A synthetic recording to try',
  create_upload: 'One-shot URL for a file on disk',
  upload_cpet: 'Upload contents already in hand',
  get_cpet: 'Format, channels, sampling, protocol',
  list_metrics: 'The derived-quantity registry',
  compute_metrics: 'Phases, gas quality, sampling',
  analyze_vt: 'Ventilatory thresholds',
  analyze_eov: 'Oscillatory ventilation (beta)',
  analyze_substrate: 'Fat and carbohydrate use',
  get_cpet_series: 'Downsampled signals, to plot',
  delete_cpet: 'Remove the recording now',
} satisfies Record<McpToolName, string>

export const mcpDemo: DemoScript = {
  slug: 'mcp',
  title: 'Oxynet over MCP',
  label: 'MCP Demo',
  statusText: 'MCP',
  blurb:
    'Connect an agentic system to the Oxynet MCP server and ask it to analyse a CPET with Oxynet capabilities. The validated models decide the physiology; the assistant explains the answer.',
  disclosure:
    'Simulated interaction. The tools, their arguments and the order they are called in are the live Oxynet MCP server. The values are representative, not measured.',

  server: {
    id: 'oxynet',
    namespace: 'oxynet',
    title: 'Oxynet Physiological Intelligence',
    transport: 'streamable http',
    endpoint: 'app.oxynet.net/oxynet-mcp',
    // All ten, as the server exposes them. The five this agent reaches for
    // light up; the rest stay dim, which is the honest picture of discovery.
    tools: Object.entries(TOOL_SUMMARIES).map(([name, summary]) => ({ name, summary })),
  },

  startDelayMs: 700,

  events: [
    // ── Scene 1. The reader attaches the export ────────────────────────────
    {
      id: 'attach',
      kind: 'attach',
      chapter: 'Attach',
      filename: 'subject_042.xlsx',
      meta: '2.1 MB',
      durationMs: 2200,
    },

    // ── Scene 2. The request. It names Oxynet, and stops there ─────────────
    {
      id: 'ask',
      kind: 'user',
      chapter: 'Request',
      text: 'Analyse the attached CPET data file with Oxynet tools, and report ventilatory thresholds.',
      durationMs: 3400,
    },

    // ── Scene 3. The agent reads what it has been given ────────────────────
    // Not discovery. The server is on the session because someone put it
    // there; the agent is looking at its own toolbox before reaching into it.
    {
      id: 'think',
      kind: 'thinking',
      chapter: 'Planning',
      label: 'Thinking',
      durationMs: 1100,
    },
    {
      id: 'plan-look',
      kind: 'assistant',
      chapter: 'Planning',
      text: 'Let me look at what tools are available.',
      durationMs: 1900,
    },
    {
      id: 'connect',
      kind: 'mcp-connect',
      chapter: 'Planning',
      durationMs: 1300,
    },
    {
      id: 'tools',
      kind: 'mcp-tools',
      chapter: 'Planning',
      durationMs: 1900,
    },
    {
      id: 'plan-do',
      kind: 'assistant',
      chapter: 'Planning',
      text: "I'll check the signal, then estimate the thresholds with Oxynet's validated models rather than reading them off the trace myself.",
      durationMs: 2400,
    },
    {
      id: 'call-capabilities',
      kind: 'tool-call',
      chapter: 'Capabilities',
      tool: 'get_capabilities',
      input: {},
      latencyMs: 600,
      durationMs: 1800,
      result: {
        status: 'ok',
        headline: 'Key authorised',
        lines: [
          { kind: 'field', label: 'analyses', value: 'vt, eov, substrate', accent: true },
          { kind: 'field', label: 'retention', value: '24 h' },
        ],
      },
    },

    // ── Scene 4. Hand over the recording ───────────────────────────────────
    {
      id: 'call-upload',
      kind: 'tool-call',
      chapter: 'Load',
      tool: 'create_upload',
      input: { filename: 'subject_042.xlsx' },
      latencyMs: 700,
      durationMs: 2200,
      result: {
        status: 'ok',
        headline: 'Upload ticket issued',
        lines: [
          { kind: 'field', label: 'upload_url', value: 'oxynet.net/u/9c41…', accent: true },
          { kind: 'field', label: 'expires_in', value: '5 min' },
          { kind: 'note', text: 'One file, one URL, its own short-lived credential.' },
        ],
      },
    },
    {
      id: 'shell-upload',
      kind: 'shell',
      chapter: 'Load',
      command: 'curl -sS -F "file=@subject_042.xlsx" "$UPLOAD_URL"',
      runMs: 1600,
      output: {
        status: 'ok',
        headline: 'Recording accepted',
        lines: [
          { kind: 'field', label: 'cpet_id', value: CPET_ID, accent: true },
          { kind: 'field', label: 'duration', value: '11:42' },
          { kind: 'field', label: 'breaths', value: '1,247' },
          {
            kind: 'field',
            label: 'channels',
            value: 'VO₂, VCO₂, VE, HR, PETO₂, PETCO₂',
          },
        ],
      },
      durationMs: 2700,
    },

    // ── Scene 5. Is this test worth interpreting ───────────────────────────
    {
      id: 'call-metrics',
      kind: 'tool-call',
      chapter: 'Quality',
      tool: 'compute_metrics',
      input: {
        cpet_id: CPET_ID,
        metrics: ['gas_quality', 'sampling_adequacy', 'phases'],
      },
      steps: ['Checking gas exchange consistency', 'Resolving exercise phases'],
      latencyMs: 1400,
      durationMs: 2500,
      result: {
        status: 'ok',
        headline: 'Data quality: good',
        lines: [
          { kind: 'field', label: 'gas_quality', value: 'no significant artefacts' },
          { kind: 'field', label: 'phases', value: 'rest, ramp, recovery resolved' },
          { kind: 'note', text: 'Breath-by-breath data ready for analysis.' },
        ],
      },
    },

    // ── Scene 6 and 7. The analysis, then the thresholds ───────────────────
    {
      id: 'call-analyze',
      kind: 'tool-call',
      chapter: 'Analysis',
      tool: 'analyze_vt',
      input: { cpet_id: CPET_ID },
      steps: [
        'Normalising breath-by-breath data',
        'Detecting exercise phases',
        'Analysing gas exchange dynamics',
        'Locating ventilatory thresholds',
      ],
      latencyMs: 3000,
      durationMs: 4000,
      result: {
        status: 'ok',
        headline: 'Analysis complete',
        lines: [
          { kind: 'field', label: 'findings', value: 'vt1, vt2', accent: true },
          { kind: 'field', label: 'quality', value: 'good (of the recording)' },
        ],
      },
    },
    {
      id: 'call-series',
      kind: 'tool-call',
      chapter: 'Analysis',
      tool: 'get_cpet_series',
      input: { cpet_id: CPET_ID, channels: ['VO2', 'VE'], max_points: 200 },
      latencyMs: 700,
      durationMs: 1700,
      result: {
        status: 'ok',
        headline: '200 points per channel',
        lines: [{ kind: 'note', text: 'Downsampled for the plot, never for the maths.' }],
      },
    },

    // ── The result, made prominent ─────────────────────────────────────────
    {
      id: 'thresholds',
      kind: 'metrics',
      chapter: 'Thresholds',
      title: 'Ventilatory thresholds',
      caption:
        'Returned by analyze_vt: VT1 and VT2. Every breath is coloured by the domain they bound; the curves beneath are illustrative and cross at the thresholds.',
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
      durationMs: 3500,
    },

    // ── Scene 8. The agent reads the result back ───────────────────────────
    {
      id: 'read-2',
      kind: 'assistant',
      chapter: 'Interpretation',
      text: '**VT1** occurred at approximately **1.42 L/min VO₂**, indicating the transition into moderate-to-heavy intensity exercise. **VT2** occurred at approximately **2.31 L/min VO₂**, representing the transition into severe-intensity exercise.',
      durationMs: 2600,
    },
    {
      id: 'read-3',
      kind: 'assistant',
      chapter: 'Interpretation',
      text: 'Both values come from the Oxynet models rather than from my reading of the trace. Quality describes the recording, not the certainty of the answer.',
      durationMs: 2300,
    },

    // ── The last word is the reader's ──────────────────────────────────────
    // Left unanswered on purpose. It is a request, not a claim: nothing here
    // says Oxynet renders the report, only that the conversation carries on
    // once the measurements are real.
    {
      id: 'ask-report',
      kind: 'user',
      chapter: 'Request',
      text: 'Amazing, can you put this into a PDF report using my favourite template?',
      durationMs: 3600,
    },

    // ── The reveal ─────────────────────────────────────────────────────────
    {
      id: 'final',
      kind: 'final',
      chapter: 'Oxynet',
      headline: 'Physiological intelligence for AI.',
      accentWord: 'AI.',
      wordmark: 'Oxynet',
      channels: ['Interface', 'API', 'MCP'],
      activeChannel: 'MCP',
      site: 'oxynet.net',
      durationMs: 3000,
    },
  ],
}
