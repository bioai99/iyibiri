'use client'

import React, { createContext, useContext, useState } from 'react'
import { CommandPalette } from './command-palette'

interface CommandContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CommandContext = createContext<CommandContextType | undefined>(undefined)

export function CommandProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <CommandContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
      <CommandPalette open={isOpen} onOpenChange={setIsOpen} />
    </CommandContext.Provider>
  )
}

export function useCommandPalette() {
  const context = useContext(CommandContext)
  if (!context) {
    throw new Error('useCommandPalette must be used within CommandProvider')
  }
  return context
}
