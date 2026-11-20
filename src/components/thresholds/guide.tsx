import Link from 'next/link'
import { Footer } from '@/components/layout/footer'
import { Section, Prose, Callout, Card, Facts } from '@/components/developers/doc'
import { LINKS } from '@/content/developers/meta'

/**
 * The frame and the shared sections of the threshold guides
 * (/ventilatory-thresholds and one page per vendor). These pages are written
 * for the person holding a CPET file and for the assistant answering them, not
 * for an integrator, so they carry no docs version stamp and sit outside the
 * developer hub's sidebar.
 */
export function GuidePage({
  eyebrow,
  title,
  lede,
  back,
  children,
}: {
  eyebrow: string
  title: string
  lede: React.ReactNode
  back?: { href: string; label: string }
  children: React.ReactNode
}) {
  return (
    <>
      <main className="pt-24 sm:pt-28">
        <article className="max-w-3xl mx-auto px-6 pb-24">
          <header className="mb-12 pb-8 border-b border-hairline">
            {back && (
              <Link href={back.href} className="inline-block text-xs text-ink-subtle hover:text-accent transition-colors mb-6">
                ← {back.label}
              </Link>
            )}
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">{eyebrow}</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4 leading-tight">
              {title}
            </h1>
            <div className="text-ink-body text-lg leading-relaxed">{lede}</div>
          </header>
          {children}
        </article>
      </main>
      <Footer />
    </>
  )
}

/** The three doors, worded for someone with a file in hand. */
export function RunIt({ fileNoun = 'the export' }: { fileNoun?: string }) {
  return (
    <Section id="run" title="Three ways to run it">
      <div className="grid gap-4">
        <Card accent>
          <h3 className="text-sm font-semibold text-ink-strong mb-2">In an AI assistant</h3>
          <Prose className="text-sm">
            <p>
              Connect Oxynet once, attach {fileNoun} and ask for VT1 and VT2. The assistant hands the
              file to Oxynet and explains what comes back; Oxynet&apos;s models locate the thresholds.
            </p>
            <p>
              In Claude, <a href={LINKS.claudeDirectory}>Oxynet is in the connector directory</a>. For
              ChatGPT, Claude Code, Gemini CLI and other clients, see{' '}
              <Link href="/developers/mcp#connect">connecting an assistant</Link>. Either way you need a{' '}
              <a href={LINKS.signup}>free API key</a>.
            </p>
          </Prose>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-ink-strong mb-2">In the browser</h3>
          <Prose className="text-sm">
            <p>
              Drop {fileNoun} on <a href={LINKS.app}>app.oxynet.net</a>. No account is needed. The app
              shows what the file contains, then offers thresholds, substrate analysis and oscillation
              (beta), with the intensity domains drawn on the chart. The thresholds are the same answer
              the API and assistants get.
            </p>
          </Prose>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-ink-strong mb-2">From code</h3>
          <Prose className="text-sm">
            <p>
              Upload the file to the REST API and ask for the <code>vt</code> analysis; the answer is
              JSON. The <Link href="/developers/quickstart">quick start</Link> has the calls in curl
              and Python. A free key covers research and testing.
            </p>
          </Prose>
        </Card>
      </div>
    </Section>
  )
}

/** Restated from content/developers/analyses.ts; the analysis catalogue is the reference. */
export function WhatComesBack() {
  return (
    <Section id="results" title="What comes back">
      <Facts
        rows={[
          ['Ventilatory thresholds', 'VT1 and VT2, each as a time from the start of the test and an oxygen uptake in mL/min, with the method and version that produced them and why that method answered. VO2, VCO2 and VE are enough; a file without end-tidal gases is still analysed.'],
          ['Intensity domains', 'Moderate, heavy and severe, the domains VT1 and VT2 bound, drawn breath by breath in the web app.'],
          ['CPET metrics', 'Peak VO2, VE and RER, O2 pulse, the VE/VCO2 slope, test phases and classical landmarks.'],
          ['Substrate use', 'Fat and carbohydrate oxidation, FATMAX, the crossover and gross efficiency.'],
          ['Signal quality', 'Whether the gas analysis, the sampling and the clock can support a measurement at all.'],
          ['Oscillatory ventilation', 'Beta. Developed on one heart failure cohort; its transportability to other populations is untested.'],
        ]}
      />
      <Prose className="mt-5">
        <p className="text-sm">
          No result carries a confidence score: nothing is calibrated against clinical outcomes, so no
          number says how sure an answer is. Each answer is marked low or normal by stated rules (a
          threshold placed while the subject was at rest is marked low, and the reason given). The
          agreement with expert raters is published. Every analysis and its limits are in the{' '}
          <Link href="/developers/analyses">analysis catalogue</Link>.
        </p>
      </Prose>
    </Section>
  )
}

/** What the terms ask of a free key, said before the upload rather than after. */
export function BeforeYouUpload() {
  return (
    <Callout title="Before you upload" className="mb-14">
      <p>
        On a free key, upload only de-identified data: remove names, dates of birth and record numbers
        from the file and the filename. Blank those cells rather than deleting rows or columns, so the
        layout stays as the software wrote it. Oxynet is research software, not a medical device, and
        its results are not a diagnosis (<Link href="/terms#research">terms</Link>).
      </p>
    </Callout>
  )
}
