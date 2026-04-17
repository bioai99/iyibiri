'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setAdminCookie } from './actions'

export default function AdminLoginPage() {
  const [secret, setSecret] = useState('')
  const [error, setError] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const ok = await setAdminCookie(secret)
    if (!ok) {
      setError(true)
      return
    }
    router.push('/admin/missions')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8">
        <h1 className="font-display font-extrabold text-xl text-text-primary mb-6 text-center">
          Admin Girişi
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={secret}
            onChange={e => { setSecret(e.target.value); setError(false) }}
            placeholder="Admin şifresi"
            className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {error && (
            <p className="text-danger text-sm text-center">Hatalı şifre</p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold"
          >
            Giriş
          </button>
        </form>
      </div>
    </div>
  )
}
