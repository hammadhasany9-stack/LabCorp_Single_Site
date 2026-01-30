import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { StatusCounts } from '@/lib/types/sites'

export type StatusFilter = 'active' | 'inactive'

interface StatusTabsProps {
  activeStatus: StatusFilter
  onStatusChange: (status: StatusFilter) => void
  counts?: StatusCounts
}

export function StatusTabs({ activeStatus, onStatusChange, counts }: StatusTabsProps) {
  const tabs: { value: StatusFilter; label: string }[] = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
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
