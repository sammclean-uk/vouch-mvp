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

