import { createRootRoute, Link, Outlet, useNavigate, useMatches } from '@tanstack/react-router'
import { Home, Clock, Sparkles, Settings } from 'lucide-preact'
import { useFeedingNotificationScheduler } from '../hooks/useFeedingNotificationScheduler'
import { InstallPwaBanner } from '../components/InstallPwaBanner'
import { translations } from '../i18n'
import '../app.css'

function AppShell() {
  useFeedingNotificationScheduler()
  const navigate = useNavigate()
  const t = translations.value.nav
  const matches = useMatches()
  const currentPath = matches[matches.length - 1]?.pathname ?? '/'

  const isActiveSession = currentPath.includes('/active')

  return (
    <div class="min-h-screen sm:min-h-0 sm:h-[calc(100vh-3rem)] max-w-md sm:mx-auto sm:my-6 bg-surface-100 dark:bg-surface-900 flex flex-col sm:rounded-3xl sm:shadow-2xl sm:overflow-hidden sm:border sm:border-surface-200 dark:sm:border-surface-700">
      {/* Header */}
      <header class="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 px-4 py-3 flex items-center gap-3 shrink-0">
        <Link to="/" class="flex items-center gap-3 no-underline">
          <img id="app-logo" src="/logo.svg" alt="" class="w-8 h-8" />
          <h1 class="text-lg font-semibold text-surface-800 dark:text-surface-100 m-0">Baby Tracker</h1>
        </Link>
      </header>

      <InstallPwaBanner />

      {/* Content */}
      <main class="flex-1 min-h-0 overflow-y-auto pb-20 sm:pb-0">
        <Outlet />
      </main>

      {/* Bottom Tab Bar - hidden during active session */}
      {!isActiveSession && (
        <nav class="fixed sm:relative bottom-0 sm:bottom-auto left-0 right-0 sm:left-auto sm:right-auto bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 flex items-center justify-around px-2 py-1 z-50 safe-area-bottom">
          <button
            class={`flex flex-col items-center gap-0.5 py-2 px-4 rounded-lg transition-colors duration-200 border-none bg-transparent cursor-pointer ${
              currentPath === '/'
                ? 'text-primary-500 dark:text-primary-300'
                : 'text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300'
            }`}
            onClick={() => navigate({ to: '/' })}
          >
            <Home size={22} strokeWidth={currentPath === '/' ? 2.5 : 2} />
            <span class="text-[11px] font-medium">{t.home}</span>
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
            <span class="text-[11px] font-medium">{t.history}</span>
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
            <span class="text-[11px] font-medium">{t.report}</span>
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
            <span class="text-[11px] font-medium">{t.settings}</span>
          </button>
        </nav>
      )}
    </div>
  )
}

export const Route = createRootRoute({
  component: AppShell
})
