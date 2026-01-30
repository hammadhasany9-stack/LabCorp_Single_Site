/**
 * Formats a phone number to (XXX) XXX-XXXX format
 * @param value - Raw phone number string
 * @returns Formatted phone number
 */
export function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters
  const digitsOnly = value.replace(/\D/g, '')
  
  // Limit to 10 digits
  const limitedDigits = digitsOnly.slice(0, 10)
  
  // Format based on length
  if (limitedDigits.length === 0) {
    return ''
  } else if (limitedDigits.length <= 3) {
    return `(${limitedDigits}`
  } else if (limitedDigits.length <= 6) {
    return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3)}`
  } else {
    return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`
  }
}

/**
 * Validates if a phone number is complete (10 digits)
 * @param value - Phone number string
 * @returns true if valid (exactly 10 digits)
 */
export function validatePhoneNumber(value: string): boolean {
  const digitsOnly = value.replace(/\D/g, '')
  return digitsOnly.length === 10
}

/**
 * Extracts just the digits from a formatted phone number
 * @param value - Formatted phone number
 * @returns String of digits only
 */
export function getPhoneDigits(value: string): string {
  return value.replace(/\D/g, '')
}
