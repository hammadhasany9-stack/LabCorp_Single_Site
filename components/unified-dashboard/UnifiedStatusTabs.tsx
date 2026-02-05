'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UnifiedStatusFilter } from '@/lib/types/unified-dashboard'

interface UnifiedStatusTabsProps {
  activeStatus: UnifiedStatusFilter
  onStatusChange: (status: UnifiedStatusFilter) => void
  counts?: {
    all: number
    approved: number
    in_progress: number
    shipped: number
    cancelled: number
  }
}

export function UnifiedStatusTabs({ 
  activeStatus, 
  onStatusChange, 
  counts 
}: UnifiedStatusTabsProps) {
  const tabs = [
    { value: 'all' as UnifiedStatusFilter, label: 'All', count: counts?.all },
    { value: 'approved' as UnifiedStatusFilter, label: 'Approved', count: counts?.approved },
    { value: 'shipped' as UnifiedStatusFilter, label: 'Shipped', count: counts?.shipped },
    { value: 'in_progress' as UnifiedStatusFilter, label: 'In Progress', count: counts?.in_progress },
    { value: 'cancelled' as UnifiedStatusFilter, label: 'Cancelled', count: counts?.cancelled },
  ]

  return (
    <Tabs value={activeStatus} onValueChange={(value) => onStatusChange(value as UnifiedStatusFilter)}>
      <TabsList className="grid w-full grid-cols-5 h-auto">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500 py-2 px-3"
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-semibold">{tab.label}</span>
              {counts && (
                <span className="text-xs opacity-90">
                  {tab.count}
                </span>
              )}
            </div>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
