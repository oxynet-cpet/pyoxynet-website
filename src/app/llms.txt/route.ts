import { DEV_NAV } from '@/content/developers/nav'
import { LINKS } from '@/content/developers/meta'
import { VENDOR_FORMATS } from '@/content/facts'
import { PUBLICATIONS, isPeerReviewed } from '@/content/publications'
import { VENDOR_GUIDES, guideHref } from '@/content/thresholds'

/**
 * www.oxynet.net/llms.txt, the index an agent or crawler reads before the pages.
 *
 * It answered 404 until 2026-10-15 while app.oxynet.net/llms.txt was live, so an
 * agent that searched for Oxynet and landed here found nothing. The two files do
 * different jobs: this one says what Oxynet is and where everything lives, the
 * app's says how to call the API. This one links to that one rather than
 * restating it, so the API instructions have a single source in oxynet-core.
 *
 * Nothing a reader can check is typed here. The format count is the generated
 * registry value and the documentation list is DEV_NAV, the same list that
 * feeds the sidebar and the sitemap, so a new developer page appears here too.
 */

export const dynamic = 'force-static'

const SITE = 'https://www.oxynet.net'

const absolute = (href: string) => (href.startsWith('http') ? href : `${SITE}${href}`)

const docs = DEV_NAV.map(
  ({ group, items }) =>
    `## ${group}\n\n` + items.map((i) => `- [${i.label}](${absolute(i.href)})`).join('\n'),
).join('\n\n')

// The evidence, peer-reviewed only, by the same rule the site and the manual count with.
const evidence = PUBLICATIONS.filter(isPeerReviewed)
  .map((p) => `- [${p.title}](${p.url}): ${p.journal}, ${p.year}`)
  .join('\n')

// The guides for a person holding a CPET file, from the same list as their pages.
const guides = [
  `- [VT1 and VT2 from a CPET file](${SITE}/ventilatory-thresholds): the three ways to run it, what comes back, who decides the threshold, common questions.`,
  ...VENDOR_GUIDES.map((g) => `- [${g.title}](${SITE}${guideHref(g)}): which ${g.vendor} exports are read and what the parser handles in them.`),
].join('\n')

const BODY = `# Oxynet

> A computational layer for cardiopulmonary exercise testing (CPET). Oxynet reads the
> raw export of a metabolic cart (${VENDOR_FORMATS} file formats, detected automatically) and
> returns ventilatory thresholds (VT1 and VT2), substrate use (fat and carbohydrate
> oxidation, FATMAX), exercise oscillatory ventilation and derived CPET quantities as
> structured, versioned JSON. Research software, not a diagnostic device.

Oxynet is reached three ways: a REST API, a remote MCP server for AI assistants, and
the web app at ${LINKS.app}. All three use the same file parsers.

Results carry no confidence score, because nothing is calibrated against clinical
outcomes. Oscillatory ventilation analysis is beta: it was developed on one heart
failure cohort and its transportability to other populations is untested.

## If you are an AI agent

- [Agent guide](${LINKS.llms}): connect, upload a file, analyse it. Start here.
- [Full agent guide](${LINKS.llmsFull}): the whole API in one text file.
- [OpenAPI 3.0 schema](${LINKS.openapi}): importable as tools or actions.
- [MCP server](${LINKS.mcp}): remote MCP over HTTP, with an API key or OAuth.
- [Oxynet in Claude's connector directory](${LINKS.claudeDirectory}): for people using Claude on the web, Desktop or mobile. Connect there and sign in once with the API key.
- [Official MCP Registry entry](${LINKS.mcpRegistry}): \`net.oxynet/cpet\`, for clients that install servers from the registry.
- [Synthetic CPET](${LINKS.sample}): demonstrate the API without a patient file.
- [Free API key](${LINKS.signup}): if the user has no key, send them here. A person signs in with Google or GitHub; an agent cannot get a key itself.
- [Agent skill](https://github.com/oxynet-cpet/oxynet-skills): the same instructions packaged for Claude Code, Gemini CLI, Codex and other coding agents.

Upload the vendor file exactly as exported. Do not parse it or convert its units
yourself: Oxynet knows each format's units and clock conventions. Do not estimate a
threshold from the trace either. The assistant routes the question and explains the
answer; Oxynet's validated models decide the physiology.

## If a person asks how to find VT1 and VT2 in their file

${guides}

${docs}

## Peer-reviewed publications

${evidence}

## Optional

- [Python package (pyoxynet)](${LINKS.pypi}): the open-source research package. It is separate from the hosted API.
- [User manual (PDF)](${SITE}${LINKS.manual})
- [Integration](${SITE}/integration): Oxynet inside a data pipeline or a product.
- [Demo](${SITE}/demo)
`

export function GET() {
  return new Response(BODY, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
