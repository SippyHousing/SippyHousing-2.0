// import { supabase, Property } from '@/lib/supabase'

// // Property Image type definition
// export interface PropertyImage {
//   id: string
//   property_id: string
//   image_url: string
//   created_at: string
// }

// export const propertyService = {
//   // Fetch all properties from the properties table
//   async getAllProperties(): Promise<Property[]> {
//     try {
//       const { data, error } = await supabase
//         .from('properties')
//         .select('*')
//         .order('created_at', { ascending: false })

//       if (error) {
//         throw new Error(`Error fetching properties: ${error.message}`)
//       }

//       return data || []
//     } catch (error) {
//       console.error('Error in getAllProperties:', error)
//       throw error
//     }
//   },

//   // Fetch properties by property_type (New, Rental, Resale)
//   async getPropertiesByType(propertyType: string): Promise<Property[]> {
//     try {
//       const { data, error } = await supabase
//         .from('properties')
//         .select('*')
//         .eq('property_type', propertyType)
//         .order('created_at', { ascending: false })

//       if (error) {
//         throw new Error(`Error fetching properties by type: ${error.message}`)
//       }

//       return data || []
//     } catch (error) {
//       console.error('Error in getPropertiesByType:', error)
//       throw error
//     }
//   },

//   // Fetch properties by usage_type (Residential, Commercial)
//   async getPropertiesByUsageType(usageType: string): Promise<Property[]> {
//     try {
//       const { data, error } = await supabase
//         .from('properties')
//         .select('*')
//         .eq('usage_type', usageType)
//         .order('created_at', { ascending: false })

//       if (error) {
//         throw new Error(`Error fetching properties by usage type: ${error.message}`)
//       }

//       return data || []
//     } catch (error) {
//       console.error('Error in getPropertiesByUsageType:', error)
//       throw error
//     }
//   },

//   // Get property by ID
//   async getPropertyById(id: string): Promise<Property | null> {
//     try {
//       const { data, error } = await supabase
//         .from('properties')
//         .select('*')
//         .eq('id', id)
//         .single()

//       if (error) {
//         throw new Error(`Error fetching property: ${error.message}`)
//       }

//       return data
//     } catch (error) {
//       console.error('Error in getPropertyById:', error)
//       throw error
//     }
//   },

//   // Add new property
//   async addProperty(property: Omit<Property, 'id' | 'created_at'>): Promise<Property> {
//     try {
//       const { data, error } = await supabase
//         .from('properties')
//         .insert([property])
//         .select()
//         .single()

//       if (error) {
//         throw new Error(`Error adding property: ${error.message}`)
//       }

//       return data
//     } catch (error) {
//       console.error('Error in addProperty:', error)
//       throw error
//     }
//   },

//   // Update property
//   async updateProperty(id: string, updates: Partial<Omit<Property, 'id' | 'created_at'>>): Promise<Property> {
//     try {
//       const { data, error } = await supabase
//         .from('properties')
//         .update(updates)
//         .eq('id', id)
//         .select()
//         .single()

//       if (error) {
//         throw new Error(`Error updating property: ${error.message}`)
//       }

//       return data
//     } catch (error) {
//       console.error('Error in updateProperty:', error)
//       throw error
//     }
//   },

//   // Delete property
//   async deleteProperty(id: string): Promise<void> {
//     try {
//       const { error } = await supabase
//         .from('properties')
//         .delete()
//         .eq('id', id)

//       if (error) {
//         throw new Error(`Error deleting property: ${error.message}`)
//       }
//     } catch (error) {
//       console.error('Error in deleteProperty:', error)
//       throw error
//     }
//   },

//   // Bulk insert properties (for CSV upload)
//   async bulkInsertProperties(properties: Omit<Property, 'id' | 'created_at'>[]): Promise<Property[]> {
//     try {
//       const { data, error } = await supabase
//         .from('properties')
//         .insert(properties)
//         .select()

//       if (error) {
//         throw new Error(`Error bulk inserting properties: ${error.message}`)
//       }

//       return data || []
//     } catch (error) {
//       console.error('Error in bulkInsertProperties:', error)
//       throw error
//     }
//   },

