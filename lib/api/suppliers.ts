import { supabase, type Supplier, type Product } from '../supabase'

export interface SupplierAbout {
  id: number
  supplier_id: number
  title: string
  data: string
}

export interface SupplierWithProducts extends Supplier {
  products?: Product[]
  product_count?: number
  about?: SupplierAbout[]
}

/**
 * Test Supabase connection
 */
export async function testSupabaseConnection() {
  try {
    // Simple query to test connection - just get one record
    const { data, error } = await supabase
      .from('suppliers')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Supabase connection test failed:', error)
      return { connected: false, error: error.message }
    }

    console.log('Supabase connection test successful')
    return { connected: true, error: null }
  } catch (error) {
    console.error('Supabase connection test error:', error)
    return { connected: false, error: 'Connection failed' }
  }
}

/**
 * Fetch suppliers with optional filtering and pagination
 */
export async function getSuppliers({
  page = 1,
  limit = 12,
  search = '',
  location = '',
  industry = '',
  sortBy = 'best_match'
}: {
  page?: number
  limit?: number
  search?: string
  location?: string
  industry?: string
  sortBy?: 'best_match' | 'rating' | 'response_rate' | 'newest' | 'product_count'
} = {}) {
  try {
    let query = supabase
      .from('suppliers')
      .select('*', { count: 'exact' })

    // Apply search filter
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    // Apply location filter
    if (location) {
      query = query.ilike('address', `%${location}%`)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        query = query.order('score', { ascending: false, nullsFirst: false })
        break
      case 'response_rate':
        // Client-side sorting will handle this to ensure proper null handling
        query = query.order('created_at', { ascending: false })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'product_count':
        // We'll sort by product count after fetching the data
        query = query.order('created_at', { ascending: false })
        break
      case 'best_match':
      default:
        // Client-side sorting will handle this to ensure proper null handling
        query = query.order('created_at', { ascending: false })
        break
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching suppliers:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return { suppliers: [], total: 0, error: error.message || 'Failed to fetch suppliers' }
    }

    // Get product counts for each supplier
    const suppliersWithCounts = await Promise.all(
      (data || []).map(async (supplier) => {
        const { count: productCount, error: countError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('supplier_id', supplier.id)

        if (countError) {
          console.warn('Error counting products for supplier:', supplier.id, countError)
        }

        return {
          ...supplier,
          product_count: productCount || 0
        }
      })
    )

    // Apply client-side sorting for specific cases
    let finalSuppliers = suppliersWithCounts as SupplierWithProducts[]
    
    if (sortBy === 'product_count') {
      finalSuppliers = finalSuppliers.sort((a, b) => (b.product_count || 0) - (a.product_count || 0))
    } else if (sortBy === 'response_rate') {
      // Client-side sorting to ensure null values are last
      finalSuppliers = finalSuppliers.sort((a, b) => {
        const aRate = a.response_rate ?? -1  // Treat null as -1 (worse than 0)
        const bRate = b.response_rate ?? -1  // Treat null as -1 (worse than 0)
        return bRate - aRate  // Descending order
      })
    } else if (sortBy === 'best_match') {
      // Client-side sorting for best match to ensure proper null handling
      finalSuppliers = finalSuppliers.sort((a, b) => {
        const aRate = a.response_rate ?? -1
        const bRate = b.response_rate ?? -1
        const aScore = a.score ?? -1
        const bScore = b.score ?? -1
        
        // Primary sort by response rate
        if (bRate !== aRate) return bRate - aRate
        
        // Secondary sort by score
        if (bScore !== aScore) return bScore - aScore
        
        // Tertiary sort by creation date (newest first)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
    }

    return {
      suppliers: finalSuppliers,
      total: count || 0,
      error: null
    }
  } catch (error) {
    console.error('Error in getSuppliers:', error)
    return {
      suppliers: [],
      total: 0,
      error: 'Failed to fetch suppliers'
    }
  }
}

/**
 * Get a single supplier by ID with their products
 */
export async function getSupplierById(id: number) {
  try {
    const { data: supplier, error: supplierError } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single()

    if (supplierError) {
      console.error('Error fetching supplier:', supplierError)
      return { supplier: null, error: supplierError.message }
    }

    // Get products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('supplier_id', id)
      .order('created_at', { ascending: false })

    if (productsError) {
      console.error('Error fetching supplier products:', productsError)
    }

    // Get supplier about information
    const { data: about, error: aboutError } = await supabase
      .from('supplier_about')
      .select('*')
      .eq('supplier_id', id)
      .order('id', { ascending: true })

    if (aboutError) {
      console.warn('Error fetching supplier about info:', aboutError)
    }

    return {
      supplier: {
        ...supplier,
        products: products || [],
        about: about || []
      } as SupplierWithProducts,
      error: null
    }
  } catch (error) {
    console.error('Error in getSupplierById:', error)
    return {
      supplier: null,
      error: 'Failed to fetch supplier'
    }
  }
}

/**
 * Get supplier statistics
 */
export async function getSupplierStats() {
  try {
    const { count: totalSuppliers } = await supabase
      .from('suppliers')
      .select('*', { count: 'exact', head: true })

    const { count: activeSuppliers } = await supabase
      .from('suppliers')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

    // Get unique countries from addresses
    const { data: addressData } = await supabase
      .from('suppliers')
      .select('address')
      .not('address', 'is', null)

    const countries = new Set<string>()
    addressData?.forEach(item => {
      if (item.address) {
        // Simple country extraction - you might want to improve this
        const addressParts = item.address.split(',')
        if (addressParts.length > 0) {
          const lastPart = addressParts[addressParts.length - 1].trim()
          if (lastPart) countries.add(lastPart)
        }
      }
    })

    return {
      totalSuppliers: totalSuppliers || 0,
      activeSuppliers: activeSuppliers || 0,
      countriesCount: countries.size,
      error: null
    }
  } catch (error) {
    console.error('Error in getSupplierStats:', error)
    return {
      totalSuppliers: 0,
      activeSuppliers: 0,
      countriesCount: 0,
      error: 'Failed to fetch supplier statistics'
    }
  }
}
