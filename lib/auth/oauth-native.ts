import { createClient } from '@/lib/supabase/client'

export function isNativePlatform(): boolean {
  if (typeof window === 'undefined') return false
  // Check for Capacitor runtime
  if ((window as any).Capacitor?.isNativePlatform?.()) return true
  if ((window as any).Capacitor) return true
  // Check for standalone mode (PWA or Capacitor WebView)
  if ((window.navigator as any).standalone) return true
  if (window.matchMedia?.('(display-mode: standalone)').matches) return true
  return false
}

export async function handleNativeOAuth(provider: 'google' | 'apple'): Promise<void> {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: 'https://www.iyibiri.app/auth/native-callback',
      skipBrowserRedirect: true,
      ...(provider === 'google' && { queryParams: { prompt: 'select_account' } }),
    },
  })

  if (error || !data.url) {
    console.error('OAuth error:', error)
    return
  }

  // Try Capacitor Browser plugin first
  try {
    const { Browser } = await import('@capacitor/browser')
    const { App } = await import('@capacitor/app')

    // Listen for custom URL scheme callback
    const handle = await App.addListener('appUrlOpen', async ({ url }) => {
      if (url.includes('auth/callback')) {
        try {
          const parsedUrl = new URL(url)
          const code = parsedUrl.searchParams.get('code')
          if (code) {
            await supabase.auth.exchangeCodeForSession(code)
          }
        } catch (e) {
          console.error('Code exchange error:', e)
        }
        await Browser.close().catch(() => {})
        await handle.remove()
        window.location.href = '/dashboard'
      }
    })

    await Browser.open({ url: data.url, presentationStyle: 'popover' })
  } catch {
    // Fallback: regular redirect if Capacitor plugins not available
    window.location.href = data.url
  }
}
