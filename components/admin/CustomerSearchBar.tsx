import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface CustomerSearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  children?: React.ReactNode
}

export function CustomerSearchBar({ searchQuery, onSearchChange, children }: CustomerSearchBarProps) {
  return (
    <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-zinc-800 p-6 mb-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search customers by name, ID, or contact..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        {children && (
          <div className="flex-shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
