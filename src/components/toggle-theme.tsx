import { IconDeviceImac, IconMoon, IconSun } from '@tabler/icons-react'
import { Button } from './ui/button'
import { ButtonGroup } from './ui/button-group'
import { type TTheme, useSetTheme, useTheme } from '@/stores/theme'

const themes: Array<{ value: TTheme; label: string; icon: typeof IconSun }> = [
  { value: 'system', label: 'System theme', icon: IconDeviceImac },
  { value: 'light', label: 'Light theme', icon: IconSun },
  { value: 'dark', label: 'Dark theme', icon: IconMoon },
]

export const ToggleTheme = () => {
  const theme = useTheme()
  const setTheme = useSetTheme()

  return (
    <ButtonGroup aria-label="Toggle theme">
      {themes.map((t) => {
        const Icon = t.icon
        const isActive = theme === t.value
        return (
          <Button
            key={t.value}
            variant="outline"
            size="icon-sm"
            aria-label={t.label}
            aria-pressed={isActive}
            onClick={() => setTheme(t.value)}
            className={isActive ? 'bg-muted!' : 'bg-background!'}
          >
            <Icon className="size-4" />
          </Button>
        )
      })}
    </ButtonGroup>
  )
}
