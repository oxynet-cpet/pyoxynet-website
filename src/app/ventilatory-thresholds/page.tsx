import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, Prose, Callout, Card, NextSteps } from '@/components/developers/doc'
import { GuidePage, RunIt, WhatComesBack, BeforeYouUpload } from '@/components/thresholds/guide'
import { VENDOR_GUIDES, guideHref, formatsFor } from '@/content/thresholds'
import { PUBLICATIONS, isPeerReviewed } from '@/content/publications'
import { LINKS, MAILTO } from '@/content/developers/meta'
import { RETENTION_HOURS } from '@/content/facts'

const TITLE = 'VT1 and VT2 from a CPET file'
const DESCRIPTION =
  'Find both ventilatory thresholds in a cardiopulmonary exercise test export, uploaded as the metabolic cart wrote it. Oxynet locates VT1 and VT2 with models trained on expert-labelled tests, from an AI assistant such as Claude or ChatGPT, in the browser, or over an API.'

export const metadata: Metadata = {
  title: `${TITLE} | Oxynet`,
  description: DESCRIPTION,
  alternates: { canonical: '/ventilatory-thresholds' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/ventilatory-thresholds', siteName: 'Oxynet', type: 'article' },
}

/**
 * The published evidence for the thresholds: peer-reviewed, by the rule the
 * site and the manual count with, and about thresholds or the intensity
 * domains they bound. Filtered rather than listed, so a new paper appears here
 * when it is added to publications.ts.
 */
const EVIDENCE = PUBLICATIONS.filter((p) => isPeerReviewed(p) && /threshold|intensity domain/i.test(p.title))

const QUESTIONS: [string, React.ReactNode][] = [
  [
    'Is it free?',
    <>
      The browser needs no account. Assistants and code need an API key, and a{' '}
      <a href={LINKS.signup}>free key</a> takes a minute, with a monthly limit stated on the sign-up page.
      For more, or for clinical use under a data processing agreement,{' '}
      <a href={MAILTO.key}>ask for an organisation key</a>.
    </>,
  ],
  [
    'Does the AI decide where the threshold is?',
    <>
      No. The assistant passes the file to Oxynet and explains the result. The thresholds come from
      Oxynet&apos;s models, which were trained on tests that experts labelled. An assistant without Oxynet
      will estimate a threshold from the numbers, and it will sound right.
    </>,
  ],
  [
    'Is there a confidence score?',
    <>
      Not a number, and none is invented: nothing is calibrated against clinical outcomes, and agreement
      with expert raters is what is published. Each answer is marked low or normal by stated rules
      instead, and a low one says which rule fired, for example a threshold placed while the subject was
      still at rest. The response also describes the recording: whether the gas analysis, sampling and
      clock can support a measurement.
    </>,
  ],
  [
    'What happens to the file?',
    <>
      The uploaded bytes are parsed and discarded. The parsed record expires after {RETENTION_HOURS} hours,
      and records are kept apart per API key. The browser keeps nothing beyond your session. Details on{' '}
      <Link href="/developers/data-handling">data handling</Link>.
    </>,
  ],
  [
    'Can I upload patient data?',
    <>
      On a free key, de-identified data only. An organisation that needs more works under a data processing
      agreement. Either way Oxynet is research software, not a medical device: its results are not a
      diagnosis and must not be used to make medical decisions about a person.
    </>,
  ],
]

export default function VentilatoryThresholdsPage() {
  return (
    <GuidePage
      eyebrow="Ventilatory thresholds"
      title={TITLE}
      lede={
        <p>
          Hand Oxynet the export your metabolic cart writes, unchanged. It reads the file, checks that the
          signal can support a measurement, and returns VT1 and VT2 located by models trained on tests that
          experts labelled. You can run it from an AI assistant, in the browser or from code.
        </p>
      }
    >
      <RunIt />

      <BeforeYouUpload />

      <Section id="files" title="Which files">
        <Prose className="mb-5">
          <p>
            The format is detected automatically. Guides for the vendors whose exports the parser was built
            and checked on:
          </p>
        </Prose>
        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
          {VENDOR_GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={guideHref(g)}
              className="glass rounded-xl border border-hairline p-4 hover:border-accent/40 transition-colors group"
            >
              <p className="text-sm font-medium text-ink-strong group-hover:text-accent transition-colors">{g.title} →</p>
              <p className="text-xs text-ink-subtle mt-1 leading-relaxed">
                {formatsFor(g).length === 1 ? 'One export layout' : `${formatsFor(g).length} export layouts`}
              </p>
            </Link>
          ))}
        </div>
        <Prose className="mt-5">
          <p>
            Every format the parser reads, with what is known about each, is on the{' '}
            <Link href="/developers/formats">supported formats</Link> page.
          </p>
        </Prose>
        <Callout className="mt-6" title="When the file is not on the list">
          <p>
            The upload is refused with the shape to convert into: Oxynet&apos;s own JSON, a list of samples
            with time, VO2, VCO2, VE and whichever other channels the file has. An assistant can do that
            conversion from the refusal&apos;s instructions, and every analysis whose channels survive it then
            runs. Or{' '}
            <a href={MAILTO.feasibility}>send one de-identified export</a> and ask for the format to be added.
          </p>
        </Callout>
      </Section>

      <WhatComesBack />

      <Section id="evidence" title="Who decides the threshold">
        <Prose>
          <p>
            An AI assistant asked to read a CPET will estimate a threshold from the numbers in front of it, and
            the answer will sound right. Connected to Oxynet it does not: it routes the file and explains what
            comes back. The thresholds come from models trained on tests that experts labelled, across cohorts
            that differ in population, protocol, ergometer and metabolic cart. The agreement is published:
          </p>
        </Prose>
        <ul className="mt-5 space-y-3 max-w-3xl">
          {EVIDENCE.map((p) => (
            <li key={p.url}>
              <Card className="p-4">
                <a href={p.url} className="text-sm font-medium text-ink-strong hover:text-accent transition-colors">
                  {p.title}
                </a>
                <p className="text-xs text-ink-subtle mt-1">
                  {p.journal}, {p.year}
                </p>
                <p className="text-sm text-ink-body mt-2 leading-relaxed">{p.description}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="questions" title="Questions">
        <dl className="max-w-3xl space-y-6">
          {QUESTIONS.map(([q, a]) => (
            <div key={q}>
              <dt className="text-[15px] font-semibold text-ink-strong mb-1.5">{q}</dt>
              <dd className="text-ink-body text-[15px] leading-relaxed [&_a]:text-accent [&_a:hover]:underline">{a}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <NextSteps
        links={[
          { href: '/developers/mcp', label: 'Connect an assistant', note: 'Claude, ChatGPT, Claude Code, Gemini CLI and any MCP client.' },
          { href: '/developers/quickstart', label: 'Quick start', note: 'From no key to a first analysis, in curl or Python.' },
        ]}
      />
    </GuidePage>
  )
}
