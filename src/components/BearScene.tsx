import type { Session } from '../app'
import { feedingSettings } from '../store/settings'
import { suggestNextFeeding } from '../utils/feedingPredictor'
import { useCurrentTime } from '../hooks/useCurrentTime'
import { translations } from '../i18n'

export type BearMood = 'idle' | 'hungry' | 'feeding'

type Props = {
  sessions: Session[]
  hasActiveSession: boolean
}

function deriveMood(sessions: Session[], hasActiveSession: boolean): BearMood {
  if (hasActiveSession) return 'feeding'
  const prediction = suggestNextFeeding(
    sessions,
    feedingSettings.value.intervalMinutes,
    feedingSettings.value.significantIntervalMinutes
  )
  const isOverdue = !!prediction.suggestedTime && prediction.suggestedTime.getTime() < Date.now()
  return isOverdue ? 'hungry' : 'idle'
}

// Mode C (Scene) illustration used as the home hero: a layered, poster-like
// den landscape (sky / far ridge / pines / hills) with the cub placed off
// centre. Flat fills only, one honey accent, and a faint grain for print
// texture. Colours come from the --art-* tokens so dark and Kindle themes
// restyle it without changes here. Only the cub's face, posture and prop
// change with mood.
const fill = (v: string) => ({ fill: `var(--art-${v})` })
const stroke = (v: string) => ({ stroke: `var(--art-${v})` })

function Pine({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} style={fill('ink')}>
      <path d="M0 -46 L13 -20 H6 L17 0 H-17 L-6 -20 H-13 Z" />
    </g>
  )
}

export function BearScene({ sessions, hasActiveSession }: Props) {
  useCurrentTime(60000)
  const mood = deriveMood(sessions, hasActiveSession)
  const t = translations.value.home.bearScene[mood]
  const isIdle = mood === 'idle'
  const isFeeding = mood === 'feeding'

  return (
    <div class="rounded-3xl overflow-hidden border border-surface-200 dark:border-surface-700" style={fill('paper')}>
      <svg viewBox="0 0 400 190" class="w-full h-auto block" role="img" aria-label={t}>
        <defs>
          <filter id="bear-scene-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.2 -0.04" />
          </filter>
        </defs>
        <rect width="400" height="190" style={fill('paper')} />

        {/* sun: big honey disc, cropped by the frame, top-left */}
        <circle cx="62" cy="40" r="46" style={fill('honey')} />

        {/* far slate ridge */}
        <path d="M150 128 L238 58 L292 104 L330 76 L400 126 V190 H150 Z" style={fill('slate')} />
        {/* pale moss hill */}
        <path d="M0 132 Q 90 100 190 128 T 400 118 V190 H0 Z" style={fill('far')} />

        {/* treeline, weighted left to balance the cub on the right */}
        <Pine x={22} y={140} s={1.25} />
        <Pine x={52} y={146} s={0.95} />
        <Pine x={84} y={142} s={1.1} />
        <Pine x={372} y={134} s={0.8} />

        {/* mid moss hill */}
        <path d="M0 158 Q 110 128 230 152 T 400 142 V190 H0 Z" style={fill('mid')} />
        {/* near forest ground */}
        <path d="M0 178 Q 140 160 260 174 T 400 168 V190 H0 Z" style={fill('near')} />

        {/* cub */}
        <g transform="translate(212 70)">
          {isIdle ? (
            <ellipse cx="52" cy="72" rx="62" ry="30" style={fill('bear')} />
          ) : (
            <ellipse cx="52" cy="76" rx="48" ry="38" style={fill('bear')} />
          )}
          {/* ears + head */}
          <circle cx="26" cy="10" r="12" style={fill('bear')} />
          <circle cx="78" cy="10" r="12" style={fill('bear')} />
          <circle cx="52" cy="34" r="34" style={fill('bear')} />
          <circle cx="26" cy="10" r="5" style={fill('bear-dark')} />
          <circle cx="78" cy="10" r="5" style={fill('bear-dark')} />
          {/* muzzle + nose */}
          <ellipse cx="52" cy="42" rx="17" ry="12" style={fill('muzzle')} />
          <ellipse cx="52" cy="39" rx="5" ry="3.6" style={fill('ink')} />

          {isIdle && (
            <>
              <path d="M32 28 q6 5 12 0" style={stroke('ink')} stroke-width="3" fill="none" stroke-linecap="round" />
              <path d="M60 28 q6 5 12 0" style={stroke('ink')} stroke-width="3" fill="none" stroke-linecap="round" />
              <text x="96" y="8" style={fill('text')} font-size="14" font-weight="700" opacity="0.7">
                Zzz
              </text>
            </>
          )}
          {mood === 'hungry' && (
            <>
              <circle cx="38" cy="27" r="3.4" style={fill('ink')} />
              <circle cx="66" cy="27" r="3.4" style={fill('ink')} />
              <ellipse cx="52" cy="49" rx="4" ry="4.6" style={fill('ink')} />
            </>
          )}
          {isFeeding && (
            <>
              <path d="M33 27 q5 -4 10 0" style={stroke('ink')} stroke-width="3" fill="none" stroke-linecap="round" />
              <path d="M61 27 q5 -4 10 0" style={stroke('ink')} stroke-width="3" fill="none" stroke-linecap="round" />
            </>
          )}

          {/* honey pot: empty outline when hungry, full (the accent) when feeding */}
          {mood === 'hungry' && (
            <g transform="translate(-40 58)" style={stroke('ink')} stroke-width="3" fill="none" stroke-linejoin="round">
              <path d="M2 20 q0 -15 15 -15 t15 15 v10 q0 7 -15 7 t-15 -7 z" />
            </g>
          )}
          {isFeeding && (
            <g transform="translate(-40 58)">
              <path d="M2 20 q0 -15 15 -15 t15 15 v10 q0 7 -15 7 t-15 -7 z" style={fill('honey')} />
              <rect x="6" y="2" width="22" height="6" rx="3" style={fill('ink')} />
              <path d="M9 21 q8 6 16 0" style={stroke('muzzle')} stroke-width="3" fill="none" stroke-linecap="round" />
            </g>
          )}
        </g>

        {/* print grain */}
        <rect width="400" height="190" filter="url(#bear-scene-grain)" opacity="0.4" style={{ mixBlendMode: 'multiply', pointerEvents: 'none' }} />
      </svg>
      <p class="text-center text-sm font-medium text-surface-700 dark:text-surface-200 py-2.5 m-0 border-t border-surface-200/70 dark:border-surface-700">
        {t}
      </p>
    </div>
  )
}
