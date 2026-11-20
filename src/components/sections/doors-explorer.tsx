'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { DemoPlayerLazy } from '@/components/demo/demo-player-lazy'
import { DuckMark } from '@/components/shared/duck-mark'
import { GradientText } from '@/components/shared/gradient-text'
import { IconAgent, IconApi, IconBrowser } from '@/components/shared/icons'
import type { DemoScript } from '@/content/demos/types'

export type DoorId = 'browser' | 'api' | 'mcp'

const APP_URL = 'https://app.oxynet.net'

/**
 * The three doors, drawn as one map: an export goes in on the left, the engine
 * sits in the middle, and the three ways to reach it leave on the right. The
 * map is also the selector. Choosing a door lights its rail and swaps the
 * panel underneath to that door's copy and that door's demo, so the picture and
 * the explanation can never describe different things.
 *
 * The idea is the tool map from Aceternity's SaaS landing page, redrawn in
 * this site's own ink: thick tracks, small travelling dashes, labelled pills.
 */

type Cta = { label: string; href: string; external?: boolean; primary?: boolean }

type Door = {
  id: DoorId
  label: string
  endpoint: string
  who: string
  Icon: (p: { className?: string }) => JSX.Element
  headline: ReactNode
  body: string[]
  steps?: string[]
  extra?: ReactNode
  note?: string
  ctas: Cta[]
}

