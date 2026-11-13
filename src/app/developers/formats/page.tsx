import type { Metadata } from 'next'
import Link from 'next/link'
import { DocHeader, Section, Prose, Callout, Facts, NextSteps } from '@/components/developers/doc'
import { CodeBlock } from '@/components/shared/code-block'
import { FormatsTable, type FormatRow } from '@/components/developers/formats-table'
import { PUBLIC_FORMATS, EVIDENCE_LABEL, CANONICAL_UNITS } from '@/content/developers/formats'
import { VENDOR_FORMATS } from '@/content/facts'
import { MAILTO } from '@/content/developers/meta'

export const metadata: Metadata = {
  title: 'Supported CPET file formats: COSMED, CORTEX, PNOE, VO2 Master and more',
  description: `The ${VENDOR_FORMATS} metabolimeter export formats Oxynet reads with automatic detection, including COSMED Omnia, CORTEX MetaSoft, PNOE and VO2 Master exports, and the canonical JSON to convert into when a file is not supported.`,
  alternates: { canonical: '/developers/formats' },
}

const CANONICAL = `{
  "id": "a label of your choosing",
  "data": [
    { "t": 0.0, "VO2": 800.0, "VCO2": 700.0, "VE": 15.0,
      "RF": 22.0, "PetO2": 100.0, "PetCO2": 38.0, "HR": 70.0 }
  ]
}`

export default function FormatsPage() {
  const rows: FormatRow[] = PUBLIC_FORMATS.map((f) => ({ ...f, evidenceLabel: EVIDENCE_LABEL[f.evidence] }))
  const oxynetOwn = PUBLIC_FORMATS.filter((f) => f.evidence === 'oxynet').length

  return (
    <>
      <DocHeader
        eyebrow="Reference"
        title="Can Oxynet read our files?"
        lede={
          <p>
            {VENDOR_FORMATS} format ids, detected from the file&apos;s content. {VENDOR_FORMATS - oxynetOwn} are
            exports from metabolimeter software or from a laboratory&apos;s own profile of it;{' '}
            {oxynetOwn} are Oxynet&apos;s own file shapes. Any other table whose columns carry standard
            channel names is read by those names, or refused with the reason. This list is generated
            from the parser that runs in production, so it cannot say more than the parser does.
          </p>
        }
      />

      <Section id="list" title="Formats">
        <FormatsTable rows={rows} />
        <Prose className="mt-5">
          <p className="text-sm">
            <strong>Vendor named</strong>: the parser was built on exports from that vendor&apos;s
            software. <strong>Vendor unconfirmed</strong>: the export&apos;s structure is known, its
            origin is not. <strong>Lab export</strong>: a laboratory&apos;s export profile whose
            metabolimeter the repository does not record. The authenticated{' '}
            <code>GET /v1/formats</code> returns the same ids with the parser&apos;s own labels.
          </p>
        </Prose>
      </Section>

      <Section id="what-it-means" title="What “supported” means">
        <Facts
          rows={[
            ['Detection', 'Automatic, from content. Every candidate parser scores the file; one must clear a threshold and beat the runner-up clearly, or the upload is refused rather than guessed.'],
            ['Units and clocks', 'Each parser knows its format’s units, per-phase clock resets and decimal conventions. Send the export unchanged.'],
            ['Absent channels', 'Reported as absent, with the reason. Nothing is back-calculated: no work rate from oxygen uptake, for example.'],
            ['Sampling', 'Breath by breath or interval averaged. The interval the file arrived at is reported.'],
            ['Versions', 'A parser was built on example files from specific software versions. Another version of the same vendor’s software may export differently.'],
          ]}
        />
        <Callout className="mt-6" title="The reliable test">
          <p>
            One de-identified export from your system. We run it and return what parsed, what did
            not and why. <a href={MAILTO.feasibility}>Send a representative file</a>, or upload it
            yourself with a key and read the upload summary.
          </p>
        </Callout>
      </Section>

      <Section id="unsupported" title="When nothing reads a file">
        <Prose className="mb-5">
          <p>
            The refusal (<code>UNSUPPORTED_FORMAT</code>) returns the shape to convert into, and
            that is the one case where converting a file yourself is correct. It is Oxynet&apos;s
            canonical JSON (format id <code>canonical_json</code>), the same shape as the{' '}
            <Link href="/developers/downloads#samples">synthetic samples</Link>. At least 40 rows,
            and <code>t</code>, <code>VO2</code>, <code>VCO2</code>, <code>VE</code> are required.
          </p>
        </Prose>
        <CodeBlock code={CANONICAL} lang="json" filename="canonical.json" copy />
        <div className="mt-5">
          <Facts rows={CANONICAL_UNITS.map(([k, v]) => [<code key={k}>{k}</code>, v])} />
        </div>
        <Callout tone="warn" className="mt-5">
          <p>
            <code>VO2</code> and <code>VCO2</code> are in mL/min. A column in L/min copied across
            unchanged is wrong by a factor of a thousand and nothing downstream will notice. State
            the mapping and units you assumed wherever the result is used.
          </p>
        </Callout>
        <Callout tone="todo" className="mt-5">
          <p>
            A downloadable example export per vendor. Real exports are health data and none is
            cleared for publication; the synthetic samples are the only files offered.
          </p>
        </Callout>
      </Section>

      <NextSteps
        links={[
          { href: '/developers/analyses', label: 'Analysis catalogue', note: 'Which channels each analysis needs.' },
          { href: '/developers/partners', label: 'Partner onboarding', note: 'From one file to an integration.' },
        ]}
      />
    </>
  )
}
