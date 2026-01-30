import { ArrowUpDown, ArrowUp, ArrowDown, Eye } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Site, SortField, SortDirection } from '@/lib/types/sites'

interface SitesTableProps {
  sites: Site[]
  sortField?: SortField
  sortDirection?: SortDirection
  onSort?: (field: SortField) => void
  onToggle: (siteId: string, newStatus: 'active' | 'inactive') => void
  onView?: (site: Site) => void
  showAdminFeatures?: boolean
}

export function SitesTable({
  sites,
  sortField,
  sortDirection,
  onSort,
  onToggle,
  onView,
  showAdminFeatures = true,
}: SitesTableProps) {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    )
  }

  const SortableHeader = ({
    field,
    children,
  }: {
    field: SortField
    children: React.ReactNode
  }) => (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => onSort && onSort(field)}
        className="h-auto p-0 font-semibold hover:bg-transparent"
      >
        {children}
        {getSortIcon(field)}
      </Button>
    </TableHead>
  )

  const getStatusVariant = (status: 'active' | 'inactive') => {
    return status === 'active' ? 'default' : 'secondary'
  }

  const handleToggleChange = (site: Site, checked: boolean) => {
    const newStatus = checked ? 'active' : 'inactive'
    onToggle(site.id, newStatus)
  }

  return (
    <div className={`bg-white dark:bg-card shadow-md border border-gray-200 dark:border-zinc-800 overflow-hidden ${
      showAdminFeatures ? 'rounded-b-2xl border-t-0' : 'rounded-2xl'
    }`}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-zinc-900/50 sticky top-0 z-10">
            <TableRow>
              <SortableHeader field="siteNumber">Site Number</SortableHeader>
              <SortableHeader field="siteName">Site Name</SortableHeader>
              <SortableHeader field="location">Location</SortableHeader>
              {showAdminFeatures && <TableHead>Status</TableHead>}
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sites.map((site) => (
              <TableRow key={site.id} className="hover:bg-gray-50 dark:hover:bg-zinc-900/30">
                <TableCell className="font-medium">{site.siteNumber}</TableCell>
                <TableCell>{site.siteName}</TableCell>
                <TableCell>{site.location}</TableCell>
                {showAdminFeatures && (
                  <TableCell>
                    <Badge variant={getStatusVariant(site.status)}>
                      {site.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                )}
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView && onView(site)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {showAdminFeatures && (
                      <Switch
                        checked={site.status === 'active'}
                        onCheckedChange={(checked) => handleToggleChange(site, checked)}
                        aria-label={`Toggle ${site.siteName} status`}
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