//   // Upload image to Supabase Storage
//   async uploadImage(file: File, propertyId: string): Promise<string> {
//     try {
//       const fileExt = file.name.split('.').pop()
//       const fileName = `${propertyId}/${Date.now()}.${fileExt}`
      
//       const { data, error } = await supabase.storage
//         .from('listings')
//         .upload(fileName, file, {
//           cacheControl: '3600',
//           upsert: false
//         })

//       if (error) {
//         throw new Error(`Error uploading image: ${error.message}`)
//       }

//       // Get public URL
//       const { data: urlData } = supabase.storage
//         .from('listings')
//         .getPublicUrl(fileName)

//       return urlData.publicUrl
//     } catch (error) {
//       console.error('Error in uploadImage:', error)
//       throw error
//     }
//   },

//   // Save image record to database
//   async saveImageRecord(propertyId: string, imageUrl: string): Promise<PropertyImage> {
//     try {
//       const { data, error } = await supabase
//         .from('property_images')
//         .insert([{
//           property_id: propertyId,
//           image_url: imageUrl
//         }])
//         .select()
//         .single()

//       if (error) {
//         throw new Error(`Error saving image record: ${error.message}`)
//       }

//       return data
//     } catch (error) {
//       console.error('Error in saveImageRecord:', error)
//       throw error
//     }
//   },

//   // Upload multiple images for a property
//   async uploadMultipleImages(files: File[], propertyId: string): Promise<PropertyImage[]> {
//     try {
//       const uploadPromises = files.map(async (file) => {
//         const imageUrl = await this.uploadImage(file, propertyId)
//         return await this.saveImageRecord(propertyId, imageUrl)
//       })

//       return await Promise.all(uploadPromises)
//     } catch (error) {
//       console.error('Error in uploadMultipleImages:', error)
//       throw error
//     }
//   },

//   // Get images for a property
//   async getPropertyImages(propertyId: string): Promise<PropertyImage[]> {
//     try {
//       const { data, error } = await supabase
//         .from('property_images')
//         .select('*')
//         .eq('property_id', propertyId)
//         .order('created_at', { ascending: false })

//       if (error) {
//         throw new Error(`Error fetching property images: ${error.message}`)
//       }

//       return data || []
//     } catch (error) {
//       console.error('Error in getPropertyImages:', error)
//       throw error
//     }
//   },

//   // Search properties across all searchable text columns (including new category fields)
//   async searchProperties(query: string): Promise<Property[]> {
//     try {
//       const q = (query || '').trim()
//       if (!q) return []

//       // Sanitize: escape single quotes; replace comma so .or() filter doesn't split on it
//       const safe = q.replace(/'/g, "''").replace(/,/g, ' ')
//       const pattern = `%${safe}%`

//       // Search across common + category-specific text columns
//       const searchColumns = [
//         'building',
//         'header',
//         'description',
//         'location',
//         'sub_location',
//         'city',
//         'country',
//         'primary_category',
//         'society_property_name',
//         'state_country',
//         'road_street_name',
//         'view',
//         'possession',
//         'rera_number',
//         'contact_number',
//         'property_type',
//         'usage_type',
//         'usage_type_category',
//         'property_type_international',
//         'configuration_international',
//         'configuration_type',
//         'furnishing_status',
//         'area',
//         'plot_size',
//         'constructed_area',
//         'built_up_area',
//         'property_size',
//         'existing_structure_details',
//         'commercial_terms',
//       ]
//       const conditions = searchColumns.map((col) => `${col}.ilike.${pattern}`).join(',')

//       const { data, error } = await supabase
//         .from('properties')
//         .select('*')
//         .or(conditions)
//         .order('created_at', { ascending: false })

//       if (error) {
//         throw new Error(`Error searching properties: ${error.message}`)
//       }

//       return data || []
//     } catch (error) {
//       console.error('Error in searchProperties:', error)
//       throw error
//     }
//   },

//   // Get properties by category (primary_category or category_assignments)
//   async getPropertiesByCategory(categorySlug: string): Promise<Property[]> {
//     try {
//       // Query for properties where primary_category matches OR category_assignments array contains the slug
//       const { data, error } = await supabase
//         .from('properties')
//         .select('*')
//         .or(`primary_category.eq.${categorySlug},category_assignments.cs.{${categorySlug}}`)
//         .order('created_at', { ascending: false })

