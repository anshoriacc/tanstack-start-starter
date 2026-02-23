import { Outlet, createFileRoute } from '@tanstack/react-router'

import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Header } from '@/components/header'

export const Route = createFileRoute('/_protected/_dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="[--header-height:calc(--spacing(16))]">
      <SidebarProvider>
        <AppSidebar variant="floating"/>

        <SidebarInset>
          <Header />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
