import { Search, Filter, Download, ChevronDown, ChevronUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchFilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onFilterToggle: () => void
  onExportCSV: () => void
  hasActiveFilters?: boolean
  isFilterExpanded: boolean
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  onFilterToggle,
  onExportCSV,
  hasActiveFilters,
  isFilterExpanded
}: SearchFilterBarProps) {
  return (
    <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-zinc-800 p-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative w-full sm:max-w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search orders, kits, tracking IDs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onFilterToggle}
            size="default"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
            )
            
            }
            {isFilterExpanded ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onExportCSV}
            size="default"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  )
}
