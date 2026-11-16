/**
 * The research log behind the unlisted /research-log page.
 *
 * Nothing here is typed by hand. The oxynet-research loop writes `research/latest.json`, checks it
 * against the page's rules (generic findings only: no names, no lab ids, no costs, no confidence
 * figures) and commits that one file; Vercel builds the push. A file this module cannot read leaves
 * the page saying so rather than failing the build.
 */
import raw from './research/latest.json'

export type Topic = 'physiology' | 'labelling' | 'models' | 'method'
export type Grade = 'exploratory' | 'robust' | 'confirmed'

export interface Finding {
  id: string
  date: string
  topic: Topic
  grade: Grade
  scope: string[]
  title: string
  summary: string
  method: string
}

export interface Step {
  date: string
  title: string
  outcome: string
}

export interface Correction {
  date: string
  text: string
}

export interface ResearchLog {
  schema: 1
  updated: string
  counts: { experiments: number; labs: number; recordings: number }
  findings: Finding[]
  timeline: Step[]
  corrections: Correction[]
}

const TOPICS: Topic[] = ['models', 'labelling', 'physiology', 'method']
const GRADES: Grade[] = ['exploratory', 'robust', 'confirmed']

export const TOPIC_ORDER = TOPICS

export const TOPIC_LABEL: Record<Topic, string> = {
  models: 'Models',
  labelling: 'Human labelling',
  physiology: 'Physiology',
  method: 'Method',
}

/** How many of the three gates a grade has passed: unseen labs, repeated, sealed labs. */
export const GATES_PASSED: Record<Grade, number> = { exploratory: 1, robust: 2, confirmed: 3 }

const isText = (v: unknown): v is string => typeof v === 'string' && v.length > 0

function isFinding(v: unknown): v is Finding {
  const f = v as Finding | undefined
  return (
    isText(f?.id) &&
    isText(f?.date) &&
    TOPICS.includes(f?.topic as Topic) &&
    GRADES.includes(f?.grade as Grade) &&
    Array.isArray(f?.scope) &&
    f.scope.every(isText) &&
    isText(f?.title) &&
    isText(f?.summary) &&
    isText(f?.method)
  )
}

/** The log, or null when the file does not have the shape the page expects. */
export function getResearchLog(): ResearchLog | null {
  const log = raw as unknown as ResearchLog
  const counts = log?.counts
  const whole =
    log?.schema === 1 &&
    isText(log?.updated) &&
    Number.isInteger(counts?.experiments) &&
    Number.isInteger(counts?.labs) &&
    Number.isInteger(counts?.recordings) &&
    Array.isArray(log?.findings) &&
    log.findings.length > 0 &&
    log.findings.every(isFinding) &&
    Array.isArray(log?.timeline) &&
    log.timeline.every((s) => isText(s?.date) && isText(s?.title) && isText(s?.outcome)) &&
    Array.isArray(log?.corrections) &&
    log.corrections.every((c) => isText(c?.date) && isText(c?.text))
  return whole ? log : null
}

/** 2026-11-16 as "16 Nov 2026", the same in every time zone. */
export function onDay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]
  return `${d} ${month} ${y}`
}
