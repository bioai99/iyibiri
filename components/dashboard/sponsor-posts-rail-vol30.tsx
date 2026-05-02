'use client'

// Vol-40 (2026-05-02): SponsorPostsRailVol30 → PostsRailVol30 wrapper.
// NGO ve sponsor kart tasarımları unified edildi (post.sponsors/post.ngos
// runtime detection). Bu dosya geriye dönük uyumluluk için korundu — yeni
// kullanımlar doğrudan PostsRailVol30'u "SPONSORLARDAN" eyebrow ile
// çağırmalı.

import { PostsRailVol30 } from './posts-rail-vol30'
import type { PostWithAuthor } from '@/lib/supabase/types'

interface Props {
  posts: PostWithAuthor[]
  allHref?: string
}

export function SponsorPostsRailVol30({ posts, allHref }: Props) {
  return (
    <PostsRailVol30
      posts={posts}
      eyebrow="SPONSORLARDAN"
      title="Sosyal sorumluluk"
      allHref={allHref}
    />
  )
}
