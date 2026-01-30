export function formatPhoneNumber(value: string): string {
  // Remove non-digits
  const cleaned = value.replace(/\D/g, '')
  
  // Format as (555) 123-4567
  if (cleaned.length === 0) return ''
  if (cleaned.length <= 3) return `(${cleaned}`
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
}

export function formatZipCode(value: string): string {
  // Format as 12345 or 12345-6789
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length <= 5) return cleaned
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 9)}`
}

export function generateOrderId(): string {
  return `SS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}
