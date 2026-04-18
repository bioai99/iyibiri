'use client'

interface ImpactSummaryProps {
  completed: number
  karma: number
}

export function ImpactSummary({ completed, karma }: ImpactSummaryProps) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(233,207,194,.12), rgba(196,203,172,.08))',
        border: '1px solid #3F3830',
        borderRadius: 18,
        padding: '22px 22px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '.22em',
          textTransform: 'uppercase',
          color: '#A89E8A',
          marginBottom: 8,
        }}
      >
        Birlikte bugüne kadar
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: '#F4EEDF',
          marginTop: 8,
          lineHeight: 1.2,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <span style={{ color: '#E8C268' }}>{(48620).toLocaleString('tr-TR')}</span> gönüllü ·
        <span style={{ color: '#E8C268' }}> {(3421000).toLocaleString('tr-TR')}</span> Karma
      </div>
      <div
        style={{
          fontSize: 13,
          color: '#A89E8A',
          marginTop: 6,
          maxWidth: 280,
          lineHeight: 1.5,
        }}
      >
        Sen de bu topluluğun{' '}
        <span
          style={{
            fontFamily: 'var(--font-display), ui-serif, Georgia, serif',
            fontStyle: 'italic',
            color: '#F4EEDF',
          }}
        >
          #142
        </span>
        &apos;nci sırasındasın.
      </div>
    </div>
  )
}
