import { useHotkey } from '@tanstack/react-hotkeys'
import { toast } from 'sonner'
import {
  IconCalendar,
  IconDownload,
  IconPlus,
  IconSearch,
  IconUser,
} from '@tabler/icons-react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { useCommandOpen, useCommandSetOpen } from '@/stores/command'

export function GlobalCommandPalette() {
  const isOpen = useCommandOpen()
  const setOpen = useCommandSetOpen()

  useHotkey('Mod+K', () => {
    setOpen(true)
  })

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            <CommandItem
              onSelect={() => {
                setOpen(false)
                toast.success('Add employee dialog opened')
              }}
            >
              <IconPlus className="mr-2 size-4" />
              Add New Employee
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false)
                toast.success('Leave request opened')
              }}
            >
              <IconCalendar className="mr-2 size-4" />
              Request Time Off
              <CommandShortcut>⌘L</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false)
                toast.success('Report generated')
              }}
            >
              <IconDownload className="mr-2 size-4" />
              Generate Report
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Recent Employees">
            <CommandItem
              onSelect={() => {
                setOpen(false)
                toast.success('Opening John Davidson')
              }}
            >
              <IconUser className="mr-2 size-4" />
              John Davidson
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false)
                toast.success('Opening Sarah Chen')
              }}
            >
              <IconUser className="mr-2 size-4" />
              Sarah Chen
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

export function CommandPaletteButton() {
  const setOpen = useCommandSetOpen()

  return (
    <button
      type="button"
      className="focus-visible:ring-ring ring-offset-background border-input hover:bg-accent hover:text-accent-foreground text-muted-foreground inline-flex h-10 w-full items-center justify-start rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
      onClick={() => setOpen(true)}
    >
      <IconSearch className="mr-2 size-4" />
      Search employees, policies...
    </button>
  )
}
