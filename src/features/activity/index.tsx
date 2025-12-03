import { Footer } from '@/components/layout/footer.tsx'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import { TasksProvider } from './components/tasks-provider'

export function Activity() {
  return (
    <TasksProvider>
      <Header />

      <Main>
        <div className='flex flex-1 flex-col gap-4 rounded-lg bg-white p-6 shadow-sm sm:gap-6 dark:bg-gray-800'>
          <div className='flex flex-wrap items-end justify-between gap-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>Activity</h2>
            </div>
            <TasksPrimaryButtons />
          </div>

          <div className='flex h-96 items-center justify-center rounded-md border border-dashed border-gray-200 text-center text-gray-300 dark:border-gray-400 dark:text-gray-300'>
            {/* Payments content goes here */}
            <p className='text-2xl font-extrabold'>
              Activity will be displayed.
            </p>
          </div>
        </div>
      </Main>

      <TasksDialogs />

      <Footer />
    </TasksProvider>
  )
}
