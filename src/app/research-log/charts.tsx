/**
 * The research log's charts, in plain HTML rather than SVG so that text stays crisp and legible
 * at phone width. Lower is better on every axis here. Identity never rests on colour alone: rows
 * are labelled, the three transport marks differ in fill as well as colour and carry a legend,
 * every mark has a hover title, and every chart has its numbers in a table beside it.
 */
import type { ThresholdBench, TransportGroup } from '@/content/research'
import { cn } from '@/lib/utils'

type Mark = 'guess' | 'breakpoints' | 'production' | 'research'

export const MARK_LABEL: Record<Mark, string> = {
  guess: 'Cohort-typical guess',
  breakpoints: 'Textbook breakpoints',
  production: 'Current production model',
  research: 'Best research model',
}

/** Context marks recede; the production model is solid ink; the research model carries the accent. */
const DOT: Record<Mark, string> = {
  guess: 'bg-background border-2 border-ink-subtle',
  breakpoints: 'bg-ink-faint',
  production: 'bg-ink-strong',
  research: 'bg-accent',
}

function niceMax(v: number): number {
  const step = v > 400 ? 100 : 50
  return Math.ceil((v * 1.05) / step) * step
}

const pct = (v: number, max: number) => `${Math.min(100, (v / max) * 100)}%`

function Axis({ max, unit, className }: { max: number; unit: string; className?: string }) {
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f))
  return (
    <div className={cn('relative h-6 text-[11px] tabular-nums text-ink-subtle', className)} aria-hidden>
      {ticks.map((t, i) => (
        <span
          key={t}
          className={cn('absolute top-1', i === 0 ? '' : i === ticks.length - 1 ? '-translate-x-full' : '-translate-x-1/2')}
          style={{ left: pct(t, max) }}
        >
          {t}
          {i === ticks.length - 1 ? ` ${unit}` : ''}
        </span>
      ))}
    </div>
  )
}

function Gridlines({ max }: { max: number }) {
  return (
    <>
      {[0.25, 0.5, 0.75].map((f) => (
        <span key={f} className="absolute inset-y-0 w-px bg-hairline/60" style={{ left: pct(max * f, max) }} aria-hidden />
      ))}
    </>
  )
}

/** One threshold: a labelled row per method, a dot at its error, the experts' floor as a dashed line. */
export function AccuracyChart({ head, data }: { head: string; data: ThresholdBench }) {
  const rows: { mark: Mark; value: number | null }[] = [
    { mark: 'guess', value: data.guess },
    { mark: 'breakpoints', value: data.breakpoints },
    { mark: 'production', value: data.production },
    { mark: 'research', value: data.research },
  ]
  const max = niceMax(Math.max(...rows.map((r) => r.value ?? 0)))
  return (
    <figure>
      <figcaption className="mb-3 text-[15px] font-semibold text-ink-strong">{head}</figcaption>
      <div className="grid grid-cols-[minmax(8.5rem,11rem)_1fr] gap-x-4">
        {rows.map(({ mark, value }) => (
          <div key={mark} className="contents">
            <span className={cn('py-2 text-[13px] leading-tight', mark === 'research' ? 'font-medium text-ink-strong' : 'text-ink-body')}>
              {MARK_LABEL[mark]}
            </span>
            <div className="relative h-9">
              <Gridlines max={max} />
              {data.floor !== null && (
                <span
                  className="absolute inset-y-0 border-l border-dashed border-ink-subtle"
                  style={{ left: pct(data.floor, max) }}
                  aria-hidden
                />
              )}
              {value !== null && (
                <>
                  <span className="absolute top-1/2 h-px -translate-y-1/2 bg-hairline" style={{ left: 0, width: pct(value, max) }} aria-hidden />
                  <span
                    title={`${MARK_LABEL[mark]}: ${value} mL/min`}
                    className={cn('absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-background', DOT[mark])}
                    style={{ left: pct(value, max) }}
                  />
                  <span
                    className={cn('absolute top-1/2 -translate-y-1/2 pl-3 text-xs tabular-nums', mark === 'research' ? 'text-ink-strong font-medium' : 'text-ink-subtle')}
                    style={{ left: pct(value, max) }}
                  >
                    {value}
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
        <span />
        <Axis max={max} unit="mL/min" />
      </div>
      {data.floor !== null && (
        <p className="mt-2 text-xs text-ink-subtle">
          Dashed line: the experts&apos; floor, about {data.floor} mL/min, roughly the closest the labels let any method get.
        </p>
      )}
    </figure>
  )
}

const TRANSPORT_MARKS = ['guess', 'production', 'research'] as const

export function Legend({ marks }: { marks: Mark[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-body">
      {marks.map((m) => (
        <li key={m} className="inline-flex items-center gap-2">
          <span className={cn('h-2.5 w-2.5 rounded-full', DOT[m])} aria-hidden />
          {MARK_LABEL[m]}
        </li>
      ))}
    </ul>
  )
}

/** One threshold's error by kind of test, on a shared axis, three marks per row. */
export function TransportChart({ head, groups }: { head: string; groups: TransportGroup[] }) {
  const values = groups.flatMap((g) => TRANSPORT_MARKS.map((m) => g[m] ?? 0))
  const max = niceMax(Math.max(...values))
  const axes = Array.from(new Set(groups.map((g) => g.axis)))
  return (
    <figure>
      <figcaption className="mb-3 text-[15px] font-semibold text-ink-strong">{head}</figcaption>
      <div className="grid grid-cols-[minmax(8.5rem,11rem)_1fr] gap-x-4">
        {axes.map((axis) => (
          <div key={axis} className="contents">
            <span className="col-span-2 pt-3 pb-1 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-subtle">
              {axis}
            </span>
            {groups
              .filter((g) => g.axis === axis)
              .map((g) => (
                <div key={g.label} className="contents">
                  <span className="py-1.5 text-[13px] leading-tight text-ink-body">
                    {g.label}
                    <span className="ml-1.5 text-[11px] tabular-nums text-ink-subtle">{g.n.toLocaleString('en-GB')} tests</span>
                  </span>
                  <div className="relative h-7">
                    <Gridlines max={max} />
                    <span className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-hairline/60" aria-hidden />
                    {TRANSPORT_MARKS.map((m) => {
                      const v = g[m]
                      if (v === undefined) return null
                      return (
                        <span
                          key={m}
                          title={`${g.label}, ${MARK_LABEL[m]}: ${v} mL/min`}
                          className={cn('absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-background', DOT[m])}
                          style={{ left: pct(v, max) }}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
          </div>
        ))}
        <span />
        <Axis max={max} unit="mL/min" className="mt-1" />
      </div>
    </figure>
  )
}

/** The numbers behind a chart, for anyone who reads tables rather than dots. */
export function NumbersTable({ head, columns, rows }: { head: string; columns: string[]; rows: (string | number)[][] }) {
  return (
    <table className="w-full text-left text-[13px] tabular-nums">
      <caption className="sr-only">{head}</caption>
      <thead>
        <tr className="border-b border-hairline text-ink-subtle">
          {columns.map((c) => (
            <th key={c} scope="col" className="py-2 pr-4 font-medium">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-b border-hairline/60 text-ink-body">
            {r.map((c, j) => (
              <td key={j} className="py-1.5 pr-4">
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
