import { createFileRoute, redirect } from '@tanstack/react-router'
import { ForgotPassword } from '@/features/auth/forgot-password'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/(auth)/forgot-password')({
  beforeLoad: async () => {
    const { session } = useAuthStore.getState()

    // If user is already authenticated, redirect to home
    if (session.signedIn && session.token) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: ForgotPassword,
})
