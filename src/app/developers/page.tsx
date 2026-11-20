import type { Metadata } from 'next'
import Link from 'next/link'
import { DocHeader, Section, Prose, Flow, Card, StatusBadge, ArrangementBadge, NextSteps, Callout } from '@/components/developers/doc'
import { INTERFACES } from '@/content/developers/analyses'
import { VENDOR_FORMATS } from '@/content/facts'
import { LINKS, MAILTO } from '@/content/developers/meta'

export const metadata: Metadata = {
  title: { absolute: 'Oxynet for developers: CPET API, Python and MCP' },
  description:
    'Integrate cardiopulmonary exercise testing (CPET) analysis into software, research pipelines and AI agents. Send a CPET recording to the Oxynet API and receive structured physiological measurements with provenance and quality context.',
  alternates: { canonical: '/developers' },
}

const PATHS = [
  {
    label: 'REST API',
    href: '/developers/api/v1',
    who: 'Clinical platforms, laboratory systems, automated pipelines.',
    body: 'Upload the vendor export, work with the handle, receive JSON. One key, analyses granted per key.',
    status: 'production' as const,
  },
  {
    label: 'Python',
    href: '/developers/python',
    who: 'Researchers, analysts, scientific workflows.',
    body: 'Call the hosted engine from Python over plain HTTP. The open-source pyoxynet package covers local research inference separately.',
    status: 'available' as const,
  },
  {
    label: 'MCP',
    href: '/developers/mcp',
    who: 'AI agents and agentic workflows.',
    body: 'A native connector for Claude, Gemini CLI and any MCP client. The agent orchestrates and explains; Oxynet computes the physiology.',
    status: 'available' as const,
  },
  {
    label: 'Local / embedded',
    href: '/developers/partners#deployment',
    who: 'Partners needing on-premise processing or product integration.',
    body: 'The same engine on your infrastructure or in your product. Scoped per partner, not self-service.',
    status: 'arrangement' as const,
  },
]

