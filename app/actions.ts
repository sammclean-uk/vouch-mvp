'use server'

import { nanoid } from 'nanoid'
import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function createUserSlug() {
  const slug = nanoid(6)
  const ownerKey = nanoid(12)

  const { data, error } = await supabase
    .from('users')
    .insert({
      slug,
      owner_key: ownerKey,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`)
  }

  return { slug, ownerKey }
}

export async function submitRecommendation(
  slug: string,
  formData: FormData
) {
  const body = formData.get('body') as string
  const name = formData.get('name') as string | null
  const contact = formData.get('contact') as string | null

  // Get user by slug
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('slug', slug)
    .single()

  if (userError || !user) {
    throw new Error('User not found')
  }

  const { error } = await supabase.from('recommendations').insert({
    user_id: user.id,
    body,
    name: name || null,
    contact: contact || null,
  })

  if (error) {
    throw new Error(`Failed to submit recommendation: ${error.message}`)
  }

  revalidatePath(`/u/${slug}`)
}

export async function submitRecommendationWithRedirect(
  slug: string,
  formData: FormData
) {
  await submitRecommendation(slug, formData)
  const { redirect } = await import('next/navigation')
  redirect(`/u/${slug}?submitted=true`)
}

export async function getRecommendationsByUser(
  slug: string,
  ownerKey: string
) {
  // Verify owner_key
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('slug', slug)
    .eq('owner_key', ownerKey)
    .single()

  if (userError || !user) {
    return null
  }

  const { data, error } = await supabase
    .from('recommendations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch recommendations: ${error.message}`)
  }

  return data
}

export async function toggleTried(
  recommendationId: string,
  slug: string,
  ownerKey: string,
  isTried: boolean
) {
  // Verify owner_key
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('slug', slug)
    .eq('owner_key', ownerKey)
    .single()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  // Verify recommendation belongs to user
  const { data: rec, error: recError } = await supabase
    .from('recommendations')
    .select('user_id')
    .eq('id', recommendationId)
    .single()

  if (recError || !rec || rec.user_id !== user.id) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('recommendations')
    .update({ is_tried: isTried })
    .eq('id', recommendationId)

  if (error) {
    throw new Error(`Failed to update recommendation: ${error.message}`)
  }

  revalidatePath(`/u/${slug}/owner`)
}

export async function deleteRecommendation(
  recommendationId: string,
  slug: string,
  ownerKey: string
) {
  // Verify owner_key
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('slug', slug)
    .eq('owner_key', ownerKey)
    .single()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  // Verify recommendation belongs to user
  const { data: rec, error: recError } = await supabase
    .from('recommendations')
    .select('user_id')
    .eq('id', recommendationId)
    .single()

  if (recError || !rec || rec.user_id !== user.id) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('recommendations')
    .delete()
    .eq('id', recommendationId)

  if (error) {
    throw new Error(`Failed to delete recommendation: ${error.message}`)
  }

  revalidatePath(`/u/${slug}/owner`)
}

// Request/Response actions
export async function createRequest(formData: FormData) {
  const location = formData.get('location') as string
  const business_type = formData.get('business_type') as string
  const comment = formData.get('comment') as string | null

  if (!location || !business_type) {
    throw new Error('Location and business type are required')
  }

  const { data, error } = await supabase
    .from('requests')
    .insert({
      location,
      business_type,
      comment: comment || null,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create request: ${error.message}`)
  }

  revalidatePath('/')
  return data
}

export async function getRequests(locationFilter?: string, businessTypeFilter?: string) {
  let query = supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (locationFilter) {
    query = query.ilike('location', `%${locationFilter}%`)
  }

  if (businessTypeFilter) {
    query = query.ilike('business_type', `%${businessTypeFilter}%`)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch requests: ${error.message}`)
  }

  return data || []
}

export async function getRequestById(id: string) {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    throw new Error(`Failed to fetch request: ${error.message}`)
  }

  return data
}

export async function submitResponse(requestId: string, formData: FormData) {
  const business = formData.get('business') as string
  const email = formData.get('email') as string | null
  const instagram = formData.get('instagram') as string | null
  const website = formData.get('website') as string | null
  const notes = formData.get('notes') as string | null

  if (!business) {
    throw new Error('Business name is required')
  }

  const { data, error } = await supabase
    .from('responses')
    .insert({
      request_id: requestId,
      business,
      email: email || null,
      instagram: instagram || null,
      website: website || null,
      notes: notes || null,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to submit response: ${error.message}`)
  }

  revalidatePath(`/request/${requestId}`)
  return data
}

export async function getResponsesByRequestId(requestId: string) {
  const { data, error } = await supabase
    .from('responses')
    .select('*')
    .eq('request_id', requestId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch responses: ${error.message}`)
  }

  return data || []
}

