import { describe, expect, it } from 'vitest'
import type { MiscEvent, Session } from '../app'
import { buildReportPrompt } from './reportPrompt'

const NOW = new Date('2026-08-13T12:00:00.000Z')

const sampleSession = (overrides: Partial<Session> = {}): Session => ({
  id: 'session-1',
  startTime: new Date('2026-08-12T08:00:00.000Z'),
  isActive: false,
  intervals: [
    {
      side: 'left',
      startTime: new Date('2026-08-12T08:00:00.000Z'),
      endTime: new Date('2026-08-12T08:12:00.000Z')
    }
  ],
  ...overrides
})

const sampleMeasurement = (overrides: Partial<MiscEvent> = {}): MiscEvent => ({
  id: 'event-1',
  type: 'measurement',
  measurementKind: 'weight',
  measurementValue: 4.2,
  measurementUnit: 'kg',
  timestamp: new Date('2026-08-12T09:00:00.000Z'),
  ...overrides
})

describe('buildReportPrompt', () => {
  it('includes instructions and a disclaimer against diagnosis', () => {
    const prompt = buildReportPrompt([], [], { types: ['feeding'], rangeDays: 7, now: NOW })
    expect(prompt).toContain('not a medical professional')
    expect(prompt.toLowerCase()).toContain('summary')
  })

  it('includes a feeding section with in-range sessions', () => {
    const sessions = [sampleSession()]
    const prompt = buildReportPrompt(sessions, [], { types: ['feeding'], rangeDays: 7, now: NOW })
    expect(prompt).toContain('## Feeding')
    expect(prompt).toContain('1 session(s) logged')
    expect(prompt).toContain('left 12m')
  })

  it('excludes feeding sessions outside the date range', () => {
    const sessions = [sampleSession({ startTime: new Date('2026-07-01T08:00:00.000Z'), intervals: [] })]
    const prompt = buildReportPrompt(sessions, [], { types: ['feeding'], rangeDays: 7, now: NOW })
    expect(prompt).toContain('No feeding sessions logged in this period.')
  })

  it('includes a measurements section with in-range measurement events', () => {
    const events = [sampleMeasurement()]
    const prompt = buildReportPrompt([], events, { types: ['measurements'], rangeDays: 7, now: NOW })
    expect(prompt).toContain('## Measurements')
    expect(prompt).toContain('Weight: 4.2 kg')
  })

  it('ignores non-measurement misc events in the measurements section', () => {
    const events: MiscEvent[] = [
      { id: 'e2', type: 'diaper', diaperPee: true, timestamp: new Date('2026-08-12T09:00:00.000Z') }
    ]
    const prompt = buildReportPrompt([], events, { types: ['measurements'], rangeDays: 7, now: NOW })
    expect(prompt).toContain('No measurements logged in this period.')
  })

  it('only includes sections for the requested report types', () => {
    const prompt = buildReportPrompt([sampleSession()], [sampleMeasurement()], { types: ['feeding'], rangeDays: 7, now: NOW })
    expect(prompt).toContain('## Feeding')
    expect(prompt).not.toContain('## Measurements')
  })

  it('includes both sections when both types are requested', () => {
    const prompt = buildReportPrompt([sampleSession()], [sampleMeasurement()], {
      types: ['feeding', 'measurements'],
      rangeDays: 7,
      now: NOW
    })
    expect(prompt).toContain('## Feeding')
    expect(prompt).toContain('## Measurements')
  })

  it('includes personal notes as their own section when provided', () => {
    const prompt = buildReportPrompt([], [], {
      types: ['feeding'],
      rangeDays: 7,
      now: NOW,
      personalNotes: 'Started teething this week, fussier at night.'
    })
    expect(prompt).toContain('## Notes from the Parent')
    expect(prompt).toContain('Started teething this week, fussier at night.')
  })

  it('omits the personal notes section when notes are blank or missing', () => {
    const promptMissing = buildReportPrompt([], [], { types: ['feeding'], rangeDays: 7, now: NOW })
    const promptBlank = buildReportPrompt([], [], { types: ['feeding'], rangeDays: 7, now: NOW, personalNotes: '   ' })
    expect(promptMissing).not.toContain('## Notes from the Parent')
    expect(promptBlank).not.toContain('## Notes from the Parent')
  })

  it('respects the rangeDays window boundary', () => {
    const events = [sampleMeasurement({ timestamp: new Date('2026-08-05T09:00:00.000Z') })]
    const withinRange = buildReportPrompt([], events, { types: ['measurements'], rangeDays: 14, now: NOW })
    const outsideRange = buildReportPrompt([], events, { types: ['measurements'], rangeDays: 3, now: NOW })
    expect(withinRange).toContain('Weight: 4.2 kg')
    expect(outsideRange).toContain('No measurements logged in this period.')
  })
})
