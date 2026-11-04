import type { Metadata } from 'next'
import Link from 'next/link'
import { DocHeader, Section, Prose, Callout, Facts, StatusBadge, NextSteps } from '@/components/developers/doc'
import { CodeBlock } from '@/components/shared/code-block'
import { readExample } from '@/lib/examples'
import { LINKS, PYOXYNET } from '@/content/developers/meta'

export const metadata: Metadata = {
  title: 'CPET analysis in Python',
  description:
    'Analyse cardiopulmonary exercise tests from Python: call the Oxynet CPET API with requests for ventilatory thresholds, substrate use and derived metrics, or run local research inference with the open-source pyoxynet package.',
  alternates: { canonical: '/developers/python' },
}

const MINIMAL = `import os, requests

BASE = "https://app.oxynet.net"
H = {"X-API-Key": os.environ["OXYNET_API_KEY"]}

with open("oxynet_sample.json", "rb") as f:
    rec = requests.post(f"{BASE}/v1/cpet", headers=H, files={"file": f}).json()

out = requests.post(f"{BASE}/v1/cpet/{rec['cpet_id']}/analyze",
                    headers=H, json={"analyses": ["vt"]}).json()
print(out["results"][0]["findings"])`

const ERRORS = `r = requests.post(f"{BASE}/v1/cpet/{cpet_id}/analyze", headers=H,
                  json={"analyses": ["vt", "eov"]})

if r.status_code == 429:
    wait = int(r.headers.get("Retry-After", "5"))   # back off, then retry
elif not r.ok:
    err = r.json()           # {"error": CODE, "message": ..., "context": {...}}
    raise RuntimeError(f"{err['error']}: {err['message']}")
else:
    for env in r.json()["results"]:
        if env["status"] == "not_analysable":
            # Not an exception: the recording cannot support this analysis.
            # Keep the reason; it belongs in the dataset.
            print(env["analysis"], "refused:", env["error"], env["message"])`

const LOCAL = `import pyoxynet

# The bundled example test, through the default model
out_df, thresholds = pyoxynet.test_pyoxynet()

print(thresholds['VT1']['time'], round(thresholds['VT1']['VO2']))  # 372 2979
print(thresholds['VT2']['time'], round(thresholds['VT2']['VO2']))  # 550 3656`

