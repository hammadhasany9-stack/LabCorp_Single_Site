import { z } from 'zod'

export interface OrderFormData {
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
  planName: z.string({
    required_error: "Plan name is required",
    invalid_type_error: "Plan name is required",
  }).min(1, "Plan name is required"),
  clientAddress: z.string({
    required_error: "Client address is required",
    invalid_type_error: "Client address is required",
  }).min(1, "Client address is required"),
  clientCity: z.string({
    required_error: "City is required",
    invalid_type_error: "City is required",
  }).min(1, "City is required"),
  clientState: z.string({
    required_error: "State is required",
    invalid_type_error: "State is required",
  }).length(2, "State must be exactly 2 characters"),
  clientZip: z.string({
    required_error: "ZIP code is required",
    invalid_type_error: "ZIP code is required",
  }).regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format. Use: 12345 or 12345-6789"),
  
  // Contact validation with phone format
  contactName: z.string({
    required_error: "Contact name is required",
    invalid_type_error: "Contact name is required",
  }).min(1, "Contact name is required"),
  contactPhone: z.string({
    required_error: "Phone number is required",
    invalid_type_error: "Phone number is required",
  }).regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid phone format. Use: (555) 123-4567"),
  contactAddress: z.string().optional(),
  specialInstructions: z.string().optional(),
  
  // Order details with business logic
  mailDate: z.date({
    required_error: "Mail date is required",
    invalid_type_error: "Mail date is required",
  }),
  labTicketRef: z.string({
    required_error: "Lab ticket reference is required",
    invalid_type_error: "Lab ticket reference is required",
  }).min(1, "Lab ticket reference is required"),
  kitName: z.string({
    required_error: "Kit name is required",
    invalid_type_error: "Kit name is required",
  }).min(1, "Kit name is required"),
  volume: z.number({
    required_error: "Volume is required",
    invalid_type_error: "Volume must be a number",
  }).min(1, "Volume must be at least 1").max(10000, "Volume cannot exceed 10,000"),
  
  // Return address
  returnAddress: z.string({
    required_error: "Return address is required",
    invalid_type_error: "Return address is required",
  }).min(1, "Return address is required"),
  returnCity: z.string({
    required_error: "Return city is required",
    invalid_type_error: "Return city is required",
  }).min(1, "Return city is required"),
  returnState: z.string({
    required_error: "Return state is required",
    invalid_type_error: "Return state is required",
  }).length(2, "State must be exactly 2 characters"),
  returnZip: z.string({
    required_error: "Return ZIP code is required",
    invalid_type_error: "Return ZIP code is required",
  }).regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format. Use: 12345 or 12345-6789"),
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
