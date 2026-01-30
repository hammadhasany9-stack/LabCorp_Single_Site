import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface ContactInfoCardProps {
  contactName: string
  contactPhone: string
  contactAddress?: string
  specialInstructions?: string
}

export function ContactInfoCard({
  contactName,
  contactPhone,
  contactAddress,
  specialInstructions
}: ContactInfoCardProps) {
  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          ATTN (Recipient Information)
        </CardTitle>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">Contact's Name</label>
          <p className="text-base font-medium text-gray-900 dark:text-gray-50 mt-1">
            {contactName}
          </p>
        </div>
        
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">Contact's Phone</label>
          <p className="text-base font-medium font-mono text-gray-900 dark:text-gray-50 mt-1">
            {contactPhone}
          </p>
        </div>
        
        {contactAddress && (
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Contact's Address</label>
            <p className="text-base font-medium text-gray-900 dark:text-gray-50 mt-1">
              {contactAddress}
            </p>
          </div>
        )}
        
        {specialInstructions && (
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Special Instructions</label>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-900">
              {specialInstructions}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
