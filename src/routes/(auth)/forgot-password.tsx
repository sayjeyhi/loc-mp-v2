import { createFileRoute, redirect } from '@tanstack/react-router'
import { ForgotPassword } from '@/features/auth/forgot-password'
import { useAuthStore } from '@/store/authStore';

export const Route = createFileRoute('/(auth)/forgot-password')({
  beforeLoad: async () => {
    const { isAuthenticated, user } = useAuthStore.getState()

    // If user is already authenticated, redirect to home
    if (isAuthenticated && user?.token) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: ForgotPassword,
})
