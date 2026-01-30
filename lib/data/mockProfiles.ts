import { UserProfile } from "@/lib/types/profile"

export const mockProfiles: Record<string, UserProfile> = {
  // Admin user profile (ID matches auth.ts)
  "1": {
    id: "1",
    firstName: "Sarah",
    lastName: "Anderson",
    email: "admin@labcorp.com",
    customerName: "LabCorp Admin",
    phoneNumber: "(555) 123-4567",
    billingAddress: {
      address1: "1447 York Court",
      address2: "Suite 200",
      city: "Burlington",
      state: "NC",
      zipcode: "27215",
      country: "United States",
    },
  },
  
  // Customer user profiles
  "customer-1": {
    id: "customer-1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@healthsystems.com",
    customerName: "Metro Health Systems",
    phoneNumber: "(555) 234-5678",
    billingAddress: {
      address1: "123 Healthcare Plaza",
      address2: "",
      city: "Seattle",
      state: "WA",
      zipcode: "98101",
      country: "United States",
    },
  },
  
  "customer-2": {
    id: "customer-2",
    firstName: "Emily",
    lastName: "Johnson",
    email: "emily.johnson@northwestmed.com",
    customerName: "Northwest Medical Center",
    phoneNumber: "(555) 345-6789",
    billingAddress: {
      address1: "456 Medical Drive",
      address2: "Building A",
      city: "Portland",
      state: "OR",
      zipcode: "97201",
      country: "United States",
    },
  },
  
  "customer-3": {
    id: "customer-3",
    firstName: "Michael",
    lastName: "Davis",
    email: "michael.davis@coastalcare.com",
    customerName: "Coastal Care Partners",
    phoneNumber: "(555) 456-7890",
    billingAddress: {
      address1: "789 Ocean Boulevard",
      address2: "Floor 5",
      city: "San Diego",
      state: "CA",
      zipcode: "92101",
      country: "United States",
    },
  },
  
  "customer-4": {
    id: "customer-4",
    firstName: "Jennifer",
    lastName: "Williams",
    email: "jennifer.williams@sunshinehealth.com",
    customerName: "Sunshine Health Group",
    phoneNumber: "(555) 567-8901",
    billingAddress: {
      address1: "321 Wellness Way",
      address2: "",
      city: "Miami",
      state: "FL",
      zipcode: "33101",
      country: "United States",
    },
  },
}

// Helper function to get profile by user ID
export function getProfileByUserId(userId: string): UserProfile | null {
  return mockProfiles[userId] || null
}

// Helper function to get profile by customer ID (for customer users)
export function getProfileByCustomerId(customerId: string): UserProfile | null {
  return mockProfiles[customerId] || null
}
