import type { Metadata } from 'next'
import Link from 'next/link'
import { DocHeader, Section, Prose, Callout, Card, StatusBadge, ArrangementBadge } from '@/components/developers/doc'
import { MAILTO, CONTACT_EMAIL, LINKS } from '@/content/developers/meta'

export const metadata: Metadata = {
  title: 'Integrate Oxynet: partner onboarding for CPET software and device companies',
  description:
    'How a CPET device manufacturer, clinical software company, laboratory or AI company goes from a compatibility check to a production integration with Oxynet: hosted, local or embedded.',
  alternates: { canonical: '/developers/partners' },
}

const STEPS = [
  { n: '01', title: 'Check compatibility', body: 'Find your export on the formats page.', href: '/developers/formats', self: true },
  { n: '02', title: 'Download the sample', body: 'Synthetic data, so nothing of yours is needed yet.', href: '/developers/downloads#samples', self: true },
  { n: '03', title: 'Test the API', body: 'Request a key and run the quick start.', href: '/developers/quickstart', self: true },
  { n: '04', title: 'Send a representative file', body: 'One de-identified export from your system.', href: MAILTO.feasibility, self: false },
  { n: '05', title: 'Feasibility assessment', body: 'What parsed, what the format needed, what was refused and why.', self: false },
  { n: '06', title: 'Integration prototype', body: 'Against the hosted API, on your side.', self: false },
  { n: '07', title: 'Validation', body: 'Your cohort, your acceptance criteria, your regulatory position.', self: false },
  { n: '08', title: 'Production deployment', body: 'Hosted, local or embedded.', self: false },
]

const ROUTES = [
  { title: 'Integrate', body: 'Call Oxynet from software you already ship. Your interface, your reporting, your customer relationship; our physiology, kept current.' },
  { title: 'Embed', body: 'Make it part of the product itself, on your infrastructure or on the device, for interpretation during the test rather than after it.' },
  { title: 'Validate', body: 'Run cohorts through the engine to establish new capabilities and the evidence behind them. Oscillation analysis needs a second population before it can leave research, and that would be a collaboration.' },
  { title: 'Partner', body: 'A broader commercial relationship around distribution, licensing or joint product development.' },
]

