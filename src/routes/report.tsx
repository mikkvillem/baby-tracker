import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'preact/hooks'
import { initDB, loadMiscEvents, loadSessions } from '../db'
import type { MiscEvent, Session } from '../app'
import { buildReportPrompt, type ReportRangeDays, type ReportType } from '../utils/reportPrompt'
import { reportNotes, setReportNotes } from '../store/reportNotes'
import { ErrorBanner } from '../components/ErrorBanner'
import { Check, Copy, NotebookPen, Sparkles } from 'lucide-preact'
import { translations, type TranslationDict } from '../i18n'

export const Route = createFileRoute('/report')({
  component: ReportRoute
})

const getReportTypes = (t: TranslationDict['report']): { id: ReportType; label: string; description: string }[] => [
  { id: 'feeding', label: t.feeding, description: t.feedingDescription },
  { id: 'measurements', label: t.measurements, description: t.measurementsDescription }
]

const RANGE_DAYS: ReportRangeDays[] = [3, 7, 14, 30]

const pillClass = (isActive: boolean) =>
  `px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 border ${
    isActive
      ? 'bg-primary-500 border-primary-500 text-white'
      : 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:border-surface-300 dark:hover:border-surface-600'
  }`

function ReportRoute() {
  const t = translations.value.report
  const REPORT_TYPES = getReportTypes(t)
  const [sessions, setSessions] = useState<Session[]>([])
  const [miscEvents, setMiscEvents] = useState<MiscEvent[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedTypes, setSelectedTypes] = useState<ReportType[]>(['feeding', 'measurements'])
  const [rangeDays, setRangeDays] = useState<ReportRangeDays>(7)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  useEffect(() => {
    initDB()
      .then(() => Promise.all([loadSessions(), loadMiscEvents()]))
      .then(([loadedSessions, loadedEvents]) => {
        setSessions(loadedSessions)
        setMiscEvents(loadedEvents)
        setError(null)
      })
      .catch(err => {
        console.error('Failed to load data for report:', err)
        setError(t.errorLoad)
      })
  }, [])

  const toggleType = (type: ReportType) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const prompt = useMemo(
    () => buildReportPrompt(sessions, miscEvents, { types: selectedTypes, rangeDays, personalNotes: reportNotes.value }),
    [sessions, miscEvents, selectedTypes, rangeDays, reportNotes.value]
  )

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopyStatus('copied')
    } catch (err) {
      console.error('Failed to copy report prompt:', err)
      setCopyStatus('error')
    }
    setTimeout(() => setCopyStatus('idle'), 2500)
  }

  return (
    <div class="max-w-lg mx-auto px-4 pt-4 pb-6 flex flex-col gap-4">
      <div>
        <h1 class="m-0 text-xl font-semibold text-surface-800 dark:text-surface-100">{t.title}</h1>
        <p class="m-0 mt-1 text-xs text-surface-500">
          {t.subtitle}
        </p>
      </div>

      {error && <ErrorBanner message={error} />}

      <div class="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl p-4 flex flex-col gap-3">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/15 flex items-center justify-center shrink-0">
            <Sparkles size={16} class="text-primary-500 dark:text-primary-300" />
          </div>
          <div>
            <h2 class="m-0 text-sm font-semibold text-surface-800 dark:text-surface-100">{t.reportTypes}</h2>
            <p class="m-0 text-xs text-surface-500">{t.chooseWhatToInclude}</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          {REPORT_TYPES.map(type => (
            <button
              key={type.id}
              type="button"
              class={pillClass(selectedTypes.includes(type.id))}
              onClick={() => toggleType(type.id)}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div>
          <label class="block text-xs font-medium mb-1.5 text-surface-500">{t.timePeriod}</label>
          <div class="flex flex-wrap gap-2">
            {RANGE_DAYS.map(days => (
              <button
                key={days}
                type="button"
                class={pillClass(rangeDays === days)}
                onClick={() => setRangeDays(days)}
              >
                {t.days({ n: days })}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl p-4 flex flex-col gap-3">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/15 flex items-center justify-center shrink-0">
            <NotebookPen size={16} class="text-primary-500 dark:text-primary-300" />
          </div>
          <div>
            <h2 class="m-0 text-sm font-semibold text-surface-800 dark:text-surface-100">{t.personalNotes}</h2>
            <p class="m-0 text-xs text-surface-500">{t.personalNotesDescription}</p>
          </div>
        </div>

        <textarea
          value={reportNotes.value}
          onInput={(e) => setReportNotes((e.target as HTMLTextAreaElement).value)}
          rows={3}
          placeholder={t.notesPlaceholder}
          class="w-full px-3 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-100 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all resize-y"
        />
      </div>

      <div class="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl p-4 flex flex-col gap-3">
        <div class="flex items-center justify-between gap-2.5">
          <h2 class="m-0 text-sm font-semibold text-surface-800 dark:text-surface-100">{t.promptPreview}</h2>
          <button
            type="button"
            disabled={selectedTypes.length === 0}
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-500 text-white border-none cursor-pointer transition-colors duration-200 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCopy}
          >
            {copyStatus === 'copied' ? <Check size={14} /> : <Copy size={14} />}
            {copyStatus === 'copied' ? t.copied : t.copyPrompt}
          </button>
        </div>

        {copyStatus === 'error' && (
          <p class="m-0 text-xs text-danger-500">{t.copyError}</p>
        )}

        {selectedTypes.length === 0 ? (
          <p class="m-0 text-xs text-surface-400">{t.pickTypeHint}</p>
        ) : (
          <textarea
            readOnly
            value={prompt}
            rows={16}
            class="w-full px-3 py-2.5 border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-700 dark:text-surface-200 rounded-xl text-xs font-mono leading-relaxed resize-y focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20"
          />
        )}
      </div>

      <p class="m-0 text-xs text-surface-400">
        {t.footerNote}
      </p>
    </div>
  )
}
