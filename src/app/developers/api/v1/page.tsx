import type { Metadata } from 'next'
import Link from 'next/link'
import { DocHeader, Section, Prose, Callout, Facts, NextSteps } from '@/components/developers/doc'
import { CodeBlock } from '@/components/shared/code-block'
import { loadOpenApi } from '@/lib/openapi'
import { ENDPOINT_NOTES, OUTSIDE_SCHEMA, OPEN_ENDPOINTS, LIMITS, ERRORS, REFUSALS, REFUSAL_MEANINGS, ENVELOPE_FIELDS } from '@/content/developers/api-v1'
import { API_BASE, LINKS, MAILTO, RECORDED } from '@/content/developers/meta'

export const metadata: Metadata = {
  title: 'CPET API reference (v1)',
  description:
    'The Oxynet REST API for cardiopulmonary exercise testing: authentication, upload, analysis of ventilatory thresholds, substrate use and oscillatory ventilation (beta), derived metrics, errors, limits, retention and versioning.',
  alternates: { canonical: '/developers/api/v1' },
}

// The endpoint table is read from the live schema; refresh it hourly.
export const revalidate = 3600

const METHOD_CLASS: Record<string, string> = {
  GET: 'text-sky-500',
  POST: 'text-accent',
  DELETE: 'text-red-400',
}

function Method({ m }: { m: string }) {
  return <span className={`font-mono text-xs font-semibold ${METHOD_CLASS[m] ?? 'text-ink-strong'}`}>{m}</span>
}

const AUTH = `curl -s -H "X-API-Key: $OXYNET_API_KEY" ${API_BASE}/v1/capabilities`

const ERROR_SHAPE = `{
  "error": "MISSING_CHANNEL",
  "message": "...",
  "context": { "required": [...], "missing": [...] }
}`

