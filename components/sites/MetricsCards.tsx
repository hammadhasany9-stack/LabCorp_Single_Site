import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { SiteMetrics } from '@/lib/types/sites'

interface MetricCardProps {
  label: string
  value: number | string
  icon: LucideIcon
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
  metrics: SiteMetrics
  icons: {
    total: LucideIcon
    active: LucideIcon
    inactive: LucideIcon
  }
  showAdminFeatures?: boolean
}

export function MetricsCards({ metrics, icons, showAdminFeatures = true }: MetricsCardsProps) {
  return (
    <div className={`grid gap-6 ${showAdminFeatures ? 'grid-cols-3' : 'grid-cols-1 max-w-md'}`}>
      <MetricCard
        label="Total Sites"
        value={metrics.totalSites}
        icon={icons.total}
      />
      {showAdminFeatures && (
        <>
          <MetricCard
            label="Active Sites"
            value={metrics.activeSites}
            icon={icons.active}
          />
          <MetricCard
            label="Inactive Sites"
            value={metrics.inactiveSites}
            icon={icons.inactive}
          />
        </>
      )}
    </div>
  )
}
