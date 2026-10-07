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

// Flat-vector cub-in-a-valley illustration used as the home screen hero,
// drawn with the Bear App palette: honey sun, teal/sky mountains, forest
// trees, moss hills. The same base bear is reused across moods; only the
// face, posture and a small prop change so the three states stay consistent.
export function BearScene({ sessions, hasActiveSession }: Props) {
  useCurrentTime(60000)
  const mood = deriveMood(sessions, hasActiveSession)
  const t = translations.value.home.bearScene[mood]
  const isIdle = mood === 'idle'
  const isFeeding = mood === 'feeding'
  const ink = 'stroke-surface-700 dark:stroke-surface-900'

  return (
    <div class="rounded-3xl overflow-hidden bg-surface-200 dark:bg-surface-800">
      <svg viewBox="0 0 400 190" class="w-full h-auto block" role="img" aria-label={t}>
        {/* sun */}
        <circle cx="318" cy="52" r="30" class="fill-warning-500" />

        {/* mountains */}
        <path d="M30 150 L110 62 L190 150 Z" class="fill-side-left-500 dark:fill-side-left-600" opacity="0.85" />
        <path d="M110 62 L128 82 L110 78 L96 84 Z" class="fill-white dark:fill-surface-200" opacity="0.85" />
        <path d="M200 150 L275 82 L360 150 Z" class="fill-sky dark:fill-side-left-600" opacity="0.9" />

        {/* hills */}
        <path d="M0 140 Q 100 116 200 134 T 400 124 V 190 H 0 Z" class="fill-side-right-500" opacity="0.8" />
        <path d="M0 166 Q 120 148 240 164 T 400 154 V 190 H 0 Z" class="fill-primary-500 dark:fill-primary-400" />

        {/* trees */}
        <g class="fill-primary-500 dark:fill-primary-400">
          <path d="M34 150 l14 -34 l14 34 z" />
          <path d="M40 132 l8 -22 l8 22 z" />
          <path d="M352 150 l12 -30 l12 30 z" />
          <path d="M357 134 l7 -20 l7 20 z" />
        </g>

        {/* cub */}
        <g transform="translate(150 78)">
          {/* body — lying down when idle, upright otherwise */}
          {isIdle ? (
            <>
              <ellipse cx="52" cy="72" rx="62" ry="30" class="fill-bear" />
              <ellipse cx="52" cy="78" rx="34" ry="16" class="fill-bear-belly" />
            </>
          ) : (
            <>
              <ellipse cx="52" cy="76" rx="48" ry="38" class="fill-bear" />
              <ellipse cx="52" cy="82" rx="28" ry="26" class="fill-bear-belly" />
            </>
          )}

          {/* head, ears */}
          <circle cx="52" cy="34" r="34" class="fill-bear" />
          <circle cx="26" cy="10" r="12" class="fill-bear" />
          <circle cx="78" cy="10" r="12" class="fill-bear" />
          <circle cx="26" cy="10" r="5.5" class="fill-bear-belly" />
          <circle cx="78" cy="10" r="5.5" class="fill-bear-belly" />
          {/* muzzle */}
          <ellipse cx="52" cy="42" rx="17" ry="12" class="fill-bear-belly" />
          <ellipse cx="52" cy="40" rx="4.5" ry="3.4" class="fill-surface-700 dark:fill-surface-900" />

          {/* eyes + mouth by mood */}
          {isIdle && (
            <>
              <path d="M32 28 q6 5 12 0" class={ink} stroke-width="2.4" fill="none" stroke-linecap="round" />
              <path d="M60 28 q6 5 12 0" class={ink} stroke-width="2.4" fill="none" stroke-linecap="round" />
              <text x="94" y="10" class="fill-surface-500 dark:fill-surface-300" font-size="14" font-weight="600">Zzz</text>
            </>
          )}
          {mood === 'hungry' && (
            <>
              <circle cx="38" cy="27" r="3" class="fill-surface-700 dark:fill-surface-900" />
              <circle cx="66" cy="27" r="3" class="fill-surface-700 dark:fill-surface-900" />
              <path d="M46 49 q6 5 12 0" class={ink} stroke-width="2.2" fill="none" stroke-linecap="round" />
            </>
          )}
          {isFeeding && (
            <>
              <path d="M33 27 q5 -4 10 0" class={ink} stroke-width="2.4" fill="none" stroke-linecap="round" />
              <path d="M61 27 q5 -4 10 0" class={ink} stroke-width="2.4" fill="none" stroke-linecap="round" />
              <path d="M46 48 q6 6 12 0" class={ink} stroke-width="2.2" fill="none" stroke-linecap="round" />
            </>
          )}

          {/* honey pot prop — empty outline when hungry, full when feeding */}
          {mood === 'hungry' && (
            <g transform="translate(-38 60)" class="stroke-surface-400 dark:stroke-surface-500" stroke-width="2" fill="none">
              <path d="M2 18 q0 -14 14 -14 t14 14 v10 q0 6 -14 6 t-14 -6 z" />
              <path d="M8 4 h16" />
            </g>
          )}
          {isFeeding && (
            <g transform="translate(-40 56)">
              <path d="M2 20 q0 -15 15 -15 t15 15 v10 q0 7 -15 7 t-15 -7 z" class="fill-warning-500" />
              <path d="M8 5 h18" class="stroke-warning-600" stroke-width="3" stroke-linecap="round" />
              <path d="M9 22 q8 6 16 0" class="stroke-warning-50" stroke-width="2" fill="none" stroke-linecap="round" />
            </g>
          )}
        </g>
      </svg>
      <p class="text-center text-sm font-medium text-surface-600 dark:text-surface-300 pb-3 m-0">
        {t}
      </p>
    </div>
  )
}
