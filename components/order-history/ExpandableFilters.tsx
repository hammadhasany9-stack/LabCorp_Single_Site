import { useState } from 'react'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import { format, subDays } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { OrderHistoryFilters, DateRangePreset, KIT_TYPE_OPTIONS } from '@/lib/types/order-history'

interface ExpandableFiltersProps {
  isExpanded: boolean
  filters: OrderHistoryFilters
  onFiltersChange: (filters: OrderHistoryFilters) => void
  onClear: () => void
  dateRange?: { from?: Date; to?: Date }
  dateRangePreset?: DateRangePreset
  onDateRangeChange: (range: { from?: Date; to?: Date }, preset?: DateRangePreset) => void
  kitType?: string
  onKitTypeChange: (kitType?: string) => void
}

export function ExpandableFilters({ 
  isExpanded, 
  filters, 
  onFiltersChange,
  onClear,
  dateRange,
  dateRangePreset,
  onDateRangeChange,
  kitType,
  onKitTypeChange
}: ExpandableFiltersProps) {
  const [localFilters, setLocalFilters] = useState<OrderHistoryFilters>(filters)
  const [kitSearchQuery, setKitSearchQuery] = useState('')
  const [isKitDropdownOpen, setIsKitDropdownOpen] = useState(false)
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
  const [customDateFrom, setCustomDateFrom] = useState<Date | undefined>(dateRange?.from)
  const [customDateTo, setCustomDateTo] = useState<Date | undefined>(dateRange?.to)

  const filteredKitTypes = KIT_TYPE_OPTIONS.filter(kit =>
    kit.id.toLowerCase().includes(kitSearchQuery.toLowerCase()) ||
    kit.name.toLowerCase().includes(kitSearchQuery.toLowerCase())
  )

  const handleApply = () => {
    onFiltersChange(localFilters)
  }

  const handleClear = () => {
    setLocalFilters({})
    setCustomDateFrom(undefined)
    setCustomDateTo(undefined)
    onClear()
  }

  const updateFilter = (key: keyof OrderHistoryFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleQuickDateFilter = (preset: DateRangePreset) => {
    const today = new Date()
    let from: Date | undefined
    let to: Date | undefined

    switch (preset) {
      case 'last_30':
        from = subDays(today, 30)
        to = today
        break
      case 'last_60':
        from = subDays(today, 60)
        to = today
        break
      case 'last_90':
        from = subDays(today, 90)
        to = today
        break
    }

    setCustomDateFrom(from)
    setCustomDateTo(to)
    onDateRangeChange({ from, to }, preset)
    setIsDateDropdownOpen(false)
  }

  const handleCustomDateApply = () => {
    onDateRangeChange({ from: customDateFrom, to: customDateTo }, 'custom')
    setIsDateDropdownOpen(false)
  }

  const handleClearDateRange = () => {
    setCustomDateFrom(undefined)
    setCustomDateTo(undefined)
    onDateRangeChange({}, undefined)
  }

  const getDateRangeLabel = () => {
    if (!dateRange?.from && !dateRange?.to) return 'Select date range'
    
    if (dateRangePreset && dateRangePreset !== 'custom') {
      switch (dateRangePreset) {
        case 'last_30':
          return 'Last 30 days'
        case 'last_60':
          return 'Last 60 days'
        case 'last_90':
          return 'Last 90 days'
      }
    }
    
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}`
    }
    
    if (dateRange.from) {
      return `From ${format(dateRange.from, 'MMM dd, yyyy')}`
    }
    
    if (dateRange.to) {
      return `Until ${format(dateRange.to, 'MMM dd, yyyy')}`
    }
    
    return 'Select date range'
  }

  const getKitTypeLabel = () => {
    if (!kitType) return 'Select kit type'
    const kit = KIT_TYPE_OPTIONS.find(k => k.name === kitType)
    return kit ? `${kit.id}    ${kit.name}` : kitType
  }

  if (!isExpanded) return null

  return (
    <div className="bg-white dark:bg-card border-x border-b border-gray-200 dark:border-zinc-800 rounded-2xl shadow-md p-6 animate-in slide-in-from-top-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Kit Type Dropdown */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Kit Type</Label>
          <Popover open={isKitDropdownOpen} onOpenChange={setIsKitDropdownOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !kitType && 'text-muted-foreground'
                )}
              >
                {getKitTypeLabel()}
                {kitType && (
                  <X
                    className="h-3 w-3 ml-auto hover:bg-accent rounded-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onKitTypeChange(undefined)
                      setKitSearchQuery('')
                    }}
                  />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-0" align="start">
              <div className="p-2 border-b">
                <Input
                  placeholder="Search by kit ID or name..."
                  value={kitSearchQuery}
                  onChange={(e) => setKitSearchQuery(e.target.value)}
                  className="h-8"
                />
              </div>
              <div className="max-h-[250px] overflow-y-auto p-1">
                {filteredKitTypes.length > 0 ? (
                  filteredKitTypes.map((kit) => (
                    <button
                      key={kit.id}
                      onClick={() => {
                        onKitTypeChange(kit.name)
                        setIsKitDropdownOpen(false)
                        setKitSearchQuery('')
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors",
                        kitType === kit.name && "bg-accent font-medium"
                      )}
                    >
                      <span className="font-mono text-xs text-gray-600 dark:text-gray-400">{kit.id}</span>
                      <span className="ml-4">{kit.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                    No kits found
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Date Range Dropdown */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Date Range</Label>
          <Popover open={isDateDropdownOpen} onOpenChange={setIsDateDropdownOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !dateRange?.from && !dateRange?.to && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {getDateRangeLabel()}
                {(dateRange?.from || dateRange?.to) && (
                  <X
                    className="h-3 w-3 ml-auto hover:bg-accent rounded-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClearDateRange()
                    }}
                  />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Quick Filters</Label>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickDateFilter('last_30')}
                      className={cn(
                        "justify-start",
                        dateRangePreset === 'last_30' && "bg-accent font-medium"
                      )}
                    >
                      Last 30 days
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickDateFilter('last_60')}
                      className={cn(
                        "justify-start",
                        dateRangePreset === 'last_60' && "bg-accent font-medium"
                      )}
                    >
                      Last 60 days
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickDateFilter('last_90')}
                      className={cn(
                        "justify-start",
                        dateRangePreset === 'last_90' && "bg-accent font-medium"
                      )}
                    >
                      Last 90 days
                    </Button>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Custom Range</Label>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1">From</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !customDateFrom && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {customDateFrom ? format(customDateFrom, 'MMM dd, yyyy') : 'From date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={customDateFrom}
                            onSelect={setCustomDateFrom}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1">To</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !customDateTo && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {customDateTo ? format(customDateTo, 'MMM dd, yyyy') : 'To date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={customDateTo}
                            onSelect={setCustomDateTo}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <Button
                    onClick={handleCustomDateApply}
                    size="sm"
                    className="w-full"
                    disabled={!customDateFrom && !customDateTo}
                  >
                    Apply Custom Range
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Order Number / ID */}
        <div className="space-y-2">
          <Label htmlFor="orderNo" className="text-sm font-semibold">
            Order Number / ID
          </Label>
          <Input
            id="orderNo"
            placeholder="Enter order number or ID"
            value={localFilters.orderNo || ''}
            onChange={(e) => updateFilter('orderNo', e.target.value)}
          />
        </div>

        {/* Tracking ID */}
        <div className="space-y-2">
          <Label htmlFor="trackingId" className="text-sm font-semibold">
            Tracking ID
          </Label>
          <Input
            id="trackingId"
            placeholder="Enter tracking ID"
            value={localFilters.trackingId || ''}
            onChange={(e) => updateFilter('trackingId', e.target.value)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3 justify-end">
        <Button 
          variant="outline" 
          onClick={handleClear}
        >
          Clear All
        </Button>
        <Button 
          onClick={handleApply}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
