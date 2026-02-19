import { IconLogout, IconChevronDown } from '@tabler/icons-react'

import { cn } from '@/lib/utils'
import { useLogoutMutation } from '@/hooks/api/auth'
import { SidebarTrigger, useSidebar } from './ui/sidebar'
import { Avatar, AvatarFallback } from './ui/avatar'
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

export const Header = () => {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  const logoutMutation = useLogoutMutation()

  const logoutHandler = () => {
    logoutMutation.mutate()
  }

  return (
    <header className="bg-background fixed w-full top-0 z-1 flex h-(--header-height) items-center justify-between gap-2 border-b px-4">
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
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="lg" className="h-12">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">AA</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Administrator</span>
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
                  <AvatarFallback className="rounded-lg">AA</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Administrator</span>
                  <span className="truncate text-xs">admin@istrat.or</span>
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
