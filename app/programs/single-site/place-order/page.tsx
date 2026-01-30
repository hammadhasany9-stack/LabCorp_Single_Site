'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { OrderFormData, orderSchema } from '@/lib/types/order'
import { formatPhoneNumber } from '@/lib/utils/formatters'
import { FormSection } from '@/components/form/FormSection'
import { AddressInput } from '@/components/form/AddressInput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Upload, Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { OrderPreviewDialog } from '@/components/OrderPreviewDialog'
import { useSessionContext } from '@/lib/hooks/useSessionContext'
import { getCustomerContextForNewEntity } from '@/lib/utils/dataFilters'

const SOW_OPTIONS = [
  { value: '1', label: 'IFOBT' },
  { value: '2', label: 'A1c Whatman' },
  { value: '3', label: 'Albumin Urine' },
  { value: '4', label: 'AdvanceDx Serum' },
]

const PRODUCT_TYPE_OPTIONS = [
  { value: '1', label: 'Employer' },
  { value: '2', label: 'Managed Care' },
  { value: '3', label: 'VBC' },
]

export default function PlaceOrderPage() {
  const router = useRouter()
  const { activeCustomerId } = useSessionContext()
  const [showPreview, setShowPreview] = useState(false)
  const [csvFileName, setCsvFileName] = useState<string | null>(null)
  const [startReqNumber, setStartReqNumber] = useState<string>('')
  const [endReqNumber, setEndReqNumber] = useState<string>('')
  
  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    mode: 'onChange',
    defaultValues: {
      customRequisition: false,
      volume: 1,
      fileNumber: '12011',
      quantity: 1,
      returnAddress: '531 South Spring Street',
      returnCity: 'Burlington',
      returnState: 'NC',
      returnZip: '27215',
    }
  })
  
  const customRequisition = form.watch('customRequisition')
  const sowNumber = form.watch('sowNumber')
  const productType = form.watch('productType')
  const fileNumber = form.watch('fileNumber')
  const quantity = form.watch('quantity')

  // Calculate requisition numbers when custom requisition fields change
  useEffect(() => {
    if (customRequisition && sowNumber && productType && fileNumber && quantity) {
      const startNum = `${fileNumber}-${sowNumber}-${productType}-01`
      const endNum = `${fileNumber}-${sowNumber}-${productType}-${String(quantity).padStart(2, '0')}`
      setStartReqNumber(startNum)
      setEndReqNumber(endNum)
    } else {
      setStartReqNumber('')
      setEndReqNumber('')
    }
  }, [customRequisition, sowNumber, productType, fileNumber, quantity])
  
  const onSubmit = (data: OrderFormData) => {
    setShowPreview(true)
  }
  
  const handleConfirmOrder = () => {
    try {
      // Get customer context for the new order
      const customerId = getCustomerContextForNewEntity(activeCustomerId)
      
      // In production, create order with customerId via API
      // const newOrder = {
      //   ...formData,
      //   customerId,
      //   orderDate: new Date(),
      //   status: 'pending'
      // }
      // await createOrder(newOrder)
      
      // For now, just navigate to confirmation
      router.push('/programs/single-site/order-confirmation')
    } catch (error) {
      console.error('Failed to create order:', error)
      // In production, show error toast to user
    }
  }

  return (
    <div className="container mx-4 px-4 sm:px-6 lg:px-4 xl:px-20 py-12 max-w-[1400px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2">
          Place New Order
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          <span className="text-destructive">*</span> indicates required fields
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Full Width CSV Upload Section - Horizontal Layout */}
          <div className="mb-8">
            <div className="bg-white dark:bg-card rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
                Upload CSV File
              </h3>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Upload className="h-8 w-8 text-gray-400 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Click to upload CSV or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        CSV files only (optional)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {csvFileName && (
                      <Badge variant="secondary">
                        {csvFileName}
                      </Badge>
                    )}
                    <Input 
                      type="file" 
                      accept=".csv"
                      className="hidden" 
                      id="csv-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) setCsvFileName(file.name)
                      }}
                    />
                    <label htmlFor="csv-upload">
                      <Button type="button" variant="outline" asChild>
                        <span className="cursor-pointer">Browse Files</span>
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Custom Requisition Section */}
              <FormSection title="File Information">
                <FormField
                  control={form.control}
                  name="customRequisition"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Custom Requisition</FormLabel>
                        
                      </div>
                      <FormControl>
                        <Switch 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Conditional Custom Requisition Fields */}
                {customRequisition && (
                  <div className="mt-6 space-y-4 p-4 rounded-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* SOW# Dropdown */}
                      <FormField
                        control={form.control}
                        name="sowNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              SOW# <span className="text-destructive">*</span>
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className={!field.value ? "border-destructive" : ""}>
                                  <SelectValue placeholder="Select SOW#" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SOW_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {!field.value && (
                              <p className="text-sm font-medium text-destructive">SOW# is required</p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Product Type Dropdown */}
                      <FormField
                        control={form.control}
                        name="productType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Product Type <span className="text-destructive">*</span>
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className={!field.value ? "border-destructive" : ""}>
                                  <SelectValue placeholder="Select Product Type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {PRODUCT_TYPE_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {!field.value && (
                              <p className="text-sm font-medium text-destructive">Product Type is required</p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Starting Requisition Number (Locked) */}
                      <FormField
                        control={form.control}
                        name="fileNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>File Number</FormLabel>
                            <FormControl>
                              <Input
                                value={startReqNumber || field.value}
                                disabled
                                className="bg-gray-100 dark:bg-gray-800 font-mono"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Quantity */}
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Quantity <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min={1}
                                placeholder="Enter quantity"
                                className={!field.value || field.value < 1 ? "border-destructive" : ""}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
                            {(!field.value || field.value < 1) && (
                              <p className="text-sm font-medium text-destructive">Quantity is required (minimum 1)</p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Requisition Number Range (Bottom Left) */}
                    {startReqNumber && endReqNumber && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                        <div>
                          <FormLabel>Start From</FormLabel>
                          <Input
                            value={startReqNumber}
                            disabled
                            className="bg-gray-100 dark:bg-gray-800 font-mono"
                          />
                        </div>
                        <div>
                          <FormLabel>Ends At</FormLabel>
                          <Input
                            value={endReqNumber}
                            disabled
                            className="bg-gray-100 dark:bg-gray-800 font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </FormSection>

              {/* Order Notes */}
              <FormSection 
                title="Order Notes" 
                description="Add any special instructions or notes (optional)"
              >
                <FormField
                  control={form.control}
                  name="orderNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter any special instructions or notes..."
                          className="min-h-[100px] resize-none"
                          maxLength={500}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-right">
                        {field.value?.length || 0}/500 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>

              {/* Return Address Section */}
              <FormSection 
                title="Labcorp Return Address" 
                description="Where kits should be returned to"
                required
              >
                <AddressInput form={form} prefix="return" />
              </FormSection>
            </div>
            
            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Client Details Section */}
              <FormSection 
                title="Client Details" 
                description="Where the order will be delivered"
                required
              >
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="planName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Plan Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter plan name"
                            aria-required="true"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <AddressInput form={form} prefix="client" showAutocomplete />
                </div>
              </FormSection>

              {/* Contact (ATTN) Section */}
              <FormSection 
                title="ATTN" 
                description="Primary contact for this order"
                required
              >
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Contact Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="John Doe"
                            aria-required="true"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Phone Number <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="(555) 123-4567"
                            aria-required="true"
                            onChange={(e) => {
                              const formatted = formatPhoneNumber(e.target.value)
                              field.onChange(formatted)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Address (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="123 Contact Street"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Instructions (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Any special delivery or handling instructions..."
                            className="min-h-[80px] resize-none"
                            maxLength={300}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-right">
                          {field.value?.length || 0}/300 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              {/* Order Details Section */}
              <FormSection 
                title="Order Details" 
                description="Specify kit and shipment details"
                required
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Lab Ticket Reference */}
                    <FormField
                      control={form.control}
                      name="labTicketRef"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Lab Ticket Reference <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter ticket reference"
                              aria-required="true"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Mail Date with Calendar Picker */}
                    <FormField
                      control={form.control}
                      name="mailDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Mail Date <span className="text-destructive">*</span>
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full h-10 flex items-center justify-start text-left font-normal px-3",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                                  <span className="truncate">
                                    {field.value ? format(field.value, "PPP") : "Select date"}
                                  </span>
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="kitName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Kit Name <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter kit name"
                              aria-required="true"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="volume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Volume (Quantity) <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={1}
                              max={10000}
                              placeholder="1"
                              aria-required="true"
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter a value between 1 and 10,000
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </FormSection>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              size="lg"
              className="px-12 py-6 text-lg font-semibold w-[600px]"
              disabled={
                form.formState.isSubmitting || 
                !form.formState.isValid ||
                (customRequisition && (!sowNumber || !productType || !quantity))
              }
            >
              Place Order
            </Button>
          </div>
        </form>
      </Form>
      
      {/* Preview Modal */}
      <OrderPreviewDialog 
        open={showPreview}
        onOpenChange={setShowPreview}
        data={form.getValues()}
        onConfirm={handleConfirmOrder}
      />
    </div>
  )
}
