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

// Flat-vector cub-in-a-den illustration used as the home screen hero. The
// same base bear shape is reused across moods; only the face, posture and a
// small prop change to keep the three states visually consistent.
export function BearScene({ sessions, hasActiveSession }: Props) {
  useCurrentTime(60000)
  const mood = deriveMood(sessions, hasActiveSession)
  const t = translations.value.home.bearScene[mood]
  const isIdle = mood === 'idle'
  const isFeeding = mood === 'feeding'

  return (
    <div class="rounded-2xl overflow-hidden bg-gradient-to-b from-primary-100 to-primary-50 dark:from-surface-800 dark:to-surface-800 border border-primary-200/60 dark:border-surface-700">
      <svg viewBox="0 0 400 190" class="w-full h-auto block" role="img" aria-label={t}>
        {/* sky + sun/moon */}
        <circle cx="340" cy="42" r="26" class="fill-primary-200 dark:fill-primary-900/60" opacity="0.8" />
        <circle cx="340" cy="42" r="14" class="fill-primary-300 dark:fill-primary-700" opacity="0.9" />

        {/* rolling den hill */}
        <path
          d="M0 140 Q 100 110 200 132 T 400 122 V 190 H 0 Z"
          class="fill-side-left-100 dark:fill-side-left-900/30"
          opacity="0.6"
        />
        <path
          d="M0 165 Q 120 145 240 162 T 400 150 V 190 H 0 Z"
          class="fill-[#3f7d4a] dark:fill-[#2c5a37]"
          opacity="0.45"
        />

        {/* cub */}
        <g transform="translate(150 78)">
          {/* body — lying down when idle, upright otherwise */}
          {isIdle ? (
            <ellipse cx="52" cy="72" rx="62" ry="30" class="fill-primary-400 dark:fill-primary-600" />
          ) : (
            <ellipse cx="52" cy="76" rx="48" ry="38" class="fill-primary-400 dark:fill-primary-600" />
          )}

          {/* head */}
          <circle cx="52" cy="34" r="34" class="fill-primary-400 dark:fill-primary-600" />
          {/* ears */}
          <circle cx="26" cy="10" r="12" class="fill-primary-400 dark:fill-primary-600" />
          <circle cx="78" cy="10" r="12" class="fill-primary-400 dark:fill-primary-600" />
          <circle cx="26" cy="10" r="5.5" class="fill-primary-200 dark:fill-primary-800" />
          <circle cx="78" cy="10" r="5.5" class="fill-primary-200 dark:fill-primary-800" />
          {/* muzzle */}
          <ellipse cx="52" cy="42" rx="17" ry="12" class="fill-primary-100 dark:fill-primary-200" />
          <ellipse cx="52" cy="40" rx="4.5" ry="3.4" class="fill-surface-800" />

          {/* eyes + mouth by mood */}
          {isIdle && (
            <>
              <path d="M32 28 q6 5 12 0" class="stroke-surface-800" stroke-width="2.4" fill="none" stroke-linecap="round" />
              <path d="M60 28 q6 5 12 0" class="stroke-surface-800" stroke-width="2.4" fill="none" stroke-linecap="round" />
              <text x="94" y="10" class="fill-surface-500 dark:fill-surface-300" font-size="14" font-weight="600">Zzz</text>
            </>
          )}
          {mood === 'hungry' && (
            <>
              <circle cx="38" cy="27" r="3" class="fill-surface-800" />
              <circle cx="66" cy="27" r="3" class="fill-surface-800" />
              <ellipse cx="52" cy="48" rx="4" ry="5" class="fill-surface-800" />
            </>
          )}
          {isFeeding && (
            <>
              <path d="M33 27 q5 -4 10 0" class="stroke-surface-800" stroke-width="2.4" fill="none" stroke-linecap="round" />
              <path d="M61 27 q5 -4 10 0" class="stroke-surface-800" stroke-width="2.4" fill="none" stroke-linecap="round" />
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
              <path d="M2 20 q0 -15 15 -15 t15 15 v10 q0 7 -15 7 t-15 -7 z" class="fill-primary-500 dark:fill-primary-400" />
              <path d="M8 5 h18" class="stroke-primary-600 dark:stroke-primary-700" stroke-width="3" stroke-linecap="round" />
              <path d="M9 22 q8 6 16 0" class="stroke-primary-100" stroke-width="2" fill="none" stroke-linecap="round" />
            </g>
          )}
        </g>
      </svg>
      <p class="text-center text-sm font-medium text-surface-600 dark:text-surface-300 py-2.5 m-0 bg-white/50 dark:bg-black/10">
        {t}
      </p>
    </div>
  )
}
