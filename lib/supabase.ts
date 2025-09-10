import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debug environment variables
if (typeof window !== 'undefined') {
  console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing')
  console.log('Supabase Key:', supabaseAnonKey ? 'Set' : 'Missing')
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
)

// Database types based on the schema
export interface Supplier {
  id: number
  name: string
  address?: string
  phone_number?: string
  website_url?: string
  score?: number
  response_rate?: number
  created_at: string
}

export interface Product {
  id: number
  product_display_id: string
  item_id?: string
  url?: string
  title?: string
  description?: string
  mcat_name?: string
  mcat_id?: string
  cat_id?: string
  main_image?: string
  brochure_url?: string
  supplier_id?: number
  price_value?: number
  price_currency?: string
  price_unit?: string
  price_display_string?: string
  created_at: string
  supplier?: Supplier
}

export interface ProductImage {
  id: number
  product_id: number
  medium_url?: string
  full_url?: string
}

export interface ProductSpecification {
  id: number
  product_id: number
  key?: string
  value?: string
}

export interface Category {
  mcat_id: string
  mcat_name: string
  product_count: number
}