export default async function ApiV1Page() {
  const schema = await loadOpenApi()

  return (
    <>
      <DocHeader
        eyebrow="REST API · v1"
        title="API reference"
        lede={
          <p>
            Base URL <code className="font-mono text-base text-ink-strong">{API_BASE}</code>. Every
            request and response is JSON except the multipart upload. The authoritative, generated
            reference is the service&apos;s own{' '}
            <a href={LINKS.openapi} className="text-accent hover:underline">OpenAPI schema</a> and{' '}
            <a href={LINKS.apiDocs} className="text-accent hover:underline">app.oxynet.net/docs</a>;
            this page adds what a schema cannot say.
          </p>
        }
      />

      <Section id="lifecycle" title="The one rule">
        <Prose>
          <p>
            Hand Oxynet the file, work with the handle. Upload the vendor export unchanged and
            receive a <code>cpet_id</code>; every later call names it, and the signals never travel
            back through the caller unless a picture is being drawn. The lifecycle is the same for a
            hospital integration, a script and an agent:
          </p>
        </Prose>
        <ol className="mt-5 space-y-2 max-w-3xl font-mono text-[13px]">
          {[
            ['GET', '/v1/capabilities', 'what may this key do'],
            ['POST', '/v1/cpet', 'upload → cpet_id, and the checks'],
            ['POST', '/v1/cpet/{id}/assess', 'everything that applies, in one call'],
            ['POST', '/v1/cpet/{id}/analyze', 'or one by one: thresholds, substrate, oscillation (beta)'],
            ['POST', '/v1/cpet/{id}/compute', 'derived quantities, input checks'],
            ['DELETE', '/v1/cpet/{id}', 'or let it expire'],
          ].map(([m, p, what], i) => (
            <li key={p + m} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-ink-faint w-4">{i + 1}</span>
              <Method m={m} />
              <span className="text-ink-strong">{p}</span>
              <span className="text-ink-faint font-sans text-xs"># {what}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="auth" title="Authentication">
        <Prose className="mb-5">
          <p>
            An API key in the <code>X-API-Key</code> header on every request. A free key comes from{' '}
            <a href={LINKS.signup}>signing up</a>; Oxynet issues keys with higher limits to
            organisations (<a href={MAILTO.key}>request one</a>). Each key carries a tier, which governs the
            models it can reach, and a set of products, which governs the analyses it can run, plus
            an optional monthly limit and expiry. Records are partitioned per key: one key cannot
            read another&apos;s uploads.
          </p>
          <p>
            Without a key, only these answer: {OPEN_ENDPOINTS.map((p, i) => <span key={p}>{i > 0 && ', '}<code>{p}</code></span>)}.
            An upload URL minted by <code>POST /v1/uploads</code> carries its own short-lived
            credential and takes no key.
          </p>
        </Prose>
        <CodeBlock code={AUTH} lang="sh" copy />
      </Section>

      <Section id="endpoints" title="Endpoints">
        {schema ? (
          <>
            <p className="text-xs font-mono text-ink-faint mb-4">
              Read from {LINKS.openapi} ({schema.title}, info.version {schema.version}, OpenAPI {schema.openapi}) when this page was built.
            </p>
            <div className="rounded-xl border border-hairline divide-y divide-hairline">
              {schema.operations.map((op) => {
                const note = ENDPOINT_NOTES[`${op.method} ${op.path}`]
                return (
                  <div key={op.method + op.path} className="px-4 py-3.5">
                    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <Method m={op.method} />
                      <span className="font-mono text-[13px] text-ink-strong break-all">{op.path}</span>
                      <span className="text-sm text-ink-subtle">{op.summary}</span>
                    </p>
                    {note && <p className="text-sm text-ink-body leading-relaxed mt-1.5 max-w-3xl">{note}</p>}
                  </div>
                )
              })}
              {OUTSIDE_SCHEMA.map((op) => (
                <div key={op.method + op.path} className="px-4 py-3.5 bg-surface/30">
                  <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <Method m={op.method} />
                    <span className="font-mono text-[13px] text-ink-strong">{op.path}</span>
                    <span className="text-sm text-ink-subtle">{op.summary}</span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-faint">not in the importer schema</span>
                  </p>
                  <p className="text-sm text-ink-body leading-relaxed mt-1.5 max-w-3xl">{op.note}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-ink-faint mt-3 max-w-3xl">
              The public schema is shaped for importers such as GPT Actions, which reject multipart
              operations, so the two multipart uploads are documented here and omitted there. The
              schema declares request bodies; response shapes are documented below and in{' '}
              <Link href="/developers/outputs" className="text-accent hover:underline">Outputs</Link>.
            </p>
          </>
        ) : (
          <Callout tone="warn" title="Schema unavailable at build time">
            <p>
              The endpoint list is read from <a href={LINKS.openapi}>{LINKS.openapi}</a>, which could
              not be fetched when this page was built. Read it there directly.
            </p>
          </Callout>
        )}
      </Section>

      <Section id="upload" title="Upload and input">
        <Prose>
          <p>
            Three ways in, one result. <code>POST /v1/cpet</code> takes multipart field{' '}
            <code>file</code> from your own code. <code>POST /v1/cpet/content</code> takes{' '}
            <code>{'{filename, content | content_base64}'}</code> for callers that cannot send
            multipart; keep the real extension in <code>filename</code>, because it is part of the
            evidence for detection. <code>POST /v1/uploads</code> returns a one-shot URL for a file
            on disk, so an agent never holds the bytes. Every route returns the upload summary:
            detected format, each channel with its coverage and, if absent, the reason; the sampling
            the file arrived at; the external load; parser flags; and a <code>preprocessing</code>{' '}
            block, the one pass every analysis then reads.
          </p>
          <p>
            Read <code>preprocessing.checks</code> before analysing. Each check carries a code, a
            message and its effect on each analysis, <code>refused</code> or{' '}
            <code>caution</code>: a check that refuses thresholds will refuse them, with the same
            message, so the caller can say so at once instead of spending an analysis to find out.
          </p>
          <p>
            Detection reads the content and refuses when no candidate is clearly best. If nothing
            reads a file, the <code>UNSUPPORTED_FORMAT</code> error returns the canonical JSON shape
            to convert into; that is the only case in which converting a file yourself is correct.
            See <Link href="/developers/formats">Supported formats</Link>.
          </p>
        </Prose>
      </Section>

      <Section id="analyses" title="Analyses and the envelope">
        <Prose className="mb-5">
          <p>
            <code>POST /v1/cpet/{'{id}'}/analyze</code> with{' '}
            <code>{'{"analyses": ["vt", "eov", "substrate"]}'}</code> returns{' '}
            <code>{'{cpet_id, results: [...]}'}</code>, one envelope per analysis in the order asked.
            An analysis the recording cannot support comes back as <code>not_analysable</code> inside
            the 200, with the reason, and the others still run. <code>&quot;signal&quot;</code> is
            not an analysis name: signal processing is read from <code>GET /v1/cpet/{'{id}'}</code>{' '}
            and the input-quality metrics. Oscillatory ventilation (<code>eov</code>) is beta:
            developed on one heart-failure cohort, transportability untested.
          </p>
          <p>
            With no <code>model</code> named, the thresholds come from the method with the best
            measured record on that kind of test, the same routed answer the browser and MCP give.
            First in that order is a committee, <code>fellowship</code>: gradient-boosted trees
            (treebeard, which needs only VO2, VCO2 and VE) and the networks gandalf, pippin and
            rosie, combined. It answers
            when every member can run on the recording; otherwise a single method answers, treebeard
            first, so a file without end-tidal gases is still analysed. <code>provenance.selection</code>{' '}
            says which method answered and why.
          </p>
          <p>
            <code>POST /v1/cpet/{'{id}'}/assess</code> (MCP: <code>assess_cpet</code>) runs every
            analysis the key includes and the recording supports in one call, and adds the derived
            metrics, a <code>headline</code> and a <code>plan</code> saying what ran and why anything
            did not. It is billed one unit per analysis that ran; the metrics are included.
          </p>
        </Prose>
        <Facts rows={ENVELOPE_FIELDS.map(([k, v]) => [<code key={k}>{k}</code>, v])} />
        <h3 className="text-sm font-semibold text-ink-strong mt-8 mb-3">Refusal codes inside a 200</h3>
        <Facts rows={REFUSALS.map(([k, v]) => [<code key={k}>{k}</code>, <span key={k} className="font-mono text-xs">{v}</span>])} />
        <p className="mt-4 mb-3 text-sm text-ink-body">The codes that need a word of explanation. The first four are about the recording itself, and the upload&apos;s checks announce them before any analysis runs. Refusals are never billed.</p>
        <Facts rows={REFUSAL_MEANINGS.map(([k, v]) => [<code key={k}>{k}</code>, v])} />
        <p className="mt-4 text-sm"><Link href="/developers/analyses" className="text-accent hover:underline">What each analysis measures, and its evidence status →</Link></p>
      </Section>

      <Section id="errors" title="Errors">
        <Prose className="mb-5">
          <p>Every error response has one shape, and <code>context</code> says what would have worked:</p>
        </Prose>
        <CodeBlock code={ERROR_SHAPE} lang="json" />
        <div className="mt-6 overflow-x-auto rounded-xl border border-hairline">
          <table className="w-full text-sm min-w-[36rem]">
            <thead>
              <tr className="border-b border-hairline bg-surface/40 text-left">
                {['HTTP', 'error', 'Meaning'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[10px] font-mono uppercase tracking-[0.14em] text-ink-subtle font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ERRORS.map((e) => (
                <tr key={e.code} className="border-t border-hairline align-top">
                  <td className="px-4 py-2.5 font-mono text-xs text-ink-subtle">{e.http}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-ink-strong whitespace-nowrap">{e.code}</td>
                  <td className="px-4 py-2.5 text-ink-body">{e.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="limits" title="Limits, quotas and retention">
        <Facts rows={LIMITS} />
        <Prose className="mt-5">
          <p>
            Your key&apos;s own values are in <code>GET /v1/capabilities</code> under{' '}
            <code>limits</code>. Uploaded bytes are parsed and discarded, never stored; the parsed
            record is deleted at expiry or on <code>DELETE</code>. See{' '}
            <Link href="/developers/data-handling">Data handling</Link>.
          </p>
        </Prose>
        <Callout tone="todo" className="mt-5">
          <p>A published rate-limit figure and a latency or availability commitment. Neither is stated today; the API reports latency per result in <code>provenance.latency_ms</code>.</p>
        </Callout>
      </Section>

      <Section id="versioning" title="Versioning">
        <Facts
          rows={[
            ['API', <><code key="a">v1</code> in the path and in the schema&apos;s info.version. Breaking changes would ship as <code key="b">/v2</code> beside it, documented at <code key="c">/developers/api/v2</code>.</>],
            ['Analysis', <><code key="a">provenance.analysis_version</code>, currently {RECORDED.analysisVersion}.</>],
            ['Response schema', <><code key="a">provenance.schema_version</code> and the upload summary&apos;s <code key="b">schema_version</code>.</>],
            ['Model', <><code key="a">provenance.model</code> and <code key="b">model_version</code>. Omit <code key="c">model</code> in requests to get the routed best method, the same answer the browser and MCP give; <code key="d">provenance.selection</code> says which method answered and why.</>],
            ['Determinism', 'The same recording returns the same numbers on the same model version.'],
            ['Request strictness', 'An unrecognised request field is a 422 naming it, so a typo cannot silently run on defaults.'],
          ]}
        />
        <Callout tone="todo" className="mt-5">
          <p>A public changelog and a deprecation policy for model and analysis versions. Until they exist, pin on the provenance fields and store them with every result.</p>
        </Callout>
      </Section>

      <NextSteps
        links={[
          { href: '/developers/outputs', label: 'Outputs and provenance', note: 'Full recorded envelopes for all three analyses.' },
          { href: '/developers/downloads', label: 'Downloads', note: 'OpenAPI, examples, sample data.' },
        ]}
      />
    </>
  )
}
