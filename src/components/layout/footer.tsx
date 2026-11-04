import { Separator } from '@/components/ui/separator'
import { DuckMark } from '@/components/shared/duck-mark'

export function Footer() {
  return (
    <footer className="section-padding border-t border-hairline">
      <div className="section-container">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DuckMark className="w-5 h-5 text-accent" />
              <h3 className="font-bold text-base gradient-text font-mono tracking-tight">Oxynet</h3>
            </div>
            <p className="text-ink-subtle text-sm leading-relaxed mb-4">
              A computational layer for CPET: physiological measurements, consistently, over an
              API that people and machines can both call.
            </p>
            <a
              href="https://app.oxynet.net"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              app.oxynet.net →
            </a>
          </div>

          <div>
            <h4 className="text-ink-strong font-semibold mb-3 text-sm uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Oxynet app', href: 'https://app.oxynet.net' },
                { label: 'VT1 and VT2 from a CPET file', href: '/ventilatory-thresholds' },
                { label: 'Developers and partners', href: '/developers' },
                { label: 'Integration', href: '/integration' },
                { label: 'Data transfer agreement', href: '/data-agreement' },
                { label: 'The manual (PDF)', href: '/manual' },
                { label: 'API documentation', href: 'https://app.oxynet.net/docs' },
                { label: 'OpenAPI schema', href: 'https://app.oxynet.net/v1/openapi.json' },
                { label: 'Agent guide (llms.txt)', href: 'https://app.oxynet.net/llms.txt' },
                { label: 'Python package (PyPI)', href: 'https://pypi.org/project/pyoxynet/' },
                { label: 'pyoxynet docs', href: 'https://pyoxynet.readthedocs.io/en/latest/index.html' },
                { label: 'GitHub repository', href: 'https://github.com/oxynet-cpet/pyoxynet' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-subtle hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-ink-strong font-semibold mb-3 text-sm uppercase tracking-wider">
              Acknowledgments
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'TensorFlow', href: 'https://www.tensorflow.org/' },
                { label: 'Keras', href: 'https://keras.io/' },
                { label: 'LiteRT', href: 'https://ai.google.dev/edge/litert' },
                { label: 'Uniplot', href: 'https://github.com/olavolav/uniplot' },
                { label: 'Exercise Thresholds', href: 'https://www.exercisethresholds.com/' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-subtle hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-surface mb-8" />

        <div className="space-y-4">
          <div className="text-xs text-ink-faint leading-relaxed max-w-3xl">
            <strong className="text-ink-subtle">Disclaimer:</strong> All content on this website, including text,
            images, and other materials, is provided for informational purposes only. The information and
            software tools provided here are not substitutes for professional medical advice, diagnosis, or
            treatment. Always consult your physician or other qualified healthcare provider with any questions
            regarding a medical condition. Never disregard professional medical advice or delay seeking it
            based on information provided by this software.
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-ink-faint">
            <p>
              © {new Date().getFullYear()} Oxynet. Header photo by{' '}
              <a
                href="https://unsplash.com/@pawel_czerwinski"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink-body underline"
              >
                Pawel Czerwinski
              </a>{' '}
              on{' '}
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink-body underline"
              >
                Unsplash
              </a>
              .
            </p>
            <p className="text-ink-faint flex items-center gap-4">
              <a href="/terms" className="hover:text-ink-body underline">Terms of use</a>
              <a href="/privacy" className="hover:text-ink-body underline">Privacy policy</a>
              <span>Built with Next.js &amp; Vercel</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
