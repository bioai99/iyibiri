import { createClient } from '@/lib/supabase/client'

export async function handleNativeOAuth(provider: 'google' | 'apple'): Promise<void> {
  const supabase = createClient()
  const { data } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: 'https://www.iyibiri.app/auth/native-callback',
      skipBrowserRedirect: true,
      ...(provider === 'google' && { queryParams: { prompt: 'select_account' } }),
    },
  })

  if (!data.url) return

  const { Browser } = await import('@capacitor/browser')
  const { App } = await import('@capacitor/app')

  // Listen for the custom URL scheme callback (fires once, then cleans up)
  const handle = await App.addListener('appUrlOpen', async ({ url }) => {
    if (url.includes('auth/callback')) {
      const parsedUrl = new URL(url)
      const code = parsedUrl.searchParams.get('code')
      if (code) {
        await supabase.auth.exchangeCodeForSession(code)
      }
      await Browser.close().catch(() => {})
      await handle.remove()
      window.location.href = '/dashboard'
    }
  })

  await Browser.open({ url: data.url, presentationStyle: 'popover' })
}

export function isNativePlatform(): boolean {
  return typeof window !== 'undefined' && typeof (window as any).Capacitor !== 'undefined'
}
