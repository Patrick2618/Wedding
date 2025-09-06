import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nwqbavdgprhjzziygcpm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53cWJhdmRncHJoanp6aXlnY3BtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3Mzc4OTIsImV4cCI6MjA3MTMxMzg5Mn0.Pf6pXjjc8V7sMSvBIrUhI9gHqREa7N4q2k8kUF5CWGU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de datos para TypeScript
export interface Guest {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  access_code: string
  max_plus_ones: number
  created_at: string
  updated_at: string
}

export interface Confirmation {
  id: string
  guest_id: string
  attending: boolean
  dietary_restrictions?: string
  menu_preference?: 'meat' | 'fish' | 'vegetarian'
  special_requests?: string
  plus_ones?: PlusOne[]
  created_at: string
  updated_at: string
}

export interface PlusOne {
  id: string
  confirmation_id: string
  name: string
  dietary_restrictions?: string
  menu_preference?: 'meat' | 'fish' | 'vegetarian'
  created_at: string
  updated_at: string
}