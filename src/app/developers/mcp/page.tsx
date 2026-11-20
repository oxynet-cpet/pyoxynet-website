import type { Metadata } from 'next'
import Link from 'next/link'
import { DocHeader, Section, Prose, Callout, Flow, Card, Facts, NextSteps } from '@/components/developers/doc'
import { CodeBlock } from '@/components/shared/code-block'
import { readExample } from '@/lib/examples'
import { MCP_TOOLS, type McpToolName } from '@/generated/registry'
import { LINKS } from '@/content/developers/meta'
import { RETENTION_HOURS } from '@/content/facts'

export const metadata: Metadata = {
  title: 'CPET for AI agents: the Oxynet MCP server',
  description:
    'Connect Claude, Gemini CLI or any MCP client to Oxynet so an AI agent can analyse cardiopulmonary exercise tests with validated physiological models instead of estimating thresholds from the numbers in its context.',
  alternates: { canonical: '/developers/mcp' },
}

/**
 * One line per tool the server serves. Typed against the generated tool list,
 * so a tool added to or removed from scripts/mcp_server.py in core fails tsc
 * here after `registry.py sync`. Wording condensed from each tool's own
 * description in that file.
 */
const TOOL_SUMMARY = {
  get_capabilities: 'What this key may do: analyses, models, metrics, limits, retention. Called first.',
  get_sample_cpet: 'Uploads a synthetic recording server-side and returns a cpet_id. For demonstrations, never a patient file.',
  create_upload: 'One-shot upload URLs (up to 200 at once), valid 5 minutes, so a file on disk goes straight to Oxynet.',
  upload_cpet: 'Upload contents the agent already holds, for example a file attached to the chat.',
  get_cpet: 'The signal view: detected format, channels and coverage, sampling, external load, parser flags.',
  analyze_vt: 'Ventilatory thresholds VT1 and VT2, with quality, notes and provenance.',
  analyze_eov: 'Oscillatory ventilation and the ventilatory control loop (beta).',
  analyze_substrate: 'Fat and carbohydrate oxidation, FATMAX, the crossover, gross efficiency.',
  list_metrics: 'Every derived quantity, with its unit, requirements and reading traps.',
  compute_metrics: 'Derived quantities and input checks: phases, gas_quality, substrate_summary, peaks, slope profile.',
  get_cpet_series: 'Downsampled signals, for drawing a picture only.',
  delete_cpet: 'Remove a recording now rather than at the 24 h expiry.',
} satisfies Record<McpToolName, string>

const DESKTOP = `Not in the directory list? Settings → Connectors → Add custom connector
URL: ${LINKS.mcp}
Leave the other fields blank. A browser opens and asks for the API key once.`

const CHATGPT = `Explore GPTs → Create → Configure → Create new action → Import from URL:
  ${LINKS.openapi}
Authentication: API Key · Auth Type: Custom · Custom Header Name: X-API-Key`

