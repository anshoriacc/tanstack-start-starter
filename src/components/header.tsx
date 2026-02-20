import { useMatches, Link } from '@tanstack/react-router'
import { IconLogout, IconChevronDown } from '@tabler/icons-react'

import { cn, getInitials } from '@/lib/utils'
import { useGetSessionQuery, useLogoutMutation } from '@/hooks/api/auth'
import { SidebarTrigger, useSidebar } from './ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Separator } from './ui/separator'
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { TruncatedText } from './ui/truncated-text'

interface BreadcrumbItemData {
  label: string
  path: string
  isLast: boolean
}

type BreadcrumbStaticData = {
  breadcrumb?: string
}

function useBreadcrumbs(): BreadcrumbItemData[] {
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
      <div className="flex h-full flex-1 items-center gap-2">
        <div
          className={cn(
            'sidebar-trigger-zone max-w-max',
            isCollapsed && 'sidebar-trigger-zone--collapsed',
          )}
        >
          <SidebarTrigger className="-ml-1" />
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
