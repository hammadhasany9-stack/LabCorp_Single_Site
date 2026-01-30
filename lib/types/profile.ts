import { z } from "zod"

export interface BillingAddress {
  address1: string
  address2?: string
  city: string
  state: string
  zipcode: string
  country: string
}

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  customerName: string
  phoneNumber: string
  billingAddress: BillingAddress
}

export interface ProfileFormData {
  phoneNumber: string
}

// Phone number validation helper
const isValidPhoneNumber = (phone: string): boolean => {
  const digitsOnly = phone.replace(/\D/g, '')
  return digitsOnly.length === 10
}

// Zod schema for profile form validation
export const profileFormSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine(isValidPhoneNumber, {
      message: "Please enter a valid phone number",
    }),
})
