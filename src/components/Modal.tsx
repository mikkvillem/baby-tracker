import type { ComponentChildren } from 'preact'
import { X } from 'lucide-preact'

type Props = {
  title: string
  onClose: () => void
  children: ComponentChildren
}

export function Modal({ title, onClose, children }: Props) {
  return (
    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-[1000]" onClick={onClose}>
      <div
        class="bg-white dark:bg-surface-800 rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 w-full sm:max-w-md shadow-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div class="flex items-center justify-between mb-5">
          <h2 class="m-0 text-lg font-semibold text-surface-800 dark:text-surface-100">{title}</h2>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-full bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400 border-none cursor-pointer hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
