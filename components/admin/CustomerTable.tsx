import { ChevronRight } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Customer } from '@/lib/types/customer'

interface CustomerTableProps {
  customers: Customer[]
  onSelectCustomer: (customer: Customer) => void
  selectedCustomerId?: string
}

export function CustomerTable({ customers, onSelectCustomer, selectedCustomerId }: CustomerTableProps) {
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

  const getStatusLabel = (status: 'active' | 'suspended' | 'pending') => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  if (customers.length === 0) {
    return (
      <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-zinc-800 p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No customers found matching your search criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-zinc-800 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-zinc-900/50 sticky top-0 z-10">
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow
                key={customer.id}
                className={`hover:bg-gray-50 dark:hover:bg-zinc-900/30 cursor-pointer ${
                  selectedCustomerId === customer.id ? 'bg-blue-50 dark:bg-blue-950/30' : ''
                }`}
                onClick={() => onSelectCustomer(customer)}
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-gray-50">
                      {customer.customerName}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {customer.customerId}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {customer.contactName}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(customer.status)}>
                    {getStatusLabel(customer.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectCustomer(customer)
                    }}
                  >
                    Select
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
