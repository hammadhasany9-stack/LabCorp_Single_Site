'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getStatusVariant, getStatusLabel } from '@/lib/utils/orderHelpers'
import { cn } from '@/lib/utils'

interface OrderDetailHeaderProps {
  orderId: string
  status: 'in_progress' | 'shipped' | 'cancelled'
  onExportCSV: () => void
  onExportXLS: () => void
}

export function OrderDetailHeader({
  orderId,
  status,
  onExportCSV,
  onExportXLS
}: OrderDetailHeaderProps) {
  const router = useRouter()

  return (
    <div className="sticky top-0 z-10  shadow-md border border-gray-200 dark:border-zinc-800 bg-transparent backdrop-blur-lg dark:bg-blur-lg py-4 mb-8 rounded-2xl px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/programs/single-site/order-history')}
            className="hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Order History
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              Order ID: {orderId}
            </h1>
            <Badge 
              variant={getStatusVariant(status)}
              className={cn(
                status === 'shipped' && 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
                status === 'in_progress' && 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
              )}
            >
              {getStatusLabel(status)}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExportCSV}
            className="gap-2"
          >
            <FileDown className="h-4 w-4" />
            Download CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExportXLS}
            className="gap-2"
          >
            <FileDown className="h-4 w-4" />
            Download XLS
          </Button>
        </div>
      </div>
    </div>
  )
}
