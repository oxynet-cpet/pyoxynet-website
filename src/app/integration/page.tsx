import type { Metadata } from 'next'
import { Fragment } from 'react'
import { Footer } from '@/components/layout/footer'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GlassCard } from '@/components/shared/glass-card'
import { GradientText } from '@/components/shared/gradient-text'
import { Button } from '@/components/ui/button'
import { VENDOR_FORMATS } from '@/content/facts'

export const metadata: Metadata = {
  title: 'Integration | Oxynet',
  description:
    'Bring automated CPET interpretation into the data pipeline. Oxynet processes CPET time-series programmatically and returns structured interpretation outputs for clinical, research, and software systems.',
}

// ── Pipeline diagram primitives ────────────────────────────────────────────

function NodeDot({ accent = false, friction = false }: { accent?: boolean; friction?: boolean }) {
  if (accent) {
    return (
      <div className="w-2.5 h-2.5 rounded-full bg-accent-fill flex-shrink-0 shadow-[0_0_8px_rgba(0,220,130,0.55)]" />
    )
  }
  if (friction) {
    return <div className="w-2.5 h-2.5 rounded-full bg-warn/45 flex-shrink-0" />
  }
  return (
    <div className="w-2.5 h-2.5 rounded-full border border-hairline bg-transparent flex-shrink-0" />
  )
}

function VLine({
  accent = false,
  friction = false,
  h = 36,
}: {
  accent?: boolean
  friction?: boolean
  h?: number
}) {
  const color = accent ? 'bg-accent/35' : friction ? 'bg-warn/18' : 'bg-surface'
  return <div className={`w-px flex-shrink-0 ${color}`} style={{ height: `${h}px` }} />
}

function LinearStep({
  label,
  sublabel,
  accent = false,
  friction = false,
  last = false,
}: {
  label: string
  sublabel?: string
  accent?: boolean
  friction?: boolean
  last?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center w-5 flex-shrink-0 pt-0.5">
        <NodeDot accent={accent} friction={friction} />
        {!last && <VLine accent={accent} friction={friction} h={sublabel ? 44 : 32} />}
      </div>
      <div className="pb-0.5">
        <p
          className={[
            'text-sm font-medium leading-snug',
            accent ? 'text-accent' : friction ? 'text-ink-subtle' : 'text-ink-strong',
          ].join(' ')}
        >
          {label}
        </p>
        {sublabel && (
          <p
            className={[
              'text-[11px] font-mono mt-0.5',
              friction ? 'text-ink-faint' : 'text-ink-faint',
            ].join(' ')}
          >
            {sublabel}
          </p>
        )}
      </div>
    </div>
  )
}

// ── Current workflow diagram ───────────────────────────────────────────────

const CURRENT_WORKFLOW = [
  { label: 'CPET Device', sublabel: 'Exercise laboratory' },
  { label: 'Manufacturer Software', sublabel: 'Data acquisition & display' },
  { label: 'Test Completed', sublabel: 'CPET time-series recorded' },
  { label: 'CSV / XLS Export', sublabel: 'File-based data handoff', friction: true },
  { label: 'Manual File Handling', sublabel: 'Local storage, email, shared drives', friction: true },
  { label: 'External Platform / Upload', sublabel: 'Data re-entry or file upload', friction: true },
  { label: 'Oxynet', sublabel: 'Automated interpretation layer', accent: true },
  { label: 'Structured Outputs', sublabel: 'Thresholds, intensity domains, metrics', accent: true },
]

function CurrentWorkflowDiagram() {
  return (
    <div className="max-w-sm mx-auto select-none" aria-label="Current CPET workflow diagram">
      {CURRENT_WORKFLOW.map((step, i) => (
        <Fragment key={step.label}>
          {/* Label before friction zone */}
          {i === 3 && (
            <div className="flex items-center gap-3 ml-1 mb-1 mt-0">
              <div className="flex-1 h-px bg-warn/18" />
              <span className="text-[9px] font-mono text-warn/55 uppercase tracking-[0.2em] whitespace-nowrap px-1">
                Export &amp; manual transfer
              </span>
              <div className="flex-1 h-px bg-warn/18" />
            </div>
          )}

          <LinearStep
            label={step.label}
            sublabel={step.sublabel}
            accent={step.accent}
            friction={step.friction}
            last={i === CURRENT_WORKFLOW.length - 1}
          />

          {/* Thin divider after friction zone */}
          {i === 5 && <div className="ml-5 h-px bg-surface mt-1 mb-1" />}
        </Fragment>
      ))}
    </div>
  )
}

