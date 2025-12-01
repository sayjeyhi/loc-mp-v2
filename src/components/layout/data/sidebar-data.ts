import {
  LayoutDashboard,
  FileTextIcon,
  UserCog,
  ShieldCheck,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  DollarSign,
  ArrowDownUp,
  ReceiptText,
  Globe
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'A1235923',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
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
