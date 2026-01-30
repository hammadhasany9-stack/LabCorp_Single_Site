import { StatusTabs, StatusFilter } from './StatusTabs'

interface TableHeaderProps {
  activeStatus: StatusFilter
  onStatusChange: (status: StatusFilter) => void
  statusCounts?: {
    all: number
    in_progress: number
    shipped: number
    cancelled: number
  }
}

export function TableHeader({ activeStatus, onStatusChange, statusCounts }: TableHeaderProps) {
  return (
    <div className="bg-white dark:bg-card rounded-t-2xl shadow-md border border-b-0 border-gray-200 dark:border-zinc-800 px-6 py-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          Orders
        </h2>
        <StatusTabs
          activeStatus={activeStatus}
          onStatusChange={onStatusChange}
          counts={statusCounts}
        />
      </div>
    </div>
  )
}
