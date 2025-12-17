import { Footer } from '@/components/layout/footer.tsx'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { AccountDetails } from './components/account-details'
import { CashDraw } from './components/cash-draw'
import { CollectionSummary } from './components/collection-summary'
import { MakeVoluntaryPrepayment } from './components/make-voluntary-prepayment'
import { RepaymentDetails } from './components/repayment-details'

export function DashboardPage() {
  return (
    <>
      <Header />

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-8 grid grid-cols-2 gap-6'>
          <AccountDetails />
          <RepaymentDetails />
        </div>

        <div className='mb-8 grid grid-cols-2 gap-6'>
          <CashDraw />
          <MakeVoluntaryPrepayment />
        </div>

        <CollectionSummary />
      </Main>
      <Footer />
    </>
  )
}
