// lib/view-transitions.ts
//
// Pattern 10: CSS View Transitions API wrapper
// Browser support: Chrome 111+ (85% 2026-04), Firefox fallback → Framer Motion
//
// Usage:
//   const router = useTransitionedRouter()
//   router.push('/dashboard/missions/123')

import { useRouter } from 'next/navigation'

export async function navigateWithTransition(url: string) {
  // Check if ViewTransition API is supported
  if (!document.startViewTransition) {
    // Fallback: regular navigation
    window.location.href = url
    return
  }

  // Start transition: browser holds paint until updateDOM completes
  document.startViewTransition(() => {
    window.location.href = url
  })
}

export function useTransitionedRouter() {
  const router = useRouter()

  const pushWithTransition = async (href: string) => {
    // Check if ViewTransition API is supported
    if (!document.startViewTransition) {
      router.push(href)
      return
    }

    // Start transition with Next.js router.push
    document.startViewTransition(() => {
      router.push(href)
    })
  }

  return {
    ...router,
    push: pushWithTransition,
  }
}
