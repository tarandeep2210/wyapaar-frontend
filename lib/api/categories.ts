import { supabase, type Category } from '../supabase'

/**
 * Get all product categories with product counts
 */
export async function getCategories() {
  try {
    // Get categories from products table by grouping mcat_name
    const { data, error } = await supabase
      .from('products')
      .select('mcat_name, mcat_id')
      .not('mcat_name', 'is', null)
      .not('mcat_id', 'is', null)

    if (error) {
      console.error('Error fetching categories:', error)
      return { categories: [], error: error.message }
    }

    // Group by category and count products
    const categoryMap = new Map<string, { mcat_id: string; mcat_name: string; count: number }>()
    
    data?.forEach(item => {
      const key = item.mcat_name
      if (categoryMap.has(key)) {
        categoryMap.get(key)!.count += 1
      } else {
        categoryMap.set(key, {
          mcat_id: item.mcat_id,
          mcat_name: item.mcat_name,
          count: 1
        })
      }
    })

    const categories: Category[] = Array.from(categoryMap.values())
      .map(cat => ({
        mcat_id: cat.mcat_id,
        mcat_name: cat.mcat_name,
        product_count: cat.count
      }))
      .sort((a, b) => b.product_count - a.product_count) // Sort by product count desc

    return {
      categories,
      error: null
    }
  } catch (error) {
    console.error('Error in getCategories:', error)
    return {
      categories: [],
      error: 'Failed to fetch categories'
    }
  }
}

/**
 * Get trending categories (most active in recent days)
 */
export async function getTrendingCategories(limit = 10) {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    
    const { data, error } = await supabase
      .from('products')
      .select('mcat_name, mcat_id, created_at')
      .not('mcat_name', 'is', null)
      .gte('created_at', thirtyDaysAgo)

    if (error) {
      console.error('Error fetching trending categories:', error)
      return { categories: [], error: error.message }
    }

    // Group by category and count recent products
    const categoryMap = new Map<string, { mcat_id: string; mcat_name: string; count: number }>()
    
    data?.forEach(item => {
      const key = item.mcat_name
      if (categoryMap.has(key)) {
        categoryMap.get(key)!.count += 1
      } else {
        categoryMap.set(key, {
          mcat_id: item.mcat_id,
          mcat_name: item.mcat_name,
          count: 1
        })
      }
    })

    const trendingCategories = Array.from(categoryMap.values())
      .map(cat => ({
        mcat_id: cat.mcat_id,
        mcat_name: cat.mcat_name,
        product_count: cat.count
      }))
      .sort((a, b) => b.product_count - a.product_count)
      .slice(0, limit)

    return {
      categories: trendingCategories,
      error: null
    }
  } catch (error) {
    console.error('Error in getTrendingCategories:', error)
    return {
      categories: [],
      error: 'Failed to fetch trending categories'
    }
  }
}

/**
 * Get products by category
 */
export async function getProductsByCategory(
  mcatId: string,
  { page = 1, limit = 12 }: { page?: number; limit?: number } = {}
) {
  try {
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from('products')
      .select(`
        *,
        supplier:suppliers(*)
      `, { count: 'exact' })
      .eq('mcat_id', mcatId)
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products by category:', error)
      return { products: [], total: 0, error: error.message }
    }

    return {
      products: data || [],
      total: count || 0,
      error: null
    }
  } catch (error) {
    console.error('Error in getProductsByCategory:', error)
    return {
      products: [],
      total: 0,
      error: 'Failed to fetch products'
    }
  }
}

/**
 * Search products across all categories
 */
export async function searchProducts(
  query: string,
  { page = 1, limit = 12, category = '' }: { page?: number; limit?: number; category?: string } = {}
) {
  try {
    const from = (page - 1) * limit
    const to = from + limit - 1

    let supabaseQuery = supabase
      .from('products')
      .select(`
        *,
        supplier:suppliers(*)
      `, { count: 'exact' })

    // Apply search filter
    if (query) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%,mcat_name.ilike.%${query}%`)
    }

    // Apply category filter
    if (category) {
      supabaseQuery = supabaseQuery.eq('mcat_id', category)
    }

    const { data, error, count } = await supabaseQuery
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching products:', error)
      return { products: [], total: 0, error: error.message }
    }

    return {
      products: data || [],
      total: count || 0,
      error: null
    }
  } catch (error) {
    console.error('Error in searchProducts:', error)
    return {
      products: [],
      total: 0,
      error: 'Failed to search products'
    }
  }
}

/**
 * Get a single product by ID with all related data
 */
export async function getProductById(productId: string | number) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        supplier:suppliers(*)
      `)
      .eq('id', productId)
      .single()

    if (error) {
      console.error('Error fetching product by ID:', error)
      return { product: null, error: error.message }
    }

    return {
      product: data,
      error: null
    }
  } catch (error) {
    console.error('Error in getProductById:', error)
    return {
      product: null,
      error: 'Failed to fetch product details'
    }
  }
}

/**
 * Get product images by product ID
 */
export async function getProductImages(productId: string | number) {
  try {
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)

    if (error) {
      console.error('Error fetching product images:', error)
      return { images: [], error: error.message }
    }

    return {
      images: data || [],
      error: null
    }
  } catch (error) {
    console.error('Error in getProductImages:', error)
    return {
      images: [],
      error: 'Failed to fetch product images'
    }
  }
}

/**
 * Get product specifications by product ID
 */
export async function getProductSpecifications(productId: string | number) {
  try {
    const { data, error } = await supabase
      .from('product_specifications')
      .select('*')
      .eq('product_id', productId)

    if (error) {
      console.error('Error fetching product specifications:', error)
      return { specifications: [], error: error.message }
    }

    return {
      specifications: data || [],
      error: null
    }
  } catch (error) {
    console.error('Error in getProductSpecifications:', error)
    return {
      specifications: [],
      error: 'Failed to fetch product specifications'
    }
  }
}
