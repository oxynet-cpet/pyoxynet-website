import type { Metadata } from 'next'
import { ChevronRight } from 'lucide-react'
import { Callout, Section } from '@/components/developers/doc'
import { Footer } from '@/components/layout/footer'
import {
  GATES_PASSED,
  TASK_LABEL,
  TASK_ORDER,
  getResearchLog,
  onDay,
  type Benchmarks,
  type Finding,
  type Grade,
} from '@/content/research'
import { cn } from '@/lib/utils'
import { AccuracyChart, Legend, MARK_LABEL, NumbersTable, TransportChart } from './charts'

/**
 * What Oxynet's research loop has learned, for people who have been given the link.
 *
 * Unlisted on purpose, like /desktop-preview: nothing links here, it is out of the sitemap and
 * /llms.txt, and it is noindex rather than in robots.txt (a crawler told not to fetch a page never
 * sees its noindex). Everything it shows comes from content/research/latest.json, written by the
 * research loop under the founder's rules: generic findings only, each naming the task it solved;
 * no names, no lab ids, no costs, no confidence figures; the production model unnamed. Items are
 * collapsed to their titles so the page stays short as the log grows.
 */
export const metadata: Metadata = {
  title: 'Research log',
  description: 'What Oxynet’s continuous research is learning about CPET, tested on labs the models never saw.',
  robots: { index: false, follow: false },
}

const GRADE_LABEL: Record<Grade, string> = {
  exploratory: 'Exploratory',
  robust: 'Robust',
  confirmed: 'Confirmed',
}

const GATES = [
  {
    name: 'Unseen labs',
    text: 'Each lab is held out in turn, and the result is scored only on labs the model never trained on.',
    grade: 'Exploratory',
  },
  {
    name: 'Repeated',
    text: 'It must survive repeats and hold in most labs, not just on the average.',
    grade: 'Robust',
  },
  {
    name: 'Sealed labs',
    text: 'One look at labs kept aside from everything else, taken once, for the final word.',
    grade: 'Confirmed',
  },
]

const SUMMARY =
  'flex w-full cursor-pointer list-none items-center gap-3 rounded py-4 text-left [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

function Chevron() {
  return (
    <ChevronRight
      className="h-4 w-4 shrink-0 text-ink-subtle transition-transform duration-200 ease-out group-open:rotate-90"
      strokeWidth={1.75}
      aria-hidden
    />
  )
}

function Rungs({ passed }: { passed: number }) {
  return (
    <span className="flex gap-1" aria-hidden>
      {GATES.map((g, i) => (
        <span key={g.name} className={cn('h-1.5 w-5 rounded-full', i < passed ? 'bg-accent' : 'bg-hairline')} />
      ))}
    </span>
  )
}

function Ladder({ grade }: { grade: Grade }) {
  const passed = GATES_PASSED[grade]
  return (
    <span className="inline-flex shrink-0 items-center gap-2" title={`Passed ${passed} of 3 checks`}>
      <Rungs passed={passed} />
      <span className={cn('hidden w-[5.5rem] text-xs font-medium sm:inline', passed === 3 ? 'text-accent' : 'text-ink-body')}>
        {GRADE_LABEL[grade]}
      </span>
    </span>
  )
}

function FindingRow({ finding }: { finding: Finding }) {
  return (
    <li className="border-t border-hairline">
      <details className="group">
        <summary className={SUMMARY}>
          <Chevron />
          <span className="min-w-0 flex-1 text-[15px] font-medium leading-snug text-ink-strong group-hover:text-foreground">
            {finding.title}
          </span>
          <Ladder grade={finding.grade} />
        </summary>
        <div className="pb-6 pl-7">
          <p className="max-w-[65ch] text-[15px] leading-relaxed text-ink-body">{finding.summary}</p>
          <dl className="mt-4 grid max-w-[65ch] gap-x-6 gap-y-2 text-[13px] sm:grid-cols-[8rem_1fr]">
            <dt className="text-ink-subtle">Task</dt>
            <dd className="text-ink-body">{TASK_LABEL[finding.task]}</dd>
            <dt className="text-ink-subtle">Found</dt>
            <dd className="tabular-nums text-ink-body">{onDay(finding.date)}</dd>
            <dt className="text-ink-subtle">Grade</dt>
            <dd className="text-ink-body">
              {GRADE_LABEL[finding.grade]}, {GATES_PASSED[finding.grade]} of 3 checks passed
            </dd>
            {finding.scope.length > 0 && (
              <>
                <dt className="text-ink-subtle">Holds for</dt>
                <dd className="text-ink-body">{finding.scope.join(', ')}</dd>
              </>
            )}
            <dt className="text-ink-subtle">How it was tested</dt>
            <dd className="leading-relaxed text-ink-body">{finding.method}</dd>
          </dl>
        </div>
      </details>
    </li>
  )
}

