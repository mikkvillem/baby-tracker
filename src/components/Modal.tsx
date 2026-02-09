import type { ComponentChildren } from 'preact'

type Props = {
  title: string
  onClose: () => void
  children: ComponentChildren
}

export function Modal({ title, onClose, children }: Props) {
  return (
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={onClose}>
      <div
        class="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 class="m-0 mb-5 text-xl font-semibold">{title}</h2>
        {children}
      </div>
    </div>
  )
}
