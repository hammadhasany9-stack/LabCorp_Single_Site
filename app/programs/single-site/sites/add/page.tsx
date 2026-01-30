"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft } from "lucide-react"
import { Site, SiteFormData, siteFormSchema } from "@/lib/types/sites"
import { FormSection } from "@/components/form/FormSection"
import { SiteAddressInput } from "@/components/sites/SiteAddressInput"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { mockSites } from "@/lib/data/mockSites"
import { generateNextSiteNumber } from "@/lib/utils/siteHelpers"
import { useSessionContext } from "@/lib/hooks/useSessionContext"
import { getCustomerContextForNewEntity } from "@/lib/utils/dataFilters"

export default function AddSitePage() {
  const router = useRouter()
  const { activeCustomerId } = useSessionContext()
  
  const form = useForm<SiteFormData>({
    resolver: zodResolver(siteFormSchema),
    mode: 'onChange',
    defaultValues: {
      siteNumber: '',
      siteName: '',
      siteAddress1: '',
      siteAddress2: '',
      siteCity: '',
      siteState: '',
      siteZipcode: '',
      hasDifferentBillingAddress: false,
      billingAddress1: '',
      billingAddress2: '',
      billingCity: '',
      billingState: '',
      billingZipcode: '',
      billingCountry: '',
    }
  })

  // Auto-generate site number on mount
  useEffect(() => {
    const nextSiteNumber = generateNextSiteNumber(mockSites)
    form.setValue('siteNumber', nextSiteNumber)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hasDifferentBillingAddress = form.watch('hasDifferentBillingAddress')

  const onSubmit = (data: SiteFormData) => {
    try {
      // Get customer context - this will throw if no context is available
      const customerId = getCustomerContextForNewEntity(activeCustomerId)
      
      // Generate unique ID (in production, this would come from the backend)
      const newSite: Site = {
        id: `site-${Date.now()}`,
        customerId, // Associate with current customer
        siteNumber: data.siteNumber,
        siteName: data.siteName,
        siteAddress1: data.siteAddress1,
        siteAddress2: data.siteAddress2,
        siteCity: data.siteCity,
        siteState: data.siteState,
        siteZipcode: data.siteZipcode,
        location: `${data.siteCity}, ${data.siteState}`,
        status: 'active', // Default to active
        hasDifferentBillingAddress: data.hasDifferentBillingAddress,
        billingAddress1: data.billingAddress1,
        billingAddress2: data.billingAddress2,
        billingCity: data.billingCity,
        billingState: data.billingState,
        billingZipcode: data.billingZipcode,
        billingCountry: data.billingCountry,
        createdDate: new Date(),
        lastModified: new Date(),
      }

      // In production, this would be an API call
      // For now, we'll store in sessionStorage to pass to the sites page
      sessionStorage.setItem('newSite', JSON.stringify(newSite))
      sessionStorage.setItem('showSuccessMessage', 'true')
      
      // Redirect back to sites list
      router.push('/programs/single-site/sites')
    } catch (error) {
      console.error('Failed to create site:', error)
      // In production, show an error toast/message to the user
    }
  }

  const handleBack = () => {
    router.push('/programs/single-site/sites')
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 max-w-[1400px]">
      {/* Header with Back Button */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="hover:bg-gray-100 dark:hover:bg-zinc-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sites
        </Button>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2">
          Add New Site
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Create and register a new site under the Single Site group.
          <span className="text-destructive ml-1">*</span> indicates required fields
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Site Identification Section */}
          <FormSection
            title="Site Identification"
            description="Basic site information and identifiers"
          >
            {/* Site Group - Read-only */}
            <FormItem>
              <FormLabel>Site Group</FormLabel>
              <FormControl>
                <Input
                  value="Single Site"
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
              </FormControl>
            </FormItem>

            {/* Site Number */}
            <FormField
              control={form.control}
              name="siteNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Site Number <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled
                      className="bg-gray-100 dark:bg-gray-800"
                      aria-required="true"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Site Name */}
            <FormField
              control={form.control}
              name="siteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Site Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Downtown Medical Center"
                      aria-required="true"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          {/* Site Address Section */}
          <FormSection
            title="Site Address"
            description="Physical location of the site"
          >
            <SiteAddressInput form={form} prefix="site" />
          </FormSection>

          {/* Different Billing Address Toggle */}
          <FormSection
            title="Billing Information"
            description="Specify if billing address differs from site address"
          >
            <FormField
              control={form.control}
              name="hasDifferentBillingAddress"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 dark:border-zinc-800 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Different Billing Address
                    </FormLabel>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Check this if the billing address is different from the site address
                    </div>
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
          </FormSection>

          {/* Conditional Billing Address Section */}
          {hasDifferentBillingAddress && (
            <FormSection
              title="Billing Address"
              description="Enter the billing address details"
            >
              <SiteAddressInput form={form} prefix="billing" includeCountry />
            </FormSection>
          )}

          {/* Action Button */}
          <div className="flex items-center justify-center pt-6">
            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              className="w-48"
            >
              Save Site
            </Button>
          </div>
        </form>
      </Form>
    </main>
  )
}
