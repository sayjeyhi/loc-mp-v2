import { useProfileStore } from '@/store/profileStore'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { LOCALIZATION_CONSTANT_KEYS } from '@/lib/localization-constants'

const {
  HELLO_LABEL,
  DASHBOARD_ACCOUNT_NUMBER_LABEL,
  DASHBOARD_STATUS_NUMBER_LABEL,
  DASHBOARD_STATUS_ACTIVE,
  DASHBOARD_STATUS_BLOCKED,
} = LOCALIZATION_CONSTANT_KEYS.DASHBOARD

export function AppHeader() {
  const { profile } = useProfileStore()
  const { getLocalizedValue } = useCompanyLocalizations()

  const { account, merchant } = profile || {}
  const isBlocked = account?.status === 'BLOCKED'

  return (
    <div>
      <h1 className='font-normal'>
        {getLocalizedValue(HELLO_LABEL)}, {merchant?.businessName || 'User'}
      </h1>

      <div className='flex items-center gap-1 text-gray-600 dark:text-gray-500 -mt-1'>
        <span className='text-xs'>
          {getLocalizedValue(DASHBOARD_ACCOUNT_NUMBER_LABEL)} :{' '}
          <span>{account?.number || '-'}</span>
        </span>

        <span className='opacity-80'> - </span>

        <span className='text-xs'>
          {getLocalizedValue(DASHBOARD_STATUS_NUMBER_LABEL)}:
        </span>

        <div
          className={`flex items-center gap-2 px-2 py-0.5 border rounded-full ${
            isBlocked
              ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isBlocked ? 'bg-red-500' : 'bg-green-500'
            }`}
          ></div>
          <span className='text-xs font-medium'>
            {isBlocked
              ? getLocalizedValue(DASHBOARD_STATUS_BLOCKED)
              : getLocalizedValue(DASHBOARD_STATUS_ACTIVE)}
          </span>
        </div>
      </div>
    </div>
  )
}

