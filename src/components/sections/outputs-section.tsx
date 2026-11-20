import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GlassCard } from '@/components/shared/glass-card'
import { GradientText } from '@/components/shared/gradient-text'

/**
 * Every group below maps to something the API returns today. Where a family is
 * research-stage it says so on the card rather than in a footnote, because a
 * capability list is read by people deciding what to build on.
 */

const FAMILIES = [
  {
    label: 'Routine interpretation',
    status: null,
    title: 'Thresholds and intensity domains',
    items: [
      'VT1 and VT2, each as a time and a V̇O₂',
      'Moderate · heavy · severe: the domains the two thresholds bound',
      'Detected consistently across protocols and ergometers',
    ],
    description:
      'The entry point, and the part with the longest validation record. Same input, same output, which is what makes longitudinal and multi-centre comparison possible.',
  },
  {
    label: 'Quantitative phenotyping',
    status: 'beta',
    title: 'Ventilatory oscillation analysis',
    items: [
      'Each episode: period, amplitude, cycles, location in the test',
      'Clarity: how far it stands above the recording’s own background',
      'End-tidal CO₂ corroboration and phase agreement',
      'Whether the swing damped, held steady or grew',
    ],
    description:
      'Not a yes/no verdict. The oscillation is measured and located, so a rhythm that fades during exercise is reported as a different finding from one that emerges late.',
  },
  {
    label: 'Metabolism',
    status: null,
    title: 'Substrate use and FATMAX',
    items: [
      'Fat and carbohydrate oxidation rates, stage by stage',
      'FATMAX, against work rate and against %V̇O₂peak',
      'The crossover where carbohydrate overtakes fat',
      'Gross efficiency and the oxygen cost of a watt, on a cycle ergometer',
    ],
    description:
      'Indirect calorimetry from V̇O₂ and V̇CO₂, so it also runs on tests with no ergometer channel, against %V̇O₂peak alone. Above RER 1.0 the fat figure is reported as a bound rather than a rate, because there the exhaled CO₂ is no longer all metabolic.',
  },
  {
    label: 'Derived quantities',
    status: null,
    title: 'Standard CPET measurements',
    items: [
      'V̇O₂max, V̇Emax, RERmax, each a 20 s rolling average rather than one breath',
      'O₂ pulse',
      'V̇E/V̇CO₂ slope as a profile over the test, with bootstrap intervals',
    ],
    description:
      'Computed on request against the same recording, so a report and its underlying numbers cannot disagree. The V̇E/V̇CO₂ slope is returned as a profile because a slope that climbs across a test is a different finding from a flat one.',
  },
  {
    label: 'Signal integrity',
    status: null,
    title: 'Whether the numbers can be believed',
    items: [
      'Cross-channel gas checks: V̇CO₂ against V̇E, PetCO₂ against PetO₂',
      'Sampling adequacy: which oscillation periods this file can resolve',
      'Clock integrity: many carts restart the clock at each phase',
    ],
    description:
      'These describe the recording, not the patient. A file can fail every check and come from a healthy subject, and where the engine repairs something it says so instead of applying it silently.',
  },
]

export function OutputsSection() {
  return (
    <section id="outputs" className="section-padding border-t border-hairline">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              What Oxynet produces
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              Structured physiological <GradientText>measurements</GradientText>
            </h2>
            <p className="text-ink-body max-w-2xl mx-auto text-lg leading-relaxed">
              Every CPET processed by Oxynet returns the same structured set of results, in the
              same shape, regardless of the device, protocol or population that produced it.
            </p>
          </div>
        </SectionWrapper>

        <div className="grid sm:grid-cols-2 gap-5">
          {FAMILIES.map((family, i) => (
            <GlassCard key={family.title} delay={i * 0.08}>
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <p className="text-xs font-mono text-accent/70 uppercase tracking-widest">
                  {family.label}
                </p>
                {family.status && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-warn/90 border border-warn/35 rounded px-1.5 py-0.5 flex-shrink-0">
                    {family.status}
                  </span>
                )}
              </div>

              <h3 className="text-base font-semibold text-foreground mb-4">{family.title}</h3>

              <ul className="space-y-2 mb-5">
                {family.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-accent/60 mt-2 flex-shrink-0" />
                    <span className="text-ink-body text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <p className="text-ink-subtle text-xs leading-relaxed pt-4 border-t border-hairline">
                {family.description}
              </p>
            </GlassCard>
          ))}
        </div>

        <SectionWrapper delay={0.35} className="mt-10">
          <div className="glass rounded-2xl p-6 max-w-3xl mx-auto border border-hairline text-center">
            <p className="text-ink-subtle text-sm leading-relaxed">
              No output carries a confidence score. Nothing here is calibrated against clinical
              outcomes, so a percentage would be a number without a meaning: an answer is marked low
              or normal by stated rules instead, with the reason. Where a recording cannot support
              an analysis, Oxynet says so, and says why.
            </p>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}
