import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Overview } from './components/overview'
import { AppHeader } from '@/components/layout/app-header.tsx'

export function Dashboard() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <AppHeader />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Account Details
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-blue-500 dark:text-blue-400 font-semibold mb-2">Funding Limit</h3>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  $1,000.00
                </p>
              </div>

              <div className="flex gap-8">
                <div>
                  <p className="text-sm mb-1 text-gray-600 dark:text-gray-400">
                    Available Balance
                  </p>
                  <p className="text-blue-500 dark:text-blue-400 text-2xl font-semibold">$225.00</p>
                </div>
                <div>
                  <p className="text-sm mb-1 text-gray-600 dark:text-gray-400">
                    Used Balance
                  </p>
                  <p className="text-red-500 dark:text-red-400 text-2xl font-semibold">$775.00</p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
                  Pending Balance
                </p>
                <p className="text-blue-500 dark:text-blue-400 text-2xl font-semibold">$535.00</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Repayment Details
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-blue-500 dark:text-blue-400 font-semibold mb-2">Repayment Schedule:</h3>
                <p className="text-lg text-gray-900 dark:text-white">
                  daily
                </p>
              </div>

              <div>
                <p className="text-sm mb-1 text-gray-600 dark:text-gray-400">
                  Discounted Balance
                </p>
                <p className="text-blue-500 dark:text-blue-400 text-2xl font-semibold">$268.00</p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
                  Current Balance
                </p>
                <p className="text-blue-500 dark:text-blue-400 text-2xl font-semibold">$940.00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Cash Draw
            </h3>

            <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
              Enter the amount you would like to withdraw
            </p>

            <div className="flex gap-3 items-center mb-4">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                <span className="px-3 py-2 text-gray-600 dark:text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="flex-1 px-3 py-2 outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              Cash Draw
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Make Voluntary Prepayment?
            </h3>

            <p className="text-sm mb-6 text-gray-600 dark:text-gray-400">
              Requests are subject to review and approval and may take up to 3 business days to clear.
            </p>

            <button className="w-full bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              Pay Now
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Collection Summary
          </h2>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Lifetime Funding
              </h3>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last Payment Date
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
                  Transaction Count
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  0
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Lifetime Collections
              </h3>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
                  Total Saved Amount
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  0
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Missed Payments
              </h3>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
                  Arrears
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  $255.00
                </p>
              </div>
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true,
  },
]
