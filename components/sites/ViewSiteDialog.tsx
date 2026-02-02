"use client"

import { useRouter } from "next/navigation"
import { Site } from "@/lib/types/sites"
import { US_STATES } from "@/lib/constants/states"
import { COUNTRIES } from "@/lib/constants/countries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { useSiteGroupContext } from "@/lib/hooks/useSiteGroupContext"
import { SITE_GROUPS } from "@/lib/constants/siteGroups"

interface ViewSiteDialogProps {
  site: Site | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewSiteDialog({ site, open, onOpenChange }: ViewSiteDialogProps) {
  const router = useRouter()
  const { currentSiteGroup } = useSiteGroupContext()
  
  if (!site) return null

  const getStateName = (stateCode: string) => {
    return US_STATES.find(s => s.value === stateCode)?.label || stateCode
  }

  const getCountryName = (countryCode?: string) => {
    if (!countryCode) return ''
    return COUNTRIES.find(c => c.value === countryCode)?.label || countryCode
  }

  const handleEdit = () => {
    onOpenChange(false)
    // Route to the correct portal based on current site group
    const portalPath = currentSiteGroup === SITE_GROUPS.DIRECT_TO_PATIENT 
      ? '/programs/direct-to-patient' 
      : '/programs/single-site'
    router.push(`${portalPath}/sites/edit/${site.id}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">View Site Details</DialogTitle>
          <DialogDescription className="text-base">
            Site information in read-only mode
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Site Identification Section */}
          <div className="bg-white dark:bg-card rounded-2xl shadow-md p-6 space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                Site Identification
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Basic site information and identifiers
              </p>
            </div>

            {/* Site Group */}
            <div className="space-y-2">
              <Label>Site Group</Label>
              <Input
                value={site.siteGroup}
                disabled
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>

            {/* Site Number */}
            <div className="space-y-2">
              <Label>Site Number</Label>
              <Input
                value={site.siteNumber}
                disabled
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>

            {/* Site Name */}
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input
                value={site.siteName}
                disabled
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <div>
                <Badge variant={site.status === 'active' ? 'default' : 'secondary'}>
                  {site.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Site Address Section */}
          <div className="bg-white dark:bg-card rounded-2xl shadow-md p-6 space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                Site Address
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Physical location of the site
              </p>
            </div>

            {/* Address 1 */}
            <div className="space-y-2">
              <Label>Address 1</Label>
              <Input
                value={site.siteAddress1}
                disabled
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>

            {/* Address 2 */}
            {site.siteAddress2 && (
              <div className="space-y-2">
                <Label>Address 2</Label>
                <Input
                  value={site.siteAddress2}
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
              </div>
            )}

            {/* City and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={site.siteCity}
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={getStateName(site.siteState)}
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
              </div>
            </div>

            {/* ZIP Code */}
            <div className="space-y-2">
              <Label>ZIP Code</Label>
              <Input
                value={site.siteZipcode}
                disabled
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>
          </div>

          {/* Billing Address Section */}
          {site.hasDifferentBillingAddress ? (
            <div className="bg-white dark:bg-card rounded-2xl shadow-md p-6 space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                  Billing Address
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Billing address details (different from site address)
                </p>
              </div>

              {/* Address 1 */}
              <div className="space-y-2">
                <Label>Address 1</Label>
                <Input
                  value={site.billingAddress1 || ''}
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
              </div>

              {/* Address 2 */}
              {site.billingAddress2 && (
                <div className="space-y-2">
                  <Label>Address 2</Label>
                  <Input
                    value={site.billingAddress2}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800"
                  />
                </div>
              )}

              {/* City and State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={site.billingCity || ''}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    value={site.billingState ? getStateName(site.billingState) : ''}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800"
                  />
                </div>
              </div>

              {/* ZIP Code */}
              <div className="space-y-2">
                <Label>ZIP Code</Label>
                <Input
                  value={site.billingZipcode || ''}
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label>Country</Label>
                <Input
                  value={getCountryName(site.billingCountry)}
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Billing Address Same as Site Address
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  This site uses the same address for billing as the physical site location.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={handleEdit}
          >
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
