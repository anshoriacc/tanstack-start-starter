import { create } from 'zustand'

interface CommandStore {
  isOpen: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

export const useCommandStore = create<CommandStore>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))

export const useCommandOpen = () => useCommandStore((s) => s.isOpen)
export const useCommandSetOpen = () => useCommandStore((s) => s.setOpen)
export const useCommandToggle = () => useCommandStore((s) => s.toggle)
