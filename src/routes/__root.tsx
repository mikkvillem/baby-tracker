import { createRootRoute, Link, Outlet, useNavigate, useMatches } from '@tanstack/react-router'
import { Home, Clock, Sparkles, Settings } from 'lucide-preact'
import { useFeedingNotificationScheduler } from '../hooks/useFeedingNotificationScheduler'
import { InstallPwaBanner } from '../components/InstallPwaBanner'
import '../app.css'

function AppShell() {
  useFeedingNotificationScheduler()
  const navigate = useNavigate()
  const matches = useMatches()
  const currentPath = matches[matches.length - 1]?.pathname ?? '/'

  const isActiveSession = currentPath.includes('/active')

  return (
    <div class="min-h-screen bg-surface-100 dark:bg-surface-900 flex flex-col">
      {/* Header */}
      <header class="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 px-4 py-3 flex items-center gap-3 shrink-0">
        <Link to="/" class="flex items-center gap-3 no-underline">
          <img id="app-logo" src="/logo.svg" alt="" class="w-8 h-8" />
          <h1 class="text-lg font-semibold text-surface-800 dark:text-surface-100 m-0">Baby Tracker</h1>
        </Link>
      </header>

      <InstallPwaBanner />

      {/* Content */}
      <main class="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Tab Bar - hidden during active session */}
      {!isActiveSession && (
        <nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 flex items-center justify-around px-2 py-1 z-50 safe-area-bottom">
          <button
            class={`flex flex-col items-center gap-0.5 py-2 px-4 rounded-lg transition-colors duration-200 border-none bg-transparent cursor-pointer ${
              currentPath === '/'
                ? 'text-primary-500 dark:text-primary-300'
                : 'text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300'
            }`}
            onClick={() => navigate({ to: '/' })}
          >
            <Home size={22} strokeWidth={currentPath === '/' ? 2.5 : 2} />
            <span class="text-[11px] font-medium">Home</span>
          </button>

          <button
            class={`flex flex-col items-center gap-0.5 py-2 px-4 rounded-lg transition-colors duration-200 border-none bg-transparent cursor-pointer ${
              currentPath === '/history'
                ? 'text-primary-500 dark:text-primary-300'
                : 'text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300'
            }`}
            onClick={() => navigate({ to: '/history' })}
          >
            <Clock size={22} strokeWidth={currentPath === '/history' ? 2.5 : 2} />
            <span class="text-[11px] font-medium">History</span>
          </button>

          <button
            class={`flex flex-col items-center gap-0.5 py-2 px-4 rounded-lg transition-colors duration-200 border-none bg-transparent cursor-pointer ${
              currentPath === '/report'
                ? 'text-primary-500 dark:text-primary-300'
                : 'text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300'
            }`}
            onClick={() => navigate({ to: '/report' })}
          >
            <Sparkles size={22} strokeWidth={currentPath === '/report' ? 2.5 : 2} />
            <span class="text-[11px] font-medium">Report</span>
          </button>

          <button
            class={`flex flex-col items-center gap-0.5 py-2 px-4 rounded-lg transition-colors duration-200 border-none bg-transparent cursor-pointer ${
              currentPath === '/settings'
                ? 'text-primary-500 dark:text-primary-300'
                : 'text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300'
            }`}
            onClick={() => navigate({ to: '/settings' })}
          >
            <Settings size={22} strokeWidth={currentPath === '/settings' ? 2.5 : 2} />
            <span class="text-[11px] font-medium">Settings</span>
          </button>
        </nav>
      )}
    </div>
  )
}

export const Route = createRootRoute({
  component: AppShell
})
