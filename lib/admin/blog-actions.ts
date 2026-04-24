'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface BlogPostData {
  title: string
  content: string
  cover_image_url?: string
  category?: 'article' | 'update' | 'story' | 'tip'
  status: 'draft' | 'published'
}

/**
 * Yeni blog yazısı oluştur
 */
export async function createBlogPost(
  ngoId: string,
  data: BlogPostData,
): Promise<{ success: boolean; postId?: string; error?: string }> {
  const supabase = await createClient()

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        ngo_id: ngoId,
        title: data.title,
        content: data.content,
        cover_image_url: data.cover_image_url || null,
        category: data.category || 'article',
        published: data.status === 'published',
        read_time: Math.ceil(data.content.split(' ').length / 200),
      })
      .select('id')
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/admin/${ngoId}/blog`)
    revalidatePath(`/admin/${ngoId}`)

    return { success: true, postId: post?.id }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

/**
 * Blog yazısını güncelle
 */
export async function updateBlogPost(
  ngoId: string,
  postId: string,
  data: Partial<BlogPostData>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    const updateData: any = {
      ...(data.title && { title: data.title }),
      ...(data.content && {
        content: data.content,
        read_time: Math.ceil(data.content.split(' ').length / 200),
      }),
      ...(data.cover_image_url !== undefined && {
        cover_image_url: data.cover_image_url || null,
      }),
      ...(data.category && { category: data.category }),
      ...(data.status === 'published' && {
        published: true,
      }),
      ...(data.status === 'draft' && {
        published: false,
      }),
    }

    const { error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', postId)
      .eq('ngo_id', ngoId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/admin/${ngoId}/blog`)
    revalidatePath(`/admin/${ngoId}`)

    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

/**
 * Blog yazısını sil (soft delete)
 */
export async function deleteBlogPost(
  ngoId: string,
  postId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('ngo_id', ngoId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/admin/${ngoId}/blog`)
    revalidatePath(`/admin/${ngoId}`)

    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

/**
 * Blog yazısı durumunu değiştir
 */
export async function toggleBlogPostStatus(
  ngoId: string,
  postId: string,
  status: 'draft' | 'published',
): Promise<{ success: boolean; error?: string }> {
  return updateBlogPost(ngoId, postId, { status })
}
