import { createFileRoute, redirect } from '@tanstack/react-router'
import { Otp } from '@/features/auth/otp'
import { useAuthStore } from '@/store/authStore';

export const Route = createFileRoute('/(auth)/otp')({
  beforeLoad: async () => {
    const { isAuthenticated, user } = useAuthStore.getState()

    // If user is already fully authenticated, redirect to home
    if (isAuthenticated && user?.token) {
      throw redirect({
        to: '/',
      })
    }

    // If user hasn't started login process, redirect to sign-in
    if (!user?.username) {
      throw redirect({
        to: '/sign-in',
      })
    }
  },
  component: Otp,
})
