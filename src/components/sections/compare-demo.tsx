'use client'

import { Compare } from '@/components/ui/compare'

/**
 * The before/after slider and its legend, without a section around it.
 *
 * It used to be its own section with its own heading and an app CTA. It now
 * sits inside the about section, as the picture of the solution the two cards
 * above it describe, and the CTA moved to the browser door, where the upload
 * is explained. The `demo` id stays on it so existing links still land here.
 */
export function CompareDemo() {
  return (
    <div id="demo" className="scroll-mt-24 flex flex-col lg:flex-row items-center justify-center gap-12">
      <div className="relative">
        <div className="p-3 glass rounded-3xl border border-hairline">
          <Compare
            firstImage="/cpet-raw.svg"
            secondImage="/cpet-analyzed.svg"
            firstImageClassName="object-cover object-center"
            secondImageClassname="object-cover object-center"
            className="h-[320px] w-[320px] md:h-[440px] md:w-[440px] rounded-2xl"
            slideMode="drag"
            autoplay
            autoplayDuration={3000}
          />
        </div>
      </div>

      <div className="max-w-sm space-y-5">
        <h3 className="text-xl font-semibold text-foreground mb-2">Intensity domains</h3>
        <p className="text-ink-subtle text-sm leading-relaxed mb-6">
          Drag the slider to see raw CPET measurements become standardised intensity domains: LT
          and RCP detected automatically, and every breath classified.
        </p>
        {[
          {
            color: 'bg-emerald-500',
            label: 'Moderate domain',
            threshold: 'Below LT',
            description: 'VO₂ reaches steady state within minutes. Blood lactate returns to resting levels. Exercise is fully sustainable.',
          },
          {
            color: 'bg-warn',
            label: 'Heavy domain',
            threshold: 'LT → RCP',
            description: 'A VO₂ slow component emerges. Lactate rises but stabilises above baseline. Prolonged exercise remains possible.',
          },
          {
            color: 'bg-rose-500',
            label: 'Severe domain',
            threshold: 'Above RCP',
            description: 'Respiratory compensation is engaged. Lactate and VO₂ rise continuously toward VO₂max. Exercise tolerance is time-limited.',
          },
        ].map((zone) => (
          <div key={zone.label} className="flex items-start gap-4">
            <div className={`w-3 h-3 rounded-full ${zone.color} mt-1.5 flex-shrink-0 opacity-80`} />
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-ink-strong font-medium text-sm">{zone.label}</p>
                <span className="text-ink-faint text-xs font-mono">{zone.threshold}</span>
              </div>
              <p className="text-ink-subtle text-sm leading-relaxed mt-0.5">{zone.description}</p>
            </div>
          </div>
        ))}

        <p className="text-ink-faint text-xs mt-6 font-mono">
          Based on Keir et al., Sports Medicine (2022)
        </p>
      </div>
    </div>
  )
}
