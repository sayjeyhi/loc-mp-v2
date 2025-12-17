import { useState } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { User } from 'lucide-react'
import { type LOCALIZATION_CONSTANT_KEYS } from '@/lib/localization-constants'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'

interface InfoFieldProps {
  label: LOCALIZATION_CONSTANT_KEYS
  value: string
}

function InfoField({ label, value }: InfoFieldProps) {
  const { getLocalizedValue } = useCompanyLocalizations()
  return (
    <div className='mb-4'>
      <label className='mb-2 block text-sm font-medium opacity-80'>
        {getLocalizedValue(label)}
      </label>
      <div className='border-input bg-background min-h-[48px] rounded-lg border px-4 py-3'>
        <p className='text-sm'>{value || '-'}</p>
      </div>
    </div>
  )
}

interface InfoCardProps {
  title: LOCALIZATION_CONSTANT_KEYS
  fields: InfoFieldProps[]
}

function InfoCard({ title, fields }: InfoCardProps) {
  const { getLocalizedValue } = useCompanyLocalizations()
  return (
    <div className='mb-6 rounded-lg border border-gray-200 p-5 dark:border-gray-700'>
      <h2 className='mb-6 flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white'>
        <div className='bg-primary h-6 w-1 rounded-full'></div>
        {getLocalizedValue(title)}
      </h2>

      {fields.map((field, index) => (
        <InfoField key={index} label={field.label} value={field.value} />
      ))}
    </div>
  )
}

