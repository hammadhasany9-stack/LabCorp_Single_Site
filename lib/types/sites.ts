import { z } from 'zod'

export interface Site {
  id: string
  siteNumber: string
  siteName: string
  location: string
  status: 'active' | 'inactive'
  customerId: string // Associated customer ID
  createdDate: Date
  lastModified: Date
  
  // Structured site address fields
  siteAddress1: string
  siteAddress2?: string
  siteCity: string
  siteState: string
  siteZipcode: string
  
  // Conditional billing address fields
  hasDifferentBillingAddress: boolean
  billingAddress1?: string
  billingAddress2?: string
  billingCity?: string
  billingState?: string
  billingZipcode?: string
  billingCountry?: string
}

export interface SiteMetrics {
  totalSites: number
  activeSites: number
  inactiveSites: number
}

export interface SiteFilters {
  search?: string
  status?: 'active' | 'inactive'
}

export type SortField = 'siteNumber' | 'siteName' | 'location'
export type SortDirection = 'asc' | 'desc'

export interface StatusCounts {
  active: number
  inactive: number
}

// Form data interface for adding/editing sites
export interface SiteFormData {
  siteNumber: string
  siteName: string
  siteAddress1: string
  siteAddress2?: string
  siteCity: string
  siteState: string
  siteZipcode: string
  hasDifferentBillingAddress: boolean
  billingAddress1?: string
  billingAddress2?: string
  billingCity?: string
  billingState?: string
  billingZipcode?: string
  billingCountry?: string
  customerId?: string // Optional for form, will be set from session context
}

// Zod schema for site form validation
export const siteFormSchema = z.object({
  // Required fields with validation messages
  siteNumber: z.string({
    required_error: "Site number is required",
    invalid_type_error: "Site number is required",
  }).min(1, "Site number is required"),
  siteName: z.string({
    required_error: "Site name is required",
    invalid_type_error: "Site name is required",
  }).min(1, "Site name is required"),
  siteAddress1: z.string({
    required_error: "Site address is required",
    invalid_type_error: "Site address is required",
  }).min(1, "Site address is required"),
  siteAddress2: z.string().optional(),
  siteCity: z.string({
    required_error: "City is required",
    invalid_type_error: "City is required",
  }).min(1, "City is required"),
  siteState: z.string({
    required_error: "State is required",
    invalid_type_error: "State is required",
  }).length(2, "State must be exactly 2 characters"),
  siteZipcode: z.string({
    required_error: "ZIP code is required",
    invalid_type_error: "ZIP code is required",
  }).regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format. Use: 12345 or 12345-6789"),
  
  // Conditional billing fields
  hasDifferentBillingAddress: z.boolean(),
  billingAddress1: z.string().optional(),
  billingAddress2: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingZipcode: z.string().optional(),
  billingCountry: z.string().optional(),
}).refine((data) => {
  // If different billing address is selected, all billing fields are required
  if (data.hasDifferentBillingAddress) {
    return data.billingAddress1 && data.billingCity && 
           data.billingState && data.billingZipcode && data.billingCountry
  }
  return true
}, {
  message: "All billing address fields are required when different billing address is selected",
  path: ["billingAddress1"],
})
