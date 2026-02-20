import { cn } from '@/lib/utils'
import * as React from 'react'

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  children: string | null | undefined
  ref?: React.Ref<HTMLSpanElement>
}

export const TruncatedText = ({
  children,
  className,
  ref: forwardedRef,
  ...props
}: Props) => {
  const internalRef = React.useRef<HTMLSpanElement>(null)
  const [isTruncated, setIsTruncated] = React.useState(false)

  React.useEffect(() => {
    const element =
      internalRef.current ??
      (typeof forwardedRef === 'object' && forwardedRef !== null
        ? forwardedRef.current
        : null)

    if (!element) return

    const checkTruncation = () => {
      setIsTruncated(element.scrollWidth > element.clientWidth)
    }

    checkTruncation()

    const resizeObserver = new ResizeObserver(checkTruncation)
    resizeObserver.observe(element)

    return () => resizeObserver.disconnect()
  }, [children, forwardedRef])

  return (
    <span
      ref={forwardedRef ?? internalRef}
      className={cn('truncate', className)}
      title={isTruncated ? children || '' : undefined}
      {...props}
    >
      {children}
    </span>
  )
}