// ── Integrated workflow diagram ────────────────────────────────────────────

function CentredNode({
  label,
  sublabel,
  accent = false,
  highlight = false,
}: {
  label: string
  sublabel?: string
  accent?: boolean
  highlight?: boolean
}) {
  return (
    <div
      className={[
        'glass rounded-xl px-4 py-2.5 border text-center w-full',
        accent
          ? 'border-accent/28'
          : highlight
          ? 'border-accent/14'
          : 'border-hairline',
      ].join(' ')}
    >
      <p
        className={[
          'text-sm font-medium leading-snug',
          accent ? 'text-accent' : 'text-ink-strong',
        ].join(' ')}
      >
        {label}
      </p>
      {sublabel && (
        <p className="text-[11px] font-mono mt-0.5 text-ink-faint">{sublabel}</p>
      )}
    </div>
  )
}

function ForkSVG() {
  return (
    <svg
      viewBox="0 0 280 44"
      fill="none"
      className="w-full max-w-[18rem] mx-auto block"
      aria-hidden="true"
    >
      {/* Centre stem from Data Pipeline node */}
      <line x1="140" y1="0" x2="140" y2="22" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
      {/* Left horizontal branch to existing workflow */}
      <line x1="60" y1="22" x2="140" y2="22" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <line x1="60" y1="22" x2="60" y2="44" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      {/* Right horizontal branch to Oxynet (accent) */}
      <line x1="140" y1="22" x2="220" y2="22" stroke="rgba(0,220,130,0.28)" strokeWidth="1" />
      <line x1="220" y1="22" x2="220" y2="44" stroke="rgba(0,220,130,0.28)" strokeWidth="1" />
    </svg>
  )
}

