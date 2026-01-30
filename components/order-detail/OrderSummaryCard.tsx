import { Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface OrderSummaryCardProps {
  kitName: string
  kitSku: string
  quantity: number
  orderNotes?: string
}

export function OrderSummaryCard({
  kitName,
  kitSku,
  quantity,
  orderNotes
}: OrderSummaryCardProps) {
  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Order Summary
        </CardTitle>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent>
        <div className="flex gap-4">
          {/* Kit Image Placeholder */}
          <div className="flex-shrink-0 w-[120px] h-[120px] bg-gray-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
            <Package className="h-16 w-16 text-gray-400 dark:text-gray-600" />
          </div>
          
          {/* Kit Details */}
          <div className="flex-1 space-y-3">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Kit Name</label>
              <p className="text-base font-medium text-gray-900 dark:text-gray-50 mt-1">
                {kitName}
              </p>
            </div>
            
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">SKU Number</label>
              <p className="text-base font-medium font-mono text-gray-900 dark:text-gray-50 mt-1">
                {kitSku}
              </p>
            </div>
            
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Quantity</label>
              <p className="text-base font-medium text-gray-900 dark:text-gray-50 mt-1">
                {quantity}
              </p>
            </div>
          </div>
        </div>
        
        {orderNotes && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
            <label className="text-sm text-gray-600 dark:text-gray-400">Order Notes</label>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              {orderNotes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
