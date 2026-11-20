import type { Metadata } from 'next'
import { DocHeader, Section, Prose, Callout, StatusBadge, NextSteps } from '@/components/developers/doc'
import { CAPABILITIES, type Capability } from '@/content/developers/analyses'
import { MATURITY, type Maturity } from '@/content/developers/maturity'

export const metadata: Metadata = {
  title: 'CPET analysis catalogue: ventilatory thresholds, substrate use, oscillatory ventilation',
  description:
    'What Oxynet computes from a cardiopulmonary exercise test, grouped by evidence maturity: VT1 and VT2, exercise intensity domains, substrate use and FATMAX, derived CPET quantities, signal integrity, and research-stage oscillatory ventilation analysis.',
  alternates: { canonical: '/developers/analyses' },
}

const ORDER: Maturity[] = ['production', 'research']

const HEADINGS: Record<Maturity, string> = {
  production: 'Production',
  available: 'Available',
  research: 'Research',
}

function Row({ c }: { c: Capability }) {
  const field = (label: string, value: string) => (
    <div className="grid sm:grid-cols-[8rem_minmax(0,1fr)] gap-x-4 gap-y-0.5 py-1.5">
      <dt className="text-[11px] font-mono uppercase tracking-[0.12em] text-ink-faint pt-0.5">{label}</dt>
      <dd className="text-sm text-ink-body leading-relaxed">{value}</dd>
    </div>
  )
  return (
    <div id={c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="glass rounded-xl border border-hairline p-5 scroll-mt-24">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h3 className="text-base font-semibold text-foreground">{c.name}</h3>
        <StatusBadge status={c.status} />
      </div>
      <p className="text-sm text-ink-strong leading-relaxed mb-3">{c.what}</p>
      <dl className="divide-y divide-hairline">
        {field('Needs', c.inputs)}
        {field('Returns', c.output)}
        {field('Evidence', c.evidence)}
        {field('Limits', c.limits)}
        {c.call && (
          <div className="grid sm:grid-cols-[8rem_minmax(0,1fr)] gap-x-4 gap-y-0.5 py-1.5">
            <dt className="text-[11px] font-mono uppercase tracking-[0.12em] text-ink-faint pt-0.5">Call</dt>
            <dd className="font-mono text-[12.5px] text-ink-strong break-words">{c.call}</dd>
          </div>
        )}
        {c.where && field('Where', c.where)}
      </dl>
    </div>
  )
}

export default function AnalysesPage() {
  return (
    <>
      <DocHeader
        eyebrow="Reference"
        title="Analysis catalogue"
        lede={
          <p>
            What Oxynet measures in a CPET, and how much weight each measurement will bear. Every
            entry states what it needs, what it returns, the evidence behind it and where it stops.
          </p>
        }
      />

      <Callout tone="warn" title="Read with every row" className="mb-12">
        <p>
          Nothing here is calibrated against clinical outcomes, and no output carries a confidence
          score: the <code>confidence</code> field is a category, low or normal, set by stated rules
          on the answer. What has been measured is agreement with expert labelling, which is a
          different claim. Oxynet is research software, not a medical device, and its output is not a
          diagnosis.
        </p>
      </Callout>

      {ORDER.map((status) => (
        <Section key={status} id={status} title={HEADINGS[status]}>
          <Prose className="mb-6"><p className="text-sm">{MATURITY[status].meaning}</p></Prose>
          <div className="space-y-4">
            {CAPABILITIES.filter((c) => c.status === status).map((c) => (
              <Row key={c.name} c={c} />
            ))}
          </div>
        </Section>
      ))}

      <Section id="promotion" title="How a model reaches production">
        <Prose>
          <p>
            A threshold model is promoted only after evaluation on a cohort it never saw, on both
            axes, clearing all four of: V&#775;O&#8322; bias &le; 120 mL/min, V&#775;O&#8322;
            correlation &ge; 0.80, time bias &le; 60 s, time correlation &ge; 0.80. Every promoted
            model ships with the evaluation that let it through, and its name and version are in the{' '}
            <code>provenance</code> of every result it produces.
          </p>
        </Prose>
      </Section>

      <NextSteps
        links={[
          { href: '/developers/outputs', label: 'Outputs and provenance', note: 'What the envelopes look like.' },
          { href: '/#publications', label: 'Publications', note: 'The peer-reviewed record.' },
        ]}
      />
    </>
  )
}
