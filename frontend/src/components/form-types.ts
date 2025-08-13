// Type definitions for the Udyam registration form
export interface AadhaarFormData {
  aadhaarNumber: string
  entrepreneurName: string
  consent: boolean
}

export interface PANFormData {
  organizationType: string
  panNumber: string
  panHolderName: string
  dateOfBirth: string
  consent: boolean
}

export interface AddressData {
  pinCode: string
  city: string
  state: string
  address: string
}

export interface UdyamFormData {
  aadhaar: AadhaarFormData
  pan: PANFormData
  address: AddressData
}

export interface FormValidationErrors {
  [key: string]: string
}

// Validation patterns
export const VALIDATION_PATTERNS = {
  AADHAAR: /^\d{12}$/,
  PAN: /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/,
  DATE: /^\d{2}\/\d{2}\/\d{4}$/,
  PINCODE: /^\d{6}$/,
} as const

// Organization types for dropdown
export const ORGANIZATION_TYPES = [
  "Proprietorship",
  "Partnership",
  "Limited Liability Partnership (LLP)",
  "Private Limited Company",
  "Public Limited Company",
  "Hindu Undivided Family (HUF)",
  "Cooperative Society",
  "Trust",
  "Society",
] as const
