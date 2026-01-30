import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { formatOrderDate } from '@/lib/utils/orderHelpers'

interface OrderDetailsCardProps {
  orderDate: Date
  dateApproved?: Date
  shippedDate?: Date
  kitNumber: string
  labTicket: string
  kitName: string
  kitPackaging: string
  quantity: number
  letterPrint: boolean
  trfTemplate?: string
  kitInstructions?: string
  labAddress: string
  labCity: string
  labState: string
  labZip: string
}

export function OrderDetailsCard({
  orderDate,
  dateApproved,
  shippedDate,
  kitNumber,
  labTicket,
  kitName,
  kitPackaging,
  quantity,
  letterPrint,
  trfTemplate,
  kitInstructions,
  labAddress,
  labCity,
  labState,
  labZip
}: OrderDetailsCardProps) {
  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Order Details
        </CardTitle>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Order Date</label>
            <p className="text-base font-medium text-gray-900 dark:text-gray-50 mt-1">
              {formatOrderDate(orderDate)}
            </p>
          </div>
          
          {dateApproved && (
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Date Approved</label>
              <p className="text-base font-medium text-gray-900 dark:text-gray-50 mt-1">
                {formatOrderDate(dateApproved)}
              </p>
            </div>
          )}
          
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Shipped Date</label>
            <p className="text-base font-medium text-gray-900 dark:text-gray-50 mt-1">
              {shippedDate ? formatOrderDate(shippedDate) : (
                <span className="text-gray-400 dark:text-gray-500">N/A</span>
              )}
            </p>
          </div>
          
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Kit Number</label>
            <p className="text-base font-medium font-mono text-gray-900 dark:text-gray-50 mt-1">
              {kitNumber}
            </p>
          </div>
          
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Lab Ticket</label>
            <p className="text-base font-medium font-mono text-gray-900 dark:text-gray-50 mt-1">
              {labTicket}
            </p>
          </div>
          
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Kit Name</label>
            <p className="text-base font-medium text-gray-900 dark:text-gray-50 mt-1">
              {kitName}
            </p>
          </div>
          
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Kit Packaging</label>
            <p className="text-base font-medium text-gray-900 dark:text-gray-50 mt-1">
              {kitPackaging}
            </p>
          </div>
          
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Quantity</label>
            <p className="text-base font-medium text-gray-900 dark:text-gray-50 mt-1">
              {quantity}
            </p>
          </div>
          
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Letter Print</label>
            <div className="mt-1">
              <Badge variant={letterPrint ? 'default' : 'secondary'}>
                {letterPrint ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
          
          {trfTemplate && (
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">TRF Template</label>
              <p className="text-base font-medium font-mono text-gray-900 dark:text-gray-50 mt-1">
                {trfTemplate}
              </p>
            </div>
          )}
        </div>
        
        {kitInstructions && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
            <label className="text-sm text-gray-600 dark:text-gray-400">Kit Instructions</label>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              {kitInstructions}
            </p>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
          <label className="text-sm text-gray-600 dark:text-gray-400">Lab Address (Return / Processing Lab)</label>
          <p className="text-base font-medium text-gray-900 dark:text-gray-50 mt-1">
            {labAddress}
          </p>
          <p className="text-base font-medium text-gray-900 dark:text-gray-50">
            {labCity}, {labState} {labZip}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
