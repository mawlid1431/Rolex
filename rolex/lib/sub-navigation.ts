import { toBento, type Bento, type NavLink } from "@/lib/navigation"

export type SubNavigationData = {
  heading: string
  back?: NavLink
  bento: Bento
  actions: NavLink[]
  configure?: { label: string }
}

type RawModule = {
  bento?: { reference: Parameters<typeof toBento>[0][] }
  bento_p13n?: { reference: Parameters<typeof toBento>[0][] }
  action?: { label: string; href: string; aria_label?: string }
  config_launcher?: { cta: { label: string } }
}

type RawSubNavigation = {
  subnav_heading: string
  back?: { label?: string; url?: string; aria_label?: string }
  module?: RawModule[]
}

/** Normalise a page `sub_navigation` block . */
export function toSubNavigation(raw?: RawSubNavigation | null): SubNavigationData | null {
  if (!raw) return null
  const modules = raw.module ?? []
  const bentoModule = modules.find((m) => m.bento || m.bento_p13n)
  const reference = (bentoModule?.bento ?? bentoModule?.bento_p13n)?.reference?.[0]
  const config = modules.find((m) => m.config_launcher)?.config_launcher
  return {
    heading: raw.subnav_heading,
    back: raw.back?.url ? { label: raw.back.label ?? "", href: raw.back.url, ariaLabel: raw.back.aria_label } : undefined,
    bento: toBento(reference),
    actions: modules
      .filter((m) => m.action)
      .map(({ action }) => ({ label: action!.label, href: action!.href, ariaLabel: action!.aria_label })),
    configure: config ? { label: config.cta.label } : undefined,
  }
}
