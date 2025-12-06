import { cn } from '@/lib/utils.ts'
import { useSettingsLoader } from '@/hooks/use-settings-loader'
import { Image } from '@/components/ui/image.tsx'

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
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-5 lg:px-0'>
      <div
        className={cn(
          'relative h-full overflow-hidden bg-gray-500 max-lg:hidden md:col-span-1 lg:col-span-3'
        )}
      >
        <Image
          src={company?.auth_bg_url}
          alt=''
          className={cn(
            'absolute top-0 left-0 h-full w-full object-cover object-top-right select-none'
          )}
          skeletonClassName='rounded-none'
        />
      </div>

      <img
        src={company?.logo_url}
        className='absolute top-8 left-8 w-64 object-contain max-lg:hidden'
        alt={company?.name || 'Company Logo'}
      />
      <div
        className='container grid h-svh max-w-none items-center justify-center lg:col-span-2 lg:border-l lg:px-0'
        style={{
          backgroundImage: authBgImage ? `url(${authBgImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
          <div className='mb-4 flex items-center justify-center lg:hidden'>
            <img
              src={company?.logo_url || company?.mobile_logo_url}
              alt={company?.name || 'Company Logo'}
              className='h-12 w-auto'
              style={{ filter: 'drop-shadow(rgba(0, 0, 0) 0px 0px 60px)' }}
            />
          </div>

          {loading && !company ? (
            <div className='bg-card space-y-4 rounded-lg border p-8'>
              <div className='space-y-2'>
                <div className='bg-muted h-6 w-32 animate-pulse rounded-md' />
                <div className='bg-muted h-4 w-full animate-pulse rounded-md' />
              </div>
              <div className='space-y-2'>
                <div className='bg-muted h-10 w-full animate-pulse rounded-md' />
                <div className='bg-muted h-10 w-full animate-pulse rounded-md' />
              </div>
              <div className='bg-muted h-10 w-full animate-pulse rounded-md' />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  )
}
