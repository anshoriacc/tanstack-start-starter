import { Link, useMatches } from '@tanstack/react-router'
import { IconChevronDown, IconLogout } from '@tabler/icons-react'

import { cn, getInitials } from '@/lib/utils'
import { useGetSessionQuery, useLogoutMutation } from '@/hooks/api/auth'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { SidebarTrigger, useSidebar } from './ui/sidebar'
import { TruncatedText } from './ui/truncated-text'
import { Separator } from './ui/separator'
import { Kbd, KbdGroup } from './ui/kbd'
import { Button } from './ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface BreadcrumbItemData {
  label: string
  path: string
  isLast: boolean
}

type BreadcrumbStaticData = {
  breadcrumb?: string
}

function useBreadcrumbs(): Array<BreadcrumbItemData> {
  const matches = useMatches()

  return matches
    .filter(
      (match) =>
        (match.staticData as BreadcrumbStaticData | undefined)?.breadcrumb,
    )
    .map((match, _index, filteredMatches) => ({
      label: (match.staticData as BreadcrumbStaticData).breadcrumb!,
      path: match.pathname,
      isLast: _index === filteredMatches.length - 1,
    }))
}

function DynamicBreadcrumbs() {
  const breadcrumbs = useBreadcrumbs()

  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb) => (
          <BreadcrumbItem key={crumb.path}>
            {crumb.isLast ? (
              <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink render={<Link to={crumb.path} />}>
                {crumb.label}
              </BreadcrumbLink>
            )}
            {!crumb.isLast && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export const Header = () => {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  const sessionQuery = useGetSessionQuery()
  const user = sessionQuery.data?.user

  const logoutMutation = useLogoutMutation()

  const logoutHandler = () => {
    logoutMutation.mutate()
  }

  return (
    <header className="bg-background sticky top-0 z-1 flex h-(--header-height) items-center justify-between gap-2 border-b px-4">
      <div className="flex flex-1 items-center gap-2">
        <div
          className={cn(
            'sidebar-trigger-zone max-w-max',
            isCollapsed && 'sidebar-trigger-zone--collapsed',
          )}
        >
          <Tooltip>
            <TooltipTrigger render={<SidebarTrigger size="icon-lg" />} />
            <TooltipContent>
              Toggle sidebar{' '}
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>B</Kbd>
              </KbdGroup>
            </TooltipContent>
          </Tooltip>
        </div>
        <Separator orientation="vertical" />
        <DynamicBreadcrumbs />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="lg" className="h-12 max-w-50">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.image} />
                <AvatarFallback className="rounded-lg">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <TruncatedText className="font-medium">
                  {user?.name}
                </TruncatedText>
              </div>
              <IconChevronDown className="ml-auto size-4" />
            </Button>
          }
        />
        <DropdownMenuContent
          className="min-w-56 rounded-lg"
          side="bottom"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.image} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <TruncatedText className="font-medium">
                    {user?.name}
                  </TruncatedText>
                  <TruncatedText className="text-xs">
                    {user?.email}
                  </TruncatedText>
                </div>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logoutHandler}>
            <IconLogout />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
