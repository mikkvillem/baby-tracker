import { translations } from '../i18n'

type Props = {
  value: 'left' | 'right'
  onChange: (side: 'left' | 'right') => void
  label?: string
}

export function SideSelector({ value, onChange, label }: Props) {
  const t = translations.value.sideSelector
  return (
    <div class="mb-4">
      <label class="block text-sm font-medium mb-2 text-surface-600 dark:text-surface-400">{label ?? t.label}</label>
      <div class="flex gap-2">
        <button
          type="button"
          class={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 border-2 ${
            value === 'left'
              ? 'bg-side-left-50 dark:bg-side-left-500/15 border-side-left-500 text-side-left-600 dark:text-side-left-500'
              : 'bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-surface-300'
          }`}
          onClick={() => onChange('left')}
        >
          {t.left}
        </button>
        <button
          type="button"
          class={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 border-2 ${
            value === 'right'
              ? 'bg-side-right-50 dark:bg-side-right-500/15 border-side-right-500 text-side-right-600 dark:text-side-right-500'
              : 'bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-surface-300'
          }`}
          onClick={() => onChange('right')}
        >
          {t.right}
        </button>
      </div>
    </div>
  )
}
