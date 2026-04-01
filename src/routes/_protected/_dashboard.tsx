import * as React from 'react'
import { Outlet, createFileRoute } from '@tanstack/react-router'

import { AppSidebar } from '@/components/app-sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  HOVER_PREVIEW_CLOSE_DELAY_MS,
  shouldOpenHoverPreview,
} from '@/lib/sidebar-hover-preview'
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar'
import { Header } from '@/components/header'

const COLLAPSED_SIDEBAR_BREAKPOINT = 960

export const Route = createFileRoute('/_protected/_dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.innerWidth >= COLLAPSED_SIDEBAR_BREAKPOINT
  })

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(min-width: ${COLLAPSED_SIDEBAR_BREAKPOINT}px)`,
    )
    const updateSidebarOpen = () => {
      setIsSidebarOpen(mediaQuery.matches)
    }

    updateSidebarOpen()
    mediaQuery.addEventListener('change', updateSidebarOpen)

    return () => mediaQuery.removeEventListener('change', updateSidebarOpen)
  }, [])

  return (
    <div className="[--header-height:calc(--spacing(16))]">
      <SidebarProvider
        className="flex flex-col"
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      >
        <DashboardLayoutContent />
      </SidebarProvider>
    </div>
  )
}

function DashboardLayoutContent() {
  const isMobile = useIsMobile()
  const { state } = useSidebar()
  const isSidebarOpen = state === 'expanded'
  const [isHoverPreviewOpen, setIsHoverPreviewOpen] = React.useState(false)
  const closeHoverPreviewTimerRef = React.useRef<number | null>(null)

  const clearCloseHoverPreviewTimer = React.useCallback(() => {
    if (closeHoverPreviewTimerRef.current === null) {
      return
    }

    window.clearTimeout(closeHoverPreviewTimerRef.current)
    closeHoverPreviewTimerRef.current = null
  }, [])

  const openHoverPreview = React.useCallback(() => {
    clearCloseHoverPreviewTimer()

    if (
      !shouldOpenHoverPreview({
        state: isSidebarOpen ? 'expanded' : 'collapsed',
        isMobile,
      })
    ) {
      return
    }

    setIsHoverPreviewOpen(true)
  }, [clearCloseHoverPreviewTimer, isMobile, isSidebarOpen])

  const scheduleCloseHoverPreview = React.useCallback(() => {
    if (!isHoverPreviewOpen) {
      return
    }

    clearCloseHoverPreviewTimer()
    closeHoverPreviewTimerRef.current = window.setTimeout(() => {
      setIsHoverPreviewOpen(false)
      closeHoverPreviewTimerRef.current = null
    }, HOVER_PREVIEW_CLOSE_DELAY_MS)
  }, [clearCloseHoverPreviewTimer, isHoverPreviewOpen])

  React.useEffect(() => {
    if (isSidebarOpen) {
      setIsHoverPreviewOpen(false)
      clearCloseHoverPreviewTimer()
    }
  }, [clearCloseHoverPreviewTimer, isSidebarOpen])

  React.useEffect(() => {
    return () => {
      clearCloseHoverPreviewTimer()
    }
  }, [clearCloseHoverPreviewTimer])

  return (
    <>
      <Header
        onSidebarTriggerMouseEnter={openHoverPreview}
        onSidebarTriggerMouseLeave={scheduleCloseHoverPreview}
      />

      <div className="flex flex-1">
        {isHoverPreviewOpen && !isSidebarOpen && (
          <div
            aria-hidden
            className="fixed top-(--header-height) left-0 z-[9] h-[calc(100svh-var(--header-height))] w-[calc(var(--sidebar-width)+(--spacing(4)))]"
            onMouseEnter={openHoverPreview}
            onMouseLeave={scheduleCloseHoverPreview}
          />
        )}
        <AppSidebar
          variant="floating"
          isHoverPreviewOpen={
            isHoverPreviewOpen &&
            shouldOpenHoverPreview({
              state: isSidebarOpen ? 'expanded' : 'collapsed',
              isMobile,
            })
          }
          onHoverPreviewEnter={openHoverPreview}
          onHoverPreviewLeave={scheduleCloseHoverPreview}
        />

        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </div>
    </>
  )
}
