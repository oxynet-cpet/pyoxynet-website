import type { Metadata } from 'next'
import { Callout, Section } from '@/components/developers/doc'
import { Footer } from '@/components/layout/footer'
import {
  GATES_PASSED,
  TOPIC_LABEL,
  TOPIC_ORDER,
  getResearchLog,
  onDay,
  type Finding,
  type Grade,
} from '@/content/research'
import { cn } from '@/lib/utils'

/**
 * What Oxynet's research loop has learned, for people who have been given the link.
 *
 * Unlisted on purpose, like /desktop-preview: nothing links here, it is out of the sitemap and
 * /llms.txt, and it is noindex rather than in robots.txt (a crawler told not to fetch a page never
 * sees its noindex). Everything it shows comes from content/research/latest.json, written by the
 * research loop under the founder's rules: generic findings only, no names, no lab ids, no costs,
 * no confidence figures, and the production model unnamed.
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

/** The three checks a finding climbs, in order. A finding's grade is how many it has passed. */
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

function Rungs({ passed, className }: { passed: number; className?: string }) {
  return (
    <span className={cn('flex gap-1', className)} aria-hidden>
      {GATES.map((g, i) => (
        <span
          key={g.name}
          className={cn('h-1.5 w-6 rounded-full', i < passed ? 'bg-accent' : 'bg-hairline')}
        />
      ))}
    </span>
  )
}

function Ladder({ grade }: { grade: Grade }) {
  const passed = GATES_PASSED[grade]
  return (
    <span className="inline-flex items-center gap-2.5 shrink-0" title={`Passed ${passed} of 3 checks`}>
      <Rungs passed={passed} />
      <span className={cn('text-xs font-medium', passed === 3 ? 'text-accent' : 'text-ink-body')}>
        {GRADE_LABEL[grade]}
      </span>
    </span>
  )
}

function Entry({ finding }: { finding: Finding }) {
  return (
    <li className="grid gap-x-10 gap-y-2 py-8 border-t border-hairline sm:grid-cols-[6.5rem_1fr]">
      <time dateTime={finding.date} className="pt-1.5 font-mono text-xs tabular-nums text-ink-subtle">
        {onDay(finding.date)}
      </time>
      <div>
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-3">
          <h3 className="max-w-[34ch] text-lg sm:text-xl font-semibold leading-snug text-ink-strong text-balance">
            {finding.title}
          </h3>
          <span className="pt-1.5">
            <Ladder grade={finding.grade} />
          </span>
        </div>
        <p className="mt-3 max-w-[65ch] text-[15px] leading-relaxed text-ink-body">{finding.summary}</p>
        {finding.scope.length > 0 && (
          <p className="mt-4 text-[13px] text-ink-subtle">{finding.scope.join('  ·  ')}</p>
        )}
        <details className="group mt-3">
          <summary className="w-fit cursor-pointer rounded text-[13px] font-medium text-ink-body transition-colors hover:text-ink-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            How it was tested
          </summary>
          <p className="mt-2 max-w-[65ch] text-[13px] leading-relaxed text-ink-body">{finding.method}</p>
        </details>
      </div>
    </li>
  )
}

export default function ResearchLogPage() {
  const log = getResearchLog()
  const byTopic = TOPIC_ORDER.map((topic) => ({
    topic,
    findings: (log?.findings ?? [])
      .filter((f) => f.topic === topic)
      .sort((a, b) => b.date.localeCompare(a.date)),
  })).filter((g) => g.findings.length > 0)

  return (
    <>
      <main className="pt-24 sm:pt-28 selection:bg-accent/25 selection:text-ink-strong">
        <article className="max-w-4xl mx-auto px-6 pb-24">
          <header className="mb-16">
            <h1 className="max-w-[16ch] text-4xl sm:text-6xl font-bold leading-[1.02] tracking-tight text-foreground text-balance">
              What the research is learning
            </h1>
            <p className="mt-7 max-w-[60ch] text-lg leading-relaxed text-ink-body">
              Oxynet runs a research loop that does not stop. Every idea is tested on recordings from labs the
              model never trained on, against what experts marked by hand. Only what holds there is written
              here, with its date and how it was tested.
            </p>
            {log && (
              <p className="mt-6 text-sm tabular-nums text-ink-subtle">
                {log.counts.experiments} experiments on {log.counts.recordings.toLocaleString('en-GB')}{' '}
                recordings from {log.counts.labs} labs so far. Updated {onDay(log.updated)}.
              </p>
            )}
          </header>

          <Section id="how" title="How a finding earns its place">
            <p className="max-w-[65ch] text-[15px] leading-relaxed text-ink-body">
              The question and what would count as success are written down before any result exists. Every
              result then sits beside a cohort-typical guess, the current production model, and the gap between
              two experts reading the same test, which marks roughly the best the labels can show. A finding
              climbs three checks:
            </p>
            <ol className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-6">
              {GATES.map((gate, i) => (
                <li key={gate.name}>
                  <Rungs passed={i + 1} />
                  <p className="mt-4 text-[15px] font-semibold text-ink-strong">{gate.name}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-body">{gate.text}</p>
                  <p className="mt-2 text-xs font-medium text-accent">{gate.grade}</p>
                </li>
              ))}
            </ol>
          </Section>

          {log ? (
            <>
              {byTopic.map(({ topic, findings }) => (
                <Section key={topic} id={topic} title={TOPIC_LABEL[topic]}>
                  <ol className="border-b border-hairline">
                    {findings.map((f) => (
                      <Entry key={f.id} finding={f} />
                    ))}
                  </ol>
                </Section>
              ))}

              <Section id="experiments" title="Experiments, newest first">
                <ol className="border-b border-hairline">
                  {log.timeline.map((step, i) => (
                    <li
                      key={`${step.date}-${i}`}
                      className="grid gap-x-10 gap-y-1 py-4 border-t border-hairline sm:grid-cols-[6.5rem_1fr]"
                    >
                      <time dateTime={step.date} className="font-mono text-xs tabular-nums text-ink-subtle sm:pt-0.5">
                        {onDay(step.date)}
                      </time>
                      <p className="text-[15px] leading-relaxed text-ink-body">
                        <span className="font-medium text-ink-strong">{step.title}.</span> {step.outcome}
                      </p>
                    </li>
                  ))}
                </ol>
              </Section>

              {log.corrections.length > 0 && (
                <Section id="corrections" title="What we got wrong">
                  <p className="max-w-[65ch] text-[15px] leading-relaxed text-ink-body">
                    A result that does not survive checking is withdrawn here, not quietly removed.
                  </p>
                  <ol className="mt-6 border-b border-hairline">
                    {log.corrections.map((c, i) => (
                      <li
                        key={`${c.date}-${i}`}
                        className="grid gap-x-10 gap-y-1 py-4 border-t border-hairline sm:grid-cols-[6.5rem_1fr]"
                      >
                        <time dateTime={c.date} className="font-mono text-xs tabular-nums text-ink-subtle sm:pt-0.5">
                          {onDay(c.date)}
                        </time>
                        <p className="max-w-[65ch] text-[15px] leading-relaxed text-ink-body">{c.text}</p>
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
            This is research. Nothing here changes what Oxynet serves until it has passed every check above and
            been released.
          </p>
        </article>
      </main>
      <Footer />
    </>
  )
}
