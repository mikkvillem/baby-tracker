// Flat, filled icon family drawn on one 24px grid with rounded joins, to match
// the mascot's soft geometric style. Each icon is a single `currentColor` fill
// plus cut-outs, so it follows the theme (including the monochrome Kindle one).
type IconProps = { size?: number; class?: string; strokeWidth?: number }

const base = (size = 24, cls?: string) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  class: cls,
  'aria-hidden': true
})

export function PawIcon({ size, class: cls }: IconProps) {
  return (
    <svg {...base(size, cls)}>
      <ellipse cx="12" cy="16.2" rx="5" ry="4" />
      <ellipse cx="5.2" cy="11" rx="2.1" ry="2.7" />
      <ellipse cx="9.4" cy="6.4" rx="2.1" ry="2.8" />
      <ellipse cx="14.6" cy="6.4" rx="2.1" ry="2.8" />
      <ellipse cx="18.8" cy="11" rx="2.1" ry="2.7" />
    </svg>
  )
}

export function HomeIcon({ size, class: cls }: IconProps) {
  return (
    <svg {...base(size, cls)}>
      <path d="M12 3.2 2.8 11.3a1 1 0 0 0 .66 1.75H5V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5.95h1.54a1 1 0 0 0 .66-1.75z" />
      <rect x="10" y="14" width="4" height="7" rx="1.2" fill="var(--color-surface-100)" opacity="0.9" />
    </svg>
  )
}

export function BookIcon({ size, class: cls }: IconProps) {
  return (
    <svg {...base(size, cls)}>
      <path d="M11 5.4C9.4 4.2 6.9 3.6 3.5 3.8A1 1 0 0 0 2.6 4.8v12.4c0 .6.5 1 1.1 1 3-.1 5.3.4 7.3 1.7z" />
      <path d="M13 5.4c1.6-1.2 4.1-1.8 7.5-1.6a1 1 0 0 1 .9 1v12.4c0 .6-.5 1-1.1 1-3-.1-5.3.4-7.3 1.7z" opacity="0.7" />
    </svg>
  )
}

export function LeafIcon({ size, class: cls }: IconProps) {
  return (
    <svg {...base(size, cls)}>
      <path d="M20.6 3.4c-8.8-.6-15.4 3.6-15.4 10.6 0 1.2.2 2.2.6 3.1L3.5 19.4a1 1 0 1 0 1.5 1.3l2.4-2.2c.9.4 1.9.6 3.1.6 7 0 10.4-6.9 10.1-15.7z" />
      <path d="M8 15.6c2.6-3.4 5.4-5.6 8.6-7" stroke="var(--color-surface-100)" stroke-width="1.4" stroke-linecap="round" fill="none" opacity="0.85" />
    </svg>
  )
}

export function GearIcon({ size, class: cls }: IconProps) {
  return (
    <svg {...base(size, cls)}>
      <path
        fill-rule="evenodd"
        d="M10.3 2.6h3.4l.5 2.5c.5.2 1 .5 1.5.8l2.4-.9 1.7 3-1.9 1.7c.1.6.1 1.1 0 1.7l1.9 1.7-1.7 3-2.4-.9c-.5.3-1 .6-1.5.8l-.5 2.5h-3.4l-.5-2.5c-.5-.2-1-.5-1.5-.8l-2.4.9-1.7-3 1.9-1.7a6 6 0 0 1 0-1.7L4.2 8.9l1.7-3 2.4.9c.5-.3 1-.6 1.5-.8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
      />
    </svg>
  )
}

export function CalendarIcon({ size, class: cls }: IconProps) {
  return (
    <svg {...base(size, cls)}>
      <path d="M7 2.8a1 1 0 0 1 1 1V5h8V3.8a1 1 0 1 1 2 0V5h.5A2.5 2.5 0 0 1 21 7.5V9H3V7.5A2.5 2.5 0 0 1 5.5 5H6V3.8a1 1 0 0 1 1-1z" />
      <path d="M3 10.5h18v8A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5z" opacity="0.7" />
    </svg>
  )
}