function IntegratedWorkflowDiagram() {
  const oxynetNodes = [
    { label: 'Oxynet API', sublabel: 'Automated interpretation layer' },
    { label: 'Automated Interpretation', sublabel: 'VT1, VT2, intensity domains' },
    { label: 'Structured Outputs', sublabel: 'Programmatic response' },
    { label: 'Clinical / Research / Software', sublabel: 'Downstream systems', dim: true },
  ]

  return (
    <div aria-label="Integrated CPET workflow diagram">
      {/* Linear top section */}
      <div className="max-w-[16rem] mx-auto flex flex-col items-center gap-0">
        <CentredNode label="CPET Device" sublabel="Exercise laboratory" />
        <div className="w-px h-7 bg-surface" />
        <CentredNode label="Manufacturer Software / Core Lab" sublabel="Acquisition & data infrastructure" />
        <div className="w-px h-7 bg-surface" />
        <CentredNode label="CPET Data Pipeline" sublabel="Existing infrastructure" highlight />
      </div>

      {/* Fork connector */}
      <ForkSVG />

      {/* Two branches */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 max-w-lg mx-auto">
        {/* Left: existing workflow (muted) */}
        <div className="flex flex-col items-center gap-0">
          <p className="text-[9px] font-mono text-ink-faint uppercase tracking-[0.18em] mb-2.5 text-center">
            Existing workflow
          </p>
          <div className="glass rounded-xl px-3 py-3 border border-hairline w-full text-center opacity-40">
            <p className="text-xs text-ink-subtle leading-snug">Continues unchanged</p>
          </div>
          <p className="text-[9px] text-ink-faint mt-1.5 text-center">↓ as before</p>
        </div>

        {/* Right: Oxynet interpretation layer (accent) */}
        <div className="flex flex-col items-center gap-0">
          <p className="text-[9px] font-mono text-accent/55 uppercase tracking-[0.18em] mb-2.5 text-center">
            Oxynet layer
          </p>
          {oxynetNodes.map((node, i) => (
            <Fragment key={node.label}>
              <div
                className={[
                  'glass rounded-xl px-3 py-2.5 border w-full text-center',
                  i === 0
                    ? 'border-accent/30'
                    : i < 3
                    ? 'border-accent/20'
                    : 'border-accent/10',
                ].join(' ')}
              >
                <p
                  className={[
                    'text-xs font-medium leading-snug',
                    i === 0
                      ? 'text-accent'
                      : i < 3
                      ? 'text-accent/75'
                      : 'text-ink-body',
                  ].join(' ')}
                >
                  {node.label}
                </p>
                <p className="text-[10px] text-ink-faint font-mono mt-0.5">{node.sublabel}</p>
              </div>
              {i < oxynetNodes.length - 1 && (
                <div className="w-px h-5 bg-accent/28 flex-shrink-0" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Page sections ──────────────────────────────────────────────────────────

function IntegrationHero() {
  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,220,130,0.05) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative section-container text-center">
        <SectionWrapper>
          <p className="text-accent text-xs font-mono uppercase tracking-[0.25em] mb-6">
            Pipeline Integration
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
            Bring automated CPET interpretation{' '}
            <GradientText>into the data pipeline</GradientText>
          </h1>
          <p className="text-ink-body text-lg leading-relaxed max-w-2xl mx-auto mb-6">
            Oxynet is designed to process CPET time-series programmatically and return structured
            interpretation outputs. The next step is to move automated interpretation closer to
            where CPET data are acquired, processed, and used.
          </p>
          <p className="text-ink-faint text-sm font-mono tracking-wide mb-8">
            From exported files to continuous data flows.
          </p>
          <div className="glass rounded-xl px-6 py-4 border border-accent/20 max-w-lg mx-auto">
            <p className="text-ink-strong text-sm font-medium">
              No manual CSV or XLS transfer required.
            </p>
            <p className="text-ink-subtle text-xs leading-relaxed mt-1">
              A test is recorded, and the interpretation follows, with nobody deciding one file
              at a time to run it.
            </p>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}

function CurrentWorkflowSection() {
  return (
    <section className="section-padding border-t border-hairline">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-14">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              Current State
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              Today: interpretation often starts{' '}
              <GradientText>after export</GradientText>
            </h2>
            <p className="text-ink-body max-w-xl mx-auto text-lg leading-relaxed">
              File-based analysis is effective for research, validation, and individual testing.
              At scale, however, export and manual transfer create an unnecessary boundary between
              CPET acquisition and automated interpretation.
            </p>
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.15}>
          <div className="glass rounded-2xl p-8 sm:p-10 border border-hairline max-w-lg mx-auto">
            <CurrentWorkflowDiagram />
            <p className="text-ink-faint text-xs leading-relaxed mt-8 text-center max-w-xs mx-auto">
              Oxynet currently enters the workflow after data have been exported and manually
              handled. That is necessary today, but not architecturally required.
            </p>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}

function IntegratedWorkflowSection() {
  return (
    <section className="section-padding border-t border-hairline">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-14">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              The Goal
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              Interpretation <GradientText>as part of the pipeline</GradientText>
            </h2>
            <p className="text-ink-body max-w-xl mx-auto text-lg leading-relaxed">
              Existing acquisition and data-management workflows can remain unchanged. Oxynet can
              operate as an interpretation layer, receiving CPET time-series programmatically
              and returning structured outputs for downstream systems.
            </p>
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.15}>
          <div className="glass rounded-2xl p-8 sm:p-10 border border-accent/10 max-w-lg mx-auto">
            <IntegratedWorkflowDiagram />
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.25} className="mt-8">
          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            <div className="glass rounded-xl p-5 border border-hairline">
              <p className="text-ink-strong font-semibold text-sm mb-2">
                Designed to integrate, not replace.
              </p>
              <p className="text-ink-subtle text-xs leading-relaxed">
                Oxynet does not replace acquisition systems, manufacturer software, or existing
                clinical workflows. It adds an automated interpretation layer that operates on the
                same CPET time-series.
              </p>
            </div>
            <div className="glass rounded-xl p-5 border border-accent/15">
              <p className="text-ink-strong font-semibold text-sm mb-2">
                No manual CSV or XLS transfer required.
              </p>
              <p className="text-ink-subtle text-xs leading-relaxed">
                When integrated at the data-pipeline level, CPET time-series reach Oxynet
                programmatically, without any intermediate export or manual file handling.
              </p>
            </div>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}

function DataFlowSection() {
  const steps = [
    {
      n: '01',
      label: 'CPET time-series in',
      body: 'Breath-by-breath or other supported CPET time-series are transferred programmatically from an existing data system to the Oxynet API.',
    },
    {
      n: '02',
      label: 'Oxynet interpretation',
      body: `Oxynet parses the vendor file as exported: ${VENDOR_FORMATS} formats, each with its own unit conventions and clock quirks, then measures the physiology in it.`,
    },
    {
      n: '03',
      label: 'Structured outputs out',
      body: 'Thresholds, derived quantities, substrate use, oscillation analysis (beta: one heart-failure cohort, transportability untested) and signal-integrity checks are returned as structured JSON for review, storage, visualisation or downstream analysis. The intensity domains follow from the thresholds.',
    },
  ]

  return (
    <section className="section-padding border-t border-hairline">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-14">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              How It Works
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              Three steps,{' '}
              <GradientText>one integration point</GradientText>
            </h2>
          </div>
        </SectionWrapper>

        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <GlassCard key={step.n} delay={i * 0.1}>
              <p className="text-accent/70 text-xs font-mono uppercase tracking-widest mb-4">
                {step.n}
              </p>
              <h3 className="text-ink-strong font-semibold text-base mb-3">{step.label}</h3>
              <p className="text-ink-subtle text-sm leading-relaxed">{step.body}</p>
            </GlassCard>
          ))}
        </div>

        <SectionWrapper delay={0.3} className="mt-10">
          <div className="glass rounded-2xl p-6 max-w-3xl mx-auto border border-hairline text-center">
            <p className="text-ink-subtle text-sm leading-relaxed">
              Oxynet is reachable over REST, over MCP for AI assistants, or via the Python package
              for local research pipelines. The{' '}
              <a
                href="https://app.oxynet.net/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline underline-offset-2"
              >
                API documentation
              </a>{' '}
              lists every endpoint and the {VENDOR_FORMATS} vendor formats detected automatically. Oxynet&apos;s
              outputs are not intended to replace clinical review. They provide a consistent,
              reproducible measurement baseline.
            </p>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}

function PartnersSection() {
  const contexts = [
    {
      label: 'Core Laboratories',
      desc: 'Exercise testing centres managing continuous or high-volume CPET data flows.',
    },
    {
      label: 'Clinical Trial Networks',
      desc: 'Multicentre studies requiring consistent, automated CPET interpretation across sites.',
    },
    {
      label: 'Software & Device Partners',
      desc: 'CPET software providers and device manufacturers exploring interpretation integration.',
    },
    {
      label: 'Research Infrastructures',
      desc: 'Academic and clinical networks evaluating automated interpretation in real-world workflows.',
    },
  ]

  return (
    <section className="section-padding border-t border-hairline">
      <div className="section-container">
        <SectionWrapper>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              Collaboration
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              Do you operate a{' '}
              <GradientText>CPET data pipeline?</GradientText>
            </h2>
            <p className="text-ink-body text-lg leading-relaxed">
              We are interested in working with organisations that acquire, process, or manage CPET
              data at scale, including exercise testing core laboratories, clinical trial
              networks, hospitals, research infrastructures, software providers, and CPET
              technology partners.
            </p>
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.15}>
          <div className="glass rounded-2xl p-8 sm:p-10 border border-accent/12 max-w-3xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-5 mb-8">
              {contexts.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-fill mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-ink-strong text-sm font-medium">{item.label}</p>
                    <p className="text-ink-subtle text-xs leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-ink-subtle text-sm leading-relaxed mb-8 max-w-lg mx-auto text-center">
              We are particularly interested in prospective integration, continuous data flows,
              multicentre validation, and evaluating automated interpretation within real-world
              CPET workflows.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a
                  href="mailto:andrea.zignoli@unitn.it?subject=CPET%20Pipeline%20Integration%20Enquiry"
                >
                  Discuss an integration
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a
                  href="mailto:oxynetcpetinterpreter@gmail.com?subject=Oxynet%20Integration%20Enquiry"
                >
                  Contact the team
                </a>
              </Button>
            </div>

            <p className="text-ink-faint text-xs leading-relaxed mt-6 text-center">
              Technical onboarding is self-service: formats, sample data, API reference and a quick
              start are in the{' '}
              <a href="/developers/partners" className="text-accent hover:underline underline-offset-2">
                developer and partner hub
              </a>
              .
            </p>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function IntegrationPage() {
  return (
    <main>
      <IntegrationHero />
      <CurrentWorkflowSection />
      <IntegratedWorkflowSection />
      <DataFlowSection />
      <PartnersSection />
      <Footer />
    </main>
  )
}
