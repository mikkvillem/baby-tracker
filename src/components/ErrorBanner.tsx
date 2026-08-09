import { AlertTriangle, X } from 'lucide-preact'

type ErrorBannerProps = {
  message: string
  onDismiss?: () => void
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div class="flex items-start gap-2.5 bg-danger-50 dark:bg-danger-500/10 border border-danger-500/30 text-danger-600 rounded-xl px-4 py-3 text-sm">
      <AlertTriangle size={16} class="shrink-0 mt-0.5" />
      <span class="flex-1">{message}</span>
      {onDismiss && (
        <button
          class="shrink-0 bg-transparent border-none text-danger-500 hover:text-danger-600 cursor-pointer p-0"
          onClick={onDismiss}
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
