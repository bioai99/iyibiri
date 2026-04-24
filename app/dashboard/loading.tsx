// app/dashboard/loading.tsx
//
// Dashboard sayfa yüklenirken gösterilen skeleton.
// Next.js 14 built-in pattern — otomatik Suspense boundary.
// Dark tema Premium × Warm + shimmer animation (globals.css).

export default function DashboardLoading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'hsl(26 16% 13%)', // c.ink900
        paddingBottom: 100,
      }}
    >
      {/* Header skeleton */}
      <div
        style={{
          padding: 'calc(env(safe-area-inset-top, 20px) + 38px) 20px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ flex: 1, maxWidth: 200 }}>
          <div
            style={{
              height: 12,
              width: '40%',
              borderRadius: 6,
              background: 'hsl(25 13% 20%)',
              animation: 'shimmer 2s ease-in-out infinite',
              backgroundImage:
                'linear-gradient(90deg, hsl(25 13% 20%) 0%, hsl(25 13% 25%) 50%, hsl(25 13% 20%) 100%)',
              backgroundSize: '200% 100%',
              marginBottom: 8,
            }}
          />
          <div
            style={{
              height: 22,
              width: '70%',
              borderRadius: 8,
              background: 'hsl(25 13% 20%)',
              animation: 'shimmer 2s ease-in-out infinite',
              backgroundImage:
                'linear-gradient(90deg, hsl(25 13% 20%) 0%, hsl(25 13% 25%) 50%, hsl(25 13% 20%) 100%)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 999,
              background: 'hsl(25 13% 20%)',
              animation: 'shimmer 2s ease-in-out infinite',
              backgroundImage:
                'linear-gradient(90deg, hsl(25 13% 20%) 0%, hsl(25 13% 25%) 50%, hsl(25 13% 20%) 100%)',
              backgroundSize: '200% 100%',
            }}
          />
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 999,
              background: 'hsl(25 13% 20%)',
              animation: 'shimmer 2s ease-in-out infinite',
              backgroundImage:
                'linear-gradient(90deg, hsl(25 13% 20%) 0%, hsl(25 13% 25%) 50%, hsl(25 13% 20%) 100%)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>
      </div>

      {/* HeroCard skeleton */}
      <div style={{ padding: '20px 16px 0' }}>
        <div
          style={{
            height: 220,
            borderRadius: 24,
            background: 'hsl(24 14% 17%)',
            animation: 'shimmer 2s ease-in-out infinite',
            backgroundImage:
              'linear-gradient(90deg, hsl(24 14% 17%) 0%, hsl(25 13% 22%) 50%, hsl(24 14% 17%) 100%)',
            backgroundSize: '200% 100%',
            border: '1px solid hsl(25 13% 22%)',
          }}
          aria-busy="true"
          aria-label="Yükleniyor"
        />
      </div>

      {/* Daily mission card skeleton */}
      <div style={{ padding: '16px 16px 0' }}>
        <div
          style={{
            height: 280,
            borderRadius: 20,
            background: 'hsl(24 14% 17%)',
            animation: 'shimmer 2s ease-in-out infinite',
            backgroundImage:
              'linear-gradient(90deg, hsl(24 14% 17%) 0%, hsl(25 13% 22%) 50%, hsl(24 14% 17%) 100%)',
            backgroundSize: '200% 100%',
            border: '1px solid hsl(25 13% 22%)',
          }}
        />
      </div>

      {/* Tab chips skeleton */}
      <div style={{ padding: '24px 20px 4px', display: 'flex', gap: 8 }}>
        <div
          style={{
            height: 32,
            width: 100,
            borderRadius: 999,
            background: 'hsl(25 13% 20%)',
            animation: 'shimmer 2s ease-in-out infinite',
          }}
        />
        <div
          style={{
            height: 32,
            width: 120,
            borderRadius: 999,
            background: 'hsl(25 13% 20%)',
            animation: 'shimmer 2s ease-in-out infinite',
          }}
        />
      </div>

      {/* Mission cards skeleton (3 adet) */}
      <div style={{ padding: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: 180,
              borderRadius: 16,
              background: 'hsl(24 14% 17%)',
              animation: 'shimmer 2s ease-in-out infinite',
              backgroundImage:
                'linear-gradient(90deg, hsl(24 14% 17%) 0%, hsl(25 13% 22%) 50%, hsl(24 14% 17%) 100%)',
              backgroundSize: '200% 100%',
              border: '1px solid hsl(25 13% 22%)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
