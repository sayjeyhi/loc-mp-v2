import { createFileRoute, redirect } from '@tanstack/react-router'
import { Otp } from '@/features/auth/otp'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/(auth)/otp')({
  beforeLoad: async () => {
    const { session, user } = useAuthStore.getState()

    // If user is already fully authenticated, redirect to home
    if (session.signedIn && session.token) {
      throw redirect({
        to: '/',
      })
    }

    // If user hasn't started login process, redirect to sign-in
    if (!user.username) {
      throw redirect({
        to: '/sign-in',
      })
    }
  },
  component: Otp,
})
