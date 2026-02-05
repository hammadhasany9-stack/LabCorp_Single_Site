'use client'

import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Calendar, XCircle, TruckIcon } from 'lucide-react'
import { MetricCardType, OrderReportMetrics } from '@/lib/types/order-report'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface MetricCardsProps {
  metrics: OrderReportMetrics
  onCardClick: (cardType: MetricCardType) => void
  activeCard?: MetricCardType | null
}

export function MetricCards({ metrics, onCardClick, activeCard }: MetricCardsProps) {
  const [showTooltip, setShowTooltip] = useState<MetricCardType | null>(null)

  const cards = [
    {
      type: 'approved' as MetricCardType,
      label: 'Approved Orders',
      value: metrics.approvedTotal,
      icon: CheckCircle2,
      subtext: 'All time',
      clickable: true,
      tooltip: null,
    },
    {
      type: 'approved-today' as MetricCardType,
      label: 'Orders Approved Today',
      value: metrics.approvedToday,
      icon: Calendar,
      subtext: 'Today',
      clickable: true,
      tooltip: null,
    },
    {
      type: 'cancelled' as MetricCardType,
      label: 'Cancelled/Refunded',
      value: metrics.cancelledTotal,
      icon: XCircle,
      subtext: 'All time',
      clickable: true,
      tooltip: 'Cancelled/Refunded orders are excluded from this report',
    },
    {
      type: 'shipped' as MetricCardType,
      label: 'Orders Shipped',
      value: metrics.shippedTotal,
      icon: TruckIcon,
      subtext: 'All time',
      clickable: true,
      tooltip: 'Shipped orders are excluded from this report table but are included in metrics',
    },
  ]

  const handleCardClick = (type: MetricCardType, hasTooltip: boolean) => {
    if (hasTooltip) {
      // Show tooltip briefly when clicking cancelled/shipped cards
      setShowTooltip(type)
      setTimeout(() => setShowTooltip(null), 3000)
    } else {
      // Normal filter behavior for other cards
      onCardClick(type)
    }
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const isActive = activeCard === card.type
        const Icon = card.icon
        const isShowingTooltip = showTooltip === card.type

        return (
          <div key={card.type} className="relative">
            <Card 
              className={cn(
                "border border-gray-200 dark:border-zinc-800 shadow-md transition-all duration-200",
                card.clickable && "cursor-pointer hover:shadow-lg hover:-translate-y-1",
                isActive && "ring-2 ring-blue-600 dark:ring-blue-400 shadow-lg"
              )}
              onClick={() => handleCardClick(card.type, !!card.tooltip)}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className={cn(
                    "h-5 w-5",
                    isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
                  )} />
                  <p className={cn(
                    "text-sm font-medium uppercase",
                    isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-200"
                  )}>
                    {card.label}
                  </p>
                </div>
                <p className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                  {card.value}
                </p>
                {card.subtext && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {card.subtext}
                  </p>
                )}
              </CardContent>
            </Card>
            {isShowingTooltip && card.tooltip && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 animate-in fade-in-0 zoom-in-95">
                <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg px-4 py-2 shadow-lg max-w-xs">
                  {card.tooltip}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
