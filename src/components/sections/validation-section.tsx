import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GradientText } from '@/components/shared/gradient-text'
import { PEER_REVIEWED_COUNT } from '@/content/publications'

/**
 * Evidence, aligned with Part Four of the PDF manual.
 *
 * The section used to say threshold detection "shows strong agreement" and
 * leave it there. A manufacturer or a clinical software company assessing this
 * needs the standard a model is actually held to, and needs to know that not
 * every capability stands on the same ground. Both are stated here in the same
 * three states the manual uses, so the two documents cannot say different
 * things about maturity.
 */

/** The promotion gate every model clears on a cohort it never saw. */
const GATE = [
  ['V̇O₂ bias', '≤ 120 mL/min'],
  ['V̇O₂ correlation', '≥ 0.80'],
  ['Time bias', '≤ 60 s'],
  ['Time correlation', '≥ 0.80'],
]

const MATURITY = [
  {
    state: 'Production',
    tone: 'accent',
    body: 'Answering on the live API, with the evaluation that let each model ship stored beside it. Threshold detection carries the longest record.',
  },
  {
    state: 'Available',
    tone: 'muted',
    body: 'Shipped and usable: the API, the MCP endpoint, the schema, the package and the deployment options.',
  },
  {
    state: 'Research',
    tone: 'warn',
    body: 'Running, and not yet shown to transport. Oscillation analysis sits here, developed on a single heart-failure cohort.',
  },
]

const NOT = [
  'Not a medical device. No CE mark, no FDA clearance, and not registered as software as a medical device in any jurisdiction.',
  'Not a diagnosis. The engine returns physiological measurements; interpreting them for a patient is the clinician’s act.',
  'Not calibrated against outcomes. No output carries a confidence score, because there is nothing to calibrate one against. An answer is marked low or normal by stated rules instead.',
]

export function ValidationSection() {
  return (
    <section id="validation" className="section-padding border-t border-hairline">
      <div className="section-container">
        <SectionWrapper>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              Scientific validation
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Measured against <GradientText>expert interpretation</GradientText>
            </h2>
            <p className="text-ink-body text-lg leading-relaxed">
              Threshold detection is evaluated against expert labelling across cohorts that differ
              in population, protocol, ergometer and metabolimeter, documented across{' '}
              {PEER_REVIEWED_COUNT()} peer-reviewed papers. Agreement with an expert is the floor
              the engine has to clear.
            </p>
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.12}>
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto mb-5">
            <div className="glass rounded-2xl p-7 border border-accent/20">
              <p className="text-xs font-mono uppercase tracking-widest text-accent/70 mb-4">
                The promotion gate
              </p>
              <p className="text-ink-body text-sm leading-relaxed mb-5">
                No model reaches the registry without clearing all four, on a cohort it never saw,
                on both the time axis and the oxygen uptake axis.
              </p>
              <dl className="space-y-2">
                {GATE.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4">
                    <dt className="text-ink-subtle text-sm">{k}</dt>
                    <dd className="font-mono text-sm text-ink-strong">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="glass rounded-2xl p-7 border border-hairline">
              <p className="text-xs font-mono uppercase tracking-widest text-ink-faint mb-4">
                Capabilities have different evidence maturity
              </p>
              <div className="space-y-4">
                {MATURITY.map((m) => (
                  <div key={m.state}>
                    <span
                      className={[
                        'inline-block font-mono text-[10px] uppercase tracking-wider rounded px-1.5 py-0.5 mb-1.5',
                        m.tone === 'accent'
                          ? 'text-accent border border-accent/35'
                          : m.tone === 'warn'
                          ? 'text-warn border border-warn/35'
                          : 'text-ink-subtle border border-hairline',
                      ].join(' ')}
                    >
                      {m.state}
                    </span>
                    <p className="text-ink-subtle text-xs leading-relaxed">{m.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.22}>
          <div className="max-w-4xl mx-auto glass rounded-2xl p-7 border border-hairline">
            <p className="text-xs font-mono uppercase tracking-widest text-ink-faint mb-4">
              What Oxynet is not
            </p>
            <ul className="grid sm:grid-cols-3 gap-5">
              {NOT.map((n) => (
                <li key={n} className="text-ink-subtle text-xs leading-relaxed">
                  {n}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 pt-5 border-t border-hairline">
              <a
                href="/manual"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent hover:underline text-sm font-medium"
              >
                The full evidence record is in the manual →
              </a>
              <a
                href="#publications"
                className="inline-flex items-center gap-2 text-ink-subtle hover:text-accent transition-colors text-sm"
              >
                View publications
              </a>
            </div>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}
