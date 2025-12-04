import { useState } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { User } from 'lucide-react'
import { formatCurrency } from '@/utils/formatCurrency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'

interface InfoFieldProps {
  label: string
  value: string
}

function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div className='mb-4'>
      <label className='mb-2 block text-sm font-medium opacity-80'>
        {label}
      </label>
      <div className='border-input bg-background min-h-[48px] rounded-lg border px-4 py-3'>
        <p className='text-sm'>{value || '-'}</p>
      </div>
    </div>
  )
}

interface InfoCardProps {
  title: string
  fields: InfoFieldProps[]
}

function InfoCard({ title, fields }: InfoCardProps) {
  return (
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {fields.map((field, index) => (
          <InfoField key={index} label={field.label} value={field.value} />
        ))}
      </CardContent>
    </Card>
  )
}

export function Settings() {
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

  const businessFields = [
    { label: 'Account Number', value: businessInfo.accountNumber },
    { label: 'Legal Name', value: businessInfo.legalName },
    { label: 'ABN/ACN', value: businessInfo.abnAcn },
    { label: 'Entity Type', value: businessInfo.entityType },
    { label: 'Year Established', value: businessInfo.yearEstablished },
    { label: 'State Incorporated', value: businessInfo.stateIncorporated },
    { label: 'Business Email', value: businessInfo.businessEmail },
    { label: 'Website', value: businessInfo.website },
  ]

  // Contact Information
  const contactInfo = {
    firstName: profile?.merchant?.primaryContact?.firstName || '-',
    lastName: profile?.merchant?.primaryContact?.lastName || '-',
    personalEmail: profile?.merchant?.primaryContact?.email || '-',
    mobileNumber: profile?.merchant?.primaryContact?.phone || '-',
  }

  const contactFields = [
    { label: 'First Name', value: contactInfo.firstName },
    { label: 'Last Name', value: contactInfo.lastName },
    { label: 'Personal Email', value: contactInfo.personalEmail },
    { label: 'Mobile Number', value: contactInfo.mobileNumber },
  ]

  // Cash Balance
  const cashBalanceFields = [
    {
      label: 'Cash Balance',
      value: profile?.account?.overpaymentBalance
        ? formatCurrency(profile.account.overpaymentBalance)
        : '$0.00',
    },
    {
      label: 'Bounce Fees',
      value: profile?.account?.outstandingBounceFees || '-',
    },
    { label: 'Direct Debit Balance', value: '-' },
    {
      label: 'Balance Toward Fees',
      value: profile?.account?.balanceToFees
        ? formatCurrency(profile.account.balanceToFees)
        : '$0.00',
    },
  ]

  // Funding Limits
  const fundingLimitsFields = [
    {
      label: 'Facility Limit',
      value: profile?.account?.maxFundingLimit
        ? formatCurrency(profile.account.maxFundingLimit)
        : '$0.00',
    },
    {
      label: 'Max Auto Approval',
      value: profile?.account?.maxAutoApproval
        ? formatCurrency(profile.account.maxAutoApproval)
        : '-',
    },
  ]

  // Funding Parameters
  const fundingParametersFields = [
    {
      label: 'Number of Payments',
      value: profile?.account?.paymentCount?.toString() || '0',
    },
    {
      label: 'Drawdown Fee',
      value: profile?.account?.merchantFunderEstablishmentFeeAmount
        ? formatCurrency(profile.account.merchantFunderEstablishmentFeeAmount)
        : '$0.00',
    },
    {
      label: 'Payment Frequency',
      value: profile?.account?.collectionFrequencyType || '-',
    },
    {
      label: 'Schedule Description',
      value: profile?.account?.collectionFrequencyTypeDescription || '-',
    },
  ]

  return (
    <>
      <Header />
      <Main>
        <div className='flex flex-1 flex-col gap-4 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800'>
          {/* User Profile Header */}

          <div className='flex flex-wrap items-end justify-between gap-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                Account Profile
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
              <TabsTrigger value='account'>Account Information</TabsTrigger>
              <TabsTrigger value='credit'>Credit Limit</TabsTrigger>
            </TabsList>

            <TabsContent value='account' className='mt-6'>
              <InfoCard title='Business Information' fields={businessFields} />
              <InfoCard title='Contact Information' fields={contactFields} />
            </TabsContent>

            <TabsContent value='credit' className='mt-6'>
              <InfoCard title='Cash Balance' fields={cashBalanceFields} />
              <InfoCard title='Funding Limits' fields={fundingLimitsFields} />
              <InfoCard
                title='Funding Parameters'
                fields={fundingParametersFields}
              />
            </TabsContent>
          </Tabs>
        </div>
      </Main>
      <Footer />
    </>
  )
}
