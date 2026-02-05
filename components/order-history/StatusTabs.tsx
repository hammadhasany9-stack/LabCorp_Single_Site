import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type StatusFilter = 'all' | 'in_progress' | 'shipped' | 'cancelled' | 'approved'

interface StatusTabsProps {
  activeStatus: StatusFilter
  onStatusChange: (status: StatusFilter) => void
  counts?: {
    all: number
    in_progress: number
    shipped: number
    cancelled: number
    approved?: number
  }
  includeApproved?: boolean
}

export function StatusTabs({ activeStatus, onStatusChange, counts, includeApproved = false }: StatusTabsProps) {
  const tabs: { value: StatusFilter; label: string }[] = includeApproved
    ? [
        { value: 'all', label: 'All' },
        { value: 'approved', label: 'Approved' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    : [
        { value: 'all', label: 'All' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'cancelled', label: 'Cancelled' }
      ]

  return (
    <div className="flex flex-wrap gap-1">
      {tabs.map(tab => (
        <Button
          key={tab.value}
          variant={activeStatus === tab.value ? 'secondary' : 'ghost'}
          className={cn(
            'font-semibold gap-0 text-gray-600 dark:text-gray-300',
            activeStatus === tab.value &&
              ' bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900'
          )}
          onClick={() => onStatusChange(tab.value)}
        >
          {tab.label}
          {counts && (
            <span className="ml-2 text-xs opacity-80">
              ({counts[tab.value]})
            </span>
          )}
        </Button>
      ))}
    </div>
  )
}
