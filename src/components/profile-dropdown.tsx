import { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserPanelContents } from '@/components/layout/nav-user.tsx'
import { SignOutDialog } from '@/components/sign-out-dialog'
import { NotificationsDrawer } from '@/components/notifications-drawer'
import { SupportDrawer } from '@/components/support-drawer'

export function ProfileDropdown() {
  const [open, setOpen] = useDialogState()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src='/avatars/01.png' alt='@shadcn' />
              <AvatarFallback>SN</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <UserPanelContents
          setOpen={setOpen}
          onNotificationsClick={() => setNotificationsOpen(true)}
          onSupportClick={() => setSupportOpen(true)}
        />
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
      <NotificationsDrawer
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />
      <SupportDrawer open={supportOpen} onOpenChange={setSupportOpen} />
    </>
  )
}