export default function DevelopersOverview() {
  return (
    <>
      <DocHeader
        eyebrow="Developers and partners"
        title="Build on a computational layer for CPET"
        lede={
          <p>
            Oxynet turns CPET recordings into structured, reproducible physiological measurements
            that people, clinical software, research workflows and AI agents can consume. Send a
            supported recording, receive measurements with their provenance and the quality of the
            input they came from.
          </p>
        }
      >
        <div className="flex flex-wrap gap-3 mt-7">
          <Link href="/developers/quickstart" className="inline-flex items-center gap-1.5 text-sm font-medium bg-accent-fill text-black rounded-lg px-4 py-2 hover:bg-accent/85 transition-colors">
            Quick start →
          </Link>
          <Link href="/developers/downloads" className="inline-flex items-center gap-1.5 text-sm font-medium border border-hairline rounded-lg px-4 py-2 hover:border-accent/40 transition-colors text-ink-strong">
            Downloads
          </Link>
          <a href={MAILTO.feasibility} className="inline-flex items-center gap-1.5 text-sm font-medium border border-hairline rounded-lg px-4 py-2 hover:border-accent/40 transition-colors text-ink-strong">
            Test one of your files
          </a>
        </div>
      </DocHeader>

      <Section id="where" title="Where Oxynet sits">
        <div className="grid md:grid-cols-[minmax(0,1fr)_17rem] gap-8 items-start">
          <Prose>
            <p>
              Oxynet is not an application a laboratory installs, and not a single threshold
              algorithm. It is the computation underneath: it reads the file the metabolimeter
              exported ({VENDOR_FORMATS} format ids, detected automatically), measures the
              physiology in it, and hands structured results to whatever sits downstream.
            </p>
            <p>
              Acquisition hardware, manufacturer software and clinical workflows stay as they are.
              What changes is that interpretation becomes a call, made the same way every time,
              with every result traceable to the model and version that produced it.
            </p>
            <p>
              VT1 and VT2 are the entry point, not the ceiling: substrate use, derived quantities,
              signal integrity and, in research, oscillatory ventilation (beta: one heart-failure
              cohort, transportability untested) come back through the same interface. The <Link href="/developers/analyses">analysis catalogue</Link> states
              the evidence behind each one.
            </p>
          </Prose>
          <Flow
            label="Where Oxynet sits between a CPET device and the systems that use its results"
            steps={[
              { label: 'CPET device / laboratory' },
              { label: 'CPET recording', sub: 'vendor export, unchanged' },
              { label: 'Oxynet', sub: 'parse, condition, measure', accent: true },
              { label: 'Structured measurements', sub: 'JSON with provenance', accent: true },
              { label: 'Clinical software, research, reports, AI agents' },
            ]}
          />
        </div>
      </Section>

      <Section id="paths" title="Four ways in">
        <div className="grid sm:grid-cols-2 gap-4">
          {PATHS.map((p) => (
            <Link key={p.label} href={p.href} className="glass rounded-xl border border-hairline p-5 hover:border-accent/40 transition-colors group block">
              <div className="flex items-center justify-between gap-3 mb-2">
                <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors">{p.label}</h3>
                {p.status === 'arrangement' ? <ArrangementBadge /> : <StatusBadge status={p.status} />}
              </div>
              <p className="text-xs text-ink-faint mb-2">{p.who}</p>
              <p className="text-sm text-ink-body leading-relaxed">{p.body}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="status" title="What is live, and what is not">
        <Prose className="mb-5">
          <p>
            Capabilities do not all stand on the same ground, and the difference matters before you
            build on one. Three states are used consistently here and in the{' '}
            <a href={LINKS.manual} target="_blank" rel="noopener noreferrer">manual</a>:
          </p>
        </Prose>
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card><StatusBadge status="production" /><p className="text-sm text-ink-body mt-3 leading-relaxed">Answering on the live API, with the evaluation that let each model ship stored beside it.</p></Card>
          <Card><StatusBadge status="available" /><p className="text-sm text-ink-body mt-3 leading-relaxed">Shipped and usable: the interfaces and deployment options.</p></Card>
          <Card><StatusBadge status="research" /><p className="text-sm text-ink-body mt-3 leading-relaxed">Running, and not yet shown to transport to a new population.</p></Card>
        </div>
        <div className="rounded-xl border border-hairline overflow-hidden max-w-3xl">
          <table className="w-full text-sm">
            <tbody>
              {INTERFACES.map((i) => (
                <tr key={i.name} className="border-t border-hairline first:border-t-0">
                  <td className="px-4 py-2.5 text-ink-strong font-medium">{i.name}</td>
                  <td className="px-4 py-2.5">{i.status === 'arrangement' ? <ArrangementBadge /> : <StatusBadge status={i.status} />}</td>
                  <td className="px-4 py-2.5 text-ink-subtle hidden sm:table-cell">{i.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="principles" title="Three things to know before the first call">
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <h3 className="text-sm font-semibold text-ink-strong mb-2">Hand over the file, keep the handle</h3>
            <p className="text-sm text-ink-body leading-relaxed">Upload the export unchanged. Converting units yourself is where errors of a thousandfold come from. Every later call names the returned <code className="font-mono text-[12.5px]">cpet_id</code>.</p>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-ink-strong mb-2">No confidence scores</h3>
            <p className="text-sm text-ink-body leading-relaxed">Nothing is calibrated against clinical outcomes, so no number says how sure an answer is. <code className="font-mono text-[12.5px]">confidence</code> is a category, low or normal, set by stated rules; <code className="font-mono text-[12.5px]">quality</code> describes the recording.</p>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-ink-strong mb-2">A refusal is a result</h3>
            <p className="text-sm text-ink-body leading-relaxed">When a recording cannot support an analysis, the API says so and says why. Report it; do not work around it.</p>
          </Card>
        </div>
        <Callout tone="warn" title="Regulatory status" className="mt-6">
          <p>
            Oxynet is research software. It is not a medical device, carries no CE mark or FDA
            clearance, and its output is not a diagnosis. Interpreting a measurement for a patient
            remains the clinician&apos;s act.
          </p>
        </Callout>
      </Section>

      <NextSteps
        links={[
          { href: '/developers/quickstart', label: 'Quick start', note: 'From no key to a first analysis on synthetic data.' },
          { href: '/developers/formats', label: 'Can Oxynet read our files?', note: `The ${VENDOR_FORMATS} supported format ids, searchable.` },
        ]}
      />
    </>
  )
}

