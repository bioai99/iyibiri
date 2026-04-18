'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Lottie from 'lottie-react'
import { Flame, Pencil, Handshake, Gift, ClipboardList, User } from 'lucide-react'
import type { Profile, MissionWithNGO, UserMission, NGO } from '@/lib/supabase/types'
import { MissionCard } from '@/components/ui/mission-card'
import { TierBadge, getTierFromKarma } from '@/components/ui/tier-badge'
import { createClient } from '@/lib/supabase/client'

import catAnim from '@/public/animations/cat.json'
import dogAnim from '@/public/animations/dog.json'
import foxAnim from '@/public/animations/fox.json'
import robotAnim from '@/public/animations/robot.json'
import partyAnim from '@/public/animations/party.json'

type AvatarType = 'cat' | 'dog' | 'fox' | 'robot' | 'party'

const avatarOptions: { type: AvatarType; label: string; anim: object }[] = [
  { type: 'cat',   label: 'Kedi',   anim: catAnim },
  { type: 'dog',   label: 'Köpek',  anim: dogAnim },
  { type: 'fox',   label: 'Tilki',  anim: foxAnim },
  { type: 'robot', label: 'Robot',  anim: robotAnim },
  { type: 'party', label: 'Parti',  anim: partyAnim },
]

const tierThresholds = [0, 500, 2000, 5000, 10000, Infinity]
const tierNames = ['İyi Biri', 'Çok İyi Biri', 'Çoook İyi Biri', 'Gerçekten İyi Biri', 'İyiliğin Öncüsü']

function getKarmaProgress(karma: number): { pct: number; toNext: number; nextTierName: string } {
  let tierIndex = 0
  for (let i = 1; i < tierThresholds.length; i++) {
    if (karma >= tierThresholds[i - 1] && karma < tierThresholds[i]) {
      tierIndex = i - 1
      break
    }
  }
  if (karma >= tierThresholds[tierThresholds.length - 2]) {
    tierIndex = tierThresholds.length - 2
  }
  const min = tierThresholds[tierIndex]
  const max = tierThresholds[tierIndex + 1]
  if (max === Infinity) return { pct: 100, toNext: 0, nextTierName: '' }
  const pct = Math.round(((karma - min) / (max - min)) * 100)
  return { pct, toNext: max - karma, nextTierName: tierNames[tierIndex + 1] ?? '' }
}

interface Props {
  profile: Profile
  missions: MissionWithNGO[]
  userMissions: UserMission[]
  ngos: NGO[]
}

const discoverItems = [
  { href: '/dashboard/ngos',     Icon: Handshake,    label: 'Kuruluşlar', gradient: 'linear-gradient(135deg,#3B82F6,#6366F1)' },
  { href: '/dashboard/rewards',  Icon: Gift,          label: 'Ödüller',    gradient: 'linear-gradient(135deg,#E8C268,#B58F3D)' },
  { href: '/dashboard/missions', Icon: ClipboardList, label: 'Görevler',   gradient: 'linear-gradient(135deg,#10B981,#14B8A6)' },
  { href: '/dashboard/profile',  Icon: User,          label: 'Profil',     gradient: 'linear-gradient(135deg,#A855F7,#D946EF)' },
]

