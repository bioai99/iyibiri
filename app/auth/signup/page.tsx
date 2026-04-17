'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, Mail, Lock, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

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
      const msg = error.message.toLowerCase()
      if (msg.includes('already registered') || msg.includes('already exists')) {
        setError('Bu e-posta adresi zaten kayıtlı')
      } else if (msg.includes('password')) {
        setError('Şifre en az 6 karakter olmalı')
      } else {
        setError('Kayıt olunamadı, tekrar dene')
      }
      setLoading(false)
      return
    }
    setLoading(false)
    router.push('/onboarding')
  }

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col">
      {/* Brand area */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center px-6 pb-8"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-5 shadow-[0_8px_32px_rgba(251,146,60,0.4)]">
          <Sparkles size={36} className="text-white" />
        </div>
        <h1 className="font-display font-black text-white text-4xl tracking-tight">İyiBiri</h1>
        <p className="text-stone-400 text-base mt-2 text-center">İyi şeyler yapmak, iyi hissettirir</p>
      </motion.div>

      {/* Form card */}
      <motion.div
        className="bg-white rounded-t-3xl px-6 pt-8 pb-10"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 32, delay: 0.1 }}
      >
        <h2 className="font-display font-extrabold text-stone-900 text-2xl mb-6">Hesap Oluştur</h2>

        <form onSubmit={handleSignup} className="space-y-3">
          {/* Name */}
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Adın Soyadın"
              className="w-full bg-stone-100 rounded-2xl pl-11 pr-4 py-4 text-stone-900 placeholder:text-stone-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="E-posta adresin"
              className="w-full bg-stone-100 rounded-2xl pl-11 pr-4 py-4 text-stone-900 placeholder:text-stone-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Şifre (en az 6 karakter)"
              className="w-full bg-stone-100 rounded-2xl pl-11 pr-4 py-4 text-stone-900 placeholder:text-stone-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm text-center pt-1"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 mt-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-display font-bold text-base rounded-2xl shadow-[0_4px_20px_rgba(251,146,60,0.35)] disabled:opacity-60"
          >
            {loading ? 'Hesap oluşturuluyor...' : 'Başla'}
          </motion.button>
        </form>

        <p className="text-center text-sm text-stone-400 mt-6">
          Zaten hesabın var mı?{' '}
          <Link href="/auth/login" className="text-primary font-bold">
            Giriş yap
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
