/**
 * What the developer pages say about themselves, and the addresses they link.
 *
 * Versioning is stated rather than implied. An integration built against these
 * pages should be able to tell which API, which analysis version and which
 * edition of the docs it read. When the API gains a v2, its reference goes at
 * /developers/api/v2 beside v1, and v1 stays where it is.
 */

import results from '../../../manual/data/api-results.json'

export const DOCS = {
  /** Bump when a page changes in a way an integrator would care about. */
  version: '1.6',
  updated: '2026-10-29',
  /** The only API version that exists. Matches `info.version` in the OpenAPI schema. */
  apiVersion: 'v1',
} as const

/**
 * The analysis version the recorded examples were taken against. Read from the
 * recording itself, so the label cannot disagree with the JSON shown under it.
 */
export const RECORDED = {
  analysisVersion: results.vt.provenance.analysis_version,
  taken: results._provenance.taken,
} as const

/** pyoxynet on PyPI. Checked by hand against pypi.org on the date above. */
export const PYOXYNET = {
  version: '1.1.0',
  python: '3.10 to 3.14',
  license: 'MIT',
} as const

export const API_BASE = 'https://app.oxynet.net'

export const LINKS = {
  app: 'https://app.oxynet.net',
  /** Free self-serve API keys, open since 2026-10-19. */
  signup: 'https://app.oxynet.net/signup',
  apiDocs: 'https://app.oxynet.net/docs',
  openapi: 'https://app.oxynet.net/v1/openapi.json',
  llms: 'https://app.oxynet.net/llms.txt',
  llmsFull: 'https://app.oxynet.net/llms-full.txt',
  mcp: 'https://app.oxynet.net/oxynet-mcp',
  /** Oxynet's listing in Claude's connector directory, published 2026-10-20. Opens for anyone signed in to Claude. */
  claudeDirectory: 'https://claude.ai/directory/oxynet',
  /** The server's entry in the official MCP Registry, published 2026-10-27 (registry API, JSON). */
  mcpRegistry: 'https://registry.modelcontextprotocol.io/v0.1/servers?search=net.oxynet/cpet',
  sample: 'https://app.oxynet.net/v1/sample',
  manual: '/manual',
  /** The data transfer agreement template (fillable PDF). Linked, not indexed. */
  dataAgreement: '/data-agreement',
  pypi: 'https://pypi.org/project/pyoxynet/',
  pyoxynetDocs: 'https://pyoxynet.readthedocs.io/en/latest/index.html',
  pyoxynetRepo: 'https://github.com/oxynet-cpet/pyoxynet',
} as const

/**
 * One address for everything commercial or access-related, the one the manual
 * prints. Subjects are pre-filled so a request arrives already sorted.
 */
export const CONTACT_EMAIL = 'andrea.zignoli@unitn.it'

const mailto = (subject: string, body = '') =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`

export const MAILTO = {
  key: mailto(
    'Oxynet API key request',
    'Organisation:\nWhat you want to build:\nWhich analyses (vt / eov / substrate):\nExpected volume:\n'
  ),
  feasibility: mailto(
    'Oxynet feasibility: representative CPET file',
    'Device / software and version:\nExport format and extension:\nWhat you want Oxynet to return:\n\nPlease attach one de-identified export. Remove names and dates of birth from the file and the filename.\n'
  ),
  partnership: mailto('Oxynet partnership enquiry'),
  local: mailto('Oxynet local or embedded deployment'),
} as const
