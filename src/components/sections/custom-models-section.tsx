import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GradientText } from '@/components/shared/gradient-text'

/**
 * Models fine-tuned on one lab's tests.
 *
 * Every step below is what core's training pipeline does today
 * (`docs/pipeline.md`): pretrain on every contributing lab, keep the encoder,
 * retrain the head on one lab's recordings, run the promotion gate, register
 * the model under a name the API and the MCP server accept, and serve it to the
 * client's keys alone: a private model (core v87, `docs/claude/keys-and-web.md`,
 * "A client's own model") is reached only by the keys that name it, is listed to
 * no other key, and answers its own keys first when they name no model. Cohort
 * codes and the names of the labs that already have one stay out of public copy.
 *
 * The gate for a lab model is run against that lab's own labelled tests, so
 * this section does not claim "a cohort it never saw" the way the validation
 * section does for the general models, and it says outright that a model
 * fitted to one lab is not evidence that it transports.
 */

const WHO = ['Laboratories', 'Clinics', 'University departments']

const STEPS = [
  {
    k: 'Share',
    body: 'Labelled tests, under the data transfer agreement. It names every way the data may be used, and lets you withdraw it from future training.',
  },
  {
    k: 'Fine-tune',
    body: 'Training starts from the model pretrained on every contributing lab. Its encoder is kept, and the layers that place the thresholds are retrained on your recordings.',
  },
  {
    k: 'Gate',
    body: 'Evaluated against your experts’ labels on the same four criteria every model clears, bias and correlation on V̇O₂ and on time. It ships only if it passes.',
  },
  {
    k: 'Serve',
    body: 'A named model on the API and over MCP that only your key reaches: no other key can call it or see it. Name no model and it reads your files first.',
  },
]

export function CustomModelsSection() {
  return (
    <section id="custom-models" className="section-padding border-t border-hairline">
      <div className="section-container">
        <SectionWrapper>
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              A model for your lab
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Trained on your tests.{' '}
              <br className="hidden sm:block" />
              <GradientText>Read your way.</GradientText>
            </h2>
            <p className="text-ink-body text-lg leading-relaxed">
              Every lab has its own protocol, population, metabolimeter and its own way of marking
              VT1 and VT2. If you have labelled tests, Oxynet fine-tunes its threshold models on
              them, so the model you call is fitted to the way your experts read a recording.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {WHO.map((w) => (
                <span
                  key={w}
                  className="rounded-full border border-hairline px-3 py-1 text-xs text-ink-body"
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.1}>
          <ol className="relative grid gap-5 md:grid-cols-4">
            {/* The rail behind the step markers: the access map's language,
                so a reader sees one system rather than two diagrams. */}
            <div
              aria-hidden="true"
              className="absolute left-[12.5%] right-[12.5%] top-[1.375rem] hidden h-2 rounded-full bg-hairline md:block"
            />
            {STEPS.map((s, i) => (
              <li key={s.k} className="relative text-center">
                <span className="relative z-10 mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-accent/40 bg-background font-mono text-sm text-accent">
                  {i + 1}
                </span>
                <div className="glass mt-4 rounded-2xl border border-hairline p-5 text-left md:min-h-[11rem]">
                  <p className="font-mono text-xs uppercase tracking-widest text-accent/80 mb-2">
                    {s.k}
                  </p>
                  <p className="text-ink-subtle text-sm leading-relaxed">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </SectionWrapper>

        <SectionWrapper delay={0.2}>
          <div className="mt-10 glass rounded-2xl p-7 max-w-3xl mx-auto border border-hairline">
            <p className="text-ink-subtle text-sm leading-relaxed">
              A model fitted to one lab is evidence about that lab. It says nothing yet about how
              it transports to a second population, and it is reported that way. A model built
              for you, or a joint development project, is agreed separately from the data
              agreement, which covers sharing the data.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-6 pt-5 border-t border-hairline">
              <a
                href={`mailto:andrea.zignoli@unitn.it?subject=${encodeURIComponent('Oxynet: a model for our lab')}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent-fill px-4 py-2 text-sm font-medium text-black hover:bg-accent/85 transition-colors"
              >
                Discuss a model for your lab <span aria-hidden="true">→</span>
              </a>
              <a
                href="/data-agreement"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-accent hover:underline underline-offset-2"
              >
                Read the data agreement →
              </a>
            </div>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}
