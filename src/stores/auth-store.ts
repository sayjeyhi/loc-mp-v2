import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'token'
const TOKEN_FOR_OTP = 'tokenForOtp'

interface AuthUser {
  username?: string
  channel?: string
  authority?: string[]
  acctId?: string
  sessionId?: string
  setPassword?: boolean
  password?: string
  isFromLogin?: boolean
  isAdmin?: boolean
  isAdminAuthNotification?: boolean
  firstName?: string
  lastName?: string
  token?: string | null
  id?: number | null
  tokenExpireTime?: number | null
  tokenForOtp?: string | null
}

interface SessionState {
  signedIn: boolean
  token: string | null
}

interface AuthState {
  user: AuthUser
  session: SessionState
  setUser: (user: Partial<AuthUser>) => void
  signInSuccess: (token: string) => void
  signOutSuccess: () => void
  reset: () => void
}

const initialUserState: AuthUser = {
  username: '',
  channel: '',
  acctId: '',
  authority: [],
  sessionId: '',
  password: '',
  isFromLogin: false,
  isAdmin: false,
  isAdminAuthNotification: false,
  firstName: '',
  lastName: '',
  token: null,
  id: null,
  tokenExpireTime: null,
  tokenForOtp: null,
}

const initialSessionState: SessionState = {
  signedIn: false,
  token: null,
}

export const useAuthStore = create<AuthState>()((set) => {
  // Initialize token from cookie
  const cookieToken = getCookie(ACCESS_TOKEN)
  const initToken = cookieToken ? JSON.parse(cookieToken) : null

  return {
    user: initialUserState,
    session: {
      signedIn: !!initToken,
      token: initToken,
    },
    setUser: (userData) =>
      set((state) => ({
        user: { ...state.user, ...userData },
      })),
    signInSuccess: (token) =>
      set((state) => {
        setCookie(ACCESS_TOKEN, JSON.stringify(token))
        return {
          session: {
            signedIn: true,
            token,
          },
          user: { ...state.user, token },
        }
      }),
    signOutSuccess: () =>
      set(() => {
        removeCookie(ACCESS_TOKEN)
        removeCookie(TOKEN_FOR_OTP)
        return {
          session: initialSessionState,
          user: initialUserState,
        }
      }),
    reset: () =>
      set(() => {
        removeCookie(ACCESS_TOKEN)
        removeCookie(TOKEN_FOR_OTP)
        return {
          user: initialUserState,
          session: initialSessionState,
        }
      }),
  }
})