export function DashboardClient({ profile, missions, userMissions, ngos }: Props) {
  const completedIds = new Set(userMissions.filter(m => m.status === 'completed').map(m => m.mission_id))
  const takenIds     = new Set(userMissions.filter(m => m.status === 'taken').map(m => m.mission_id))

  const featuredMissions   = missions.filter(m => m.featured && !completedIds.has(m.id)).slice(0, 6)
  const inProgressMissions = missions.filter(m => takenIds.has(m.id) && !completedIds.has(m.id))

  const karma = profile.karma_total ?? 0
  const tier = getTierFromKarma(karma)
  const { pct, toNext, nextTierName } = getKarmaProgress(karma)

  const [avatarType, setAvatarType] = useState<AvatarType>((profile.avatar_type as AvatarType) ?? 'cat')
  const [showPicker, setShowPicker] = useState(false)
  const supabase = useMemo(() => createClient(), [])
  const currentAvatar = avatarOptions.find(a => a.type === avatarType) ?? avatarOptions[0]

  async function handleAvatarSelect(type: AvatarType) {
    setAvatarType(type)
    setShowPicker(false)
    await supabase.from('profiles').update({ avatar_type: type }).eq('id', profile.id)
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-12 pb-6">
        {/* Hero card + avatar wrapper */}
        <div style={{ position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            style={{
              background: '#2E2923',
              borderRadius: 20,
              border: '1px solid #3F3830',
              padding: '22px 22px 18px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Concentric gold arcs decoration */}
            <svg
              width="240" height="240" viewBox="0 0 240 240"
              style={{ position: 'absolute', right: -80, top: -80, opacity: 0.1, pointerEvents: 'none' }}
              aria-hidden="true"
            >
              {[110, 80, 50, 20].map(r => (
                <circle key={r} cx="120" cy="120" r={r} stroke="#E8C268" strokeWidth="0.8" fill="none" />
              ))}
            </svg>

            <div style={{ position: 'relative' }}>
              {/* Top row: eyebrow + tier badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{
                    margin: 0, fontSize: 10, fontWeight: 700,
                    color: '#A89E8A', letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}>
                    Karma Hesabın
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #E8C268, #B58F3D)',
                      flexShrink: 0,
                      boxShadow: '0 0 0 3px rgba(232,194,104,0.2)',
                    }} />
                    <span style={{
                      fontSize: 52, fontWeight: 700, lineHeight: 0.95,
                      letterSpacing: '-0.035em',
                      color: '#E8C268',
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {karma.toLocaleString('tr-TR')}
                    </span>
                  </div>
                </div>
                <TierBadge tier={tier} size="sm" />
              </div>

              {/* Progress bar */}
              {toNext > 0 && (
                <div style={{ marginTop: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 7, gap: 8 }}>
                    <span style={{ color: '#A89E8A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <em style={{ fontStyle: 'italic', color: '#F4EEDF', fontFamily: 'var(--font-display)' }}>
                        {nextTierName}
                      </em>
                      {`'ye`}
                    </span>
                    <span style={{ color: '#E8C268', fontWeight: 700, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                      {toNext.toLocaleString('tr-TR')} kaldı
                    </span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 999, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #B58F3D, #E8C268)',
                        borderRadius: 999,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Stat strip */}
              <div style={{
                display: 'flex', marginTop: 18, paddingTop: 16,
                borderTop: '1px solid #3F3830',
              }}>
                {[
                  { label: 'GÖREV', value: completedIds.size, sub: 'tamamlandı', flame: false },
                  { label: 'SERİ',  value: `${profile.streak ?? 0} gün`, sub: 'kesintisiz', flame: true },
                  { label: 'SIRA',  value: '#-', sub: 'bu ay', flame: false },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    style={{
                      flex: 1, textAlign: 'center', padding: '0 4px',
                      borderLeft: i > 0 ? '1px solid #3F3830' : 'none',
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: '#A89E8A', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                      {stat.label}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, marginTop: 5 }}>
                      {stat.flame && <Flame size={11} style={{ color: '#E8C268' }} />}
                      <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#F4EEDF', letterSpacing: '-0.015em', fontVariantNumeric: 'tabular-nums' }}>
                        {stat.value}
                      </p>
                    </div>
                    <p style={{ margin: 0, fontSize: 10, color: '#A89E8A', marginTop: 3 }}>{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Floating avatar button */}
          <motion.button
            onClick={() => setShowPicker(true)}
            whileTap={{ scale: 0.95 }}
            style={{
              position: 'absolute',
              top: 22, right: 22,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              zIndex: 10,
            }}
          >
            <div style={{ position: 'relative', width: 64, height: 64 }}>
              <Lottie animationData={currentAvatar.anim} loop autoplay style={{ width: 64, height: 64 }} />
              <div style={{
                position: 'absolute', top: -4, right: -4,
                background: 'rgba(46,41,35,0.85)',
                borderRadius: '50%', width: 18, height: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid #3F3830',
              }}>
                <Pencil size={9} style={{ color: '#A89E8A' }} />
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Avatar Picker Bottom Sheet */}
      <AnimatePresence>
        {showPicker && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPicker(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 px-4 pt-5 pb-10"
              style={{ background: '#2E2923', borderRadius: '24px 24px 0 0', borderTop: '1px solid #3F3830' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            >
              <div style={{ width: 40, height: 4, background: '#574E42', borderRadius: 999, margin: '0 auto 20px' }} />
              <h3 style={{ margin: '0 0 16px', textAlign: 'center', fontSize: 17, fontWeight: 700, color: '#F4EEDF' }}>
                Maskotunu Seç
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {avatarOptions.map(option => (
                  <motion.button
                    key={option.type}
                    onClick={() => handleAvatarSelect(option.type)}
                    whileTap={{ scale: 0.92 }}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      padding: 8, borderRadius: 16, border: 'none', cursor: 'pointer',
                      background: avatarType === option.type
                        ? 'rgba(232,194,104,0.14)'
                        : 'rgba(255,255,255,0.03)',
                      outline: avatarType === option.type
                        ? '2px solid rgba(232,194,104,0.5)'
                        : 'none',
                    }}
                  >
                    <Lottie animationData={option.anim} loop autoplay style={{ width: 52, height: 52 }} />
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#A89E8A' }}>
                      {option.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="px-4 space-y-8">
        {/* In-Progress missions */}
        {inProgressMissions.length > 0 && (
          <section>
            <h2 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700, color: '#F4EEDF', letterSpacing: '-0.02em' }}>
              🔥 Devam Eden
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {inProgressMissions.map((mission, i) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30, delay: i * 0.05 }}
                >
                  <MissionCard mission={mission} isTaken compact />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Featured missions */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#F4EEDF', letterSpacing: '-0.02em' }}>
              Senin İçin Seçtiklerimiz
            </h2>
            <Link href="/dashboard/missions" style={{ fontSize: 13, fontWeight: 700, color: '#E8C268', textDecoration: 'none' }}>
              Tümü →
            </Link>
          </div>
          {featuredMissions.length === 0 ? (
            <p style={{ color: '#574E42', fontSize: 13, textAlign: 'center', padding: '32px 0' }}>
              Tüm öne çıkan görevleri tamamladın! 🎉
            </p>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {featuredMissions.map((mission, i) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30, delay: i * 0.06 }}
                >
                  <MissionCard
                    mission={mission}
                    isCompleted={completedIds.has(mission.id)}
                    isTaken={takenIds.has(mission.id)}
                    compact
                  />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* NGO Rail */}
        {ngos.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#F4EEDF', letterSpacing: '-0.02em' }}>
                Kuruluşlardan
              </h2>
              <Link href="/dashboard/ngos" style={{ fontSize: 13, fontWeight: 700, color: '#E8C268', textDecoration: 'none' }}>
                Tümü →
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {ngos.map((ngo, i) => {
                const coverUrl = (ngo as NGO & { cover_image_url?: string | null }).cover_image_url
                return (
                  <motion.div
                    key={ngo.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30, delay: i * 0.05 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ flexShrink: 0, width: 158 }}
                  >
                    <Link href={`/dashboard/ngos/${ngo.id}`}>
                      <div style={{
                        background: '#2E2923',
                        borderRadius: 14,
                        overflow: 'hidden',
                        border: '1px solid #3F3830',
                      }}>
                        <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: '100%', height: '100%',
                              backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
                              backgroundColor: coverUrl ? undefined : (ngo.color_accent ?? '#3F3830'),
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          />
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(180deg, rgba(26,22,18,0) 45%, rgba(26,22,18,0.85) 100%)',
                          }} />
                          <div style={{
                            position: 'absolute', left: 10, bottom: 10,
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          }}>
                            {ngo.logo_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={ngo.logo_url}
                                alt={ngo.name}
                                style={{ width: '72%', height: '72%', objectFit: 'contain' }}
                                onError={e => { e.currentTarget.style.display = 'none' }}
                              />
                            ) : (
                              <span style={{ fontSize: 12, fontWeight: 700, color: ngo.color_accent ?? '#E8C268' }}>
                                {(ngo.short_name ?? ngo.name)[0]}
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ padding: '11px 12px 13px' }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#F4EEDF', letterSpacing: '-0.015em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {ngo.short_name ?? ngo.name}
                          </p>
                          <p style={{ margin: '2px 0 0', fontSize: 11, color: '#A89E8A' }}>
                            {missions.filter(m => m.ngos?.id === ngo.id).length} aktif görev
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </section>
        )}

        {/* Quick access discover grid */}
        <section>
          <h2 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700, color: '#F4EEDF', letterSpacing: '-0.02em' }}>
            Keşfet
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {discoverItems.map(({ href, Icon, label, gradient }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30, delay: 0.1 + i * 0.05 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link href={href}>
                  <div style={{
                    background: '#2E2923',
                    borderRadius: 16,
                    border: '1px solid #3F3830',
                    padding: '18px 16px',
                    display: 'flex', flexDirection: 'column', gap: 12,
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: gradient,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={18} style={{ color: 'white' }} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#F4EEDF', letterSpacing: '-0.01em' }}>
                      {label}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