export function ProfilePage() {
  const { getLocalizedValue } = useCompanyLocalizations()
  const [activeTab, setActiveTab] = useState<'account' | 'credit'>('account')
  const { profile } = useProfileStore()

  // User email for header
  const userEmail = profile?.merchant?.businessEmail || '-'

  // Business Information
  const businessInfo = {
    accountNumber: profile?.account?.number || '-',
    legalName: profile?.merchant?.businessName || '-',
    abnAcn: profile?.merchant?.federalId || '-',
    entityType: profile?.merchant?.businessType || '-',
    yearEstablished: profile?.merchant?.businessStartDate || '-',
    stateIncorporated: profile?.merchant?.stateOfIncorporation || '-',
    businessEmail: profile?.merchant?.businessEmail || '-',
    website: profile?.merchant?.website || '-',
  }

  const businessFields: InfoFieldProps[] = [
    {
      label: 'ACCOUNT_INFORMATION_TAB_FORM_ACCOUNT_LABEL',
      value: businessInfo.accountNumber,
    },
    {
      label: 'ACCOUNT_INFORMATION_TAB_FORM_LEGAL_NAME_LABEL',
      value: businessInfo.legalName,
    },
    {
      label: 'ACCOUNT_INFORMATION_TAB_FORM_ABN_LABEL',
      value: businessInfo.abnAcn,
    },
    {
      label: 'ACCOUNT_INFORMATION_TAB_FORM_ENTITY_TYPE_LABEL',
      value: businessInfo.entityType,
    },
    {
      label: 'ACCOUNT_INFORMATION_TAB_FORM_YEAR_STARTED_LABEL',
      value: businessInfo.yearEstablished,
    },
    {
      label: 'ACCOUNT_INFORMATION_TAB_FORM_STATE_INCORPORATED_LABEL',
      value: businessInfo.stateIncorporated,
    },
    {
      label: 'ACCOUNT_INFORMATION_TAB_FORM_EMAIL_ADDRESS_LABEL',
      value: businessInfo.businessEmail,
    },
    {
      label: 'ACCOUNT_INFORMATION_TAB_FORM_WEBSITE_LABEL',
      value: businessInfo.website,
    },
  ]

  // Contact Information
  const contactInfo = {
    firstName: profile?.merchant?.primaryContact?.firstName || '-',
    lastName: profile?.merchant?.primaryContact?.lastName || '-',
    personalEmail: profile?.merchant?.primaryContact?.email || '-',
    mobileNumber: profile?.merchant?.primaryContact?.phone || '-',
  }

  const contactFields: InfoFieldProps[] = [
    {
      label: 'ACCOUNT_INFORMATION_TAB_FORM_CONTACT_FIRST_NAME_LABEL',
      value: contactInfo.firstName,
    },
    {
      label: 'ACCOUNT_INFORMATION_TAB_FORM_CONTACT_LAST_NAME_LABEL',
      value: contactInfo.lastName,
    },
    {
      label: 'ACCOUNT_INFORMATION_TAB_FORM_CONTACT_EMAIL_ADDRESS_LABEL',
      value: contactInfo.personalEmail,
    },
    {
      label: 'ACCOUNT_INFORMATION_TAB_FORM_CONTACT_MOBILE_NUMBER_LABEL',
      value: contactInfo.mobileNumber,
    },
  ]

  // Cash Balance
  const cashBalanceFields: InfoFieldProps[] = [
    {
      label: 'CREDIT_LIMIT_INFORMATION_FROM_CASH_BALANCE_LABEL',
      value: profile?.account?.overpaymentBalance
        ? formatCurrency(profile.account.overpaymentBalance)
        : '$0.00',
    },
    {
      label: 'CREDIT_LIMIT_INFORMATION_FROM_FEE_BALANCE_LABEL',
      value: profile?.account?.outstandingBounceFees || '-',
    },
    {
      label: 'CREDIT_LIMIT_INFORMATION_FROM_MINIMUM_ACH_BALANCE_LABEL',
      value: '-',
    },
    {
      label: 'CREDIT_LIMIT_INFORMATION_FROM_BALANCE_TOWARD_FEES_LABEL',
      value: profile?.account?.balanceToFees
        ? formatCurrency(profile.account.balanceToFees)
        : '$0.00',
    },
  ]

  // Funding Limits
  const fundingLimitsFields: InfoFieldProps[] = [
    {
      label: 'CREDIT_LIMIT_INFORMATION_FROM_MAX_FUNDING_LIMIT_LABEL',
      value: profile?.account?.maxFundingLimit
        ? formatCurrency(profile.account.maxFundingLimit)
        : '$0.00',
    },
    {
      label: 'CREDIT_LIMIT_INFORMATION_FROM_MAX_AUTO_APPROVAL_LABEL',
      value: profile?.account?.maxAutoApproval
        ? formatCurrency(profile.account.maxAutoApproval)
        : '-',
    },
  ]

  // Funding Parameters
  const fundingParametersField: InfoFieldProps[] = [
    {
      label: 'CREDIT_LIMIT_INFORMATION_FROM_DAILY_PAYMENT_COUNT_LABEL',
      value: profile?.account?.paymentCount?.toString() || '0',
    },
    {
      label: 'CREDIT_LIMIT_INFORMATION_FROM_ESTABLISHMENT_FEE_LABEL',
      value: profile?.account?.merchantFunderEstablishmentFeeAmount
        ? formatCurrency(profile.account.merchantFunderEstablishmentFeeAmount)
        : '$0.00',
    },
    {
      label: 'CREDIT_LIMIT_INFORMATION_FROM_COLLECTION_SCHEDULE_TYPE_LABEL',
      value: profile?.account?.collectionFrequencyType || '-',
    },
    {
      label: 'CREDIT_LIMIT_INFORMATION_FROM_SCHEDULE_DESCRIPTION_LABEL',
      value: profile?.account?.collectionFrequencyTypeDescription || '-',
    },
  ]

  return (
    <>
      <Header />
      <Main>
        <div className='flex flex-1 flex-col gap-4 rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900'>
          {/* User Profile Header */}

          <div className='flex flex-wrap items-end justify-between gap-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                {getLocalizedValue('PROFILE_PAGE_TITLE_LABEL')}
              </h2>
            </div>

            <div className='flex items-center gap-3 rounded-lg bg-gray-50 p-2 text-sm font-medium dark:bg-gray-700'>
              <div className='flex h-5 w-5 items-center justify-center'>
                <User size={16} />
              </div>
              {userEmail}
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as 'account' | 'credit')
            }
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='account'>
                {getLocalizedValue('ACCOUNT_INFORMATION_TAB_LABEL')}
              </TabsTrigger>
              <TabsTrigger value='credit'>
                {getLocalizedValue('CREDIT_LIMIT_INFORMATION_LABEL')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value='account' className='mt-6'>
              <InfoCard
                title='ACCOUNT_INFORMATION_TAB_BUSINESS_INFORMATION_LABEL'
                fields={businessFields}
              />
              <InfoCard
                title='ACCOUNT_INFORMATION_TAB_FORM_CONTACT_INFORMATION_LABEL'
                fields={contactFields}
              />
            </TabsContent>

            <TabsContent value='credit' className='mt-6'>
              <InfoCard
                title='CREDIT_LIMIT_INFORMATION_PAGE_TITLE_CASH_BALANCE'
                fields={cashBalanceFields}
              />
              <InfoCard
                title='CREDIT_LIMIT_INFORMATION_PAGE_TITLE_FUNDING_LIMITS'
                fields={fundingLimitsFields}
              />
              <InfoCard
                title='CREDIT_LIMIT_INFORMATION_PAGE_TITLE_FUNDING_PARAMETERS'
                fields={fundingParametersField}
              />
            </TabsContent>
          </Tabs>
        </div>
      </Main>
      <Footer />
    </>
  )
}
