import React from 'react'

import { Separator } from './ui/separator'
import { SidebarTrigger, useSidebar } from './ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'

export const Header = () => {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <header className="flex h-16 items-center gap-2 border-b px-4">
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
    </header>
  )
}