function makeDoors(formats: number, retentionHours: number): Door[] {
  return [
    {
      id: 'browser',
      label: 'Browser',
      endpoint: 'app.oxynet.net',
      who: 'For clinicians and labs',
      Icon: IconBrowser,
      headline: (
        <>
          Drop the file in. <GradientText>Read the physiology out.</GradientText>
        </>
      ),
      body: [
        'Reduce variability across clinicians and sessions. The app reads your metabolimeter export as exported and returns the same structured measurements every time, with no change to how you capture data and nothing to install.',
        `Free inferences in the browser. Cortex, COSMED, MetaSoft and more. The uploaded file is parsed and discarded, and the parsed record is deleted after ${retentionHours} hours.`,
      ],
      steps: [
        'Upload the file your system already exports, in whatever format it writes.',
        'Oxynet processes the signals and detects ventilatory thresholds automatically.',
        'Receive structured outputs (intensity domains, VT1, VT2) ready for clinical review.',
      ],
      ctas: [{ label: 'Open app.oxynet.net', href: APP_URL, external: true, primary: true }],
    },
    {
      id: 'api',
      label: 'REST API',
      endpoint: '/v1/cpet',
      who: 'For software and device makers',
      Icon: IconApi,
      headline: (
        <>
          A physiology engine <GradientText>behind your system.</GradientText>
        </>
      ),
      body: [
        'Call Oxynet from the software you already ship. Send the recording, receive structured measurements, display them in your own interface. Your product, your reporting, our physiology.',
        `Upload the vendor file exactly as exported and work with the handle you get back. ${formats} export formats are detected automatically, so nothing upstream has to normalise units or columns first.`,
      ],
      steps: [
        'Integrate the Oxynet API into your existing CPET software or device platform.',
        'Send CPET data via standard API calls, with no change to your data capture pipeline.',
        'Receive standardised interpretation outputs and display them within your software.',
      ],
      extra: (
        <p className="text-ink-subtle text-sm leading-relaxed">
          Every endpoint, parameter and response shape is published as{' '}
          <a
            href={`${APP_URL}/v1/openapi.json`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[13px] text-ink-strong hover:text-accent underline underline-offset-2"
          >
            OpenAPI 3.0
          </a>
          , importable into a client generator, a custom GPT action or an integration platform.
        </p>
      ),
      ctas: [
        { label: 'Read the API docs', href: `${APP_URL}/docs`, external: true, primary: true },
        { label: 'Developer hub', href: '/developers' },
        { label: 'See the integration', href: '/integration' },
      ],
    },
    {
      id: 'mcp',
      label: 'MCP',
      endpoint: '/oxynet-mcp',
      who: 'For AI assistants and cohorts',
      Icon: IconAgent,
      headline: (
        <>
          Not the model&apos;s opinion. <GradientText>Oxynet&apos;s measurement.</GradientText>
        </>
      ),
      body: [
        'If you want your agentic system to rely on validated models rather than on a plausible sentence, connect your provider to the Oxynet MCP server and ask it to analyse the test with Oxynet capabilities. It works with Claude, Gemini CLI and any MCP client, and the signals never travel through the conversation.',
        'A language model asked to read a cardiopulmonary exercise test will happily estimate a threshold from the trace. Told to use Oxynet, it stops estimating and starts calling: the assistant routes the question and explains the answer, and the physiology is decided by models trained on expert-labelled tests.',
      ],
      extra: (
        <div className="rounded-xl border border-hairline bg-black/30 p-5 font-mono text-[12.5px] leading-relaxed overflow-x-auto">
          <p className="text-ink-faint mb-3"># any MCP client, one line</p>
          <p className="text-ink-strong whitespace-nowrap">
            <span className="text-accent">claude mcp add</span> --transport http oxynet \
          </p>
          <p className="text-ink-strong pl-4 whitespace-nowrap">
            {APP_URL}/oxynet-mcp --header{' '}
            <span className="text-ink-subtle">&quot;X-API-Key: ...&quot;</span>
          </p>
          <p className="text-ink-faint mt-4 mb-1"># then, for a whole cohort</p>
          <p className="text-ink-body">
            &quot;analyse every CPET in this folder and tell me which ones show oscillatory
            ventilation&quot;
          </p>
        </div>
      ),
      note: 'No result carries a numeric confidence, and an assistant should not invent one: an answer is marked low or normal by stated rules, with the reason. Oscillatory ventilation is beta, developed on one heart-failure cohort with transportability untested. Where a recording cannot support an analysis, the server says so and says why: that refusal is the correct thing to report. The integration guide is also served as plain text at /llms.txt, so an agent can read it in one request.',
      ctas: [
        { label: 'Connect an assistant', href: '/developers/mcp', primary: true },
        { label: 'Open the demo on its own page', href: '/demo' },
      ],
    },
  ]
}

// ── The map ──────────────────────────────────────────────────────────────────
// Everything is placed in one 1000 x 400 frame. The SVG rails use it as their
// viewBox and the HTML nodes are positioned in percentages of it, and the box
// holding both keeps the same 5:2 ratio, so a rail always meets its node.

const W = 1000
const H = 400
const MID = H / 2
const SRC = { x: 110, w: 190 }
const HUB = { x: 430, w: 200 }
const DOOR = { x: 850, w: 220 }
const ROW: Record<DoorId, number> = { browser: 72, api: 200, mcp: 328 }
const FORK = 620
const R = 20

const INTAKE = `M${SRC.x + SRC.w / 2} ${MID} H${HUB.x - HUB.w / 2}`

function branch(y: number) {
  const from = HUB.x + HUB.w / 2
  const to = DOOR.x - DOOR.w / 2
  if (y === MID) return `M${from} ${MID} H${to}`
  const d = y < MID ? -1 : 1
  return `M${from} ${MID} H${FORK - R} Q${FORK} ${MID} ${FORK} ${MID + d * R} V${y - d * R} Q${FORK} ${y} ${FORK + R} ${y} H${to}`
}

const pctX = (x: number) => `${(x / W) * 100}%`
const pctY = (y: number) => `${(y / H) * 100}%`

const VENDORS = ['COSMED', 'Cortex', 'MetaSoft', 'PNOE', 'VO2 Master']
const ANALYSES: [string, string | null][] = [
  ['Thresholds', null],
  ['Oscillation', 'beta'],
  ['Substrate', null],
  ['Signal integrity', null],
]

function Rail({ d, lit }: { d: string; lit: boolean }) {
  return (
    <g>
      <path
        d={d}
        fill="none"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-colors duration-300 ${lit ? 'stroke-accent/20' : 'stroke-hairline'}`}
      />
      <path
        d={d}
        fill="none"
        strokeWidth={1.6}
        strokeDasharray="4 12"
        strokeLinecap="round"
        className={`motion-safe:animate-rail-dash transition-colors duration-300 ${
          lit ? 'stroke-accent' : 'stroke-ink-faint/70'
        }`}
      />
    </g>
  )
}

/** A dot riding a rail. Negative `begin` so it is mid-journey on first paint. */
function Packet({ path, dur, begin, lit }: { path: string; dur: number; begin: number; lit: boolean }) {
  return (
    <circle
      r={4}
      className={`motion-reduce:hidden ${lit ? 'fill-accent' : 'fill-ink-faint'}`}
    >
      <animateMotion dur={`${dur}s`} begin={`${-begin}s`} repeatCount="indefinite" path={path} />
    </circle>
  )
}

function Pill({ x, children }: { x: number; children: ReactNode }) {
  return (
    <span
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-hairline bg-background px-2.5 py-0.5 font-mono text-[10px] text-ink-subtle whitespace-nowrap"
      style={{ left: pctX(x), top: pctY(MID) }}
    >
      {children}
    </span>
  )
}

function SourceCard({ formats }: { formats: number }) {
  return (
    <div className="glass rounded-2xl border border-hairline p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint mb-3">
        Your export
      </p>
      <div className="flex flex-wrap gap-1.5">
        {VENDORS.map((v) => (
          <span
            key={v}
            className="rounded-md border border-hairline bg-surface px-1.5 py-0.5 text-[11px] text-ink-body"
          >
            {v}
          </span>
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-snug text-ink-subtle">
        {formats} formats, detected automatically
      </p>
    </div>
  )
}

function HubCard() {
  return (
    <div className="glass rounded-2xl border border-accent/30 p-4 shadow-[0_0_60px_-20px_rgb(var(--accent-rgb)/0.45)]">
      <div className="flex items-center gap-2 mb-3">
        <DuckMark className="w-5 h-5 text-accent" />
        <span className="font-mono font-bold text-sm gradient-text">Oxynet engine</span>
      </div>
      <ul className="space-y-1">
        {ANALYSES.map(([a, tag]) => (
          <li key={a} className="flex items-center gap-2 text-[12px] text-ink-body">
            <span className="h-1 w-1 rounded-full bg-accent/70" />
            {a}
            {tag && (
              <span className="rounded border border-warn/35 px-1 font-mono text-[9px] uppercase tracking-wider text-warn/90">
                {tag}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function DoorButton({
  door,
  active,
  onSelect,
  idPrefix,
}: {
  door: Door
  active: boolean
  onSelect: () => void
  idPrefix: string
}) {
  return (
    <button
      type="button"
      role="tab"
      id={`${idPrefix}-${door.id}`}
      aria-selected={active}
      aria-controls="door-panel"
      onClick={onSelect}
      className={[
        'w-full text-left rounded-2xl border p-3.5 transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
        active
          ? 'glass border-accent/50 shadow-[0_0_40px_-18px_rgb(var(--accent-rgb)/0.6)]'
          : 'border-hairline bg-background/60 hover:border-ink-faint',
      ].join(' ')}
    >
      <span className="flex items-center gap-3">
        <door.Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-accent' : 'text-ink-subtle'}`} />
        <span className="min-w-0">
          <span className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-foreground">{door.label}</span>
            <span className="truncate font-mono text-[10px] text-ink-faint">{door.endpoint}</span>
          </span>
          <span className="block text-[11px] text-ink-subtle">{door.who}</span>
        </span>
      </span>
    </button>
  )
}

