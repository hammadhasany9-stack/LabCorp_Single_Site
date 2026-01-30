"use client"

import { UseFormReturn } from "react-hook-form"
import { SiteFormData } from "@/lib/types/sites"
import { US_STATES } from "@/lib/constants/states"
import { COUNTRIES } from "@/lib/constants/countries"
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

interface SiteAddressInputProps {
  form: UseFormReturn<SiteFormData>
  prefix: 'site' | 'billing'
  includeCountry?: boolean
}

export function SiteAddressInput({ form, prefix, includeCountry = false }: SiteAddressInputProps) {
  const address1Field = prefix === 'site' ? 'siteAddress1' : 'billingAddress1'
  const address2Field = prefix === 'site' ? 'siteAddress2' : 'billingAddress2'
  const cityField = prefix === 'site' ? 'siteCity' : 'billingCity'
  const stateField = prefix === 'site' ? 'siteState' : 'billingState'
  const zipcodeField = prefix === 'site' ? 'siteZipcode' : 'billingZipcode'
  const countryField = 'billingCountry'

  return (
    <div className="space-y-4">
      {/* Address 1 */}
      <FormField
        control={form.control}
        name={address1Field as keyof SiteFormData}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Address 1 <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="123 Main Street"
                aria-required="true"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address 2 */}
      <FormField
        control={form.control}
        name={address2Field as keyof SiteFormData}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address 2</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Suite, Floor, etc. (optional)"
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
          name={cityField as keyof SiteFormData}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                City <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
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
          name={stateField as keyof SiteFormData}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                State <span className="text-destructive">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        name={zipcodeField as keyof SiteFormData}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              ZIP Code <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
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

      {/* Country (only for billing) */}
      {includeCountry && (
        <FormField
          control={form.control}
          name={countryField as keyof SiteFormData}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Country <span className="text-destructive">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger aria-required="true">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  )
}
