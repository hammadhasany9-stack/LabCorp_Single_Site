import { z } from 'zod'
import { SiteGroup } from '@/lib/constants/siteGroups'

export interface OrderFormData {
  siteGroup?: SiteGroup // Portal identifier (Single Site or Direct to Patient)
  // Kit Section
  csvFile?: File
  customRequisition: boolean
  orderNotes?: string
  
  // Custom Requisition Fields
  sowNumber?: string
  productType?: string
  fileNumber?: string
  quantity?: number
  
  // Client Details
  planName: string
  clientAddress: string
  clientCity: string
  clientState: string
  clientZip: string
  
  // Contact (ATTN) Details
  contactName: string
  contactPhone: string
  contactAddress?: string
  specialInstructions?: string
  
  // Order Details
  mailDate: Date
  labTicketRef: string
  kitName: string
  volume: number
  
  // Return Address
  returnAddress: string
  returnCity: string
  returnState: string
  returnZip: string
}

export const orderSchema = z.object({
  customRequisition: z.boolean(),
  orderNotes: z.string().optional(),
  
  // Custom Requisition Fields (optional, only required when customRequisition is true)
  sowNumber: z.string().optional(),
  productType: z.string().optional(),
  fileNumber: z.string().optional(),
  quantity: z.number().optional(),
  
  // Client Details - Required fields
  planName: z.string({ message: "Plan name is required" }).min(1, "Plan name is required"),
  clientAddress: z.string({ message: "Client address is required" }).min(1, "Client address is required"),
  clientCity: z.string({ message: "City is required" }).min(1, "City is required"),
  clientState: z.string({ message: "State is required" }).length(2, "State must be exactly 2 characters"),
  clientZip: z.string({ message: "ZIP code is required" }).regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format. Use: 12345 or 12345-6789"),
  
  // Contact validation with phone format
  contactName: z.string({ message: "Contact name is required" }).min(1, "Contact name is required"),
  contactPhone: z.string({ message: "Phone number is required" }).regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid phone format. Use: (555) 123-4567"),
  contactAddress: z.string().optional(),
  specialInstructions: z.string().optional(),
  
  // Order details with business logic
  mailDate: z.date({ message: "Mail date is required" }),
  labTicketRef: z.string({ message: "Lab ticket reference is required" }).min(1, "Lab ticket reference is required"),
  kitName: z.string({ message: "Kit name is required" }).min(1, "Kit name is required"),
  volume: z.number({ message: "Volume must be a number" }).min(1, "Volume must be at least 1").max(10000, "Volume cannot exceed 10,000"),
  
  // Return address
  returnAddress: z.string({ message: "Return address is required" }).min(1, "Return address is required"),
  returnCity: z.string({ message: "Return city is required" }).min(1, "Return city is required"),
  returnState: z.string({ message: "Return state is required" }).length(2, "State must be exactly 2 characters"),
  returnZip: z.string({ message: "Return ZIP code is required" }).regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format. Use: 12345 or 12345-6789"),
}).refine((data) => {
  // If custom requisition is enabled, validate required fields
  if (data.customRequisition) {
    return data.sowNumber && data.productType && data.quantity && data.quantity >= 1
  }
  return true
}, {
  message: "When custom requisition is enabled, SOW#, Product Type, and Quantity are required",
  path: ["customRequisition"],
})