function Pending({ note }: { note?: string }) {
  return (
    <Callout tone="todo" title="Not measured yet">
      <p>{note ?? 'This benchmark is in the queue.'}</p>
    </Callout>
  )
}

function Panel({ id, title, task, children }: { id: string; title: string; task: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-hairline py-10 first:border-t-0 first:pt-2">
      <h3 className="text-lg font-semibold text-ink-strong">{title}</h3>
      <p className="mt-1 mb-6 max-w-[65ch] text-[13px] leading-relaxed text-ink-subtle">{task}</p>
      {children}
    </section>
  )
}

function BenchmarkPanels({ b }: { b: Benchmarks }) {
  const th = b.thresholds
  const tr = b.transport
  return (
    <div>
      <Panel
        id="bench-phases"
        title={TASK_LABEL.phases}
        task="Finding where rest, warm-up, exercise and recovery begin, against boundaries marked in the file. Error in seconds."
      >
        {b.phases.status === 'measured' && b.phases.results?.length ? (
          <NumbersTable
            head="Phase boundary error"
            columns={['Method', 'Exercise start', 'Recovery start', 'Tests']}
            rows={b.phases.results.map((r) => [r.method, `${r.exercise_start_mae_s} s`, `${r.recovery_start_mae_s} s`, r.n])}
          />
        ) : (
          <Pending note={b.phases.note} />
        )}
      </Panel>

      <Panel
        id="bench-thresholds"
        title={TASK_LABEL.thresholds}
        task={`Placing VT1 and VT2 where experts marked them, on ${th.heads.VT1.n_labs} labs each held out in turn. Average distance from the expert, in mL/min of VO2. Lower is better.`}
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <AccuracyChart head="VT1" data={th.heads.VT1} />
          <AccuracyChart head="VT2" data={th.heads.VT2} />
        </div>
        {th.history.length > 1 ? (
          <p className="mt-6 text-[13px] text-ink-body">
            Best research model over time:{' '}
            {th.history.map((h) => `${onDay(h.date)} VT1 ${h.VT1}, VT2 ${h.VT2}`).join('; ')} (mL/min).
          </p>
        ) : null}
        <details className="group mt-6">
          <summary className={cn(SUMMARY, 'w-fit py-1 text-[13px] text-ink-body hover:text-ink-strong')}>
            <Chevron />
            Show the numbers
          </summary>
          <div className="mt-3 max-w-2xl">
            <NumbersTable
              head="Threshold error by method"
              columns={['Method', 'VT1 (mL/min)', 'VT2 (mL/min)']}
              rows={[
                ...(['guess', 'breakpoints', 'production', 'research'] as const).map((m) => [
                  MARK_LABEL[m],
                  th.heads.VT1[m] ?? 'not yet',
                  th.heads.VT2[m] ?? 'not yet',
                ]),
                ["Experts' floor", th.heads.VT1.floor ?? 'not yet', th.heads.VT2.floor ?? 'not yet'],
                ['Tests scored', th.heads.VT1.n_tests.toLocaleString('en-GB'), th.heads.VT2.n_tests.toLocaleString('en-GB')],
              ]}
            />
          </div>
        </details>
      </Panel>

      <Panel
        id="bench-transport"
        title={TASK_LABEL.transport}
        task="The same threshold error, split by how each test was run and by fitness, to see whether a model carries to tests unlike the ones it learned from."
      >
        {tr.status === 'measured' && tr.heads ? (
          <>
            <Legend marks={['guess', 'production', 'research']} />
            <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-12">
              <TransportChart head="VT1" groups={tr.heads.VT1.groups} />
              <TransportChart head="VT2" groups={tr.heads.VT2.groups} />
            </div>
            {tr.heads.VT1.labs_research_beats_guess !== null && (
              <p className="mt-6 max-w-[65ch] text-[13px] leading-relaxed text-ink-body">
                Lab by lab, the best research model beats the cohort-typical guess in{' '}
                {tr.heads.VT1.labs_research_beats_guess} of {tr.heads.VT1.labs_held_out} held-out labs on VT1 and{' '}
                {tr.heads.VT2.labs_research_beats_guess} of {tr.heads.VT2.labs_held_out} on VT2. Fitness thirds are
                thirds of VO2 peak across all tests; &ldquo;not recorded&rdquo; means the file carried no ergometer
                channel.
              </p>
            )}
            <details className="group mt-6">
              <summary className={cn(SUMMARY, 'w-fit py-1 text-[13px] text-ink-body hover:text-ink-strong')}>
                <Chevron />
                Show the numbers
              </summary>
              <div className="mt-3 max-w-3xl overflow-x-auto">
                <NumbersTable
                  head="Threshold error by kind of test"
                  columns={['Group', 'Tests', 'VT1 guess', 'VT1 production', 'VT1 research', 'VT2 guess', 'VT2 production', 'VT2 research']}
                  rows={tr.heads.VT1.groups.map((g, i) => {
                    const g2 = tr.heads!.VT2.groups[i]
                    return [`${g.axis}: ${g.label}`, g.n, g.guess, g.production, g.research ?? '', g2?.guess ?? '', g2?.production ?? '', g2?.research ?? '']
                  })}
                />
              </div>
            </details>
          </>
        ) : (
          <Pending note={tr.note} />
        )}
      </Panel>

      <Panel
        id="bench-efficiency"
        title={TASK_LABEL.efficiency}
        task="The aim is the cheapest model that learns a task from the fewest labelled tests: each model placed by its error against its size, its training compute and how many labelled tests it needed."
      >
        {b.efficiency.status === 'measured' && b.efficiency.models?.length ? (
          <NumbersTable
            head="Model size, compute and data"
            columns={['Model', 'Size', 'Training compute', 'Labelled tests', 'VT1', 'VT2']}
            rows={b.efficiency.models.map((m) => [
              m.kind,
              `${m.model_kb} kB`,
              `${m.train_cpu_min} CPU-min`,
              m.n_train.toLocaleString('en-GB'),
              `${m.VT1} mL/min`,
              `${m.VT2} mL/min`,
            ])}
          />
        ) : (
          <Pending note={b.efficiency.note} />
        )}
      </Panel>
    </div>
  )
}

