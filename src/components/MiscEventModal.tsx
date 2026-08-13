import { useState } from 'preact/hooks'
import type { MiscEvent, MiscEventType, MeasurementKind } from '../app'
import { Modal } from './Modal'
import { feedingSettings } from '../store/settings'
import { Droplets, Pill, Ruler, PenLine } from 'lucide-preact'
import { translations, type TranslationDict } from '../i18n'

type Props = {
  onClose: () => void
  onSave: (event: MiscEvent) => void
}

const getEventOptions = (t: TranslationDict['miscEventModal']): { type: MiscEventType; label: string; icon: typeof Droplets; color: string; activeColor: string }[] => [
  { type: 'diaper', label: t.diaper, icon: Droplets, color: 'bg-warning-50 dark:bg-warning-500/10 text-warning-600 dark:text-warning-500 border-warning-200 dark:border-warning-500/20', activeColor: 'bg-warning-500 text-white border-warning-500' },
  { type: 'medicine', label: t.medicine, icon: Pill, color: 'bg-event-medicine/10 text-event-medicine border-event-medicine/20', activeColor: 'bg-event-medicine text-white border-event-medicine' },
  { type: 'measurement', label: t.measure, icon: Ruler, color: 'bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-500 border-success-200 dark:border-success-500/20', activeColor: 'bg-success-500 text-white border-success-500' },
  { type: 'custom', label: t.custom, icon: PenLine, color: 'bg-side-right-50 dark:bg-side-right-500/10 text-side-right-600 dark:text-side-right-500 border-side-right-100 dark:border-side-right-500/20', activeColor: 'bg-event-custom text-white border-event-custom' }
]

const getMeasurementTabs = (t: TranslationDict['miscEventModal']): { kind: MeasurementKind; label: string }[] => [
  { kind: 'weight', label: t.weight },
  { kind: 'height', label: t.height },
  { kind: 'headCircumference', label: t.head }
]

const DEFAULT_UNITS: Record<MeasurementKind, string> = {
  weight: 'kg',
  height: 'cm',
  headCircumference: 'cm'
}

const inputClass = 'w-full px-3 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-100 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all'

