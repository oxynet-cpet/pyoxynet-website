/**
 * The research log behind the unlisted /research-log page.
 *
 * Nothing here is typed by hand. The oxynet-research loop writes `research/latest.json`: the
 * findings in words (generic by the founder's rules: no names, no lab ids, no costs, no
 * confidence figures, the production model unnamed) and a benchmark block its own script
 * computes from results. It publishes only on a meaningful change. A file this module cannot
 * read leaves the page saying so rather than failing the build.
 */
import raw from './research/latest.json'

/** The problem a finding solved, said explicitly: it is not always threshold detection. */
export type Task = 'phases' | 'thresholds' | 'transport' | 'labelling' | 'efficiency' | 'method'
export type Grade = 'exploratory' | 'robust' | 'confirmed'

export interface Finding {
  id: string
  date: string
  task: Task
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

export interface ThresholdBench {
  guess: number
  breakpoints: number
  production: number
  research: number | null
  floor: number | null
  n_tests: number
  n_labs: number
}

export interface TransportGroup {
  axis: string
  label: string
  n: number
  guess: number
  production: number
  research?: number
}

export interface Benchmarks {
  computed: string
  thresholds: {
    status: 'measured' | 'pending'
    heads: Record<'VT1' | 'VT2', ThresholdBench>
    history: { date: string; VT1: number; VT2: number }[]
  }
  transport: {
    status: 'measured' | 'pending'
    heads?: Record<'VT1' | 'VT2', { groups: TransportGroup[]; labs_held_out: number; labs_research_beats_guess: number | null }>
    note?: string
  }
  phases: {
    status: 'measured' | 'pending'
    note?: string
    results?: { method: string; exercise_start_mae_s: number; recovery_start_mae_s: number; n: number }[]
  }
  efficiency: {
    status: 'measured' | 'pending'
    note?: string
    models?: { date: string; kind: string; model_kb: number; train_cpu_min: number; n_train: number; VT1: number; VT2: number }[]
  }
}

export interface ResearchLog {
  schema: 1
  updated: string
  counts: { experiments: number; labs: number; recordings: number }
  findings: Finding[]
  timeline: Step[]
  corrections: Correction[]
  benchmarks?: Benchmarks
}

export const TASK_ORDER: Task[] = ['phases', 'thresholds', 'transport', 'labelling', 'efficiency', 'method']

export const TASK_LABEL: Record<Task, string> = {
  phases: 'Pre-processing and phases',
  thresholds: 'Ventilatory thresholds',
  transport: 'Transport across labs and tests',
  labelling: 'Expert labelling',
  efficiency: 'Model size and data',
  method: 'How we measure',
}

const GRADES: Grade[] = ['exploratory', 'robust', 'confirmed']

/** How many of the three checks a grade has passed: unseen labs, repeated, sealed labs. */
export const GATES_PASSED: Record<Grade, number> = { exploratory: 1, robust: 2, confirmed: 3 }

const isText = (v: unknown): v is string => typeof v === 'string' && v.length > 0

function isFinding(v: unknown): v is Finding {
  const f = v as Finding | undefined
  return (
    isText(f?.id) &&
    isText(f?.date) &&
    TASK_ORDER.includes(f?.task as Task) &&
    GRADES.includes(f?.grade as Grade) &&
    Array.isArray(f?.scope) &&
    f.scope.every(isText) &&
    isText(f?.title) &&
    isText(f?.summary) &&
    isText(f?.method)
  )
}

function isBench(b: unknown): b is Benchmarks {
  const v = b as Benchmarks | undefined
  const ok = (s: unknown) => s === 'measured' || s === 'pending'
  return (
    ok(v?.thresholds?.status) && ok(v?.transport?.status) && ok(v?.phases?.status) && ok(v?.efficiency?.status) &&
    (v?.thresholds?.status !== 'measured' ||
      (['VT1', 'VT2'] as const).every((h) => Number.isFinite(v.thresholds.heads?.[h]?.guess)))
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
  if (!whole) return null
  return { ...log, benchmarks: isBench(log.benchmarks) ? log.benchmarks : undefined }
}

/** 2026-11-16 as "16 Nov 2026", the same in every time zone. */
export function onDay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]
  return `${d} ${month} ${y}`
}
