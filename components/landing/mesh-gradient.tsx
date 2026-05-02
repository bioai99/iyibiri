'use client'

/**
 * MeshGradient — Animated radial gradient mesh background.
 *
 * 3 yumuşak gold/cream blob CSS keyframes ile yavaş hareket eder.
 * Performans: GPU-accelerated transform + opacity. JS yok, sadece CSS.
 * `intensity` = 'soft' (cream warmth, default) | 'gold' (hero için warmer).
 */
export function MeshGradient({
  intensity = 'soft',
  className = '',
}: {
  intensity?: 'soft' | 'gold'
  className?: string
}) {
  const isGold = intensity === 'gold'
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Blob 1 — gold warm */}
      <div
        className="absolute -top-40 -left-32 w-[640px] h-[640px] rounded-full opacity-70 mix-blend-multiply animate-mesh-1"
        style={{
          background: isGold
            ? 'radial-gradient(circle at center, rgba(232,194,104,0.55), transparent 65%)'
            : 'radial-gradient(circle at center, rgba(232,194,104,0.30), transparent 65%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Blob 2 — clay warmth */}
      <div
        className="absolute top-32 -right-40 w-[560px] h-[560px] rounded-full opacity-50 mix-blend-multiply animate-mesh-2"
        style={{
          background:
            'radial-gradient(circle at center, rgba(200,85,61,0.25), transparent 65%)',
          filter: 'blur(70px)',
        }}
      />
      {/* Blob 3 — sage soft */}
      <div
        className="absolute -bottom-32 left-1/3 w-[700px] h-[700px] rounded-full opacity-50 mix-blend-multiply animate-mesh-3"
        style={{
          background:
            'radial-gradient(circle at center, rgba(196,203,172,0.30), transparent 65%)',
          filter: 'blur(80px)',
        }}
      />
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        }}
      />
    </div>
  )
}
