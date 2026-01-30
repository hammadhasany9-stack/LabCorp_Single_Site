import { Site, SiteFilters, SortField, SortDirection } from '@/lib/types/sites'

/**
 * Filter sites by search query and status
 */
export function filterSites(sites: Site[], filters: SiteFilters): Site[] {
  let filtered = [...sites]

  // Filter by status
  if (filters.status) {
    filtered = filtered.filter(site => site.status === filters.status)
  }

  // Filter by search query
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(site =>
      site.siteNumber.toLowerCase().includes(searchLower) ||
      site.siteName.toLowerCase().includes(searchLower) ||
      site.location.toLowerCase().includes(searchLower)
    )
  }

  return filtered
}

/**
 * Sort sites by field and direction
 */
export function sortSites(
  sites: Site[],
  field: SortField,
  direction: SortDirection
): Site[] {
  const sorted = [...sites]

  sorted.sort((a, b) => {
    let aValue: string | number
    let bValue: string | number

    switch (field) {
      case 'siteNumber':
        aValue = a.siteNumber.toLowerCase()
        bValue = b.siteNumber.toLowerCase()
        break
      case 'siteName':
        aValue = a.siteName.toLowerCase()
        bValue = b.siteName.toLowerCase()
        break
      case 'location':
        aValue = a.location.toLowerCase()
        bValue = b.location.toLowerCase()
        break
      default:
        return 0
    }

    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1
    }
    return 0
  })

  return sorted
}

/**
 * Paginate sites
 */
export function paginateSites(
  sites: Site[],
  page: number,
  pageSize: number
): { sites: Site[], totalPages: number } {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedSites = sites.slice(startIndex, endIndex)
  const totalPages = Math.ceil(sites.length / pageSize)

  return {
    sites: paginatedSites,
    totalPages,
  }
}

/**
 * Generate the next available site number
 */
export function generateNextSiteNumber(sites: Site[]): string {
  if (sites.length === 0) {
    return 'SITE-001'
  }

  // Extract numbers from existing site numbers
  const numbers = sites
    .map(site => {
      const match = site.siteNumber.match(/SITE-(\d+)/)
      return match ? parseInt(match[1], 10) : 0
    })
    .filter(num => num > 0)

  // Find the maximum number
  const maxNumber = Math.max(...numbers, 0)
  
  // Generate next number with leading zeros
  const nextNumber = (maxNumber + 1).toString().padStart(3, '0')
  
  return `SITE-${nextNumber}`
}

/**
 * Find a site by ID
 */
export function findSiteById(sites: Site[], siteId: string): Site | undefined {
  return sites.find(site => site.id === siteId)
}
