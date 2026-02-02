'use client'

import { usePathname } from 'next/navigation'
import { SITE_GROUPS, SiteGroup } from '@/lib/constants/siteGroups'

export function useSiteGroupContext() {
  const pathname = usePathname()
  
  const currentSiteGroup: SiteGroup = pathname.startsWith('/programs/direct-to-patient')
    ? SITE_GROUPS.DIRECT_TO_PATIENT
    : SITE_GROUPS.SINGLE_SITE
  
  return { currentSiteGroup }
}
