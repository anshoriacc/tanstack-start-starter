import React from 'react'
import {
  IconChevronRight,
  IconLayoutDashboard,
  IconUsers,
  IconBuilding,
  IconCalendar,
  IconCreditCard,
  IconCash,
  IconChartBar,
  IconSettings,
} from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

import { ToggleTheme } from './toggle-theme'
import {
  CollapsibleContent,
  CollapsibleTrigger,
  Collapsible,
} from './ui/collapsible'
import {
  Sidebar,
  SidebarMenu,
  SidebarGroup,
  SidebarHeader,
  SidebarContent,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from './ui/sidebar'

const navs = [
  {
    title: 'Main',
    url: '#',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: IconLayoutDashboard,
        isActive: true,
      },
    ],
  },
  {
    title: 'HR Management',
    url: '#',
    items: [
      {
        title: 'Employees',
        url: '#',
        icon: IconUsers,
        isActive: false,
      },
      {
        title: 'Departments',
        url: '#',
        icon: IconBuilding,
        isActive: false,
      },
      {
        title: 'Leave Requests',
        url: '#',
        icon: IconCalendar,
        isActive: false,
      },
      {
        title: 'Benefits',
        url: '#',
        icon: IconCreditCard,
        isActive: false,
      },
    ],
  },
  {
    title: 'Finance',
    url: '#',
    items: [
      {
        title: 'Payroll',
        url: '#',
        icon: IconCash,
        isActive: false,
      },
      {
        title: 'Reports',
        url: '#',
        icon: IconChartBar,
        isActive: false,
      },
    ],
  },
  {
    title: 'System',
    url: '#',
    items: [
      {
        title: 'Settings',
        url: '#',
        icon: IconSettings,
        isActive: false,
      },
    ],
  },
]

export const AppSidebar = (props: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <img src="/logo192.png" alt="Logo" className="h-8 w-8" />
          <span className="font-semibold text-lg">Dashboard</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {navs.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                render={
                  <CollapsibleTrigger>
                    {item.title}{' '}
                    <IconChevronRight className="ml-auto transition-transform group-data-open/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                }
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              ></SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          render={
                            <Link to={item.url}>
                              {item.icon && (
                                <item.icon className="mr-2 size-4" />
                              )}
                              {item.title}
                            </Link>
                          }
                          isActive={item.isActive}
                        ></SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <ToggleTheme />
      </SidebarFooter>
    </Sidebar>
  )
}
