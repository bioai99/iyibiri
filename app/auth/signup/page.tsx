'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/onboarding')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-text-primary">İyilik Yolculuğuna Başla</h1>
          <p className="text-text-muted text-sm mt-1">Hesap oluştur, ilk görevini al</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">Adın</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              placeholder="Adın Soyadın"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              placeholder="ornek@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              placeholder="En az 6 karakter"
            />
          </div>

          {error && (
            <motion.p
              className="text-sm text-danger text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary text-white font-display font-bold text-base rounded-xl shadow-md disabled:opacity-60"
            whileTap={{ scale: 0.97 }}
          >
            {loading ? 'Hesap oluşturuluyor...' : 'Başla'}
          </motion.button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Zaten hesabın var mı?{' '}
          <Link href="/auth/login" className="text-primary font-semibold">
            Giriş yap
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
