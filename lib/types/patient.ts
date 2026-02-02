import { z } from 'zod'

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
  PreferNotToSay = 'Prefer not to say',
}

export interface Patient {
  id: string // Unique identifier for each patient row
  firstName: string
  middleName?: string
  lastName: string
  dateOfBirth: Date | null
  gender: Gender | null
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  phoneNumber: string
}

// Validation schema for patient data
export const patientSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.date().nullable(),
  gender: z.nativeEnum(Gender).nullable(),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'State must be 2 characters'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
  phoneNumber: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid phone format. Use: (555) 123-4567'),
})

// Helper to create empty patient
export const createEmptyPatient = (): Patient => ({
  id: crypto.randomUUID(),
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: null,
  gender: null,
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  phoneNumber: '',
})
