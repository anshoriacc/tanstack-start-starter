import { IconUsers } from '@tabler/icons-react'

import { useGetUserListQuery, type TUser } from '@/hooks/api/user'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemMedia,
} from '@/components/ui/item'
import { Button } from '@/components/ui/button'

type Props = {
  onSelect: (user: Pick<TUser, 'username' | 'password'>) => void
}

export const DemoAccountList = ({ onSelect }: Props) => {
  const { data: usersData, isLoading } = useGetUserListQuery({
    limit: 0,
    select: ['id', 'username', 'password', 'image'],
  })

  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="link" className="mt-4 h-auto p-0 text-sm" />}
      >
        <IconUsers className="mr-1.5 size-4" />
        Demo Accounts
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Demo Accounts</DialogTitle>
          <DialogDescription>
            Select an account to auto-fill credentials
          </DialogDescription>
        </DialogHeader>
        <div role="list" aria-label="Available demo accounts">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="space-y-1">
              {usersData?.users.map((user) => (
                <DialogClose
                  key={user.id}
                  render={
                    <Item
                      variant="muted"
                      size="sm"
                      className="cursor-pointer"
                      role="button"
                      tabIndex={0}
                      aria-label={`Use account ${user.username}`}
                    />
                  }
                  onClick={() => onSelect(user)}
                >
                  <ItemMedia>
                    <Avatar size="sm">
                      <AvatarImage src={user.image} alt="" />
                      <AvatarFallback>
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{user.username}</ItemTitle>
                    <ItemDescription className="font-mono text-xs">
                      {user.password}
                    </ItemDescription>
                  </ItemContent>
                </DialogClose>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
