type Props = {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  ariaLabel?: string
}

export function Switch({ checked, onChange, disabled, ariaLabel }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      class={`relative w-11 h-6 rounded-full transition-colors duration-200 border-none cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${
        checked ? 'bg-primary-500' : 'bg-surface-300 dark:bg-surface-600'
      }`}
    >
      <span
        class={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
