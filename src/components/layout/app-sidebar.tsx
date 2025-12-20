import {
  ArrowDownUp,
  DollarSign,
  FileTextIcon,
  Globe,
  LayoutDashboard,
  ReceiptText,
  ShieldCheck,
  UserCog,
} from 'lucide-react'
import { useLayout } from '@/context/layout-provider'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { useCompanySettings } from '@/hooks/use-company-settings'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

export function AppSidebar() {
  const { collapsible } = useLayout()
  const company = useCompanySettings()
  const { getLocalizedValue } = useCompanyLocalizations()

  const termsAndConditionsLink =
    company?.settings?.find(
      (setting) => setting.setting.title === 'Terms and Conditions link'
    )?.value || '#'

  const privacyAndPolicyLink =
    company?.settings?.find(
      (setting) => setting.setting.title === 'Privacy Policy link'
    )?.value || '#'

  const footerLinkLabel =
    company?.settings?.find(
      (setting) => setting.setting.title === 'Footer Link Label'
    )?.value || ''

  const footerLinkValue =
    company?.settings?.find(
      (setting) => setting.setting.title === 'Footer Link Value'
    )?.value || ''

  const otherItems = [
    {
      title: getLocalizedValue('PRIVACY_POLICY_LABEL'),
      url: privacyAndPolicyLink,
      icon: ShieldCheck,
    },
    {
      title: getLocalizedValue('TERMS_AND_CONDITIONS_LABEL'),
      url: termsAndConditionsLink,
      icon: ReceiptText,
    },
  ]

  if (footerLinkLabel && footerLinkValue) {
    otherItems.push({
      title: footerLinkLabel,
      url: footerLinkValue,
      icon: Globe,
    })
  }

  const sidebarItems = [
    {
      title: 'Navigation',
      items: [
        {
          title: getLocalizedValue('SIDE_BAR_MENU_ITEM_DASHBOARD'),
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: getLocalizedValue('CONTRACTS_TITLE'),
          url: '/contracts',
          icon: FileTextIcon,
        },
        {
          title: getLocalizedValue('ACTIVITY_TITLE'),
          url: '/activity',
          icon: DollarSign,
        },
        {
          title: getLocalizedValue('PAYMENTS_TITLE'),
          url: '/payments',
          icon: ArrowDownUp,
        },
        {
          title: getLocalizedValue('PROFILE_TITLE'),
          url: '/profile',
          icon: UserCog,
        },
      ],
    },
    {
      title: 'Other',
      items: otherItems,
    },
  ]

  return (
    <Sidebar collapsible={collapsible} variant='sidebar'>
      <SidebarHeader>
        <TeamSwitcher />

        {/* Replace <TeamSwitch /> with the following <AppTitle />
         /* if you want to use the normal app title instead of TeamSwitch dropdown */}
        {/* <AppTitle /> */}
      </SidebarHeader>
      <SidebarContent>
        {sidebarItems.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
