import { useState } from 'react'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { OrderHistoryFilters } from '@/lib/types/order-history'

interface FilterPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: OrderHistoryFilters
  onFiltersChange: (filters: OrderHistoryFilters) => void
  onClear: () => void
}

export function FilterPanel({ 
  open, 
  onOpenChange, 
  filters, 
  onFiltersChange,
  onClear 
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<OrderHistoryFilters>(filters)

  const handleApply = () => {
    onFiltersChange(localFilters)
    onOpenChange(false)
  }

  const handleClear = () => {
    setLocalFilters({})
    onClear()
    onOpenChange(false)
  }

  const updateFilter = (key: keyof OrderHistoryFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Orders</SheetTitle>
          <SheetDescription>
            Apply filters to narrow down your order history
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Date Range Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Date Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1">From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !localFilters.dateRange?.from && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localFilters.dateRange?.from ? (
                        format(localFilters.dateRange.from, 'MMM dd, yyyy')
                      ) : (
                        'Pick date'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={localFilters.dateRange?.from}
                      onSelect={(date) => 
                        updateFilter('dateRange', { 
                          ...localFilters.dateRange, 
                          from: date 
                        })
                      }
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
                      className={cn(
                        'w-auto justify-start text-left font-normal',
                        !localFilters.dateRange?.to && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localFilters.dateRange?.to ? (
                        format(localFilters.dateRange.to, 'MMM dd, yyyy')
                      ) : (
                        'Pick date'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={localFilters.dateRange?.to}
                      onSelect={(date) => 
                        updateFilter('dateRange', { 
                          ...localFilters.dateRange, 
                          to: date 
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
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

          {/* Kit ID */}
          <div className="space-y-2">
            <Label htmlFor="kitId" className="text-sm font-semibold">
              Kit ID
            </Label>
            <Input
              id="kitId"
              placeholder="Enter kit ID"
              value={localFilters.kitId || ''}
              onChange={(e) => updateFilter('kitId', e.target.value)}
            />
          </div>

          {/* Kit Name */}
          <div className="space-y-2">
            <Label htmlFor="kitName" className="text-sm font-semibold">
              Kit Name
            </Label>
            <Input
              id="kitName"
              placeholder="Enter kit name"
              value={localFilters.kitName || ''}
              onChange={(e) => updateFilter('kitName', e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleClear}
          >
            Clear All
          </Button>
          <Button 
            className="flex-1"
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
