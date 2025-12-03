import { Outlet } from '@tanstack/react-router'
import { CreditCard, User } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Footer } from '@/components/layout/footer.tsx'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { SidebarNav } from './components/sidebar-nav'

const sidebarNavItems = [
  {
    title: 'Account',
    href: '/settings',
    icon: <User size={18} />,
  },
  {
    title: 'Credit Limit',
    href: '/settings/credit-limit',
    icon: <CreditCard size={18} />,
  },
]

export function Settings() {
  return (
    <>
      <Header />

      <Main>
        <div className='flex flex-1 flex-col gap-4 rounded-lg bg-white p-6 shadow-sm sm:gap-6 dark:bg-gray-800'>
          <div className='space-y-0.5'>
            <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
              Settings
            </h1>
            <p className='text-muted-foreground'>
              Manage your account settings and set e-mail preferences.
            </p>
          </div>
          <Separator className='my-1 lg:my-2' />
          <div className='flex flex-1 flex-col space-y-1 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-6'>
            <aside className='top-0 lg:sticky lg:w-1/5'>
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className='flex w-full overflow-y-hidden'>
              <Outlet />
            </div>
          </div>
        </div>
      </Main>

      <Footer />
    </>
  )
}
