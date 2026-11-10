'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { Download } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { megabytes, type DesktopRelease, type InstallerKind } from '@/content/desktop'
import { cn } from '@/lib/utils'

/**
 * The downloads and the install steps, both following the computer the page is open on.
 *
 * All three installers are always offered: the browser's guess only decides which one leads, because
 * someone may well be downloading for another computer. The server renders them neutral and in a
 * fixed order, and the guess is made once the page is running, so nothing depends on it.
 */

type System = 'windows' | 'mac' | 'other'

const SystemContext = createContext<{ system: System | null; intelMac: boolean }>({
  system: null,
  intelMac: false,
})

interface NavigatorWithHints extends Navigator {
  userAgentData?: {
    platform?: string
    getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string }>
  }
}

function recognise(nav: NavigatorWithHints): System {
  const ua = nav.userAgent
  const platform = nav.userAgentData?.platform ?? nav.platform ?? ''
  if (/android|iphone|ipad|ipod/i.test(ua)) return 'other'
  // An iPad asks for desktop pages by calling itself a Mac; only its touch screen gives it away.
  if (/mac/i.test(platform) && nav.maxTouchPoints > 1) return 'other'
  if (/win/i.test(platform) || /windows nt/i.test(ua)) return 'windows'
  if (/mac/i.test(platform) || /macintosh/i.test(ua)) return 'mac'
  return 'other'
}

export function DesktopSystem({ children }: { children: React.ReactNode }) {
  const [system, setSystem] = useState<System | null>(null)
  const [intelMac, setIntelMac] = useState(false)

  useEffect(() => {
    const nav = navigator as NavigatorWithHints
    const found = recognise(nav)
    setSystem(found)
    // Only Chromium browsers can tell. Safari and Firefox report nothing useful, so the Mac button
    // states the requirement in any case.
    if (found === 'mac') {
      nav.userAgentData
        ?.getHighEntropyValues?.(['architecture'])
        .then((values) => setIntelMac(values.architecture === 'x86'))
        .catch(() => undefined)
    }
  }, [])

  return <SystemContext.Provider value={{ system, intelMac }}>{children}</SystemContext.Provider>
}

const INSTALLERS: Record<
  InstallerKind,
  { title: string; action: string; body: string; for?: System }
> = {
  windows: {
    title: 'Windows',
    action: 'Download for Windows',
    body: 'Installs for you alone, with no administrator rights. Windows 10 or 11, 64-bit.',
    for: 'windows',
  },
  // Never leads: nobody's computer tells us they are its IT department.
  msi: {
    title: 'Windows, for IT departments',
    action: 'Download MSI',
    body: 'Installs for everyone on the computer, into Program Files. Needs administrator rights.',
  },
  mac: {
    title: 'Mac',
    action: 'Download for Mac',
    body: 'Drag it to Applications. Macs with Apple Silicon only, not Intel.',
    for: 'mac',
  },
}

const ORDER: InstallerKind[] = ['windows', 'msi', 'mac']

function inOrder(system: System | null): InstallerKind[] {
  return system === 'mac' ? ['mac', 'windows', 'msi'] : ORDER
}

export function DownloadChoice({ release }: { release: DesktopRelease }) {
  const { system, intelMac } = useContext(SystemContext)
  const still = useReducedMotion()

  return (
    <>
      <LayoutGroup>
        <ul className="rounded-xl border border-hairline divide-y divide-hairline overflow-hidden">
          {inOrder(system).map((kind) => {
            const installer = release.files[kind]
            const copy = INSTALLERS[kind]
            const leads = copy.for === system
            return (
              <motion.li
                key={kind}
                layout={still ? false : 'position'}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  'flex flex-col sm:flex-row sm:items-center gap-4 px-4 py-5 sm:px-5 transition-colors duration-500',
                  leads && 'bg-accent/[0.05]'
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] font-medium text-ink-strong">
                    {copy.title}
                    {leads && (
                      <span className="text-[10px] font-mono font-normal uppercase tracking-[0.18em] text-accent">
                        This computer
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-ink-body leading-relaxed mt-1">{copy.body}</p>
                  <p className="text-[11px] font-mono text-ink-subtle mt-2 break-all">
                    {installer.name} · {megabytes(installer.bytes)}
                  </p>
                </div>
                <a
                  href={installer.url}
                  className={cn(
                    'shrink-0 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-sm font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    leads
                      ? 'bg-accent-fill text-black font-semibold hover:bg-accent-fill/90'
                      : 'border border-hairline text-ink-strong hover:bg-surface'
                  )}
                >
                  <Download className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  {copy.action}
                </a>
              </motion.li>
            )
          })}
        </ul>
      </LayoutGroup>

      {system === 'other' && (
        <p className="text-sm text-ink-body leading-relaxed mt-4 max-w-3xl">
          Oxynet Desktop runs on Windows and on Macs with Apple Silicon. Open this page on the computer
          you will use, or download for it from here.
        </p>
      )}
      {intelMac && (
        <p className="text-sm text-warn leading-relaxed mt-4 max-w-3xl">
          This Mac looks like it has an Intel processor, and the preview runs on Apple Silicon only.
        </p>
      )}
    </>
  )
}

function Steps({ children }: { children: React.ReactNode }) {
  return (
    <ol className="max-w-3xl space-y-3 text-[15px] text-ink-body leading-relaxed list-decimal pl-5 marker:font-mono marker:text-[12px] marker:text-ink-subtle [&_strong]:text-ink-strong [&_strong]:font-medium">
      {children}
    </ol>
  )
}

export function InstallSteps() {
  const { system } = useContext(SystemContext)
  const [chosen, setChosen] = useState<'windows' | 'mac' | null>(null)
  const shown = chosen ?? (system === 'mac' ? 'mac' : 'windows')

  return (
    <Tabs value={shown} onValueChange={(value) => setChosen(value as 'windows' | 'mac')}>
      <TabsList>
        <TabsTrigger value="windows">Windows</TabsTrigger>
        <TabsTrigger value="mac">Mac</TabsTrigger>
      </TabsList>
      <TabsContent value="windows" className="mt-5">
        <Steps>
          <li>Run the setup file. It installs by itself, asks for no administrator rights and adds an icon to your desktop.</li>
          <li>
            Windows will say <strong>Windows protected your PC</strong>, because the preview is not signed
            yet. Press <strong>More info</strong>, then <strong>Run anyway</strong>.
          </li>
          <li>
            If <strong>Run anyway</strong> is not there, your computer is managed by your IT department.
            Ask them before going further: the MSI above is the one made for them.
          </li>
        </Steps>
      </TabsContent>
      <TabsContent value="mac" className="mt-5">
        <Steps>
          <li>Open the disk image, drag <strong>Oxynet Desktop</strong> to Applications, and open it from there.</li>
          <li>
            macOS will say it cannot verify the application, because the preview is not notarised yet.
            Press <strong>Done</strong>, not Move to Trash.
          </li>
          <li>
            Go to <strong>System Settings</strong>, <strong>Privacy &amp; Security</strong>, scroll down to
            Security and press <strong>Open Anyway</strong>.
          </li>
          <li>
            If that does not appear, or your password is refused, paste this into Terminal and open the
            application again. It needs no password.
            <pre className="mt-2 overflow-x-auto rounded-lg border border-hairline bg-surface/60 px-3 py-2 font-mono text-[12.5px] text-ink-strong">
              <code>xattr -dr com.apple.quarantine &quot;/Applications/Oxynet Desktop.app&quot;</code>
            </pre>
          </li>
        </Steps>
      </TabsContent>
    </Tabs>
  )
}

export { Steps as DesktopSteps }
