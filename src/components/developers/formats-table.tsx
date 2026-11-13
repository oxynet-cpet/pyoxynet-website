'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

export interface FormatRow {
  id: string
  vendor: string
  description: string
  container?: string
  evidence: 'named' | 'unconfirmed' | 'lab' | 'oxynet' | 'reader'
  evidenceLabel: string
  note?: string
}

const EVIDENCE_CLASS: Record<FormatRow['evidence'], string> = {
  named: 'text-accent border-accent/35 bg-accent/10',
  unconfirmed: 'text-warn border-warn/40 bg-warn/10',
  lab: 'text-ink-body border-hairline bg-surface',
  oxynet: 'text-sky-500 border-sky-500/40 bg-sky-500/10',
  reader: 'text-sky-500 border-sky-500/40 bg-sky-500/10',
}

/** Filters on everything a partner might type: a vendor, an id, a word from the description, an extension. */
export function FormatsTable({ rows }: { rows: FormatRow[] }) {
  const [q, setQ] = useState('')

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return rows
    return rows.filter((r) =>
      [r.id, r.vendor, r.description, r.container ?? '', r.evidenceLabel, r.note ?? '']
        .join(' ')
        .toLowerCase()
        .includes(needle)
    )
  }, [q, rows])

  return (
    <div>
      <label className="block max-w-md mb-4">
        <span className="sr-only">Filter formats</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter: COSMED, CORTEX, .xml, German, PNOE..."
          className="w-full rounded-lg border border-hairline bg-surface/40 px-4 py-2.5 text-sm text-foreground placeholder:text-ink-faint focus:outline-none focus:border-accent/50"
        />
      </label>
      <p className="text-xs text-ink-faint font-mono mb-3" aria-live="polite">
        {shown.length} of {rows.length} shown
      </p>

      <div className="overflow-x-auto rounded-xl border border-hairline">
        <table className="w-full text-sm min-w-[44rem]">
          <thead>
            <tr className="border-b border-hairline bg-surface/40 text-left">
              {['Vendor', 'Export', 'File', 'Evidence', 'Format id'].map((h) => (
                <th key={h} className="px-4 py-2.5 text-[10px] font-mono uppercase tracking-[0.14em] text-ink-subtle font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id} className="border-t border-hairline align-top">
                <td className="px-4 py-3 text-ink-strong font-medium whitespace-nowrap">{r.vendor}</td>
                <td className="px-4 py-3 text-ink-body leading-relaxed">
                  {r.description}
                  {r.note && <span className="block text-xs text-warn mt-1">{r.note}</span>}
                </td>
                <td className="px-4 py-3 text-ink-subtle text-xs">{r.container ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={cn('inline-block rounded border px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.1em] whitespace-nowrap', EVIDENCE_CLASS[r.evidence])}>
                    {r.evidenceLabel}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-ink-subtle whitespace-nowrap">{r.id}</td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink-subtle">
                  Nothing matches. That is not a no: send a representative file and we will tell you.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
