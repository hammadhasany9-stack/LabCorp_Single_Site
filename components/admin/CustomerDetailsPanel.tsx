import { Mail, Phone, Building2, Hash, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Customer } from '@/lib/types/customer'
import { format } from 'date-fns'

interface CustomerDetailsPanelProps {
  customer: Customer | null
  children?: React.ReactNode
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-zinc-800 last:border-0">
      <Icon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          {label}
        </p>
        <p className="text-sm text-gray-900 dark:text-gray-50 break-words">
          {value}
        </p>
      </div>
    </div>
  )
}

export function CustomerDetailsPanel({ customer, children }: CustomerDetailsPanelProps) {
  if (!customer) {
    return (
      <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-zinc-800 p-8">
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50 mb-2">
            No Customer Selected
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select a customer from the table to view details and impersonate
          </p>
        </div>
      </div>
    )
  }

  const getStatusVariant = (status: 'active' | 'suspended' | 'pending') => {
    switch (status) {
      case 'active':
        return 'default'
      case 'suspended':
        return 'destructive'
      case 'pending':
        return 'secondary'
    }
  }

  return (
    <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-zinc-800 overflow-hidden">
      <div className="border-b border-gray-200 dark:border-zinc-800 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-1">
              {customer.customerName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {customer.customerId}
            </p>
          </div>
          <Badge variant={getStatusVariant(customer.status)} className="ml-4">
            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-1">
        <DetailRow
          icon={Building2}
          label="Customer Name"
          value={customer.customerName}
        />
        <DetailRow
          icon={Hash}
          label="Customer ID"
          value={customer.customerId}
        />
        <DetailRow
          icon={Mail}
          label="Primary Contact"
          value={customer.contactName}
        />
        <DetailRow
          icon={Mail}
          label="Contact Email"
          value={customer.contactEmail}
        />
        <DetailRow
          icon={Phone}
          label="Contact Phone"
          value={customer.contactPhone}
        />
        <DetailRow
          icon={Calendar}
          label="Created Date"
          value={format(customer.createdDate, 'MMM d, yyyy')}
        />
      </div>

      {children && (
        <div className="border-t border-gray-200 dark:border-zinc-800 p-6">
          {children}
        </div>
      )}
    </div>
  )
}
