import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { getStatusVariant, getStatusLabel } from '@/lib/utils/orderHelpers'
import { cn } from '@/lib/utils'

interface ClientDetailsCardProps {
  planName: string
  planAddress: string
  planCity: string
  planState: string
  planZip: string
  billingAccountNo: string
  status: 'in_progress' | 'shipped' | 'cancelled' | 'approved'
}

export function ClientDetailsCard({
  planName,
  planAddress,
  planCity,
  planState,
  planZip,
  billingAccountNo,
  status
}: ClientDetailsCardProps) {
  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Client Details
        </CardTitle>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">Plan Name</label>
          <p className="text-base font-medium text-gray-900 dark:text-gray-50 mt-1">
            {planName}
          </p>
        </div>
        
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">Plan Address</label>
          <p className="text-base font-medium text-gray-900 dark:text-gray-50 mt-1">
            {planAddress}
          </p>
          <p className="text-base font-medium text-gray-900 dark:text-gray-50">
            {planCity}, {planState} {planZip}
          </p>
        </div>
        
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">LabCorp Billing Account Number</label>
          <p className="text-base font-medium font-mono text-gray-900 dark:text-gray-50 mt-1">
            {billingAccountNo}
          </p>
        </div>
        
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">Status</label>
          <div className="mt-1">
            <Badge 
              variant={getStatusVariant(status)}
              className={cn(
                status === 'shipped' && 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
                status === 'in_progress' && 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
                status === 'approved' && 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400'
              )}
            >
              {getStatusLabel(status)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
