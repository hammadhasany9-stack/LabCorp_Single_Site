import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  showCustomerFilter?: boolean
  selectedCustomerId?: string
  onCustomerChange?: (customerId: string) => void
  customers?: Array<{ id: string; name: string }>
}

export function SearchBar({ 
  searchQuery, 
  onSearchChange,
  showCustomerFilter = false,
  selectedCustomerId = 'all',
  onCustomerChange,
  customers = []
}: SearchBarProps) {
  return (
    <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-zinc-800 p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by site number, name, or location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Customer Filter - Admin Only */}
        {showCustomerFilter && customers.length > 0 && (
          <div className="w-full sm:w-[280px]">
            <Select value={selectedCustomerId} onValueChange={onCustomerChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by customer..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  )
}
