/**
 * The published Oxynet Desktop installers.
 *
 * Nothing about a release is typed on this site. `tools/publish_installers.py` in oxynet-desktop
 * uploads the installers to a public bucket and writes `latest.json` last, and the page reads that
 * file, so a release needs no change here and shows within `RELEASE_REVALIDATE_S` of publishing.
 * The bucket holds the installers because they are far larger than a repository or Vercel accepts.
 */

export const RELEASE_URL = 'https://oxynet-downloads.s3.eu-central-1.amazonaws.com/desktop/latest.json'
export const RELEASE_REVALIDATE_S = 300

export type InstallerKind = 'windows' | 'msi' | 'mac'

export interface Installer {
  name: string
  url: string
  bytes: number
  sha256: string
}

export interface DesktopRelease {
  version: string
  published_at: string
  files: Record<InstallerKind, Installer>
}

function isInstaller(value: unknown): value is Installer {
  const v = value as Installer | undefined
  return (
    typeof v?.name === 'string' &&
    typeof v?.url === 'string' &&
    v.url.startsWith('https://') &&
    typeof v?.bytes === 'number' &&
    typeof v?.sha256 === 'string'
  )
}

/** The current release, or null: a page that says so beats a build or a request that fails. */
export async function getDesktopRelease(): Promise<DesktopRelease | null> {
  try {
    const response = await fetch(RELEASE_URL, { next: { revalidate: RELEASE_REVALIDATE_S } })
    if (!response.ok) return null
    const release = (await response.json()) as DesktopRelease
    const files = release?.files
    const whole =
      typeof release?.version === 'string' &&
      typeof release?.published_at === 'string' &&
      isInstaller(files?.windows) &&
      isInstaller(files?.msi) &&
      isInstaller(files?.mac)
    return whole ? release : null
  } catch {
    return null
  }
}

export function megabytes(bytes: number): string {
  return `${Math.round(bytes / 1_000_000)} MB`
}

export function publishedOn(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso))
}
