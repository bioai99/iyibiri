'use client'

import { Drawer } from 'vaul'
import type { ReactNode } from 'react'
import { useTheme } from '@/lib/theme'

interface BottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  children: ReactNode
  snapPoints?: (string | number)[]
}

export function BottomSheet({
  open,
  onOpenChange,
  title,
  children,
  snapPoints,
}: BottomSheetProps) {
  const { colors: c } = useTheme()

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} snapPoints={snapPoints}>
      <Drawer.Portal>
        <Drawer.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
            zIndex: 9000,
          }}
        />
        <Drawer.Content
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: c.ink900,
            border: `1px solid ${c.ink700}`,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            zIndex: 9001,
            maxHeight: '94vh',
            display: 'flex',
            flexDirection: 'column',
            outline: 'none',
          }}
        >
          {/* Drag handle */}
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 999,
              background: c.ink600,
              margin: '12px auto 8px',
              flexShrink: 0,
            }}
          />
          {title && (
            <Drawer.Title
              style={{
                // Vol-62-C: Atlas grid padding snap (8→8 ok, 20→20 ok, 16→16 ok) — keep
                padding: '8px 20px 16px',
                fontFamily: 'var(--font-display), serif',
                fontSize: 18,
                fontWeight: 500,
                color: c.cream,
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </Drawer.Title>
          )}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              // Vol-62-C: Atlas grid padding snap (0→0 ok, 20→20 ok, 32→32 ok) — keep
              padding: '0 20px 32px',
              paddingBottom: 'calc(32px + env(safe-area-inset-bottom, 0px))',
            }}
          >
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
