import { useMemo, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserPanelContents } from '@/components/layout/nav-user.tsx'
import { SignOutDialog } from '@/components/sign-out-dialog'
import { NotificationsDrawer } from '@/components/notifications-drawer'
import { SupportDrawer } from '@/components/support-drawer'
import { useAuthStore } from '@/store/authStore'
import { useProfileStore } from '@/store/profileStore'

// Helper function to get user initials
const getInitials = (name: string): string => {
  if (!name) return 'U'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

export function ProfileDropdown() {
  const [open, setOpen] = useDialogState()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const { user: authUser } = useAuthStore()
  const { profile } = useProfileStore()

  const userInfo = useMemo(() => {
    const merchant = profile?.merchant
    const primaryContact = merchant?.primaryContact
    const account = profile?.account

    const name =
      merchant?.businessName ||
      (primaryContact?.firstName && primaryContact?.lastName
        ? `${primaryContact.firstName} ${primaryContact.lastName}`
        : primaryContact?.firstName || primaryContact?.lastName) ||
      authUser?.username ||
      account?.number ||
      'User'

    return {
      name,
      initials: getInitials(name),
    }
  }, [authUser, profile])

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='relative h-8 w-8 rounded-full'
            aria-label={userInfo.name}
          >
            <Avatar className='h-8 w-8'>
              <AvatarFallback>{userInfo.initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <UserPanelContents
          side='bottom'
          align='start'
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
