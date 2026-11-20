import type { Metadata } from 'next'
import Link from 'next/link'
import { DocHeader, Section, Prose, Callout, Facts, Card, NextSteps } from '@/components/developers/doc'
import { CodeBlock } from '@/components/shared/code-block'
import { ENVELOPE_FIELDS } from '@/content/developers/api-v1'
import { RECORDED } from '@/content/developers/meta'
import results from '../../../../manual/data/api-results.json'

export const metadata: Metadata = {
  title: 'CPET API outputs: structured measurements with provenance',
  description:
    'What the Oxynet CPET API returns: ventilatory thresholds, substrate use and oscillation findings (beta) as structured JSON, each with provenance (model, version, analysis version, latency), input quality, a confidence category set by stated rules and plain-language notes.',
  alternates: { canonical: '/developers/outputs' },
}

const REFUSAL_SHAPE = `{
  "analysis": "eov",
  "status": "not_analysable",
  "findings": null,
  "error": "MISSING_CHANNEL",
  "message": "<why, in words>",
  "context": { "<what was needed and what was present>": "..." },
  "provenance": { "analysis_version": "...", "schema_version": "...", "computed_at": "..." },
  "preprocessing": { "version": "...", "read": null, "checks": ["<codes that applied>"] }
}`

export default function OutputsPage() {
  const upload = results.upload
  const vt = results.vt
  const eov = results.eov
  const substrate = { ...results.substrate, windows: results.substrate.windows.slice(0, 2) }
  const metrics = results.metrics

  return (
    <>
      <DocHeader
        eyebrow="Reference"
        title="Not a number: a measurement with its context"
        lede={
          <p>
            Every Oxynet result says what was measured, how good the recording was, what the reader
            must not drop, and exactly what produced it. That is what makes it safe to store, to
            report, and to hand to software or an agent that was not there when it was computed.
          </p>
        }
      />

      <Section id="envelope" title="The envelope">
        <Prose className="mb-5">
          <p>All three analyses return the same outer shape, so a consumer writes one parser.</p>
        </Prose>
        <Facts rows={ENVELOPE_FIELDS.map(([k, v]) => [<code key={k}>{k}</code>, v])} />
      </Section>

      <Section id="why" title="Why each part is there">
        <div className="grid sm:grid-cols-2 gap-4">
          <Card>
            <h3 className="text-sm font-semibold text-ink-strong mb-2"><code className="font-mono">provenance</code></h3>
            <p className="text-sm text-ink-body leading-relaxed">A result can always be traced to the model, version and analysis version that produced it, and when. With no model named, <code className="font-mono">selection</code> says which method answered and why, and <code className="font-mono">members</code> lists a committee&apos;s members. Inference is deterministic: same recording, same model version, same numbers.</p>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-ink-strong mb-2"><code className="font-mono">quality</code></h3>
            <p className="text-sm text-ink-body leading-relaxed">Describes the INPUT: coverage of the core gas channels and whether the sampling interval is known. It says nothing about the answer.</p>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-ink-strong mb-2"><code className="font-mono">confidence</code></h3>
            <p className="text-sm text-ink-body leading-relaxed">A category, low or normal, set by stated rules on the answer, never a number. Low names the rule that fired, such as a threshold placed while the subject was at rest; normal means no rule fired, not that the answer is certain. Nothing is calibrated against clinical outcomes.</p>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-ink-strong mb-2"><code className="font-mono">preprocessing</code></h3>
            <p className="text-sm text-ink-body leading-relaxed">What the analysis read, and which of the recording&apos;s checks applied to it. No answer hides what it was computed from.</p>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-ink-strong mb-2"><code className="font-mono">notes</code> and flags</h3>
            <p className="text-sm text-ink-body leading-relaxed">The caveats that must travel with the numbers: a channel the model ran without, windows where a fat rate is only an upper bound, a protocol that never reached steady state.</p>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-ink-strong mb-2">Refusal</h3>
            <p className="text-sm text-ink-body leading-relaxed">When the recording cannot support an analysis the envelope says so, with a code and the reason, and the other analyses still run. Nothing is computed on inadequate input and returned as if it were fine.</p>
          </Card>
        </div>
      </Section>

      <Section id="recorded" title="Recorded responses">
        <Callout className="mb-6" title="Where these come from">
          <p>
            Real responses from the live API, recorded on {RECORDED.taken} (analysis version{' '}
            {RECORDED.analysisVersion}) against the de-identified reference recording used in the
            manual. They were stored for the manual, which kept only the fields it prints, and some
            nesting was flattened, so live fields such as <code>confidence</code> and{' '}
            <code>preprocessing</code> may be missing here; the <Link href="#envelope">envelope above</Link>{' '}
            lists every field a live response carries. Nothing below was typed by hand.
          </p>
        </Callout>

        <h3 className="text-base font-semibold text-ink-strong mb-3">Upload summary (excerpt)</h3>
        <CodeBlock code={JSON.stringify(upload, null, 2)} lang="json" copy />
        <Prose className="mt-3 mb-8"><p className="text-sm">Note <code>load.available: false</code> with its reason: the export had no work-rate column, and nothing is back-calculated to invent one.</p></Prose>

        <h3 className="text-base font-semibold text-ink-strong mb-3">Thresholds (<code className="font-mono text-sm">vt</code>)</h3>
        <CodeBlock code={JSON.stringify(vt, null, 2)} lang="json" copy />

        <h3 className="text-base font-semibold text-ink-strong mt-8 mb-3">Oscillatory ventilation (<code className="font-mono text-sm">eov</code>), research stage</h3>
        <Prose className="mb-4">
          <p className="text-sm">
            Beta: developed on a single heart-failure cohort, transportability untested. The
            finding here is an oscillation too fast for the EOV definitions, flagged and not graded,
            with the gas analysis confirmed sound. Fields shown as stored for the manual.
          </p>
        </Prose>
        <CodeBlock code={JSON.stringify(eov, null, 2)} lang="json" copy />

        <h3 className="text-base font-semibold text-ink-strong mt-8 mb-3">Substrate use (<code className="font-mono text-sm">substrate</code>)</h3>
        <Prose className="mb-4">
          <p className="text-sm">
            <code>windows</code> cut to the first 2 of {results.substrate.windows.length}. The{' '}
            <code>flags</code> are the part to read: RER above 1.0 in half the windows, so the fat
            rate there is a bound, not a measurement. The equations are returned in{' '}
            <code>method</code>.
          </p>
        </Prose>
        <CodeBlock code={JSON.stringify(substrate, null, 2)} lang="json" copy />

        <h3 className="text-base font-semibold text-ink-strong mt-8 mb-3">Derived quantities (<code className="font-mono text-sm">compute</code>)</h3>
        <Prose className="mb-4">
          <p className="text-sm">
            Values only; the live response wraps each as <code>{'{status: "ok", value}'}</code>. The
            V&#775;E/V&#775;CO&#8322; slope is a profile over the test, not one number, and the
            landmarks carry their own reading note: they corroborate, they never override a model.
          </p>
        </Prose>
        <CodeBlock code={JSON.stringify(metrics, null, 2)} lang="json" copy />
      </Section>

      <Section id="refusal" title="A refusal">
        <Prose className="mb-4"><p>The shape of an analysis that could not run, inside a 200 that carries the others:</p></Prose>
        <CodeBlock code={REFUSAL_SHAPE} lang="json" filename="shape, not a recording" />
      </Section>

      <Callout tone="todo">
        <p>
          A complete, unabridged response on the downloadable synthetic sample, recorded with a
          key, so the example and the sample file match one to one.
        </p>
      </Callout>

      <NextSteps
        links={[
          { href: '/developers/patterns', label: 'Integration patterns', note: 'Where these results go next.' },
          { href: '/developers/api/v1#versioning', label: 'Versioning', note: 'Which fields to store and pin on.' },
        ]}
      />
    </>
  )
}
