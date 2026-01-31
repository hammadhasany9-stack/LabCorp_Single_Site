"use client"

import { UseFormReturn } from "react-hook-form"
import { OrderFormData } from "@/lib/types/order"
import { US_STATES } from "@/lib/constants/states"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatZipCode } from "@/lib/utils/formatters"

interface AddressInputProps {
  form: UseFormReturn<OrderFormData>
  prefix: 'client' | 'return'
  showAutocomplete?: boolean
}

export function AddressInput({ form, prefix, showAutocomplete = false }: AddressInputProps) {
  const addressField = `${prefix}Address` as keyof OrderFormData
  const cityField = `${prefix}City` as keyof OrderFormData
  const stateField = `${prefix}State` as keyof OrderFormData
  const zipField = `${prefix}Zip` as keyof OrderFormData

  return (
    <div className="space-y-4">
      {/* Address */}
      <FormField
        control={form.control}
        name={addressField}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Address <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value as string}
                placeholder="123 Main Street"
                aria-required="true"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* City and State - Two columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={cityField}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                City <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value as string}
                  placeholder="New York"
                  aria-required="true"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={stateField}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                State <span className="text-destructive">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                <FormControl>
                  <SelectTrigger aria-required="true">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* ZIP Code */}
      <FormField
        control={form.control}
        name={zipField}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              ZIP Code <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value as string}
                placeholder="12345 or 12345-6789"
                aria-required="true"
                onChange={(e) => {
                  const formatted = formatZipCode(e.target.value)
                  field.onChange(formatted)
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
