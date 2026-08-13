import type { MiscEvent, Session } from '../app'

export type ReportType = 'feeding' | 'measurements'

export type ReportRangeDays = 3 | 7 | 14 | 30

export type ReportOptions = {
  types: ReportType[]
  rangeDays: ReportRangeDays
  personalNotes?: string
  /** Injectable for tests; defaults to the current time. */
  now?: Date
}

const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  feeding: 'Feeding',
  measurements: 'Measurements'
}

const MEASUREMENT_KIND_LABELS: Record<string, string> = {
  weight: 'Weight',
  height: 'Height',
  headCircumference: 'Head circumference'
}

const formatDate = (date: Date): string => date.toISOString().slice(0, 10)

const formatDateTime = (date: Date): string =>
  `${formatDate(date)} ${date.toTimeString().slice(0, 5)}`

const formatDurationMinutes = (ms: number): string => `${Math.round(ms / 60000)}m`

const inRange = (date: Date, start: Date, end: Date): boolean =>
  date.getTime() >= start.getTime() && date.getTime() <= end.getTime()

const buildFeedingSection = (sessions: Session[], start: Date, end: Date): string => {
  const inRangeSessions = sessions
    .filter(session => inRange(session.startTime, start, end))
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())

  if (inRangeSessions.length === 0) {
    return '## Feeding\nNo feeding sessions logged in this period.'
  }

  const lines = inRangeSessions.map(session => {
    const parts = session.intervals
      .filter(interval => interval.endTime)
      .map(interval => `${interval.side} ${formatDurationMinutes(interval.endTime!.getTime() - interval.startTime.getTime())}`)
    const detail = parts.length > 0 ? parts.join(', ') : 'no completed intervals'
    return `- ${formatDateTime(session.startTime)} — ${detail}`
  })

  return `## Feeding\n${inRangeSessions.length} session(s) logged.\n${lines.join('\n')}`
}

const buildMeasurementsSection = (events: MiscEvent[], start: Date, end: Date): string => {
  const inRangeEvents = events
    .filter(event => event.type === 'measurement' && inRange(event.timestamp, start, end))
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

  if (inRangeEvents.length === 0) {
    return '## Measurements\nNo measurements logged in this period.'
  }

  const lines = inRangeEvents.map(event => {
    const kindLabel = event.measurementKind ? MEASUREMENT_KIND_LABELS[event.measurementKind] ?? event.measurementKind : 'Measurement'
    const unit = event.measurementUnit ?? ''
    return `- ${formatDate(event.timestamp)} — ${kindLabel}: ${event.measurementValue ?? '?'}${unit ? ` ${unit}` : ''}`
  })

  return `## Measurements\n${inRangeEvents.length} measurement(s) logged.\n${lines.join('\n')}`
}

const SECTION_BUILDERS: Record<ReportType, (sessions: Session[], events: MiscEvent[], start: Date, end: Date) => string> = {
  feeding: (sessions, _events, start, end) => buildFeedingSection(sessions, start, end),
  measurements: (_sessions, events, start, end) => buildMeasurementsSection(events, start, end)
}

const INSTRUCTIONS = `You are a warm, knowledgeable assistant helping a parent make sense of their baby's tracked care data. You are not a medical professional and must not diagnose anything — instead, describe patterns and trends in plain language, and gently flag anything that might be worth mentioning to their pediatrician.

Using only the data provided below, write a short report with these sections:
1. **Summary** — 2-3 sentences on the overall period.
2. **Patterns & Trends** — what looks regular, what's changing over time.
3. **Notable Points** — anything unusual, worth double-checking, or worth celebrating. Skip this section if nothing stands out.
4. **Questions for Your Pediatrician** — only include specific questions if the data genuinely warrants them; otherwise omit this section.

Keep the tone warm, concise, and free of medical jargon. Do not invent data that isn't provided, and do not estimate the baby's age unless a birth date is given. If the data is too sparse to say anything meaningful, say so honestly instead of guessing. If the parent included personal notes below, treat them as trusted context (e.g. teething, illness, schedule changes) and factor them into the report.`

export function buildReportPrompt(sessions: Session[], miscEvents: MiscEvent[], options: ReportOptions): string {
  const now = options.now ?? new Date()
  const end = now
  const start = new Date(now.getTime() - options.rangeDays * 24 * 60 * 60 * 1000)

  const types = options.types.length > 0 ? options.types : (['feeding', 'measurements'] as ReportType[])
  const typeLabels = types.map(type => REPORT_TYPE_LABELS[type]).join(' + ')

  const sections = types.map(type => SECTION_BUILDERS[type](sessions, miscEvents, start, end))

  const trimmedNotes = options.personalNotes?.trim()
  if (trimmedNotes) {
    sections.unshift(`## Notes from the Parent\n${trimmedNotes}`)
  }

  return [
    INSTRUCTIONS,
    '',
    `---`,
    `DATA (${typeLabels}) — ${formatDate(start)} to ${formatDate(end)}`,
    '',
    sections.join('\n\n')
  ].join('\n')
}
