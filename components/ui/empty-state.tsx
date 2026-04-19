'use client'
import { useTheme } from '@/lib/theme'

interface EmptyStateProps {
  title: string
  description?: string
  action?: { label: string; href: string }
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  const { colors: c } = useTheme()
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '48px 24px', textAlign: 'center',
    }}>
      {/* Simple illustration — circle with checkmark */}
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: c.goldSoft, border: `1px solid ${c.goldLine}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h3 style={{
        fontFamily: 'var(--font-display), serif', fontSize: 20, fontWeight: 500,
        color: c.cream, margin: '0 0 6px', letterSpacing: '-0.02em',
      }}>
        {title}
      </h3>
      {description && (
        <p style={{ fontSize: 14, color: c.ink300, margin: 0, lineHeight: 1.5, maxWidth: 260 }}>
          {description}
        </p>
      )}
      {action && (
        <a href={action.href} style={{
          marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '10px 20px', borderRadius: 12,
          background: c.gold, color: c.ink, fontSize: 14, fontWeight: 600,
          textDecoration: 'none',
        }}>
          {action.label}
        </a>
      )}
    </div>
  )
}
