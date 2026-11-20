import { SectionWrapper } from '@/components/shared/section-wrapper'
import { GradientText } from '@/components/shared/gradient-text'
import { IconApi, IconCode } from '@/components/shared/icons'
import { apiDemo, browserDemo, mcpDemo } from '@/content/demos'
import { RETENTION_HOURS, VENDOR_FORMATS } from '@/content/facts'
import { DoorsExplorer } from './doors-explorer'

/**
 * One engine, three doors: the browser, the REST API, the MCP server.
 *
 * This one section replaced five (developers, the agent demo, who it is for,
 * how it works, deployment), each of which described the same three ways in
 * with a different set of three. The map is the selector and the panel under
 * it carries the door's copy and its demo.
 *
 * A server component on purpose: the three demo scripts are handed to the
 * client as props, so they travel in the RSC payload rather than in the
 * landing page's JavaScript, the same way the MCP demo always did.
 *
 * The Python package is deliberately not a fourth door. It runs the open
 * research models locally, not the engine, so it is pointed at from here and
 * lives in its own section further down.
 */
export function DoorsSection() {
  return (
    <section id="doors" className="section-padding border-t border-hairline">
      {/* Anchors of the sections folded into this one, so old links land here. */}
      <span id="how-it-works" aria-hidden="true" />
      <span id="deployment" aria-hidden="true" />
      <span id="audience" aria-hidden="true" />

      <div className="section-container">
        <SectionWrapper>
          <div className="text-center mb-14">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
              Three ways in
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              One engine, <GradientText>three doors</GradientText>
            </h2>
            <p className="text-ink-body max-w-2xl mx-auto text-lg leading-relaxed">
              Start in the browser. Call the API when it should happen automatically. Connect an
              assistant over MCP when the question arrives in a conversation. Behind every door
              the same method answers, the one with the best measured record on that kind of test,
              and one key covers the API and MCP.
            </p>
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.1}>
          <DoorsExplorer
            scripts={{ browser: browserDemo, api: apiDemo, mcp: mcpDemo }}
            formats={VENDOR_FORMATS}
            retentionHours={RETENTION_HOURS}
          />
        </SectionWrapper>

        <SectionWrapper delay={0.15}>
          <div className="mt-20 grid md:grid-cols-2 gap-5">
            <div className="glass rounded-2xl p-7 border border-accent/12">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                The test happens. The interpretation follows.
              </h3>
              <p className="text-ink-body text-sm leading-relaxed">
                The unit of work is not a person uploading a file. A testing service that runs
                thousands of CPETs a year can have every one of them interpreted as it is recorded:
                no export, no manual transfer, no decision to make per test. That is the
                integration Oxynet is built for.
              </p>
            </div>
            <div className="glass rounded-2xl p-7 border border-hairline">
              <div className="flex items-center gap-3 mb-3">
                <IconApi className="w-5 h-5 text-accent flex-shrink-0" />
                <h3 className="text-lg font-semibold text-foreground">
                  Designed to integrate, not replace
                </h3>
              </div>
              <p className="text-ink-body text-sm leading-relaxed">
                Oxynet runs on top of existing CPET systems. It reads CPET time-series and returns
                structured outputs over the API or, by arrangement, in a local or embedded
                deployment, without changes to your data capture hardware, clinical workflow, or
                reporting interface.
              </p>
            </div>
          </div>

          <p className="mt-8 flex items-center justify-center gap-2 text-sm text-ink-subtle">
            <IconCode className="w-4 h-4 text-ink-faint" />
            Rather run the open research models on your own machine?{' '}
            <a href="#package" className="text-accent hover:underline underline-offset-2">
              The pyoxynet package →
            </a>
          </p>
        </SectionWrapper>
      </div>
    </section>
  )
}
