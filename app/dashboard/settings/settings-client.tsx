'use client'

/**
 * Settings page MVP — BUG-026 fix (Vol-14)
 *
 * Sections:
 *   1. Tema (light/dark toggle)
 *   2. Hesap (e-posta read-only, profil düzenle link)
 *   3. Yasal (KVKK, gizlilik, kullanım koşulları)
 *   4. Çıkış yap
 *   5. Hakkında (versiyon, geri bildirim)
 *
 * Future expansions: bildirim ayarları, dil tercihi, hesap silme.
 */

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronRight, Sun, Moon, LogOut, FileText, Shield, Mail, Edit3, Heart } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { IconButtonDS } from '@/components/ui/ds'
import { createClient } from '@/lib/supabase/client'

interface SettingsClientProps {
  userEmail: string
}

export function SettingsClient({ userEmail }: SettingsClientProps) {
  const { colors: c, mode, toggleMode } = useTheme()
  const router = useRouter()

  const displayFont = 'var(--font-display), Fraunces, serif'
  const uiFont = 'var(--font-sans), system-ui, sans-serif'

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  const sectionLabel: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: c.ink400,
    margin: '24px 20px 8px',
    fontFamily: uiFont,
  }

  const rowStyle: React.CSSProperties = {
    background: c.ink800,
    border: `1px solid ${c.ink600}`,
    borderRadius: 14,
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    cursor: 'pointer',
    color: c.cream,
    fontFamily: uiFont,
    fontSize: 15,
    fontWeight: 500,
    textDecoration: 'none',
    width: '100%',
  }

  const stack: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: '0 16px',
  }

  return (
    <div style={{ background: c.ink900, color: c.cream, minHeight: '100%', paddingBottom: 'calc(120px + env(safe-area-inset-bottom, 20px))' }}>
      {/* Header */}
      <div style={{ padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/dashboard/profile" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <IconButtonDS icon={<ArrowLeft size={18} />} size={36} />
        </Link>
        <h1 style={{ fontFamily: displayFont, fontSize: 24, fontWeight: 500, margin: 0, color: c.cream, letterSpacing: '-0.025em' }}>
          Ayarlar
        </h1>
      </div>

      {/* 1. Tema */}
      <p style={sectionLabel}>Görünüm</p>
      <div style={stack}>
        <motion.button
          type="button"
          onClick={toggleMode}
          whileTap={{ scale: 0.98 }}
          style={{ ...rowStyle, justifyContent: 'space-between', border: `1px solid ${c.ink600}` }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {mode === 'dark' ? <Moon size={18} color={c.gold} /> : <Sun size={18} color={c.gold} />}
            <span>Tema</span>
          </div>
          <span style={{ fontSize: 13, color: c.ink300, fontWeight: 600 }}>
            {mode === 'dark' ? 'Karanlık' : 'Aydınlık'}
          </span>
        </motion.button>
      </div>

      {/* 2. Hesap */}
      <p style={sectionLabel}>Hesap</p>
      <div style={stack}>
        <div style={{ ...rowStyle, justifyContent: 'space-between', cursor: 'default' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Mail size={18} color={c.ink300} />
            <span>E-posta</span>
          </div>
          <span style={{ fontSize: 13, color: c.ink300, fontWeight: 500 }}>{userEmail}</span>
        </div>
        <Link href="/dashboard/profile/edit" style={{ ...rowStyle, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Edit3 size={18} color={c.ink300} />
            <span>Profili düzenle</span>
          </div>
          <ChevronRight size={18} color={c.ink400} />
        </Link>
      </div>

      {/* 3. Yasal */}
      <p style={sectionLabel}>Yasal</p>
      <div style={stack}>
        <Link href="/legal/kvkk" style={{ ...rowStyle, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Shield size={18} color={c.ink300} />
            <span>KVKK Aydınlatma Metni</span>
          </div>
          <ChevronRight size={18} color={c.ink400} />
        </Link>
        <Link href="/legal/privacy" style={{ ...rowStyle, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FileText size={18} color={c.ink300} />
            <span>Gizlilik Politikası</span>
          </div>
          <ChevronRight size={18} color={c.ink400} />
        </Link>
        <Link href="/legal/terms" style={{ ...rowStyle, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FileText size={18} color={c.ink300} />
            <span>Kullanım Koşulları</span>
          </div>
          <ChevronRight size={18} color={c.ink400} />
        </Link>
      </div>

      {/* 4. Hakkında */}
      <p style={sectionLabel}>Hakkında</p>
      <div style={stack}>
        <div style={{ ...rowStyle, justifyContent: 'space-between', cursor: 'default' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Heart size={18} color={c.gold} />
            <span>İyiBiri</span>
          </div>
          <span style={{ fontSize: 12, color: c.ink400, fontWeight: 500 }}>v1.0.0 — beta</span>
        </div>
      </div>

      {/* 5. Çıkış yap */}
      <p style={sectionLabel}>Oturum</p>
      <div style={stack}>
        <motion.button
          type="button"
          onClick={handleSignOut}
          whileTap={{ scale: 0.98 }}
          style={{
            ...rowStyle,
            justifyContent: 'center',
            background: c.ink800,
            color: c.danger,
            fontWeight: 600,
            border: `1px solid ${c.ink600}`,
          }}
        >
          <LogOut size={18} color={c.danger} />
          <span>Çıkış yap</span>
        </motion.button>
      </div>
    </div>
  )
}
