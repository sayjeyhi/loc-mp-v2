import { createFileRoute } from '@tanstack/react-router'
import { SettingsCreditLimit } from '@/features/settings/credit-limit'

export const Route = createFileRoute('/_authenticated/settings/credit-limit')({
  component: SettingsCreditLimit,
})