export default function PythonPage() {
  const full = readExample('examples/python/quickstart.py')

  return (
    <>
      <DocHeader
        eyebrow="Python"
        title="Oxynet from Python"
        lede={
          <p>
            Two different things, and it matters which one you want. The hosted engine is reached
            from Python over plain HTTP. The open-source <code className="font-mono text-base">pyoxynet</code>{' '}
            package runs research models locally and is not a client for the hosted engine.
          </p>
        }
      />

      <Section id="which" title="Which one">
        <div className="overflow-x-auto rounded-xl border border-hairline">
          <table className="w-full text-sm min-w-[36rem]">
            <thead>
              <tr className="border-b border-hairline bg-surface/40 text-left">
                {['', 'Hosted API from Python', 'pyoxynet package'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[10px] font-mono uppercase tracking-[0.14em] text-ink-subtle font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="[&_td]:px-4 [&_td]:py-2.5 [&_td]:align-top [&_tr]:border-t [&_tr]:border-hairline">
              <tr><td className="text-ink-subtle">What runs</td><td className="text-ink-body">The production engine: every analysis on the <Link href="/developers/analyses" className="text-accent hover:underline">catalogue</Link></td><td className="text-ink-body">Two frozen research models from the papers (intensity domains, VT1 and VT2) and a synthetic CPET generator</td></tr>
              <tr><td className="text-ink-subtle">Vendor files</td><td className="text-ink-body">Read as exported, format detected</td><td className="text-ink-body">You prepare the input table yourself</td></tr>
              <tr><td className="text-ink-subtle">Where data goes</td><td className="text-ink-body">To app.oxynet.net, see <Link href="/developers/data-handling" className="text-accent hover:underline">Data handling</Link></td><td className="text-ink-body">Nowhere; runs on your machine</td></tr>
              <tr><td className="text-ink-subtle">Access</td><td className="text-ink-body">API key</td><td className="text-ink-body">Open source (MIT), no key</td></tr>
              <tr><td className="text-ink-subtle">Status</td><td><StatusBadge status="production" /></td><td><StatusBadge status="available" /></td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-ink-faint mt-3 max-w-3xl">
          Results from the package are not guaranteed to match the hosted engine: the two are
          separate codebases, the package does not include the hosted parsers or signal
          conditioning, and its models are the frozen research models, not the ones the hosted
          engine runs.
        </p>
      </Section>

      <Section id="hosted" title="The hosted engine from Python">
        <Callout tone="todo" title="Not yet available">
          <p>
            An Oxynet client package. There is none today, and none is implied by the examples: they
            use <code>requests</code> against the documented endpoints. Generating a typed client from{' '}
            <a href={LINKS.openapi}>the OpenAPI schema</a> (for example with openapi-python-client)
            also works. When an official client ships, it will be documented here.
          </p>
        </Callout>

        <h3 className="text-base font-semibold text-ink-strong mt-8 mb-3">Install and authenticate</h3>
        <CodeBlock code={`pip install requests\nexport OXYNET_API_KEY=sk_live_...   # never commit it`} lang="sh" copy />

        <h3 className="text-base font-semibold text-ink-strong mt-8 mb-3">Minimal</h3>
        <CodeBlock code={MINIMAL} lang="python" copy />

        <h3 className="text-base font-semibold text-ink-strong mt-8 mb-3">Complete</h3>
        <Prose className="mb-4"><p>Capabilities, upload, every analysis the key holds, derived quantities, deletion.</p></Prose>
        <CodeBlock code={full.code} lang="python" filename="python/quickstart.py" download={full.href} copy />

        <h3 className="text-base font-semibold text-ink-strong mt-8 mb-3">What comes back</h3>
        <Facts
          rows={[
            ['Upload', <><code key="a">cpet_id</code>, <code key="b">source.format</code>, <code key="c">channels</code> (present, coverage, reason), <code key="d">sampling</code>, <code key="e">load</code>, <code key="f">flags</code>, <code key="g">expires_at</code></>],
            ['Analyze', <><code key="a">{'{cpet_id, results: [envelope, ...]}'}</code></>],
            ['Compute', <><code key="a">{'{cpet_id, metrics: {name: {status, value | error}}, provenance}'}</code></>],
          ]}
        />
        <p className="mt-3 text-sm"><Link href="/developers/outputs" className="text-accent hover:underline">Field-by-field →</Link></p>

        <h3 className="text-base font-semibold text-ink-strong mt-8 mb-3">Errors and refusals</h3>
        <Prose className="mb-4">
          <p>
            An HTTP error means the request failed. A <code>not_analysable</code> envelope inside a
            200 means the request worked and the recording cannot support that analysis. Treat
            them differently.
          </p>
        </Prose>
        <CodeBlock code={ERRORS} lang="python" copy />

        <h3 className="text-base font-semibold text-ink-strong mt-8 mb-3">Versioning</h3>
        <Prose>
          <p>
            Store <code>provenance</code> with every result. A cohort analysed across a model or
            analysis version change should be visible as such in your data, not discovered later.
          </p>
        </Prose>
      </Section>

      <Section id="pyoxynet" title="pyoxynet: local research inference">
        <Facts
          rows={[
            ['Install', <code key="i">pip install pyoxynet</code>],
            ['Version', `${PYOXYNET.version} on PyPI`],
            ['Python', `${PYOXYNET.python}; Windows, Linux, macOS (Apple silicon)`],
            ['Models', 'CNN (default, evaluated in Keir et al., Sports Medicine 2026) and LSTM; frozen'],
            ['Licence', PYOXYNET.license],
            ['Source', <a key="s" href={LINKS.pyoxynetRepo} className="text-accent hover:underline">github.com/oxynet-cpet/pyoxynet</a>],
            ['Documentation', <a key="d" href={LINKS.pyoxynetDocs} className="text-accent hover:underline">pyoxynet.readthedocs.io</a>],
          ]}
        />
        <Prose className="my-5">
          <p>
            The models are LiteRT files and run without TensorFlow. The input is a table with
            the columns <code>time</code>, <code>VO2_I</code>, <code>VCO2_I</code>,{' '}
            <code>VE_I</code>, <code>PetO2_I</code> and <code>PetCO2_I</code>, which you prepare
            from your export. The README&apos;s own example:
          </p>
        </Prose>
        <CodeBlock code={LOCAL} lang="python" filename="from the pyoxynet README" copy />
        <Prose className="mt-5">
          <p>
            For partners who need the production engine to run locally rather than through the
            hosted API, see <Link href="/developers/partners#deployment">local and embedded deployment</Link>.
          </p>
        </Prose>
      </Section>

      <NextSteps
        links={[
          { href: '/developers/api/v1', label: 'API reference (v1)', note: 'Endpoints, errors, limits.' },
          { href: '/developers/downloads', label: 'Downloads', note: 'Examples and synthetic samples.' },
        ]}
      />
    </>
  )
}
