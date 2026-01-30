import { Building2, UserCheck, LucideIcon } from 'lucide-react'
import { CustomerMetrics } from '@/lib/types/customer'

interface MetricsCardsProps {
  metrics: CustomerMetrics
}

interface MetricCardProps {
  title: string
  value: number
  icon: LucideIcon
}

function MetricCard({ title, value, icon: Icon }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-zinc-800 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            {value}
          </p>
        </div>
        <div className="flex-shrink-0">
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
            <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <MetricCard
        title="Total Customers"
        value={metrics.totalCustomers}
        icon={Building2}
      />
      <MetricCard
        title="Pending Accounts"
        value={metrics.pendingCustomers}
        icon={UserCheck}
      />
    </div>
  )
}