export default function ResearchLogPage() {
  const log = getResearchLog()
  const byTask = TASK_ORDER.map((task) => ({
    task,
    findings: (log?.findings ?? []).filter((f) => f.task === task).sort((a, b) => b.date.localeCompare(a.date)),
  })).filter((g) => g.findings.length > 0)

  return (
    <>
      <main className="pt-24 sm:pt-28 selection:bg-accent/25 selection:text-ink-strong">
        <article className="mx-auto max-w-4xl px-6 pb-24">
          <header className="mb-16">
            <h1 className="max-w-[16ch] text-4xl font-bold leading-[1.02] tracking-tight text-foreground text-balance sm:text-6xl">
              What the research is learning
            </h1>
            <p className="mt-7 max-w-[60ch] text-lg leading-relaxed text-ink-body">
              Oxynet runs a research loop that does not stop. Every idea is tested on recordings from labs the
              model never trained on, against what experts marked by hand. Only what holds there is written
              here, with the task it solved, its date and how it was tested.
            </p>
            {log && (
              <p className="mt-6 text-sm tabular-nums text-ink-subtle">
                {log.counts.experiments} experiments on {log.counts.recordings.toLocaleString('en-GB')} recordings
                from {log.counts.labs} labs so far. Updated {onDay(log.updated)}.
              </p>
            )}
          </header>

          {log ? (
            <>
              {log.benchmarks && (
                <Section id="benchmarks" title="Benchmarks, by task">
                  <BenchmarkPanels b={log.benchmarks} />
                </Section>
              )}

              <Section id="findings" title="Findings">
                {byTask.map(({ task, findings }) => (
                  <div key={task} id={task} className="mb-10 scroll-mt-24 last:mb-0">
                    <h3 className="mb-1 text-[13px] font-medium text-ink-subtle">{TASK_LABEL[task]}</h3>
                    <ol className="border-b border-hairline">
                      {findings.map((f) => (
                        <FindingRow key={f.id} finding={f} />
                      ))}
                    </ol>
                  </div>
                ))}
              </Section>

              <Section id="experiments" title="Timeline of experiments">
                <ol className="relative ml-1.5 border-l border-hairline">
                  {log.timeline.map((step, i) => (
                    <li key={`${step.date}-${i}`} className="relative pl-6">
                      <span
                        className={cn('absolute -left-[5px] top-[1.375rem] h-2.5 w-2.5 rounded-full ring-4 ring-background', i === 0 ? 'bg-accent' : 'bg-ink-faint')}
                        aria-hidden
                      />
                      <details className="group">
                        <summary className={cn(SUMMARY, 'items-baseline py-3.5')}>
                          <time dateTime={step.date} className="w-24 shrink-0 font-mono text-xs tabular-nums text-ink-subtle">
                            {onDay(step.date)}
                          </time>
                          <span className="min-w-0 flex-1 text-[15px] leading-snug text-ink-strong">{step.title}</span>
                          <Chevron />
                        </summary>
                        <p className="max-w-[65ch] pb-4 text-[14px] leading-relaxed text-ink-body sm:pl-[6.75rem]">{step.outcome}</p>
                      </details>
                    </li>
                  ))}
                </ol>
              </Section>

              <Section id="how" title="How a finding earns its place">
                <details className="group">
                  <summary className={cn(SUMMARY, 'w-fit py-1 text-[15px] text-ink-body hover:text-ink-strong')}>
                    <Chevron />
                    Written down first, then three checks
                  </summary>
                  <p className="mt-3 max-w-[65ch] text-[15px] leading-relaxed text-ink-body">
                    The question and what would count as success are written down before any result exists. Every
                    result then sits beside a cohort-typical guess, the current production model, and the gap between
                    two experts reading the same test, which marks roughly the best the labels can show. A finding
                    climbs three checks:
                  </p>
                  <ol className="mt-6 grid gap-8 sm:grid-cols-3 sm:gap-6">
                    {GATES.map((gate, i) => (
                      <li key={gate.name}>
                        <Rungs passed={i + 1} />
                        <p className="mt-4 text-[15px] font-semibold text-ink-strong">{gate.name}</p>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-body">{gate.text}</p>
                        <p className="mt-2 text-xs font-medium text-accent">{gate.grade}</p>
                      </li>
                    ))}
                  </ol>
                </details>
              </Section>

              {log.corrections.length > 0 && (
                <Section id="corrections" title="What we got wrong">
                  <ol className="border-b border-hairline">
                    {log.corrections.map((c, i) => (
                      <li key={`${c.date}-${i}`} className="border-t border-hairline">
                        <details className="group">
                          <summary className={cn(SUMMARY, 'items-baseline')}>
                            <time dateTime={c.date} className="w-24 shrink-0 font-mono text-xs tabular-nums text-ink-subtle">
                              {onDay(c.date)}
                            </time>
                            <span className="min-w-0 flex-1 text-[15px] leading-snug text-ink-strong">
                              {c.text.split('. ')[0]}.
                            </span>
                            <Chevron />
                          </summary>
                          <p className="max-w-[65ch] pb-4 text-[14px] leading-relaxed text-ink-body sm:pl-[6.75rem]">{c.text}</p>
                        </details>
                      </li>
                    ))}
                  </ol>
                </Section>
              )}
            </>
          ) : (
            <Callout tone="warn" title="The log could not be read">
              <p>Its data file is missing or not in the expected shape. Nothing below this line is shown until it is.</p>
            </Callout>
          )}

          <p className="mt-4 max-w-[65ch] border-t border-hairline pt-6 text-[13px] leading-relaxed text-ink-subtle">
            This is research. Nothing here changes what Oxynet serves until it has passed every check above and been
            released.
          </p>
        </article>
      </main>
      <Footer />
    </>
  )
}