/** Wide screens: the map, left to right. */
function FlowMap({
  doors,
  active,
  onSelect,
  formats,
}: {
  doors: Door[]
  active: DoorId
  onSelect: (id: DoorId) => void
  formats: number
}) {
  return (
    <div className="relative hidden lg:block" style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
        <Rail d={INTAKE} lit />
        {doors.map((d) => (
          <Rail key={d.id} d={branch(ROW[d.id])} lit={d.id === active} />
        ))}
        {[0, 0.8].map((b) => (
          <Packet key={b} path={INTAKE} dur={1.6} begin={b} lit={false} />
        ))}
        {doors.map((d, i) =>
          [0, 1.1].map((b) => (
            <Packet
              key={`${d.id}-${b}`}
              path={branch(ROW[d.id])}
              dur={2.2}
              begin={b + i * 0.35}
              lit={d.id === active}
            />
          )),
        )}
      </svg>

      <Pill x={(SRC.x + SRC.w / 2 + HUB.x - HUB.w / 2) / 2}>as exported</Pill>
      <Pill x={(HUB.x + HUB.w / 2 + FORK - R) / 2}>JSON</Pill>

      <div
        className="absolute -translate-y-1/2"
        style={{ left: pctX(SRC.x - SRC.w / 2), width: pctX(SRC.w), top: pctY(MID) }}
      >
        <SourceCard formats={formats} />
      </div>
      <div
        className="absolute -translate-y-1/2"
        style={{ left: pctX(HUB.x - HUB.w / 2), width: pctX(HUB.w), top: pctY(MID) }}
      >
        <HubCard />
      </div>
      <div role="tablist" aria-label="Ways to reach Oxynet">
        {doors.map((d) => (
          <div
            key={d.id}
            className="absolute -translate-y-1/2"
            style={{ left: pctX(DOOR.x - DOOR.w / 2), width: pctX(DOOR.w), top: pctY(ROW[d.id]) }}
          >
            <DoorButton
              door={d}
              active={d.id === active}
              onSelect={() => onSelect(d.id)}
              idPrefix="door-tab"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function VerticalRail({ label }: { label: string }) {
  return (
    <div className="relative mx-auto h-12 w-2 rounded-full bg-hairline">
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-hairline bg-background px-2.5 py-0.5 font-mono text-[10px] text-ink-subtle whitespace-nowrap">
        {label}
      </span>
    </div>
  )
}

/** Narrow screens: the same map, top to bottom. */
function FlowStack({
  doors,
  active,
  onSelect,
  formats,
}: {
  doors: Door[]
  active: DoorId
  onSelect: (id: DoorId) => void
  formats: number
}) {
  return (
    <div className="mx-auto max-w-sm lg:hidden">
      <SourceCard formats={formats} />
      <VerticalRail label="as exported" />
      <HubCard />
      <VerticalRail label="JSON" />
      <div role="tablist" aria-label="Ways to reach Oxynet" className="grid gap-2.5">
        {doors.map((d) => (
          <DoorButton
            key={d.id}
            door={d}
            active={d.id === active}
            onSelect={() => onSelect(d.id)}
            idPrefix="door-tab-m"
          />
        ))}
      </div>
    </div>
  )
}

// Old links into the sections this one replaced still land on the right door.
const HASH_TO_DOOR: Record<string, DoorId> = {
  browser: 'browser',
  api: 'api',
  mcp: 'mcp',
  agents: 'mcp',
  'agent-demo': 'mcp',
}

export function DoorsExplorer({
  scripts,
  formats,
  retentionHours,
}: {
  scripts: Record<DoorId, DemoScript>
  formats: number
  retentionHours: number
}) {
  const doors = makeDoors(formats, retentionHours)
  const [active, setActive] = useState<DoorId>('browser')

  useEffect(() => {
    const fromHash = () => {
      const door = HASH_TO_DOOR[window.location.hash.slice(1)]
      if (door) setActive(door)
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [])

  const door = doors.find((d) => d.id === active)!

  return (
    <>
      <FlowMap doors={doors} active={active} onSelect={setActive} formats={formats} />
      <FlowStack doors={doors} active={active} onSelect={setActive} formats={formats} />

      <span id="agents" className="block scroll-mt-24" aria-hidden="true" />
      <span id="agent-demo" className="block scroll-mt-24" aria-hidden="true" />

      <div
        id="door-panel"
        role="tabpanel"
        aria-labelledby={`door-tab-${door.id} door-tab-m-${door.id}`}
        className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-[1fr_34rem] lg:items-start lg:gap-16"
      >
        <div key={`copy-${door.id}`} className="animate-fade-in">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">
            {door.label} · {door.who.replace(/^For /, 'for ')}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight leading-[1.2]">
            {door.headline}
          </h3>
          <div className="mt-5 space-y-4">
            {door.body.map((p) => (
              <p key={p} className="text-ink-body text-base leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          {door.steps && (
            <ol className="mt-6 space-y-3">
              {door.steps.map((step, i) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full border border-accent/40 text-accent text-xs font-mono flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-ink-body text-sm leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          )}

          {door.extra && <div className="mt-6">{door.extra}</div>}
          {door.note && (
            <p className="mt-5 text-ink-faint text-xs leading-relaxed">{door.note}</p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            {door.ctas.map((cta) =>
              cta.primary ? (
                <a
                  key={cta.label}
                  href={cta.href}
                  target={cta.external ? '_blank' : undefined}
                  rel={cta.external ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-accent-fill px-4 py-2 text-sm font-medium text-black hover:bg-accent/85 transition-colors"
                >
                  {cta.label} <span aria-hidden="true">→</span>
                </a>
              ) : (
                <a
                  key={cta.label}
                  href={cta.href}
                  target={cta.external ? '_blank' : undefined}
                  rel={cta.external ? 'noopener noreferrer' : undefined}
                  className="text-sm font-medium text-accent hover:underline underline-offset-2"
                >
                  {cta.label} →
                </a>
              ),
            )}
          </div>
        </div>

        {/* Keyed by door, so switching starts the new demo from its first
            event instead of resuming another door's timeline. The prefixes
            matter: the copy beside it is keyed by door too, and siblings
            sharing a key leave the previous door's copy on screen. */}
        <DemoPlayerLazy
          key={`demo-${door.id}`}
          script={scripts[door.id]}
          className="mx-auto w-full max-w-[34rem]"
        />
      </div>
    </>
  )
}
