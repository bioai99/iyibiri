'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInAdmin } from './actions'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') ?? '/admin'
  const error = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(
    error === 'unauthorized'
      ? 'Yetkin yok.'
      : error === 'ngo_unauthorized'
        ? 'Bu STK için yetkin yok.'
        : null
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    const result = await signInAdmin(email, password)

    if (!result.success) {
      setErrorMsg(result.error || 'Giriş başarısız.')
      setLoading(false)
      return
    }

    // Successful login, redirect to returnTo or admin hub
    router.push(returnTo)
  }

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8">
        <h1 className="font-display font-extrabold text-xl text-text-primary mb-2 text-center">
          STK Admin Girişi
        </h1>

        <p className="text-text-secondary text-sm text-center mb-6 leading-relaxed">
          STK yetkili email + şifrenizle giriş yapın. Yetki sorunları için:{' '}
          <a
            href="mailto:destek@iyibiri.app"
            className="text-primary hover:underline font-semibold"
          >
            destek@iyibiri.app
          </a>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errorMsg}
            </div>
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setErrorMsg(null)
            }}
            placeholder="admin@stk.org"
            required
            autoFocus
            className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrorMsg(null)
            }}
            placeholder="Şifre"
            required
            className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 disabled:opacity-70 transition-colors"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>

          <a
            href="/auth/forgot-password"
            className="block text-center text-text-secondary text-sm hover:underline"
          >
            Şifremi unuttum
          </a>
        </form>

        <p className="text-xs text-text-tertiary text-center mt-6 pt-6 border-t border-border">
          Giriş yaparak,{' '}
          <a href="/legal/kvkk-aydinlatma-genel" className="hover:underline">
            Aydınlatma Metni
          </a>
          ni kabul etmiş olursunuz.
        </p>
      </div>
    </div>
  )
}
