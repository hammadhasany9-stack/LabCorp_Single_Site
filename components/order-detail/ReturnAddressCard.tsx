import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface ReturnAddressCardProps {
  returnAttn: string
  returnAddress: string
  returnCity: string
  returnState: string
  returnZip: string
}

export function ReturnAddressCard({
  returnAttn,
  returnAddress,
  returnCity,
  returnState,
  returnZip
}: ReturnAddressCardProps) {
  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Return Address
        </CardTitle>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">ATTN</label>
          <p className="text-base font-medium text-gray-900 dark:text-gray-50 mt-1">
            {returnAttn}
          </p>
        </div>
        
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">LabCorp Return Address</label>
          <p className="text-base font-medium text-gray-900 dark:text-gray-50 mt-1">
            {returnAddress}
          </p>
          <p className="text-base font-medium text-gray-900 dark:text-gray-50">
            {returnCity}, {returnState} {returnZip}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