export default function McpPage() {
  const claude = readExample('examples/mcp/claude-code.sh')
  const gemini = readExample('examples/mcp/gemini-settings.json')

  return (
    <>
      <DocHeader
        eyebrow="MCP and AI agents"
        title="A physiological tool layer for agents"
        lede={
          <p>
            Oxynet provides the physiological computation. The agent provides orchestration and
            explanation. Connected over the Model Context Protocol, an assistant calls models that
            were evaluated against expert labelling, and reports what came back.
          </p>
        }
      />

      <Section id="why" title="Why it exists">
        <div className="grid md:grid-cols-[minmax(0,1fr)_17rem] gap-8 items-start">
          <Prose>
            <p>
              A general-purpose assistant given a CPET will tend to estimate a threshold from the
              numbers in its context, and the estimate will sound right. Connected to Oxynet, it
              routes the question to the engine instead. The thresholds, the substrate curve and the
              oscillation grade are computed by Oxynet; the agent decides what to ask, compares
              results across tests, and explains them.
            </p>
            <p>
              The file goes from disk to Oxynet and only the structured result comes back. A 360 KB
              export inlined into a conversation is roughly ninety thousand tokens; through a handle
              it is a few hundred, which is what makes a folder of recordings tractable at all.
            </p>
          </Prose>
          <Flow
            label="How an agent uses Oxynet"
            steps={[
              { label: 'User / clinician' },
              { label: 'AI agent', sub: 'routes, compares, explains' },
              { label: 'Oxynet MCP tools', accent: true },
              { label: 'CPET analysis', sub: 'validated models', accent: true },
              { label: 'Structured results', accent: true },
              { label: 'Agent response / workflow' },
            ]}
          />
        </div>
      </Section>

      <Section id="roles" title="Who does what">
        <div className="grid sm:grid-cols-2 gap-4">
          <Card accent>
            <h3 className="text-sm font-semibold text-accent mb-3">Oxynet</h3>
            <ul className="text-sm text-ink-body space-y-1.5 list-disc pl-4">
              <li>Parses the vendor file and conditions the signals</li>
              <li>Locates thresholds, measures substrate use, grades oscillation</li>
              <li>Checks whether the recording can support each measurement</li>
              <li>Refuses, with the reason, when it cannot</li>
              <li>Stamps every result with model, version and analysis version</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-ink-strong mb-3">The agent</h3>
            <ul className="text-sm text-ink-body space-y-1.5 list-disc pl-4">
              <li>Decides which analyses answer the question</li>
              <li>Handles the files the user names, and only those</li>
              <li>Compares, ranks and tabulates structured results</li>
              <li>Explains them, passing on notes and refusals</li>
              <li>Never turns the low or normal confidence category into a number</li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section id="connect" title="Connect">
        <Facts
          rows={[
            ['Endpoint', <code key="e">{LINKS.mcp}</code>],
            ['Transport', 'Streamable HTTP'],
            ['MCP Registry', <><a key="r" href={LINKS.mcpRegistry} className="text-accent hover:underline"><code>net.oxynet/cpet</code></a> in the official MCP Registry, for clients that install servers from it</>],
            ['Authentication', <>An <code key="k">X-API-Key</code> header, or OAuth in clients that use it (Claude, Claude Code), where the login is the same API key</>],
            ['Key', <><a key="s" href={LINKS.signup} className="text-accent hover:underline">Free at app.oxynet.net/signup</a>, or <Link key="l" href="/developers/quickstart#access" className="text-accent hover:underline">issued by Oxynet</Link> for an organisation. The MCP server and REST share one key.</>],
          ]}
        />
        <div className="space-y-6 mt-8">
          <div>
            <h3 className="text-sm font-semibold text-ink-strong mb-3">Claude Code</h3>
            <CodeBlock code={claude.code} lang="bash" filename="mcp/claude-code.sh" download={claude.href} copy />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink-strong mb-3">Claude (web, Desktop, mobile)</h3>
            <p className="text-sm text-ink-body mb-3">
              Oxynet is in Claude&apos;s connector directory:{' '}
              <a href={LINKS.claudeDirectory} className="text-accent hover:underline">open the Oxynet listing</a>,
              connect, and paste the API key once on Oxynet&apos;s sign-in page.
            </p>
            <CodeBlock code={DESKTOP} lang="sh" />
            <p className="text-xs text-ink-faint mt-2">These apps have no shell, so files are attached to the chat and uploaded with <code className="font-mono">upload_cpet</code>.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink-strong mb-3">Gemini CLI</h3>
            <CodeBlock code={gemini.code} lang="json" filename="~/.gemini/settings.json" download={gemini.href} copy />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink-strong mb-3">ChatGPT (Custom GPT Action, over REST)</h3>
            <CodeBlock code={CHATGPT} lang="sh" />
          </div>
        </div>
        <Prose className="mt-6">
          <p>
            An agent that can make HTTP requests needs no connector at all: the plain-text guide at{' '}
            <a href={LINKS.llmsFull}>/llms-full.txt</a> is written for it to read in one request.
          </p>
        </Prose>
      </Section>

      <Section id="tools" title="Tools">
        <div className="rounded-xl border border-hairline divide-y divide-hairline">
          {MCP_TOOLS.map((t) => (
            <div key={t} className="px-4 py-3 grid sm:grid-cols-[12rem_minmax(0,1fr)] gap-x-4 gap-y-1">
              <code className="font-mono text-[13px] text-ink-strong">{t}</code>
              <p className="text-sm text-ink-body">{TOOL_SUMMARY[t]}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink-faint mt-3">In the order the server declares them. <code className="font-mono">&quot;signal&quot;</code> is not an analysis name: it is <code className="font-mono">get_cpet</code> plus <code className="font-mono">compute_metrics</code>.</p>
      </Section>

      <Section id="calls" title="A typical run">
        <CodeBlock
          lang="sh"
          code={`get_capabilities()                          # analyses are licensed separately
create_upload()                             # -> upload_url, valid 5 minutes
$ curl -F "file=@test.xlsx" <upload_url>    # the shell moves the file -> cpet_id
get_cpet(cpet_id)                           # what is in it, what is absent and why
analyze_vt(cpet_id)                         # one tool per analysis
analyze_substrate(cpet_id)
compute_metrics(cpet_id, ["gas_quality", "ve_vco2_slope"])
delete_cpet(cpet_id)`}
        />
        <p className="text-sm text-ink-body mt-4 max-w-3xl">
          Or one call for everything: <code className="font-mono text-[13px]">assess_cpet(cpet_id)</code>{' '}
          runs every analysis the key includes and the recording supports, with the derived metrics,
          a headline and a plan saying what ran and why anything did not. It is billed one unit per
          analysis that ran.
        </p>
        <p className="text-xs text-ink-faint mt-3">Watch it end to end in the <Link href="/demo" className="text-accent hover:underline">simulated agent demo</Link>.</p>
      </Section>

      <Section id="data" title="Inputs, outputs and data">
        <Prose>
          <p>
            <strong>Inputs.</strong> The vendor export, unchanged, named by the user. Agents are
            instructed never to search a disk for CPET files on their own initiative, and to ask the
            user to remove names and dates of birth first.
          </p>
          <p>
            <strong>Outputs.</strong> The same envelopes as REST (<Link href="/developers/outputs">Outputs</Link>),
            trimmed of fields an agent does not need: curve points are omitted unless asked for.
          </p>
          <p>
            <strong>Data.</strong> The same rules as REST: bytes parsed and discarded, the parsed
            record deleted after {RETENTION_HOURS} hours or on <code>delete_cpet</code>, records partitioned per key.
            See <Link href="/developers/data-handling">Data handling</Link>.
          </p>
        </Prose>
        <Callout tone="warn" className="mt-6">
          <p>
            No result carries a numeric confidence and an agent must not invent one.{' '}
            <code>confidence</code> is a category, low or normal, set by stated rules: an agent passes
            on a low one with its reason. <code>quality</code> describes the recording. Oscillation
            analysis is beta, developed on a single heart-failure cohort with transportability
            untested; an agent reporting it should say so.
          </p>
        </Callout>
      </Section>

      <NextSteps
        links={[
          { href: '/developers/patterns#agent', label: 'Agent integration pattern', note: 'Where the agent sits in a product.' },
          { href: '/developers/analyses', label: 'Analysis catalogue', note: 'What each tool call measures.' },
        ]}
      />
    </>
  )
}
