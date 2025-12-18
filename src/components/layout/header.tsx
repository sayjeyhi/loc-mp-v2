import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useProfileLoader } from '@/hooks/use-profile-loader'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { AppHeader } from '@/components/layout/app-header.tsx'
import { ProfileDropdown } from '@/components/profile-dropdown.tsx'
import { ReconnectBanks } from '@/components/reconnect-banks'

// import { ThemeSwitch } from '@/components/theme-switch.tsx'

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<HTMLElement>
}

export function Header({ className, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0)

  // Load profile data to ensure it's available for AppHeader and other components
  useProfileLoader()

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true })

    // Clean up the event listener on unmount
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'z-50 h-20',
        'header-fixed peer/header sticky top-0 w-[inherit]',
        offset > 10 ? 'shadow' : 'shadow-none',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'relative flex h-full items-center gap-3 p-4 sm:gap-4',
          'dark:bg-card border-b bg-white'
        )}
      >
        <SidebarTrigger variant='outline' className='max-md:scale-125' />
        <Separator orientation='vertical' className='h-6' />
        <AppHeader />
        <div className='ms-auto flex items-center space-x-4'>
          <ReconnectBanks />
          {/*<ThemeSwitch />*/}
          <ProfileDropdown />
        </div>
      </div>
    </header>
  )
}
