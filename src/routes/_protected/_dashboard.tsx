import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { Separator } from '@base-ui/react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_protected/_dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <DashboardLayout />
    </SidebarProvider>
  )
}

function DashboardLayout() {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div
            className={cn(
              'sidebar-trigger-zone max-w-max',
              isCollapsed && 'sidebar-trigger-zone--collapsed',
            )}
          >
            <SidebarTrigger className="-ml-1" />
          </div>
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
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
        </header>

        <Outlet />
      </SidebarInset>
    </>
  )
}
