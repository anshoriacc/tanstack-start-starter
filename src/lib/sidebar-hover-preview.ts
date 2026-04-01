type HoverPreviewContext = {
  state: 'expanded' | 'collapsed'
  isMobile: boolean
}

export const HOVER_PREVIEW_CLOSE_DELAY_MS = 180

export const shouldOpenHoverPreview = ({
  state,
  isMobile,
}: HoverPreviewContext) => {
  if (isMobile) {
    return false
  }

  return state === 'collapsed'
}
