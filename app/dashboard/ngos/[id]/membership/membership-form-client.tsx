'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
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

const EYEBROW: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
}

export function MembershipFormClient({ ngo, userId }: MembershipFormClientProps) {
  const { colors: c } = useTheme()
  const router = useRouter()

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
        console.error('Membership insert error:', insertError)
        setError('Üyelik kaydı sırasında bir sorun oluştu. Lütfen tekrar dene.')
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
    width: '100%',
    padding: '12px 14px',
    background: c.ink800,
    border: `1px solid ${c.ink600}`,
    borderRadius: 12,
    color: c.cream,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div
      style={{
        background: c.ink900,
        color: c.cream,
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <IconButtonDS
          icon={<ArrowLeft size={16} />}
          onClick={() => router.back()}
        />
        <div style={{ flex: 1 }}>
          <div style={{ ...EYEBROW, color: c.gold }}>
            {(ngo.short_name ?? ngo.name).toUpperCase()} · ÜYELİK
          </div>
        </div>
      </div>

      {/* NGO Logo + Name */}
      <div style={{ padding: '28px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
            marginBottom: 14,
            boxShadow: '0 8px 24px rgba(0,0,0,.3)',
          }}
        >
          {ngo.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ngo.logo_url}
              alt={ngo.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <span style={{ fontWeight: 900, color: '#57524A', fontSize: 22 }}>
              {(ngo.short_name ?? ngo.name).slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-fraunces, Georgia, serif)',
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: '-0.025em',
            color: c.cream,
            textAlign: 'center',
          }}
        >
          {ngo.name}
        </h1>
        {ngo.membership_description && (
          <p style={{ margin: '10px 0 0', fontSize: 14, color: c.ink300, lineHeight: 1.55, textAlign: 'center', maxWidth: 320 }}>
            {ngo.membership_description}
          </p>
        )}
      </div>

      {/* Form fields */}
      <div style={{ padding: '28px 20px 0', flex: '1 1 auto' }}>
        {hasForm && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {formFields.map(field => (
              <div key={field.key}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.cream, marginBottom: 6 }}>
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
                  <select
                    value={formData[field.key] ?? ''}
                    onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    style={{ ...inputStyle, appearance: 'none' }}
                  >
                    <option value="">Seçiniz</option>
                    {field.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
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
          </div>
        )}

        {/* KVKK checkbox */}
        <div style={{ marginTop: hasForm ? 24 : 0, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <input
            type="checkbox"
            checked={kvkkChecked}
            onChange={e => setKvkkChecked(e.target.checked)}
            style={{ marginTop: 3, accentColor: c.gold, width: 18, height: 18, flexShrink: 0 }}
          />
          <label style={{ fontSize: 13, color: c.ink200, lineHeight: 1.5, cursor: 'pointer' }} onClick={() => setKvkkChecked(!kvkkChecked)}>
            Bilgilerimin {ngo.name} ile paylasilmasini kabul ediyorum.
          </label>
        </div>

        {/* Terms checkbox */}
        {ngo.membership_terms_url && (
          <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <input
              type="checkbox"
              checked={termsChecked}
              onChange={e => setTermsChecked(e.target.checked)}
              style={{ marginTop: 3, accentColor: c.gold, width: 18, height: 18, flexShrink: 0 }}
            />
            <label style={{ fontSize: 13, color: c.ink200, lineHeight: 1.5 }}>
              <a href={ngo.membership_terms_url} target="_blank" rel="noopener noreferrer" style={{ color: c.gold, textDecoration: 'underline' }}>
                Üyelik sözlesmesini
              </a>{' '}
              okudum ve kabul ediyorum.
            </label>
          </div>
        )}
      </div>

      {/* Submit CTA */}
      <div
        style={{
          padding: '20px 20px 28px',
          borderTop: `1px solid ${c.ink700}`,
          background: c.ink900,
        }}
      >
        {error && (
          <div
            style={{
              background: 'rgba(200,60,60,0.12)',
              border: '1px solid rgba(200,60,60,0.3)',
              borderRadius: 12,
              padding: '12px 16px',
              marginBottom: 14,
              fontSize: 13,
              color: '#E05252',
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>
        )}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            width: '100%',
            background: canSubmit ? c.gold : c.ink600,
            border: 'none',
            color: canSubmit ? '#241E18' : c.ink300,
            padding: '14px 20px',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'all .2s',
            boxSizing: 'border-box',
          }}
        >
          {submitting ? 'Kaydediliyor...' : 'Üye Ol'}
        </button>
      </div>
    </div>
  )
}
