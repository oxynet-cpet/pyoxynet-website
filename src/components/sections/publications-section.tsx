import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GradientText } from '@/components/shared/gradient-text'
import { Badge } from '@/components/ui/badge'
import { PUBLICATIONS } from '@/content/publications'
import type { PublicationType } from '@/types'

const TYPE_LABEL: Record<PublicationType, string> = {
  research: 'Research',
  review: 'Review',
  blog: 'Blog',
  linkedin: 'LinkedIn',
  medium: 'Medium',
}

const TYPE_VARIANT: Record<PublicationType, 'research' | 'review' | 'blog' | 'linkedin' | 'medium'> = {
  research: 'research',
  review: 'review',
  blog: 'blog',
  linkedin: 'linkedin',
  medium: 'medium',
}

function ExternalIcon() {
  return (
    <svg
      className="w-4 h-4 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  )
}

export function PublicationsSection() {
  return (
    <section id="publications" className="section-padding border-t border-hairline">
      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              Research
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              Scientific <GradientText>publications</GradientText>
            </h2>
            <p className="text-ink-body max-w-xl mx-auto text-lg">
              Peer-reviewed research, reviews, and articles behind the Oxynet project.
            </p>
          </div>
        </SectionWrapper>

        <div className="grid md:grid-cols-2 gap-4">
          {PUBLICATIONS.map((pub, i) => (
            <SectionWrapper key={pub.url} delay={(i % 4) * 0.07}>
              <a
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-hover rounded-2xl p-6 block group h-full"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <Badge variant={TYPE_VARIANT[pub.type]}>
                    {TYPE_LABEL[pub.type]}
                  </Badge>
                  <span className="text-ink-faint group-hover:text-accent transition-colors mt-0.5">
                    <ExternalIcon />
                  </span>
                </div>
                <h3 className="text-foreground font-semibold mb-2 group-hover:text-accent transition-colors leading-snug">
                  {pub.title}
                </h3>
                <p className="text-ink-subtle text-sm leading-relaxed">{pub.description}</p>
                {pub.journal && (
                  <p className="text-ink-faint text-xs mt-3 font-mono">
                    {pub.journal}
                    {pub.year && ` · ${pub.year}`}
                  </p>
                )}
              </a>
            </SectionWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}