export default function PartnersPage() {
  return (
    <>
      <DocHeader
        eyebrow="Partners"
        title="We want to integrate Oxynet. What happens next?"
        lede={
          <p>
            The first three steps are self-service and need no conversation. Technical access can
            begin with a representative CPET file; commercial terms depend on the deployment model,
            the scope and the partnership structure, and come later.
          </p>
        }
      />

      <Section id="steps" title="From first look to production">
        <ol className="grid sm:grid-cols-2 gap-3">
          {STEPS.map((s) => {
            const inner = (
              <>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono text-accent">{s.n}</span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-faint">{s.self ? 'Self-service' : 'With Oxynet'}</span>
                </div>
                <p className="text-sm font-semibold text-ink-strong">{s.title}</p>
                <p className="text-sm text-ink-body mt-1 leading-relaxed">{s.body}</p>
              </>
            )
            const cls = `block glass rounded-xl border p-4 h-full ${s.self ? 'border-accent/25' : 'border-hairline'}`
            return (
              <li key={s.n}>
                {s.href ? (
                  s.href.startsWith('mailto:') ? (
                    <a href={s.href} className={`${cls} hover:border-accent/50 transition-colors`}>{inner}</a>
                  ) : (
                    <Link href={s.href} className={`${cls} hover:border-accent/50 transition-colors`}>{inner}</Link>
                  )
                ) : (
                  <div className={cls}>{inner}</div>
                )}
              </li>
            )
          })}
        </ol>
        <Callout className="mt-6" title="Phase one needs one file and no commitment">
          <p>
            Send a de-identified export with the device, software version and what you want back.{' '}
            <a href={MAILTO.feasibility}>Send a representative file</a>. Remove names and dates of
            birth from the file and its name before sending.
          </p>
        </Callout>
      </Section>

      <Section id="run-a-test" title="Run a test yourself">
        <Prose>
          <p>
            There is deliberately no public, unauthenticated upload for your own files: a CPET export
            is health data. With a trial key you can upload a de-identified export and read the
            upload summary, which answers most compatibility questions on its own: the detected
            format, every channel present and absent with the reason, and the sampling. The{' '}
            <a href="https://app.oxynet.net">web application</a> also accepts files for a quick look.
          </p>
        </Prose>
        <div className="flex flex-wrap gap-3 mt-5">
          <a href={MAILTO.key} className="inline-flex items-center text-sm font-medium bg-accent-fill text-black rounded-lg px-4 py-2 hover:bg-accent/85 transition-colors">Request sandbox access</a>
          <Link href="/developers/quickstart" className="inline-flex items-center text-sm font-medium border border-hairline rounded-lg px-4 py-2 hover:border-accent/40 transition-colors text-ink-strong">Quick start</Link>
        </div>
      </Section>

      <Section id="deployment" title="Deployment options">
        <div className="grid md:grid-cols-3 gap-4">
          <Card accent>
            <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-ink-strong">Hosted API</h3><StatusBadge status="production" /></div>
            <p className="text-sm text-ink-body leading-relaxed mb-2">Your software calls app.oxynet.net over HTTPS. Fastest route to a working integration; model updates are central.</p>
            <p className="text-xs text-ink-subtle leading-relaxed">Recordings leave the local environment, and connectivity becomes a dependency.</p>
          </Card>
          <Card>
            <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-ink-strong">Local engine</h3><ArrangementBadge /></div>
            <p className="text-sm text-ink-body leading-relaxed mb-2">Available now as Oxynet Desktop, in preview: the analyses run offline on one computer, one licence per computer. Recordings never leave the institution.</p>
            <p className="text-xs text-ink-subtle leading-relaxed">A local server for your own software is scoped per partner: you own deployment and updates, and models have to be shipped to you.</p>
          </Card>
          <Card>
            <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-ink-strong">Embedded</h3><ArrangementBadge /></div>
            <p className="text-sm text-ink-body leading-relaxed mb-2">Interpretation inside the product, during the test rather than after it.</p>
            <p className="text-xs text-ink-subtle leading-relaxed">The tightest coupling and the longest conversation about versioning and support. A joint scoping exercise, not a shipping product.</p>
          </Card>
        </div>
        <Prose className="mt-5">
          <p className="text-sm">
            Hosted and local run the same code, with models from the same registry, pinned per
            release and named in every result. A partnership can start on the hosted API and move
            inward knowing which model answers at each step. For a Desktop licence,{' '}
            <a href={MAILTO.desktop}>write with your name and lab</a>.
          </p>
        </Prose>
      </Section>

      <Section id="routes" title="Four routes">
        <div className="grid sm:grid-cols-2 gap-4">
          {ROUTES.map((r, i) => (
            <Card key={r.title}>
              <p className="text-[11px] font-mono text-accent mb-1">0{i + 1}</p>
              <h3 className="text-sm font-semibold text-ink-strong mb-2">{r.title}</h3>
              <p className="text-sm text-ink-body leading-relaxed">{r.body}</p>
            </Card>
          ))}
        </div>
        <Prose className="mt-5">
          <p className="text-sm">
            Commercial and licensing structure follows from the route, the deployment and the scope
            of rights, so it is not fixed here and no price list is published.
          </p>
        </Prose>
      </Section>

      <Section id="contact" title="When to get in touch">
        <div className="grid sm:grid-cols-3 gap-4">
          <a href={MAILTO.key} className="glass rounded-xl border border-hairline p-4 hover:border-accent/40 transition-colors block">
            <p className="text-sm font-semibold text-ink-strong">An API key</p>
            <p className="text-xs text-ink-subtle mt-1">A sentence on what you want to build.</p>
          </a>
          <a href={MAILTO.feasibility} className="glass rounded-xl border border-hairline p-4 hover:border-accent/40 transition-colors block">
            <p className="text-sm font-semibold text-ink-strong">A feasibility check</p>
            <p className="text-xs text-ink-subtle mt-1">One de-identified file from your system.</p>
          </a>
          <a href={MAILTO.partnership} className="glass rounded-xl border border-hairline p-4 hover:border-accent/40 transition-colors block">
            <p className="text-sm font-semibold text-ink-strong">A partnership</p>
            <p className="text-xs text-ink-subtle mt-1">Licensing, embedding, validation, distribution.</p>
          </a>
        </div>
        <p className="text-xs text-ink-faint font-mono mt-4">{CONTACT_EMAIL}</p>
        <p className="text-xs text-ink-subtle mt-6 max-w-3xl leading-relaxed">
          Sharing a dataset? Our{' '}
          <a href={LINKS.dataAgreement} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            data transfer agreement template
          </a>{' '}
          (fillable PDF) shows every choice with its alternatives. If your institution has its own
          template, we will work from yours.
        </p>
      </Section>
    </>
  )
}
