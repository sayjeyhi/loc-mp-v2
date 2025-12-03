import { Logo } from '@/assets/logo'
import { useSettingsLoader } from '@/hooks/use-settings-loader'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { company, loading } = useSettingsLoader()

  // Get auth background image from settings
  const authBgImage = company?.settings?.find(
    (setting) => setting.setting.title === 'Auth Background Image'
  )?.value

  return (
    <div
      className='container grid h-svh max-w-none items-center justify-center'
      style={{
        backgroundImage: authBgImage ? `url(${authBgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
        <div className='mb-4 flex items-center justify-center'>
          {loading && !company ? (
            <div className='flex items-center justify-center'>
              <div className='h-12 w-32 animate-pulse rounded-md bg-muted' />
            </div>
          ) : (company?.mobile_logo_url ||company?.logo_url) ? (
            <>
              <img
                src={company.logo_url}
                alt={company.name || 'Company Logo'}
                className='h-24 w-auto hidden md:block'
              />
              <img
                src={company.mobile_logo_url}
                alt={company.name || 'Company Logo'}
                className='h-12 w-auto md:hidden'
              />
            </>
          ) : (
            <Logo className='h-12 w-auto' />
          )}
        </div>
        {loading && !company ? (
          <div className='space-y-4 rounded-lg border bg-card p-8'>
            <div className='space-y-2'>
              <div className='h-6 w-32 animate-pulse rounded-md bg-muted' />
              <div className='h-4 w-full animate-pulse rounded-md bg-muted' />
            </div>
            <div className='space-y-2'>
              <div className='h-10 w-full animate-pulse rounded-md bg-muted' />
              <div className='h-10 w-full animate-pulse rounded-md bg-muted' />
            </div>
            <div className='h-10 w-full animate-pulse rounded-md bg-muted' />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
