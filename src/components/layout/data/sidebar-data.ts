import {
  LayoutDashboard,
  FileTextIcon,
  UserCog,
  ShieldCheck,
  User,
  DollarSign,
  ArrowDownUp,
  ReceiptText,
  Globe,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'A1235923',
    email: 'test@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'A21395922',
      logo: User,
      plan: 'LOC test 1',
    },
    {
      name: 'A21395922',
      logo: User,
      plan: 'LOC test 2',
    },
    {
      name: 'A21395922',
      logo: User,
      plan: 'LOC test 3',
    },
  ],
  navGroups: [
    {
      title: 'Navigation',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Contracts',
          url: '/contracts',
          icon: FileTextIcon,
        },
        {
          title: 'Activity',
          url: '/transactions-history',
          icon: DollarSign,
        },
        {
          title: 'Payments',
          url: '/transactions-history',
          icon: ArrowDownUp,
        },
        {
          title: 'Profile',
          url: '/settings',
          icon: UserCog,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Privacy Policy',
          url: '/help-center',
          icon: ShieldCheck,
        },
        {
          title: 'Terms of Service',
          url: '/help-center',
          icon: ReceiptText,
        },
        {
          title: 'Website',
          url: '/help-center',
          icon: Globe,
        },
      ],
    },
  ],
}
