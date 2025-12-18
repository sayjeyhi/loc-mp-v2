import { type QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  Outlet,
  useRouterState,
} from '@tanstack/react-router'
import { useEffect } from 'react'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import { GeneralError } from '@/features/errors/general-error'
import { NotFoundError } from '@/features/errors/not-found-error'
import { ThemeProvider } from '@/components/theme-provider'

function ScrollToTopOnRouteChange() {
  const location = useRouterState({ select: (s) => s.location })

  useEffect(() => {
    // If navigating to an anchor on the page, let the browser handle it.
    if (location.hash) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth'

    // Scroll the actual page scroller (usually html/body depending on browser).
    const scroller = document.scrollingElement as HTMLElement | null

    // Run after the route commit so the scroll doesn't get overridden by layout.
    requestAnimationFrame(() => {
      if (scroller) {
        scroller.scrollTo({ top: 0, left: 0, behavior })
      } else {
        window.scrollTo({ top: 0, left: 0, behavior })
      }
    })
  }, [location.href, location.hash])

  return null
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: () => {
    return (
      <ThemeProvider>
        <ScrollToTopOnRouteChange />
        <NavigationProgress />
        <Outlet />
        <Toaster duration={5000} />
        {/*{import.meta.env.MODE === 'development' && (*/}
        {/*  <>*/}
        {/*    <ReactQueryDevtools buttonPosition='bottom-left' />*/}
        {/*    <TanStackRouterDevtools position='bottom-right' />*/}
        {/*  </>*/}
        {/*)}*/}
      </ThemeProvider>
    )
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
