'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Users, Calendar, Star, Shield, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/theme'
import { IconButtonDS } from '@/components/ui/ds'
import { createClient } from '@/lib/supabase/client'
import type { NGO } from '@/lib/supabase/types'

interface FormField {
  key: string
  label: string
  type: 'text' | 'tel' | 'textarea' | 'select'
  required?: boolean
  options?: string[]
}

interface MembershipFormClientProps {
  ngo: NGO
  userId: string
}

export function MembershipFormClient({ ngo, userId }: MembershipFormClientProps) {
  const { colors: c } = useTheme()
  const router = useRouter()
  const displayFont = 'var(--font-display), Fraunces, serif'
  const uiFont = 'var(--font-sans), system-ui, sans-serif'

  const formFields: FormField[] = Array.isArray(ngo.membership_form_fields) ? ngo.membership_form_fields : []
  const hasForm = formFields.length > 0

  const [formData, setFormData] = useState<Record<string, string>>({})
  const [kvkkChecked, setKvkkChecked] = useState(false)
  const [termsChecked, setTermsChecked] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requiredFieldsFilled = formFields
    .filter(f => f.required)
    .every(f => (formData[f.key] ?? '').trim() !== '')

  const termsOk = ngo.membership_terms_url ? termsChecked : true
  const canSubmit = kvkkChecked && termsOk && requiredFieldsFilled && !submitting

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)
    try {
      const supabase = createClient()
      const status = ngo.membership_approval_required ? 'pending' : 'active'
      const { error: insertError } = await supabase.from('ngo_memberships').insert({
        user_id: userId,
        ngo_id: ngo.id,
        status,
        form_data: hasForm ? formData : {},
      })
      if (insertError) {
        if (insertError.message?.includes('unique') || insertError.message?.includes('duplicate')) {
          setError('Zaten bu kuruluşa üyesin.')
        } else {
          setError('Üyelik kaydı sırasında bir sorun oluştu. Lütfen tekrar dene.')
        }
        setSubmitting(false)
        return
      }
      router.push(`/dashboard/ngos/${ngo.id}/membership/success`)
    } catch {
      setError('Bir hata oluştu. Lütfen internet bağlantını kontrol edip tekrar dene.')
      setSubmitting(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 16px',
    background: c.ink800, border: `1.5px solid ${c.ink600}`,
    borderRadius: 14, color: c.cream, fontSize: 15,
    fontFamily: uiFont, outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{
      background: c.ink900, color: c.cream,
      height: '100%', display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <IconButtonDS icon={<ArrowLeft size={16} />} onClick={() => router.back()} />
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: c.gold }}>
          {(ngo.short_name ?? ngo.name).toUpperCase()} · ÜYELİK
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 100px', WebkitOverflowScrolling: 'touch' }}>
        {/* NGO Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ padding: '24px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
        >
          <div style={{
            width: 80, height: 80, borderRadius: 20,
            background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 10, marginBottom: 16, boxShadow: '0 4px 16px rgba(0,0,0,.1)',
          }}>
            {ngo.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ngo.logo_url} alt={ngo.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontWeight: 900, color: ngo.color_accent ?? c.gold, fontSize: 24 }}>
                {(ngo.short_name ?? ngo.name).slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <h1 style={{
            margin: 0, fontFamily: displayFont, fontSize: 24, fontWeight: 500,
            letterSpacing: '-0.025em', color: c.cream,
          }}>
            {ngo.short_name ?? ngo.name} Gönüllüsü Ol
          </h1>
          {ngo.membership_description && (
            <p style={{ margin: '8px 0 0', fontSize: 14, color: c.ink300, lineHeight: 1.5, maxWidth: 300 }}>
              {ngo.membership_description}
            </p>
          )}
        </motion.div>

        {/* Üyelik avantajları */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          style={{ padding: '20px 20px 0' }}
        >
          <div style={{
            background: c.ink800, border: `1px solid ${c.ink600}`,
            borderRadius: 16, padding: '16px 18px',
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: c.gold, margin: '0 0 12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Üyelik avantajları
            </p>
            {[
              { icon: Star, text: 'Görevlerden öncelikli haberdar ol' },
              { icon: Calendar, text: 'Özel etkinliklere erişim' },
              { icon: Users, text: 'Gönüllü topluluğuna katıl' },
              { icon: Shield, text: 'Doğrulanmış gönüllü rozeti' },
            ].map(({ icon: Icon, text }, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0',
                borderTop: idx > 0 ? `1px solid ${c.ink600}` : 'none',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: c.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={15} color={c.gold} />
                </div>
                <span style={{ fontSize: 13, color: c.cream, lineHeight: 1.4 }}>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* İstatistik çubuğu */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          style={{
            padding: '16px 20px 0',
            display: 'flex', gap: 8,
          }}
        >
          {[
            { value: ngo.volunteer_count?.toLocaleString('tr-TR') ?? '—', label: 'Gönüllü' },
            { value: ngo.founded ? `${new Date().getFullYear() - ngo.founded} yıl` : '—', label: 'Tecrübe' },
            { value: ngo.member_count?.toLocaleString('tr-TR') ?? '—', label: 'Üye' },
          ].map((stat, idx) => (
            <div key={idx} style={{
              flex: 1, background: c.ink800, border: `1px solid ${c.ink600}`,
              borderRadius: 12, padding: '10px 8px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: displayFont, fontSize: 18, fontWeight: 600, color: c.cream }}>{stat.value}</div>
              <div style={{ fontSize: 10, color: c.ink300, marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Form alanları (varsa) */}
        {hasForm && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            <p style={{ fontSize: 12, fontWeight: 700, color: c.gold, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Bilgilerin
            </p>
            {formFields.map(field => (
              <div key={field.key}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: c.ink300, marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {field.label}{field.required ? ' *' : ''}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.key] ?? ''}
                    onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    placeholder={field.label}
                  />
                ) : field.type === 'select' && field.options ? (
                  <div style={{ position: 'relative' }}>
                    <select
                      value={formData[field.key] ?? ''}
                      onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                      style={{ ...inputStyle, appearance: 'none', paddingRight: 40 }}
                    >
                      <option value="">Seçiniz</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} color={c.ink300} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                ) : (
                  <input
                    type={field.type === 'tel' ? 'tel' : 'text'}
                    value={formData[field.key] ?? ''}
                    onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    style={inputStyle}
                    placeholder={field.label}
                  />
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* Onay bölümü */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: hasForm ? 0.45 : 0.35, duration: 0.4 }}
          style={{ padding: '20px 20px 0' }}
        >
          {/* Paylaşılacak bilgiler */}
          <div style={{
            background: c.ink800, border: `1px solid ${c.ink600}`,
            borderRadius: 14, padding: '14px 16px', marginBottom: 16,
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: c.ink300, margin: '0 0 8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Paylaşılacak bilgilerin
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Ad soyad', 'E-posta adresi', 'Şehir'].map(info => (
                <div key={info} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 4, height: 4, borderRadius: 999, background: c.gold }} />
                  <span style={{ fontSize: 13, color: c.ink200 }}>{info}</span>
                </div>
              ))}
              {hasForm && formFields.map(f => (
                <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 4, height: 4, borderRadius: 999, background: c.gold }} />
                  <span style={{ fontSize: 13, color: c.ink200 }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* KVKK checkbox */}
          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
            <div
              onClick={() => setKvkkChecked(!kvkkChecked)}
              style={{
                width: 22, height: 22, borderRadius: 7, marginTop: 1,
                background: kvkkChecked ? c.gold : 'transparent',
                border: `1.5px solid ${kvkkChecked ? c.gold : c.ink500}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, cursor: 'pointer',
              }}
            >
              {kvkkChecked && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: 13, color: c.ink200, lineHeight: 1.5 }}>
              Kişisel verilerimin <span style={{ color: c.cream, fontWeight: 600 }}>{ngo.name}</span> ile paylaşılmasını kabul ediyorum.
            </span>
          </label>

          {/* Terms checkbox */}
          {ngo.membership_terms_url && (
            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', marginTop: 12 }}>
              <div
                onClick={() => setTermsChecked(!termsChecked)}
                style={{
                  width: 22, height: 22, borderRadius: 7, marginTop: 1,
                  background: termsChecked ? c.gold : 'transparent',
                  border: `1.5px solid ${termsChecked ? c.gold : c.ink500}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, cursor: 'pointer',
                }}
              >
                {termsChecked && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: 13, color: c.ink200, lineHeight: 1.5 }}>
                <a href={ngo.membership_terms_url} target="_blank" rel="noopener noreferrer" style={{ color: c.gold, textDecoration: 'underline' }}>
                  Üyelik sözleşmesini
                </a>{' '}okudum ve kabul ediyorum.
              </span>
            </label>
          )}
        </motion.div>

        {/* Submit CTA */}
        <div style={{ padding: '20px 20px 0' }}>
        {error && (
          <div style={{
            background: 'rgba(200,60,60,0.1)', border: '1px solid rgba(200,60,60,0.25)',
            borderRadius: 12, padding: '10px 14px', marginBottom: 12,
            fontSize: 13, color: c.danger, lineHeight: 1.4,
          }}>
            {error}
          </div>
        )}
        <motion.button
          whileTap={canSubmit ? { scale: 0.97 } : undefined}
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            width: '100%', height: 52, borderRadius: 14,
            background: canSubmit ? c.gold : c.ink600,
            border: 'none', color: canSubmit ? c.ink : c.ink300,
            fontFamily: uiFont, fontSize: 15, fontWeight: 700,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: canSubmit ? '0 2px 8px rgba(0,0,0,.08)' : 'none',
          }}
        >
          {submitting ? 'Kaydediliyor...' : 'Gönüllü Ol'}
        </motion.button>
        </div>
      </div>
    </div>
  )
}