//       if (error) {
//         throw new Error(`Error fetching properties by category: ${error.message}`)
//       }

//       return data || []
//     } catch (error) {
//       console.error('Error in getPropertiesByCategory:', error)
//       throw error
//     }
//   },

//   // Get properties by multiple categories (properties that belong to any of the specified categories)
//   async getPropertiesByCategories(categorySlugs: string[]): Promise<Property[]> {
//     try {
//       if (categorySlugs.length === 0) {
//         return []
//       }

//       // For multiple categories, we'll fetch all and filter in JavaScript for better reliability
//       // This ensures we catch properties in primary_category OR category_assignments
//       const { data, error } = await supabase
//         .from('properties')
//         .select('*')
//         .order('created_at', { ascending: false })

//       if (error) {
//         throw new Error(`Error fetching properties: ${error.message}`)
//       }

//       // Filter properties that match any of the specified categories
//       const filtered = (data || []).filter(property => {
//         const primaryMatch = property.primary_category && categorySlugs.includes(property.primary_category)
//         const assignmentsMatch = property.category_assignments && 
//           property.category_assignments.some((slug: string) => categorySlugs.includes(slug))
//         return primaryMatch || assignmentsMatch
//       })

//       return filtered
//     } catch (error) {
//       console.error('Error in getPropertiesByCategories:', error)
//       throw error
//     }
//   },

//   // Get properties that belong to ALL specified categories (intersection)
//   async getPropertiesByAllCategories(categorySlugs: string[]): Promise<Property[]> {
//     try {
//       if (categorySlugs.length === 0) {
//         return []
//       }

//       // For intersection, we need to check that category_assignments contains all specified slugs
//       // This is more complex and may require filtering in JavaScript for better accuracy
//       const { data, error } = await supabase
//         .from('properties')
//         .select('*')
//         .order('created_at', { ascending: false })

//       if (error) {
//         throw new Error(`Error fetching properties: ${error.message}`)
//       }

//       // Filter properties that have all specified categories in their assignments
//       const filtered = (data || []).filter(property => {
//         const assignments = property.category_assignments || []
//         return categorySlugs.every(slug => 
//           assignments.includes(slug) || property.primary_category === slug
//         )
//       })

//       return filtered
//     } catch (error) {
//       console.error('Error in getPropertiesByAllCategories:', error)
//       throw error
//     }
//   },

//   // Delete image
//   async deleteImage(imageId: string): Promise<void> {
//     try {
//       const { error } = await supabase
//         .from('property_images')
//         .delete()
//         .eq('id', imageId)

//       if (error) {
//         throw new Error(`Error deleting image: ${error.message}`)
//       }
//     } catch (error) {
//       console.error('Error in deleteImage:', error)
//       throw error
//     }
//   }
// } 
import { supabase, Property } from '@/lib/supabase'

// Property Image type definition
export interface PropertyImage {
  id: string
  property_id: string
  image_url: string
  created_at: string
}

