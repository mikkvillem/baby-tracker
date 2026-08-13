export const en = {
  common: {
    cancel: 'Cancel',
    save: 'Save',
    add: 'Add',
    create: 'Create',
    delete: 'Delete',
    back: 'Back',
    left: 'Left',
    right: 'Right',
    loading: 'Loading...'
  },

  nav: {
    home: 'Home',
    history: 'History',
    report: 'Report',
    settings: 'Settings'
  },

  duration: {
    hoursMinutes: ({ h, m }: { h: number; m: number }) => `${h}h ${m}m`,
    hoursOnly: ({ h }: { h: number }) => `${h}h`,
    minutesOnly: ({ m }: { m: number }) => `${m}m`,
    minutesShort: ({ m }: { m: number }) => `${m} min`,
    minutesSeconds: ({ m, s }: { m: number; s: number }) => `${m}m ${s}s`
  },

  feedingPredictor: {
    overdueHoursMinutes: ({ h, m }: { h: number; m: number }) => `${h}h ${m}m overdue`,
    overdueMinutes: ({ m }: { m: number }) => `${m}m overdue`,
    inHoursMinutes: ({ h, m }: { h: number; m: number }) => `in ${h}h ${m}m`,
    inMinutes: ({ m }: { m: number }) => `in ${m}m`
  },

  installBanner: {
    message: 'Install Baby Tracker on your device for quick access.',
    install: 'Install',
    dismiss: 'Dismiss'
  },

  home: {
    sessionInProgress: 'Session in progress',
    startFeeding: 'Start Feeding',
    manualEntry: 'Manual Entry',
    logEvent: 'Log Event',
    today: 'Today',
    errorLoad: 'Failed to load your data. Please reload the page and try again.',
    errorStart: 'Failed to start a new session. Please try again.',
    errorAddManual: 'Failed to save the session. Please try again.',
    errorAddEvent: 'Failed to save the event. Please try again.'
  },

  nextFeeding: {
    label: 'Next Feeding'
  },

  dailyStats: {
    sessions: 'Sessions',
    left: 'Left',
    right: 'Right',
    last: 'Last'
  },

  sideSelector: {
    label: 'Side',
    left: 'Left',
    right: 'Right'
  },

  activeSession: {
    home: 'Home',
    started: ({ time }: { time: string }) => `Started ${time}`,
    ready: 'Ready',
    total: 'Total',
    left: 'Left',
    right: 'Right',
    tapToStop: 'Tap to stop',
    tapToStart: 'Tap to start',
    endSession: 'End Session',
    intervals: 'Intervals',
    errorLoad: 'Failed to load this session. Please reload the page and try again.',
    errorEnd: 'Failed to end the session. Please try again.',
    errorUpdate: 'Failed to save your changes. Please try again.'
  },

  sessionDetails: {
    back: 'Back',
    delete: 'Delete',
    started: 'Started',
    duration: 'Duration',
    intervals: 'Intervals',
    left: 'Left',
    right: 'Right',
    add: 'Add',
    noIntervals: 'No intervals recorded',
    confirmDeleteSession: 'Are you sure you want to delete this entire session? This cannot be undone.',
    errorLoad: 'Failed to load this session. Please reload the page and try again.',
    errorUpdate: 'Failed to save your changes. Please try again.',
    errorDelete: 'Failed to delete the session. Please try again.'
  },

  intervalRow: {
    recording: 'Recording',
    deleteInterval: 'Delete interval'
  },

  intervalModal: {
    editTitle: 'Edit Interval',
    addTitle: 'Add Interval',
    startDate: 'Start Date',
    startTime: 'Start Time',
    endDate: 'End Date',
    endTime: 'End Time',
    errorEndBeforeStart: 'End time must be after start time'
  },

  manualSessionModal: {
    title: 'Manual Entry',
    date: 'Date',
    startTime: 'Start Time',
    durationMinutes: 'Duration (minutes)',
    endTime: 'End Time',
    errorEndBeforeStart: 'End time must be after start time'
  },

  miscEventModal: {
    title: 'Log Event',
    eventType: 'Event Type',
    diaper: 'Diaper',
    medicine: 'Medicine',
    measure: 'Measure',
    custom: 'Custom',
    diaperContentsLabel: 'What was in the diaper?',
    poop: 'Poop',
    pee: 'Pee',
    label: 'Label',
    labelPlaceholder: 'e.g., Bath time, Tummy time',
    medicineField: 'Medicine',
    selectPlaceholder: 'Select...',
    measurementField: 'Measurement',
    weight: 'Weight',
    height: 'Height',
    head: 'Head',
    valuePlaceholderWeight: 'e.g. 4.2',
    valuePlaceholderOther: 'e.g. 55',
    unitPlaceholder: 'Unit',
    date: 'Date',
    time: 'Time',
    notes: 'Notes (optional)',
    notesPlaceholder: 'Add any additional notes...',
    addEvent: 'Add Event',
    errorSelectType: 'Please select an event type',
    errorCustomLabel: 'Please enter a label for custom event',
    errorSelectMedicine: 'Please select a medicine',
    errorMeasurementValue: 'Please enter a valid measurement value'
  },

  history: {
    title: 'History',
    import: 'Import',
    export: 'Export',
    today: 'Today',
    yesterday: 'Yesterday',
    noActivity: 'No activity yet',
    startTracking: 'Start tracking to see your history',
    active: 'Active',
    loadPreviousDay: 'Load Previous Day',
    confirmDeleteEvent: 'Delete this event?',
    errorLoad: 'Failed to load your history. Please reload the page and try again.',
    errorDeleteEvent: 'Failed to delete the event. Please try again.',
    errorExport: 'Failed to export data. Please try again.',
    errorImport: 'Failed to import data. Please try again.',
    importNoNew: 'No new data to import — everything in this file was already imported.',
    importSummary: ({ sessions, events }: { sessions: number; events: number }) =>
      `Import complete: added ${sessions} session${sessions === 1 ? '' : 's'} and ${events} event${events === 1 ? '' : 's'}.`,
    importSkipped: ({ count }: { count: number }) => ` Skipped ${count} already-imported item${count === 1 ? '' : 's'}.`,
    custom: 'Custom',
    medicine: 'Medicine',
    vitamin: 'Vitamin D',
    probiotic: 'Probiotic',
    measurement: 'Measurement',
    diaper: 'Diaper',
    diaperWithContents: ({ contents }: { contents: string }) => `Diaper (${contents})`,
    poop: 'poop',
    pee: 'pee',
    weight: 'Weight',
    height: 'Height',
    head: 'Head'
  },

  report: {
    title: 'AI Report',
    subtitle: 'Build a ready-to-paste prompt from your tracked data. Copy it into your favorite AI chat to get a summary of patterns and trends.',
    errorLoad: 'Failed to load your data. Please reload the page and try again.',
    reportTypes: 'Report Types',
    chooseWhatToInclude: 'Choose what to include',
    feeding: 'Feeding',
    feedingDescription: 'Nursing sessions and side timing',
    measurements: 'Measurements',
    measurementsDescription: 'Weight, height, head circumference',
    timePeriod: 'Time period',
    days: ({ n }: { n: number }) => `${n} days`,
    personalNotes: 'Personal Notes',
    personalNotesDescription: 'Add context for the AI — saved on this device',
    notesPlaceholder: 'e.g. Started teething this week, fussier at night than usual...',
    promptPreview: 'Prompt Preview',
    copyPrompt: 'Copy prompt',
    copied: 'Copied',
    copyError: "Couldn't copy automatically — select the text below and copy it manually.",
    pickTypeHint: 'Pick at least one report type above to build a prompt.',
    footerNote: "Your data never leaves this device unless you paste it into an AI chat yourself. This isn't medical advice — always check anything concerning with your pediatrician."
  },

  settings: {
    title: 'Settings',
    appearance: 'Appearance',
    appearanceDescription: 'Pick how Baby Tracker looks on this device',
    themes: {
      system: { label: 'System', description: 'Match your device setting' },
      light: { label: 'Light', description: 'The default warm palette' },
      dark: { label: 'Dark', description: 'The default palette, inverted' },
      kindle: { label: 'Kindle', description: 'Monochrome, e-ink inspired' },
      'kindle-dark': { label: 'Kindle Dark', description: 'Monochrome night mode' }
    } as Record<string, { label: string; description: string }>,
    language: 'Language',
    languageDescription: 'Choose the language used throughout the app',
    feedingReminder: 'Feeding Reminder',
    feedingReminderDescription: 'Used to suggest the next feeding time on the home screen',
    hours: 'Hours',
    minutes: 'Minutes',
    suggestsFeeding: ({ duration }: { duration: string }) => `Suggests a feeding roughly every ${duration} after the last one ends.`,
    significantInterval: 'Significant Interval',
    significantIntervalDescription: 'Minimum duration for a nursing interval to count as a real feed',
    sideSwitchesNote: ({ m }: { m: number }) => `Side switches shorter than ${m}m are treated as noise and ignored when finding the last feeding time.`,
    feedingNotifications: 'Feeding Notifications',
    feedingNotificationsDescription: 'Get notified about the next feeding on this device',
    notificationsUnsupported: 'Notifications are not supported on this device.',
    notificationsBlocked: 'Notifications are blocked for this app. Enable them in your browser or device settings to turn this on.',
    sendTestNotification: 'Send test notification',
    sentCheckNotifications: 'Sent — check your notifications',
    failedToSend: 'Failed to send',
    beforeFeeding: 'Before feeding',
    whenOverdue: 'When overdue',
    minutesBefore: 'Minutes before',
    notifyBefore: ({ m }: { m: number }) => `Notify ${m}m before the suggested feeding time.`,
    minutesOverdue: 'Minutes overdue',
    notifyOverdue: ({ m }: { m: number }) => `Notify ${m}m after the suggested feeding time has passed.`,
    medicineList: 'Medicine List',
    medicineListDescription: 'Options shown when logging a medicine event',
    reset: 'Reset',
    removeMedicine: ({ name }: { name: string }) => `Remove ${name}`,
    medicinePlaceholder: 'e.g. Teething gel'
  },

  notifications: {
    feedingOverdueTitle: 'Feeding overdue',
    feedingApproachingTitle: 'Feeding time approaching',
    feedingOverdueBody: "It's past the suggested feeding time.",
    feedingApproachingBody: 'The suggested feeding time is coming up soon.',
    testTitle: 'Test notification',
    testBody: 'If you can see this, feeding notifications are working on this device.',
    unsupportedNoBrowser: 'Notifications require a browser environment',
    unsupportedNoApi: 'This browser does not support notifications',
    unsupportedNoServiceWorker: 'This browser does not support background notifications'
  }
}

export type TranslationDict = typeof en
