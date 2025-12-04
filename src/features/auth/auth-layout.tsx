import { LOCALIZATION_CONSTANT_KEYS } from '@/lib/localization-constants.ts'
import { cn } from '@/lib/utils.ts'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations.ts'
import { useSettingsLoader } from '@/hooks/use-settings-loader'
import { CardTitle } from '@/components/ui/card.tsx'

type AuthLayoutProps = {
  children: React.ReactNode
}

const { SIGN_IN_LABEL } = LOCALIZATION_CONSTANT_KEYS.LOGIN

export function AuthLayout({ children }: AuthLayoutProps) {
  const { company, loading } = useSettingsLoader()
  const { getLocalizedValue } = useCompanyLocalizations()

  // Get auth background image from settings
  const authBgImage = company?.settings?.find(
    (setting) => setting.setting.title === 'Auth Background Image'
  )?.value

  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-5 lg:px-0'>
      <div
        className={cn(
          'relative h-full overflow-hidden bg-gray-500 max-lg:hidden md:col-span-1 lg:col-span-3',
          '[&>img]:absolute [&>img]:top-0 [&>img]:left-0 [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>img]:object-top-right [&>img]:select-none'
        )}
      >
        <img src={company?.auth_bg_url} alt='' />
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
          <CardTitle className='mb-8 text-center text-2xl tracking-tight'>
            {getLocalizedValue(SIGN_IN_LABEL)} {company?.name || ''}
          </CardTitle>

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
