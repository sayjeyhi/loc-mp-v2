import { ContentSection } from '../components/content-section'
import { CreditLimitForm } from './credit-limit-form'

export function SettingsCreditLimit() {
  return (
    <ContentSection
      title='Credit Limit'
      desc='Manage your credit limit settings.'
    >
      <CreditLimitForm />
    </ContentSection>
  )
}
