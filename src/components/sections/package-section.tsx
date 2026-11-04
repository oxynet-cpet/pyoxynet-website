import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GlassCard } from '@/components/shared/glass-card'
import { GradientText } from '@/components/shared/gradient-text'
import { IconResearch, IconSignal } from '@/components/shared/icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UsageTabs } from './usage-tabs'
import { highlight } from '@/lib/shiki'
import { CODE_EXAMPLES } from '@/content/code-examples'

const MODELS = [
  {
    Icon: IconResearch,
    title: 'Inference Models',
    description:
      'Two frozen models from the papers: the CNN evaluated in Sports Medicine (2026) and an LSTM. They read VO₂, VCO₂, VE, PetO₂ and PetCO₂ and place VT1 and VT2.',
    badge: 'LiteRT',
  },
  {
    Icon: IconSignal,
    title: 'Generator Model',
    description:
      'Creates realistic synthetic CPET data for research and validation using a Conditional GAN (CGAN) architecture.',
    badge: 'CGAN',
  },
]

/**
 * The open research package, with its code examples.
 *
 * These were two sections (the package, then "Code Examples") in the middle of
 * the product story. They are one now and sit after it: pyoxynet runs the open
 * research models locally, it is not a door into the engine, and researchers
 * are the audience for both halves. Still an async Server Component, so Shiki
 * renders here and never ships to the client.
 */
export async function PackageSection() {
  const [installPipHtml, installGitHtml, usageHtml, generationHtml] = await Promise.all([
    highlight(CODE_EXAMPLES.install_pip.code, CODE_EXAMPLES.install_pip.lang),
    highlight(CODE_EXAMPLES.install_git.code, CODE_EXAMPLES.install_git.lang),
    highlight(CODE_EXAMPLES.basic_usage.code, CODE_EXAMPLES.basic_usage.lang),
    highlight(CODE_EXAMPLES.generation.code, CODE_EXAMPLES.generation.lang),
  ])

  const tabs = [
    { label: 'Install', filename: CODE_EXAMPLES.install_pip.filename, html: installPipHtml },
    { label: 'Install (git)', filename: CODE_EXAMPLES.install_git.filename, html: installGitHtml },
    { label: 'Inference', filename: CODE_EXAMPLES.basic_usage.filename, html: usageHtml },
    { label: 'Generation', filename: CODE_EXAMPLES.generation.filename, html: generationHtml },
  ]

  return (
    <section id="package" className="section-padding border-t border-hairline">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              Open Source
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              The <GradientText>Pyoxynet</GradientText> Package
            </h2>
            <p className="text-ink-body max-w-2xl mx-auto text-lg leading-relaxed">
              The open research side of Oxynet: the models from the papers, in a package you can
              import. Trained with{' '}
              <a
                href="https://keras.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-strong hover:text-accent transition-colors underline underline-offset-2"
              >
                Keras
              </a>{' '}
              and{' '}
              <a
                href="https://www.tensorflow.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-strong hover:text-accent transition-colors underline underline-offset-2"
              >
                TensorFlow
              </a>
              , run with LiteRT, so the package needs neither.
            </p>
          </div>
        </SectionWrapper>

        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {MODELS.map((model, i) => (
            <GlassCard key={model.title} delay={i * 0.1}>
              <div className="flex items-start justify-between mb-4">
                <model.Icon className="w-6 h-6 text-accent" />
                <Badge>{model.badge}</Badge>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{model.title}</h3>
              <p className="text-ink-body text-sm leading-relaxed">{model.description}</p>
            </GlassCard>
          ))}
        </div>

        {/* `usage` was the old code-examples section's id. */}
        <SectionWrapper delay={0.15}>
          <div id="usage" className="scroll-mt-24 max-w-4xl mx-auto mb-10">
            <p className="text-ink-body text-sm leading-relaxed mb-5">
              Python <strong className="text-ink-strong">3.10 to 3.14</strong> on Windows, Linux
              and macOS (Apple silicon). Pyoxynet puts second-by-second, breath-by-breath and
              averaged data on a one-second grid itself.
            </p>
            <UsageTabs tabs={tabs} />
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.2}>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <a
                href="https://pypi.org/project/pyoxynet/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Install from PyPI
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://pyoxynet.readthedocs.io/en/latest/index.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the docs
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://github.com/oxynet-cpet/pyoxynet"
                target="_blank"
                rel="noopener noreferrer"
              >
                ↗ GitHub
              </a>
            </Button>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}