export const propertyService = {
  // Fetch all properties from the properties table
  async getAllProperties(): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Error fetching properties: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error in getAllProperties:', error)
      throw error
    }
  },

  // Fetch properties by property_type (New, Rental, Resale)
  async getPropertiesByType(propertyType: string): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('property_type', propertyType)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Error fetching properties by type: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error in getPropertiesByType:', error)
      throw error
    }
  },

  // Fetch properties by usage_type (Residential, Commercial)
  async getPropertiesByUsageType(usageType: string): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('usage_type', usageType)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Error fetching properties by usage type: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error in getPropertiesByUsageType:', error)
      throw error
    }
  },

  // Get property by ID
  async getPropertyById(id: string): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw new Error(`Error fetching property: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in getPropertyById:', error)
      throw error
    }
  },

  // Add new property
  async addProperty(property: Omit<Property, 'id' | 'created_at'>): Promise<Property> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([property])
        .select()
        .single()

      if (error) {
        throw new Error(`Error adding property: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in addProperty:', error)
      throw error
    }
  },

  // Update property
  async updateProperty(id: string, updates: Partial<Omit<Property, 'id' | 'created_at'>>): Promise<Property> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error updating property: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in updateProperty:', error)
      throw error
    }
  },

  // Delete property
  async deleteProperty(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(`Error deleting property: ${error.message}`)
      }
    } catch (error) {
      console.error('Error in deleteProperty:', error)
      throw error
    }
  },

  // Bulk insert properties (for CSV upload)
  async bulkInsertProperties(properties: Omit<Property, 'id' | 'created_at'>[]): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert(properties)
        .select()

      if (error) {
        throw new Error(`Error bulk inserting properties: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error in bulkInsertProperties:', error)
      throw error
    }
  },

  // Upload image to Supabase Storage
  async uploadImage(file: File, propertyId: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${propertyId}/${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('listings')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        throw new Error(`Error uploading image: ${error.message}`)
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('listings')
        .getPublicUrl(fileName)

      return urlData.publicUrl
    } catch (error) {
      console.error('Error in uploadImage:', error)
      throw error
    }
  },

  // Save image record to database
  async saveImageRecord(propertyId: string, imageUrl: string): Promise<PropertyImage> {
    try {
      const { data, error } = await supabase
        .from('property_images')
        .insert([{
          property_id: propertyId,
          image_url: imageUrl
        }])
        .select()
        .single()

      if (error) {
        throw new Error(`Error saving image record: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in saveImageRecord:', error)
      throw error
    }
  },

  // Upload multiple images for a property
  async uploadMultipleImages(files: File[], propertyId: string): Promise<PropertyImage[]> {
    try {
      const uploadPromises = files.map(async (file) => {
        const imageUrl = await this.uploadImage(file, propertyId)
        return await this.saveImageRecord(propertyId, imageUrl)
      })

      return await Promise.all(uploadPromises)
    } catch (error) {
      console.error('Error in uploadMultipleImages:', error)
      throw error
    }
  },

  // Get images for a property
  async getPropertyImages(propertyId: string): Promise<PropertyImage[]> {
    try {
      const { data, error } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Error fetching property images: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error in getPropertyImages:', error)
      throw error
    }
  },

  // Search properties across name, category/BHK, price, and area/sqft — matches
  // free-text queries like "2BHK Andheri under 1 crore" or "penthouse sea view"
  async searchProperties(query: string): Promise<Property[]> {
    try {
      const q = (query || '').trim()
      if (!q) return []

      // Escape a value for safe use inside a PostgREST ilike/or filter string
      const escapeForFilter = (val: string) =>
        val.replace(/'/g, "''").replace(/,/g, ' ').replace(/[()]/g, ' ').trim()

      // All text/text-like columns worth a substring match. Covers name,
      // category/type, BHK/configuration, and price/area fields.
      const GENERAL_COLUMNS = [
        'building',
        'header',
        'description',
        'additional_info',
        'location',
        'sub_location',
        'city',
        'country',
        'primary_category',
        'society_property_name',
        'state_country',
        'road_street_name',
        'view',
        'possession',
        'property_type',
        'usage_type',
        'usage_type_category',
        'property_type_international',
        'configuration_international',
        'configuration_type',
        'furnishing_status',
        'bhk',
        'area',
        'plot_size',
        'constructed_area',
        'built_up_area',
        'property_size',
        'flat_size',
        'existing_structure_details',
        'commercial_terms',
        'price',
        'price_range',
        'sale_price',
        'price_international',
      ]

      // Columns specifically for BHK / configuration matches (kept tight so a
      // "2" doesn't fuzzy-match into unrelated fields)
      const BHK_COLUMNS = [
        'bhk',
        'configuration_type',
        'configuration_international',
        'header',
        'building',
        'description',
        'primary_category',
      ]

      // Columns specifically for price/area style numeric matches
      const PRICE_AREA_COLUMNS = [
        'price',
        'price_range',
        'sale_price',
        'price_international',
        'area',
        'plot_size',
        'constructed_area',
        'built_up_area',
        'property_size',
        'flat_size',
      ]

      // Each entry is an OR-group (conditions joined by ',' → OR).
      // Groups are applied as separate .or() calls, which PostgREST ANDs
      // together — so "2BHK Andheri" requires BOTH to match (in any column).
      const orGroups: string[] = []
      let remaining = q

      // 1) Pull out "N BHK" / "NBHK" / "N RK" style tokens first, since they
      // need to check both spaced and unspaced variants against the same row.
      const bhkRegex = /(\d+)\s*-?\s*(bhk|rk)/gi
      let match: RegExpExecArray | null
      while ((match = bhkRegex.exec(q)) !== null) {
        const num = match[1]
        const unit = match[2].toUpperCase()
        const variants = [`${num} ${unit}`, `${num}${unit}`, `${num}-${unit}`]
        const group = BHK_COLUMNS
          .flatMap((col) => variants.map((v) => `${col}.ilike.%${escapeForFilter(v)}%`))
          .join(',')
        orGroups.push(group)
        remaining = remaining.replace(match[0], ' ')
      }

      // 2) Split whatever text is left into individual word tokens so multi
      // word queries (name + locality + category) all have to be satisfied,
      // instead of requiring one giant exact phrase match.
      const tokens = remaining
        .split(/[\s,]+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0)

      for (const token of tokens) {
        const safeToken = escapeForFilter(token)
        if (!safeToken) continue

        const isNumericish = /^\d[\d.]*$/.test(safeToken)
        // Longer numbers are almost always price/area figures (e.g. "5000000",
        // "1200"); short 1-2 digit numbers are too generic on their own, so
        // fall back to the general column set for those.
        const columns = isNumericish && safeToken.replace(/\D/g, '').length >= 3
          ? PRICE_AREA_COLUMNS
          : GENERAL_COLUMNS

        const group = columns.map((col) => `${col}.ilike.%${safeToken}%`).join(',')
        orGroups.push(group)
      }

      if (orGroups.length === 0) return []

      let queryBuilder = supabase.from('properties').select('*')
      for (const group of orGroups) {
        queryBuilder = queryBuilder.or(group)
      }

      const { data, error } = await queryBuilder.order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Error searching properties: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error in searchProperties:', error)
      throw error
    }
  },

  // Get properties by category (primary_category or category_assignments)
  async getPropertiesByCategory(categorySlug: string): Promise<Property[]> {
    try {
      // Query for properties where primary_category matches OR category_assignments array contains the slug
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .or(`primary_category.eq.${categorySlug},category_assignments.cs.{${categorySlug}}`)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Error fetching properties by category: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error in getPropertiesByCategory:', error)
      throw error
    }
  },

  // Get properties by multiple categories (properties that belong to any of the specified categories)
  async getPropertiesByCategories(categorySlugs: string[]): Promise<Property[]> {
    try {
      if (categorySlugs.length === 0) {
        return []
      }

      // For multiple categories, we'll fetch all and filter in JavaScript for better reliability
      // This ensures we catch properties in primary_category OR category_assignments
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Error fetching properties: ${error.message}`)
      }

      // Filter properties that match any of the specified categories
      const filtered = (data || []).filter(property => {
        const primaryMatch = property.primary_category && categorySlugs.includes(property.primary_category)
        const assignmentsMatch = property.category_assignments && 
          property.category_assignments.some((slug: string) => categorySlugs.includes(slug))
        return primaryMatch || assignmentsMatch
      })

      return filtered
    } catch (error) {
      console.error('Error in getPropertiesByCategories:', error)
      throw error
    }
  },

  // Get properties that belong to ALL specified categories (intersection)
  async getPropertiesByAllCategories(categorySlugs: string[]): Promise<Property[]> {
    try {
      if (categorySlugs.length === 0) {
        return []
      }

      // For intersection, we need to check that category_assignments contains all specified slugs
      // This is more complex and may require filtering in JavaScript for better accuracy
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Error fetching properties: ${error.message}`)
      }

      // Filter properties that have all specified categories in their assignments
      const filtered = (data || []).filter(property => {
        const assignments = property.category_assignments || []
        return categorySlugs.every(slug => 
          assignments.includes(slug) || property.primary_category === slug
        )
      })

      return filtered
    } catch (error) {
      console.error('Error in getPropertiesByAllCategories:', error)
      throw error
    }
  },

  // Delete image
  async deleteImage(imageId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('id', imageId)

      if (error) {
        throw new Error(`Error deleting image: ${error.message}`)
      }
    } catch (error) {
      console.error('Error in deleteImage:', error)
      throw error
    }
  }
} 
