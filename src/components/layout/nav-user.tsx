import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { User, Bell, ChevronsUpDown, LogOut, Headphones } from 'lucide-react'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { NotificationsDrawer } from '@/components/notifications-drawer'
import { SignOutDialog } from '@/components/sign-out-dialog'
import { SupportDrawer } from '@/components/support-drawer'
import { useAuthStore } from '@/store/authStore'
import { useProfileStore } from '@/store/profileStore'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'

// Helper function to get user initials
const getInitials = (name: string): string => {
  if (!name) return 'U'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

export const UserPanelContents = ({
  setOpen,
  onNotificationsClick,
  onSupportClick,
  side,
  align = 'end',
  sideOffset = 4,
  alignOffset,
}: {
  setOpen: (value: string | boolean | null) => void
  onNotificationsClick: () => void
  onSupportClick: () => void
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  alignOffset?: number
}) => {
  const { getLocalizedValue } = useCompanyLocalizations()
  const { isMobile } = useSidebar()
  const { user: authUser } = useAuthStore()
  const { profile } = useProfileStore()

  // Get user display information
  const userInfo = useMemo(() => {
    const merchant = profile?.merchant
    const primaryContact = merchant?.primaryContact
    const account = profile?.account

    // Name priority: businessName > primaryContact name > username > accountNumber
    const name =
      merchant?.businessName ||
      (primaryContact?.firstName && primaryContact?.lastName
        ? `${primaryContact.firstName} ${primaryContact.lastName}`
        : primaryContact?.firstName || primaryContact?.lastName) ||
      authUser?.username ||
      account?.number ||
      'User'

    // Email priority: primaryContact email > businessEmail > username
    const email =
      primaryContact?.email ||
      merchant?.businessEmail ||
      authUser?.username ||
      ''

    // Avatar initials from name
    const initials = getInitials(name)

    return {
      name,
      email,
      initials,
    }
  }, [authUser, profile])

  return (
    <DropdownMenuContent
      className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
      side={side ?? (isMobile ? 'bottom' : 'right')}
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
    >
      <DropdownMenuLabel className='p-0 font-normal'>
        <div className='flex items-center gap-2 px-1 py-1.5 text-start text-sm'>
          <Avatar className='h-8 w-8 rounded-lg'>
            <AvatarFallback className='rounded-lg'>
              {userInfo.initials}
            </AvatarFallback>
          </Avatar>
          <div className='grid flex-1 text-start text-sm leading-tight'>
            <span className='truncate font-semibold'>{userInfo.name}</span>
            {userInfo.email && (
              <span className='truncate text-xs'>{userInfo.email}</span>
            )}
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link to='/profile'>
            <User />
            {getLocalizedValue('PROFILE_PAGE_TITLE_LABEL')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSupportClick}>
          <Headphones />
          {getLocalizedValue('CUSTOMER_SUPPORT_LABEL')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onNotificationsClick}>
          <Bell />
          {getLocalizedValue('NOTIFICATIONS_DRAWER_TITLE_LABEL')}
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant='destructive' onClick={() => setOpen(true)}>
        <LogOut />
        {getLocalizedValue('SHARED_BTN_LOG_OUT')}
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}

export function NavUser() {
  const [open, setOpen] = useDialogState()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const { user: authUser } = useAuthStore()
  const { profile } = useProfileStore()

  // Get user display information
  const userInfo = useMemo(() => {
    const merchant = profile?.merchant
    const primaryContact = merchant?.primaryContact
    const account = profile?.account

    // Name priority: businessName > primaryContact name > username > accountNumber
    const name =
      merchant?.businessName ||
      (primaryContact?.firstName && primaryContact?.lastName
        ? `${primaryContact.firstName} ${primaryContact.lastName}`
        : primaryContact?.firstName || primaryContact?.lastName) ||
      authUser?.username ||
      account?.number ||
      'User'

    // Email priority: primaryContact email > businessEmail > username
    const email =
      primaryContact?.email ||
      merchant?.businessEmail ||
      authUser?.username ||
      ''

    // Avatar initials from name
    const initials = getInitials(name)

    return {
      name,
      email,
      initials,
    }
  }, [authUser, profile])

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarFallback className='rounded-lg'>
                    {userInfo.initials}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-start text-sm leading-tight'>
                  <span className='truncate font-semibold'>{userInfo.name}</span>
                  {userInfo.email && (
                    <span className='truncate text-xs'>{userInfo.email}</span>
                  )}
                </div>
                <ChevronsUpDown className='ms-auto size-4' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <UserPanelContents
              setOpen={setOpen}
              onNotificationsClick={() => setNotificationsOpen(true)}
              onSupportClick={() => setSupportOpen(true)}
            />
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
      <NotificationsDrawer
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />
      <SupportDrawer open={supportOpen} onOpenChange={setSupportOpen} />
    </>
  )
}
