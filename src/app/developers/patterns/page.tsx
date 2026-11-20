import type { Metadata } from 'next'
import { DocHeader, Section, Prose, Flow, NextSteps } from '@/components/developers/doc'

export const metadata: Metadata = {
  title: 'CPET software integration patterns',
  description:
    'How Oxynet fits into clinical software, research pipelines, CPET device manufacturer software and AI agent workflows, with the interface each one uses.',
  alternates: { canonical: '/developers/patterns' },
}

const PATTERNS = [
  {
    id: 'clinical',
    title: 'Clinical software',
    iface: 'REST API',
    steps: [
      { label: 'CPET device' },
      { label: 'Clinical software', sub: 'exports the test' },
      { label: 'Oxynet API', accent: true },
      { label: 'Structured physiology', sub: 'with provenance', accent: true },
      { label: 'Clinical workflow / report' },
    ],
    body: 'The software already holds the export. It posts the file as a test completes, stores the envelopes beside the record, and prints notes verbatim in the report. The clinician reads and signs; the measurement is consistent from test to test.',
  },
  {
    id: 'research',
    title: 'Research',
    iface: 'REST from Python, R or MATLAB',
    steps: [
      { label: 'CPET files', sub: 'mixed vendors' },
      { label: 'Pipeline', sub: 'Python / R / MATLAB' },
      { label: 'Oxynet', accent: true },
      { label: 'Structured dataset', sub: 'one row per test', accent: true },
      { label: 'Analysis / publication' },
    ],
    body: 'Heterogeneous exports from several sites processed one way. Upload tickets are minted in bulk for a folder. Store provenance as columns so the methods section can state the model and analysis version, and a refused recording stays in the dataset with its reason.',
  },
  {
    id: 'device',
    title: 'Device manufacturer',
    iface: 'REST today; local or embedded by arrangement',
    steps: [
      { label: 'Device' },
      { label: 'Native integration', sub: 'manufacturer software' },
      { label: 'Oxynet', sub: 'hosted, local or embedded', accent: true },
      { label: 'Physiological outputs', accent: true },
      { label: 'Manufacturer software', sub: 'your interface, your report' },
    ],
    body: 'The manufacturer keeps the interface, the reporting and the customer relationship; Oxynet supplies the physiology and keeps it current. A partnership can start on the hosted API and move inward without the interpretation changing underneath the customer.',
  },
  {
    id: 'agent',
    title: 'AI agent',
    iface: 'MCP',
    steps: [
      { label: 'CPET', sub: 'named by the user' },
      { label: 'AI agent', sub: 'routes and explains' },
      { label: 'Oxynet MCP', accent: true },
      { label: 'Physiology', sub: 'computed, not estimated', accent: true },
      { label: 'Agent response / workflow' },
    ],
    body: 'The agent decides what to ask and explains what comes back; the thresholds and grades are computed by Oxynet. Files travel by upload ticket, so a cohort costs the agent a few hundred tokens per test rather than the whole signal.',
  },
]

export default function PatternsPage() {
  return (
    <>
      <DocHeader
        eyebrow="Partners"
        title="Integration patterns"
        lede={<p>Four common shapes. In each, the highlighted steps are Oxynet; everything else stays as it is.</p>}
      />

      <div className="grid md:grid-cols-2 gap-6">
        {PATTERNS.map((p) => (
          <section key={p.id} id={p.id} className="glass rounded-2xl border border-hairline p-6 scroll-mt-24">
            <h2 className="text-lg font-semibold text-foreground">{p.title}</h2>
            <p className="text-[11px] font-mono text-ink-faint mt-1 mb-5">{p.iface}</p>
            <Flow steps={p.steps} label={`${p.title} integration`} className="mb-5" />
            <p className="text-sm text-ink-body leading-relaxed">{p.body}</p>
          </section>
        ))}
      </div>

      <Section id="common" title="The same in all four" className="mt-14">
        <Prose>
          <p>
            The vendor file goes in unchanged. The <code>cpet_id</code> is the unit of work. Results
            come back in one envelope shape with provenance, input quality and notes. A refusal is
            kept, not retried into submission. Nothing carries a confidence score: an answer is
            marked low or normal by stated rules, never given a number.
          </p>
        </Prose>
      </Section>

      <NextSteps
        links={[
          { href: '/developers/partners', label: 'Partner onboarding', note: 'From one file to production.' },
          { href: '/integration', label: 'Pipeline integration', note: 'Interpretation at acquisition time, not after export.' },
        ]}
      />
    </>
  )
}
