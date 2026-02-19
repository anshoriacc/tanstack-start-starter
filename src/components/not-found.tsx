import { Link } from '@tanstack/react-router'
import { IconZoomExclamation } from '@tabler/icons-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './ui/empty'

export const NotFound = () => {
  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconZoomExclamation />
          </EmptyMedia>
          <EmptyTitle>404 - Not Found</EmptyTitle>
          <EmptyDescription>
            The page you are looking for does not exist.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <EmptyDescription>
            <Link to="/">Go back to home</Link>
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </main>
  )
}
