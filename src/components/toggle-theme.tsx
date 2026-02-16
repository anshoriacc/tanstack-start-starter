import { IconDeviceImac, IconMoon, IconSun } from '@tabler/icons-react'
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group'
import { type TTheme, useSetTheme, useTheme } from '@/stores/theme'

export const ToggleTheme = () => {
  const theme = useTheme()
  const setTheme = useSetTheme()

  const handleThemeChange = (value: Array<string>) => {
    if (value.length > 0) {
      setTheme(value[0] as TTheme)
    }
  }

  return (
    <ToggleGroup
      variant="outline"
      size="sm"
      value={[theme]}
      onValueChange={handleThemeChange}
      aria-label="Toggle theme"
    >
      <ToggleGroupItem value="system" aria-label="Use system theme">
        <IconDeviceImac />
      </ToggleGroupItem>
      <ToggleGroupItem value="light" aria-label="Use light theme">
        <IconSun />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Use dark theme">
        <IconMoon />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
