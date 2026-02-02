import Papa from 'papaparse'
import { Patient, Gender, createEmptyPatient } from '@/lib/types/patient'
import { formatPhoneNumber } from '@/lib/utils/formatters'

interface CSVRow {
  [key: string]: string
}

export interface ParseResult {
  success: boolean
  patients: Patient[]
  errors: string[]
}

// Expected CSV columns (case-insensitive matching)
const COLUMN_MAPPINGS: Record<string, string[]> = {
  firstName: ['first name', 'firstname', 'first_name'],
  middleName: ['middle name', 'middlename', 'middle_name'],
  lastName: ['last name', 'lastname', 'last_name'],
  dateOfBirth: ['dob', 'date of birth', 'dateofbirth', 'date_of_birth', 'birthdate'],
  gender: ['gender', 'sex'],
  addressLine1: ['address line 1', 'address1', 'address_line_1', 'address'],
  addressLine2: ['address line 2', 'address2', 'address_line_2'],
  city: ['city'],
  state: ['state'],
  zipCode: ['zip code', 'zipcode', 'zip_code', 'zip', 'postal code'],
  phoneNumber: ['phone number', 'phonenumber', 'phone_number', 'phone', 'contact'],
}

// Find column name in CSV headers (case-insensitive)
const findColumnName = (headers: string[], possibleNames: string[]): string | null => {
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim())
  
  for (const possibleName of possibleNames) {
    const index = normalizedHeaders.indexOf(possibleName.toLowerCase())
    if (index !== -1) {
      return headers[index]
    }
  }
  
  return null
}

// Parse date string to Date object
const parseDate = (dateStr: string): Date | null => {
  if (!dateStr || dateStr.trim() === '') return null
  
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return null
  
  return date
}

// Parse gender string to Gender enum
const parseGender = (genderStr: string): Gender | null => {
  if (!genderStr || genderStr.trim() === '') return null
  
  const normalized = genderStr.toLowerCase().trim()
  
  if (normalized === 'male' || normalized === 'm') return Gender.Male
  if (normalized === 'female' || normalized === 'f') return Gender.Female
  if (normalized === 'other') return Gender.Other
  if (normalized === 'prefer not to say' || normalized === 'prefer not to answer') return Gender.PreferNotToSay
  
  return null
}

// Parse CSV file and convert to Patient array
export const parsePatientCSV = async (file: File): Promise<ParseResult> => {
  return new Promise((resolve) => {
    const errors: string[] = []
    
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          errors.push(...results.errors.map(err => `Row ${err.row}: ${err.message}`))
        }
        
        const headers = results.meta.fields || []
        
        if (headers.length === 0) {
          resolve({
            success: false,
            patients: [],
            errors: ['CSV file is empty or has no headers'],
          })
          return
        }
        
        // Map column names
        const columnMap: Record<string, string | null> = {}
        for (const [field, possibleNames] of Object.entries(COLUMN_MAPPINGS)) {
          columnMap[field] = findColumnName(headers, possibleNames)
        }
        
        // Check for required columns
        const requiredFields = ['firstName', 'lastName', 'addressLine1', 'city', 'state', 'zipCode']
        const missingFields = requiredFields.filter(field => !columnMap[field])
        
        if (missingFields.length > 0) {
          resolve({
            success: false,
            patients: [],
            errors: [`Missing required columns: ${missingFields.join(', ')}`],
          })
          return
        }
        
        // Parse each row
        const patients: Patient[] = []
        
        results.data.forEach((row, index) => {
          try {
            const patient = createEmptyPatient()
            
            patient.firstName = row[columnMap.firstName!] || ''
            patient.middleName = columnMap.middleName ? (row[columnMap.middleName] || '') : ''
            patient.lastName = row[columnMap.lastName!] || ''
            patient.dateOfBirth = columnMap.dateOfBirth ? parseDate(row[columnMap.dateOfBirth]) : null
            patient.gender = columnMap.gender ? parseGender(row[columnMap.gender]) : null
            patient.addressLine1 = row[columnMap.addressLine1!] || ''
            patient.addressLine2 = columnMap.addressLine2 ? (row[columnMap.addressLine2] || '') : ''
            patient.city = row[columnMap.city!] || ''
            patient.state = row[columnMap.state!] || ''
            patient.zipCode = row[columnMap.zipCode!] || ''
            
            // Format phone number if provided
            const rawPhone = columnMap.phoneNumber ? (row[columnMap.phoneNumber] || '') : ''
            patient.phoneNumber = rawPhone ? formatPhoneNumber(rawPhone) : ''
            
            // Validate required fields
            if (!patient.firstName || !patient.lastName) {
              errors.push(`Row ${index + 2}: Missing first name or last name`)
            } else {
              patients.push(patient)
            }
          } catch (error) {
            errors.push(`Row ${index + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`)
          }
        })
        
        resolve({
          success: patients.length > 0,
          patients,
          errors,
        })
      },
      error: (error) => {
        resolve({
          success: false,
          patients: [],
          errors: [`Failed to parse CSV: ${error.message}`],
        })
      },
    })
  })
}

// Export patients to CSV
export const exportPatientsToCSV = (patients: Patient[]): string => {
  const headers = [
    'First Name',
    'Middle Name',
    'Last Name',
    'Date of Birth',
    'Gender',
    'Address Line 1',
    'Address Line 2',
    'City',
    'State',
    'ZIP Code',
    'Phone Number',
  ]
  
  const rows = patients.map(patient => [
    patient.firstName,
    patient.middleName || '',
    patient.lastName,
    patient.dateOfBirth ? patient.dateOfBirth.toISOString().split('T')[0] : '',
    patient.gender || '',
    patient.addressLine1,
    patient.addressLine2 || '',
    patient.city,
    patient.state,
    patient.zipCode,
    patient.phoneNumber,
  ])
  
  const csv = Papa.unparse({
    fields: headers,
    data: rows,
  })
  
  return csv
}

// Download CSV file
export const downloadPatientCSV = (patients: Patient[], filename = 'patients.csv') => {
  const csv = exportPatientsToCSV(patients)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
