"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react"
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
import { getSitesBySiteGroup } from "@/lib/data"
import { findSiteById } from "@/lib/utils/siteHelpers"
import { useSessionContext } from "@/lib/hooks/useSessionContext"
import { useSiteGroupContext } from "@/lib/hooks/useSiteGroupContext"
import { verifySiteOwnership } from "@/lib/utils/dataFilters"

export default function EditSitePage() {
  const router = useRouter()
  const params = useParams()
  const siteId = params.id as string
  const { activeCustomerId, isLoading: sessionLoading } = useSessionContext()
  const { currentSiteGroup } = useSiteGroupContext()
  
  const [isLoading, setIsLoading] = useState(true)
  const [site, setSite] = useState<Site | null>(null)
  const [accessDenied, setAccessDenied] = useState(false)
  
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

  const hasDifferentBillingAddress = form.watch('hasDifferentBillingAddress')

  // Load site data
  useEffect(() => {
    // Wait for session to load
    if (sessionLoading) return
    
    // In production, this would be an API call
    const sites = getSitesBySiteGroup(currentSiteGroup)
    const foundSite = findSiteById(sites, siteId)
    
    if (!foundSite) {
      setIsLoading(false)
      return
    }
    
    // Verify ownership and site group match
    const hasAccess = verifySiteOwnership(foundSite, activeCustomerId)
    const siteGroupMatches = foundSite.siteGroup === currentSiteGroup
    if (!hasAccess || !siteGroupMatches) {
      setAccessDenied(true)
      setIsLoading(false)
      return
    }
    
    setSite(foundSite)
    
    // Pre-fill form with site data
    form.reset({
      siteNumber: foundSite.siteNumber,
      siteName: foundSite.siteName,
      siteAddress1: foundSite.siteAddress1,
      siteAddress2: foundSite.siteAddress2 || '',
      siteCity: foundSite.siteCity,
      siteState: foundSite.siteState,
      siteZipcode: foundSite.siteZipcode,
      hasDifferentBillingAddress: foundSite.hasDifferentBillingAddress,
      billingAddress1: foundSite.billingAddress1 || '',
      billingAddress2: foundSite.billingAddress2 || '',
      billingCity: foundSite.billingCity || '',
      billingState: foundSite.billingState || '',
      billingZipcode: foundSite.billingZipcode || '',
      billingCountry: foundSite.billingCountry || '',
    })
    
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId, activeCustomerId, sessionLoading, currentSiteGroup])

  const onSubmit = (data: SiteFormData) => {
    if (!site) return

    // Update site with new data
    const updatedSite: Site = {
      ...site,
      siteNumber: data.siteNumber,
      siteName: data.siteName,
      siteAddress1: data.siteAddress1,
      siteAddress2: data.siteAddress2,
      siteCity: data.siteCity,
      siteState: data.siteState,
      siteZipcode: data.siteZipcode,
      location: `${data.siteCity}, ${data.siteState}`,
      hasDifferentBillingAddress: data.hasDifferentBillingAddress,
      billingAddress1: data.billingAddress1,
      billingAddress2: data.billingAddress2,
      billingCity: data.billingCity,
      billingState: data.billingState,
      billingZipcode: data.billingZipcode,
      billingCountry: data.billingCountry,
      lastModified: new Date(),
    }

    // In production, this would be an API call
    // For now, we'll store in sessionStorage to pass to the sites page
    sessionStorage.setItem('updatedSite_dtp', JSON.stringify(updatedSite))
    sessionStorage.setItem('showUpdateSuccessMessage_dtp', 'true')
    
    // Redirect back to sites list
    router.push('/programs/direct-to-patient/sites')
  }

  const handleBack = () => {
    router.push('/programs/direct-to-patient/sites')
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 max-w-[1400px]">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg text-gray-600 dark:text-gray-400">Loading site details...</p>
          </div>
        </div>
      </main>
    )
  }

  if (accessDenied || !site) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 max-w-[1400px]">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="bg-red-50 dark:bg-red-950 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">
              {accessDenied ? 'Access Denied' : 'Site Not Found'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {accessDenied 
                ? 'You do not have permission to edit this site.' 
                : 'The requested site could not be found.'}
            </p>
            <Button onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sites
            </Button>
          </div>
        </div>
      </main>
    )
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
          Edit Site
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Update site information for {site?.siteName}.
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
                  value="Direct to Patient"
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
              </FormControl>
            </FormItem>

            {/* Site Number - Read-only in edit mode */}
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

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="w-48"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              className="w-48"
            >
              Update Site
            </Button>
          </div>
        </form>
      </Form>
    </main>
  )
}