export function MiscEventModal({ onClose, onSave }: Props) {
  const t = translations.value.miscEventModal
  const common = translations.value.common
  const EVENT_OPTIONS = getEventOptions(t)
  const MEASUREMENT_TABS = getMeasurementTabs(t)
  const [selectedType, setSelectedType] = useState<MiscEventType | null>(null)
  const [customLabel, setCustomLabel] = useState('')
  const [diaperPoop, setDiaperPoop] = useState(true)
  const [diaperPee, setDiaperPee] = useState(true)
  const [medicineName, setMedicineName] = useState('')
  const [measurementTab, setMeasurementTab] = useState<MeasurementKind>('weight')
  const [measurementValue, setMeasurementValue] = useState('')
  const [measurementUnit, setMeasurementUnit] = useState('kg')
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5))

  const handleSubmit = (e: Event) => {
    e.preventDefault()

    if (!selectedType) {
      alert(t.errorSelectType)
      return
    }

    if (selectedType === 'custom' && !customLabel.trim()) {
      alert(t.errorCustomLabel)
      return
    }

    if (selectedType === 'medicine' && !medicineName) {
      alert(t.errorSelectMedicine)
      return
    }

    if (selectedType === 'measurement') {
      const value = parseFloat(measurementValue)
      if (Number.isNaN(value) || value <= 0) {
        alert(t.errorMeasurementValue)
        return
      }
    }

    const timestamp = new Date(`${date}T${time}`)

    const newEvent: MiscEvent = {
      id: Date.now().toString(),
      type: selectedType,
      customLabel: selectedType === 'custom' ? customLabel : undefined,
      diaperPoop: selectedType === 'diaper' ? diaperPoop : undefined,
      diaperPee: selectedType === 'diaper' ? diaperPee : undefined,
      medicineName: selectedType === 'medicine' ? medicineName : undefined,
      measurementKind: selectedType === 'measurement' ? measurementTab : undefined,
      measurementValue: selectedType === 'measurement' ? parseFloat(measurementValue) : undefined,
      measurementUnit: selectedType === 'measurement' ? measurementUnit : undefined,
      timestamp,
      notes: notes.trim() || undefined
    }

    onSave(newEvent)
  }

  const handleTypeSelect = (type: MiscEventType) => {
    setSelectedType(type)
    if (type === 'measurement') {
      setMeasurementUnit(DEFAULT_UNITS[measurementTab])
    }
  }

  const handleMeasurementTabChange = (kind: MeasurementKind) => {
    setMeasurementTab(kind)
    setMeasurementUnit(DEFAULT_UNITS[kind])
    setMeasurementValue('')
  }

  return (
    <Modal title={t.title} onClose={onClose}>
      <form onSubmit={handleSubmit}>
          <div class="mb-5">
            <label class="block text-sm font-medium mb-2.5 text-surface-600 dark:text-surface-400">{t.eventType}</label>
            <div class="grid grid-cols-4 gap-2">
              {EVENT_OPTIONS.map(option => {
                const Icon = option.icon
                const isSelected = selectedType === option.type
                return (
                  <button
                    key={option.type}
                    type="button"
                    class={`p-3 rounded-xl font-medium transition-all duration-200 active:scale-[0.96] flex flex-col items-center gap-1.5 border ${
                      isSelected ? option.activeColor : option.color
                    }`}
                    onClick={() => handleTypeSelect(option.type)}
                  >
                    <Icon size={20} />
                    <span class="text-xs">{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {selectedType === 'diaper' && (
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2 text-surface-600 dark:text-surface-400">{t.diaperContentsLabel}</label>
              <div class="flex flex-wrap gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={diaperPoop}
                    onChange={(e) => setDiaperPoop((e.target as HTMLInputElement).checked)}
                    class="w-4 h-4 rounded border-surface-300 text-primary-500 dark:text-primary-300 focus:ring-primary-400"
                  />
                  <span class="text-sm text-surface-700 dark:text-surface-300">{t.poop}</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={diaperPee}
                    onChange={(e) => setDiaperPee((e.target as HTMLInputElement).checked)}
                    class="w-4 h-4 rounded border-surface-300 text-primary-500 dark:text-primary-300 focus:ring-primary-400"
                  />
                  <span class="text-sm text-surface-700 dark:text-surface-300">{t.pee}</span>
                </label>
              </div>
            </div>
          )}

          {selectedType === 'custom' && (
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1.5 text-surface-600 dark:text-surface-400">{t.label}</label>
              <input
                type="text"
                value={customLabel}
                onInput={(e) => setCustomLabel((e.target as HTMLInputElement).value)}
                placeholder={t.labelPlaceholder}
                class={inputClass}
              />
            </div>
          )}

          {selectedType === 'medicine' && (
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1.5 text-surface-600 dark:text-surface-400">{t.medicineField}</label>
              <select
                value={medicineName}
                onInput={(e) => setMedicineName((e.target as HTMLSelectElement).value)}
                required
                class={inputClass}
              >
                <option value="">{t.selectPlaceholder}</option>
                {feedingSettings.value.medicineOptions.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          )}

          {selectedType === 'measurement' && (
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2 text-surface-600 dark:text-surface-400">{t.measurementField}</label>
              <div class="flex gap-1 p-1 bg-surface-100 dark:bg-surface-700 rounded-xl mb-3">
                {MEASUREMENT_TABS.map(({ kind, label }) => (
                  <button
                    key={kind}
                    type="button"
                    class={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${measurementTab === kind
                      ? 'bg-white dark:bg-surface-600 text-surface-900 dark:text-surface-100 shadow-sm'
                      : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                    }`}
                    onClick={() => handleMeasurementTabChange(kind)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div class="flex gap-2 items-center">
                <input
                  type="number"
                  step={measurementTab === 'weight' ? 0.01 : 0.1}
                  min="0"
                  value={measurementValue}
                  onInput={(e) => setMeasurementValue((e.target as HTMLInputElement).value)}
                  placeholder={measurementTab === 'weight' ? t.valuePlaceholderWeight : t.valuePlaceholderOther}
                  class={`flex-1 ${inputClass.replace('w-full ', '')}`}
                />
                <input
                  type="text"
                  value={measurementUnit}
                  onInput={(e) => setMeasurementUnit((e.target as HTMLInputElement).value)}
                  placeholder={t.unitPlaceholder}
                  class="w-16 px-2 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-100 rounded-xl text-sm text-center focus:outline-none focus:border-primary-400"
                />
              </div>
            </div>
          )}

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1.5 text-surface-600 dark:text-surface-400">{t.date}</label>
            <input
              type="date"
              value={date}
              onInput={(e) => setDate((e.target as HTMLInputElement).value)}
              required
              class={inputClass}
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1.5 text-surface-600 dark:text-surface-400">{t.time}</label>
            <input
              type="time"
              value={time}
              onInput={(e) => setTime((e.target as HTMLInputElement).value)}
              required
              class={inputClass}
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1.5 text-surface-600 dark:text-surface-400">{t.notes}</label>
            <textarea
              value={notes}
              onInput={(e) => setNotes((e.target as HTMLTextAreaElement).value)}
              placeholder={t.notesPlaceholder}
              rows={2}
              class={`${inputClass} resize-none`}
            />
          </div>

          <div class="flex gap-3 justify-end mt-6">
            <button
              type="button"
              class="px-4 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-surface-50 dark:hover:bg-surface-700"
              onClick={onClose}
            >
              {common.cancel}
            </button>
            <button
              type="submit"
              class="px-4 py-2.5 border-none bg-primary-500 text-white rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-primary-600"
            >
              {t.addEvent}
            </button>
          </div>
        </form>
    </Modal>
  )
}
