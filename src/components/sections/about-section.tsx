import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GradientText } from '@/components/shared/gradient-text'
import { CompareDemo } from './compare-demo'

/**
 * The why, and then the picture of it.
 *
 * The problem and the solution used to sit two sections apart from the slider
 * that shows the solution working. A first-time reader now gets them in one
 * place: the variability problem, the measurement layer, and the slider as the
 * proof, before the page asks them to choose a way in.
 */
export function AboutSection() {
  return (
    <section id="about" className="section-padding border-t border-hairline">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              Why a measurement layer
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              Standardising <GradientText>CPET interpretation</GradientText>
            </h2>
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.1}>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="glass rounded-2xl p-8 border border-hairline">
              <p className="text-xs font-mono uppercase tracking-widest text-ink-faint mb-4">Problem</p>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Interpretation variability limits clinical utility
              </h3>
              <p className="text-ink-body leading-relaxed text-sm">
                Threshold determination is a visual judgment made against several criteria that do
                not always agree. Where they disagree, the answer depends on which criterion the
                reader weighted and how the data were smoothed before plotting, and none of that
                reaches the report.
              </p>
            </div>

            <div className="glass rounded-2xl p-8 border border-accent/20">
              <p className="text-xs font-mono uppercase tracking-widest text-accent/70 mb-4">Solution</p>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                A measurement layer under the interpretation
              </h3>
              <p className="text-ink-body leading-relaxed text-sm">
                Oxynet computes the same quantities the same way on every recording, whatever
                produced it, so the reading a clinician gives is anchored to numbers that do not
                move between sessions, sites or systems.
              </p>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.15} className="mt-24">
          <h3 className="text-center text-2xl sm:text-3xl font-bold tracking-tight mb-12">
            From raw CPET signals to <GradientText>structured physiology</GradientText>
          </h3>
          <CompareDemo />
        </SectionWrapper>

        <SectionWrapper delay={0.2} className="mt-16">
          <div className="glass rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-ink-subtle leading-relaxed text-sm text-center">
              Oxynet is a{' '}
              <span className="text-ink-strong font-medium">computational engine</span>, not a
              replacement for clinical expertise. It measures; the reading stays with the
              clinician.
            </p>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}
