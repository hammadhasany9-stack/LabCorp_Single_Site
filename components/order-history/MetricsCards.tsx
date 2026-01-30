import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { OrderMetrics } from '@/lib/types/order-history'

interface MetricCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  description?: string
}

function MetricCard({ label, value, icon: Icon }: MetricCardProps) {
  return (
    <Card className="rounded-2xl shadow-md dark:border-zinc-800">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl">
            <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-sm font-medium uppercase text-gray-600 dark:text-gray-200">
            {label}
          </p>
        </div>
        <div className="pt-2">
          <p className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-1">
            {value}
          </p>
          
        </div>
      </CardContent>
    </Card>
  )
}

interface MetricsCardsProps {
  metrics: OrderMetrics
  icons: {
    total: LucideIcon
    shipped: LucideIcon
    cancelled: LucideIcon
    inProgress: LucideIcon
    ordersToday: LucideIcon
  }
  showAdminFeatures?: boolean
}

export function MetricsCards({ metrics, icons, showAdminFeatures = true }: MetricsCardsProps) {
  return (
    <div className={`grid gap-6 ${showAdminFeatures ? 'grid-cols-5' : 'grid-cols-4'}`}>
      <MetricCard
        label="Total Orders"
        value={metrics.totalOrders}
        icon={icons.total}
      />
      <MetricCard
        label="Orders Shipped"
        value={metrics.ordersShipped}
        icon={icons.shipped}
      />
      <MetricCard
        label="Orders Cancelled"
        value={metrics.ordersCancelled}
        icon={icons.cancelled}
      />
      <MetricCard
        label="Orders In Progress"
        value={metrics.ordersInProgress}
        icon={icons.inProgress}
      />
      {showAdminFeatures && (
        <MetricCard
          label="Orders Placed Today"
          value={metrics.ordersPlacedToday}
          icon={icons.ordersToday}
        />
      )}
    </div>
  )
}
