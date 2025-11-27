// src/pages/register/types.ts
export interface Certificate {
  name: string
  issuer?: string
  issueYear?: number | null
  certificateLink?: string
  issuedDate?: string | null  // frontend will send ISO string
  certificateImage?: string   // base64 string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role?: 'student' | 'trainer' | undefined

  // trainer fields
  education: string
  experience: string // keep string in UI; convert to number before sending
  certificates: Certificate[]
  dob: string
  bio: string
  resume: File | string | null // File during upload, string for base64

  // shared
  phone: string
  nationalityCode?: string
  location?: string

  // student fields & trainer teaching fields
  learningType: '' | 'subjects' | 'languages' | 'hobbies' // students
  learningValues: string[] // generic

  // trainer will also use these but label as teachingType/teachingValues in mapping
  subjects: string[]
  languages: string[]
  hobbies: string[]
  standards: string[] // array of selected standards or custom ranges
  customStandardRange?: string
}
