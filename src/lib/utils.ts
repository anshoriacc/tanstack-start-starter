export {cn} from 'cn'

export function getInitials(name?: string, limit: number = 2): string {
  if (!name) return ''

  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, limit)
    .join('')
}
