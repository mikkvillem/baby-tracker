import { Download, X } from 'lucide-preact'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { translations } from '../i18n'

export function InstallPwaBanner() {
  const { canInstall, promptInstall, dismiss } = useInstallPrompt()
  const t = translations.value.installBanner

  if (!canInstall) return null

  return (
    <div class="flex items-center gap-3 bg-primary-50 dark:bg-primary-500/10 border border-primary-500/30 text-primary-700 dark:text-primary-300 rounded-xl px-4 py-3 mx-4 mt-3 text-sm">
      <Download size={18} class="shrink-0" />
      <span class="flex-1">{t.message}</span>
      <button
        class="shrink-0 bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium rounded-lg px-3 py-1.5 border-none cursor-pointer transition-colors duration-200"
        onClick={promptInstall}
      >
        {t.install}
      </button>
      <button
        class="shrink-0 bg-transparent border-none text-primary-500 dark:text-primary-300 hover:text-primary-600 dark:hover:text-primary-200 cursor-pointer p-0"
        onClick={dismiss}
        aria-label={t.dismiss}
      >
        <X size={14} />
      </button>
    </div>
  )
}
