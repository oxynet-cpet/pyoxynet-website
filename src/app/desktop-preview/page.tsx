import type { Metadata } from 'next'
import { Mail } from 'lucide-react'
import { Callout, Prose, Section } from '@/components/developers/doc'
import {
  DesktopSteps,
  DesktopSystem,
  DownloadChoice,
  InstallSteps,
} from '@/components/desktop/desktop-downloads'
import { Footer } from '@/components/layout/footer'
import { CONTACT_EMAIL } from '@/content/developers/meta'
import {
  getDesktopRelease,
  publishedOn,
  RELEASE_REVALIDATE_S,
  type InstallerKind,
} from '@/content/desktop'

/**
 * Oxynet Desktop for people who have been given the link.
 *
 * Unlisted on purpose while the application is tested with a few people: nothing links here, and it
 * is out of the sitemap and /llms.txt. It is noindex rather than in robots.txt, because that file is
 * public and a crawler told not to fetch a page never sees its noindex. A licence, not this address,
 * is what controls use: without one the application runs nothing.
 *
 * What it states about a release comes from the file oxynet-desktop publishes (content/desktop.ts).
 */
export const revalidate = RELEASE_REVALIDATE_S

export const metadata: Metadata = {
  title: 'Oxynet Desktop',
  description: 'CPET analysis on your own computer, offline. Research software in preview.',
  robots: { index: false, follow: false },
}

const LICENCE_REQUEST =
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Oxynet Desktop licence')}` +
  `&body=${encodeURIComponent("Name and lab:\nThis computer's code:\n")}`

const CHECKSUM_ORDER: InstallerKind[] = ['windows', 'msi', 'mac']

export default async function DesktopPreviewPage() {
  const release = await getDesktopRelease()

  return (
    <>
      <main className="pt-24 sm:pt-28">
        <article className="max-w-3xl mx-auto px-6 pb-24">
          <header className="mb-12 pb-8 border-b border-hairline">
            <p className="text-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">Preview</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4 leading-tight">
              Oxynet Desktop
            </h1>
            <div className="text-ink-body text-lg leading-relaxed">
              CPET analysis on your own computer. It reads your exports offline, and your recordings stay
              with you. Research software: it gives measurements, not a diagnosis.
            </div>
            {release && (
              <p className="mt-6 text-[11px] font-mono text-ink-subtle">
                version {release.version} · published {publishedOn(release.published_at)}
              </p>
            )}
          </header>

          <DesktopSystem>
            <Section id="download" title="Download">
              {release ? (
                <>
                  <DownloadChoice release={release} />
                  <details className="group mt-4 max-w-3xl">
                    <summary className="cursor-pointer text-sm text-ink-body hover:text-ink-strong transition-colors w-fit">
                      Check a download (SHA-256)
                    </summary>
                    <dl className="mt-3 space-y-3">
                      {CHECKSUM_ORDER.map((kind) => (
                        <div key={kind}>
                          <dt className="text-[11px] font-mono text-ink-body break-all">
                            {release.files[kind].name}
                          </dt>
                          <dd className="text-[11px] font-mono text-ink-subtle break-all">
                            {release.files[kind].sha256}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                </>
              ) : (
                <Callout tone="warn" title="Not available just now">
                  <p>
                    The downloads could not be reached. Try again in a few minutes, or write to{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline underline-offset-2">
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                </Callout>
              )}
            </Section>

            <Section id="install" title="Install it">
              <InstallSteps />
            </Section>
          </DesktopSystem>

          <Section id="licence" title="Get a licence">
            <Prose className="mb-5">
              <p>Nothing runs until a licence is installed. Each one is issued by hand, for one computer.</p>
            </Prose>
            <DesktopSteps>
              <li>Open the application, then read and accept the licence agreement.</li>
              <li>
                On the licence screen, press <strong>Copy</strong> beside this computer&apos;s code.
              </li>
              <li>Send us the code, with your name and lab.</li>
              <li>
                We reply with a file. Press <strong>Install licence file</strong> and choose it.
              </li>
            </DesktopSteps>
            <a
              href={LICENCE_REQUEST}
              className="mt-6 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-hairline text-sm font-medium text-ink-strong hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Email your code
            </a>
            <Prose className="mt-6">
              <p>
                Licences are short while we test, so that we hear from you quickly. If you need longer, just
                ask. Installing a new version over the old one keeps your licence.
              </p>
            </Prose>
          </Section>

          <Section id="problems" title="If something does not work">
            <Prose>
              <p>
                Please do not send a recording. Press <strong>Save a problem report</strong>: you will find it
                on a file that could not be read, and on the licence screen. <strong>Report a problem</strong>{' '}
                beside a file&apos;s tabs does the same for a file that reads but looks wrong.
              </p>
              <p>
                It saves a plain text file saying how the file is laid out and where reading stopped, with no
                file names, no values and no names of people. You can read it first, and nothing is sent
                unless you send it. Email it to{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with a line about what you saw.
              </p>
            </Prose>
          </Section>

          <Section id="scope" title="What it does" className="mb-0">
            <Prose>
              <p>
                It opens CPET exports and checks their signal and quality. On request, for one file or a whole
                folder, it runs the ventilatory thresholds (VT1 and VT2), substrate use and FATMAX, and the
                oscillation analysis, and exports a table with VO₂ peak by the averaging you choose.
              </p>
              <p>It does not connect to the internet, and nothing leaves your computer through it.</p>
            </Prose>
            <Callout tone="warn" title="Oscillation analysis is beta" className="mt-5">
              <p>It was developed on one heart-failure cohort, and its transportability is untested.</p>
            </Callout>
          </Section>
        </article>
      </main>
      <Footer />
    </>
  )
}
