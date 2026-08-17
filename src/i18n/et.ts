import type { TranslationDict } from './en'

export const et: TranslationDict = {
  common: {
    cancel: 'Tühista',
    save: 'Salvesta',
    add: 'Lisa',
    create: 'Loo',
    delete: 'Kustuta',
    back: 'Tagasi',
    left: 'Vasak',
    right: 'Parem',
    loading: 'Laadimine...'
  },

  nav: {
    home: 'Avaleht',
    history: 'Ajalugu',
    report: 'Raport',
    settings: 'Seaded'
  },

  duration: {
    hoursMinutes: ({ h, m }) => `${h}t ${m}min`,
    hoursOnly: ({ h }) => `${h}t`,
    minutesOnly: ({ m }) => `${m}min`,
    minutesShort: ({ m }) => `${m} min`,
    minutesSeconds: ({ m, s }) => `${m}min ${s}s`
  },

  feedingPredictor: {
    overdueHoursMinutes: ({ h, m }) => `${h}t ${m}min hilinenud`,
    overdueMinutes: ({ m }) => `${m}min hilinenud`,
    inHoursMinutes: ({ h, m }) => `${h}t ${m}min pärast`,
    inMinutes: ({ m }) => `${m}min pärast`
  },

  installBanner: {
    message: 'Paigalda Baby Tracker oma seadmesse kiireks ligipääsuks.',
    install: 'Paigalda',
    dismiss: 'Sulge'
  },

  home: {
    sessionInProgress: 'Toitmine käib',
    startFeeding: 'Alusta toitmist',
    manualEntry: 'Käsitsi sisestus',
    logEvent: 'Lisa sündmus',
    today: 'Täna',
    errorLoad: 'Andmete laadimine ebaõnnestus. Palun laadi leht uuesti ja proovi uuesti.',
    errorStart: 'Uue seansi alustamine ebaõnnestus. Palun proovi uuesti.',
    errorAddManual: 'Seansi salvestamine ebaõnnestus. Palun proovi uuesti.',
    errorAddEvent: 'Sündmuse salvestamine ebaõnnestus. Palun proovi uuesti.'
  },

  nextFeeding: {
    label: 'Järgmine toitmine'
  },

  dailyStats: {
    sessions: 'Seansid',
    left: 'Vasak',
    right: 'Parem',
    last: 'Viimane'
  },

  sideSelector: {
    label: 'Pool',
    left: 'Vasak',
    right: 'Parem'
  },

  activeSession: {
    home: 'Avaleht',
    started: ({ time }) => `Algas ${time}`,
    ready: 'Valmis',
    total: 'Kokku',
    left: 'Vasak',
    right: 'Parem',
    tapToStop: 'Puuduta, et peatada',
    tapToStart: 'Puuduta, et alustada',
    endSession: 'Lõpeta seanss',
    intervals: 'Intervallid',
    errorLoad: 'Selle seansi laadimine ebaõnnestus. Palun laadi leht uuesti ja proovi uuesti.',
    errorEnd: 'Seansi lõpetamine ebaõnnestus. Palun proovi uuesti.',
    errorUpdate: 'Muudatuste salvestamine ebaõnnestus. Palun proovi uuesti.'
  },

  sessionDetails: {
    back: 'Tagasi',
    delete: 'Kustuta',
    started: 'Algas',
    duration: 'Kestus',
    intervals: 'Intervallid',
    left: 'Vasak',
    right: 'Parem',
    add: 'Lisa',
    noIntervals: 'Intervalle pole salvestatud',
    confirmDeleteSession: 'Kas oled kindel, et soovid kogu selle seansi kustutada? Seda ei saa hiljem tagasi võtta.',
    errorLoad: 'Selle seansi laadimine ebaõnnestus. Palun laadi leht uuesti ja proovi uuesti.',
    errorUpdate: 'Muudatuste salvestamine ebaõnnestus. Palun proovi uuesti.',
    errorDelete: 'Seansi kustutamine ebaõnnestus. Palun proovi uuesti.'
  },

  intervalRow: {
    recording: 'Salvestamine',
    deleteInterval: 'Kustuta intervall'
  },

  intervalModal: {
    editTitle: 'Muuda intervalli',
    addTitle: 'Lisa intervall',
    startDate: 'Alguskuupäev',
    startTime: 'Algusaeg',
    endDate: 'Lõppkuupäev',
    endTime: 'Lõppaeg',
    errorEndBeforeStart: 'Lõppaeg peab olema hiljem kui algusaeg'
  },

  manualSessionModal: {
    title: 'Käsitsi sisestus',
    date: 'Kuupäev',
    startTime: 'Algusaeg',
    durationMinutes: 'Kestus (minutites)',
    endTime: 'Lõppaeg',
    errorEndBeforeStart: 'Lõppaeg peab olema hiljem kui algusaeg'
  },

  miscEventModal: {
    title: 'Lisa sündmus',
    eventType: 'Sündmuse tüüp',
    diaper: 'Mähe',
    medicine: 'Ravim',
    measure: 'Mõõt',
    custom: 'Muu',
    diaperContentsLabel: 'Mis mähkmes oli?',
    poop: 'Kakk',
    pee: 'Pissi',
    label: 'Silt',
    labelPlaceholder: 'nt vannitamine, kõhuli aeg',
    medicineField: 'Ravim',
    selectPlaceholder: 'Vali...',
    measurementField: 'Mõõtmine',
    weight: 'Kaal',
    height: 'Pikkus',
    head: 'Pea',
    valuePlaceholderWeight: 'nt 4.2',
    valuePlaceholderOther: 'nt 55',
    unitPlaceholder: 'Ühik',
    date: 'Kuupäev',
    time: 'Kellaaeg',
    notes: 'Märkused (valikuline)',
    notesPlaceholder: 'Lisa täiendavaid märkusi...',
    addEvent: 'Lisa sündmus',
    errorSelectType: 'Palun vali sündmuse tüüp',
    errorCustomLabel: 'Palun sisesta kohandatud sündmuse silt',
    errorSelectMedicine: 'Palun vali ravim',
    errorMeasurementValue: 'Palun sisesta kehtiv mõõtmisväärtus'
  },

  history: {
    title: 'Ajalugu',
    import: 'Impordi',
    export: 'Ekspordi',
    today: 'Täna',
    yesterday: 'Eile',
    noActivity: 'Tegevust veel pole',
    startTracking: 'Alusta jälgimist, et näha oma ajalugu',
    active: 'Käimas',
    loadPreviousDay: 'Laadi eelmine päev',
    confirmDeleteEvent: 'Kustutada see sündmus?',
    errorLoad: 'Ajaloo laadimine ebaõnnestus. Palun laadi leht uuesti ja proovi uuesti.',
    errorDeleteEvent: 'Sündmuse kustutamine ebaõnnestus. Palun proovi uuesti.',
    errorExport: 'Andmete eksportimine ebaõnnestus. Palun proovi uuesti.',
    errorImport: 'Andmete importimine ebaõnnestus. Palun proovi uuesti.',
    importNoNew: 'Uusi andmeid importida pole — kõik selles failis oli juba varem imporditud.',
    importSummary: ({ sessions, events }) => `Import lõpetatud: lisati ${sessions} seanss(i) ja ${events} sündmus(t).`,
    importSkipped: ({ count }) => ` Vahele jäeti ${count} juba imporditud kirje(t).`,
    custom: 'Muu',
    medicine: 'Ravim',
    vitamin: 'D-vitamiin',
    probiotic: 'Probiootikum',
    measurement: 'Mõõtmine',
    diaper: 'Mähe',
    diaperWithContents: ({ contents }) => `Mähe (${contents})`,
    poop: 'kakk',
    pee: 'pissi',
    weight: 'Kaal',
    height: 'Pikkus',
    head: 'Pea'
  },

  report: {
    title: 'Tehisintellekti raport',
    subtitle: 'Loo oma jälgitud andmetest kopeeritav prompt. Kleebi see oma lemmik AI vestlusesse, et saada kokkuvõte mustritest ja trendidest.',
    errorLoad: 'Andmete laadimine ebaõnnestus. Palun laadi leht uuesti ja proovi uuesti.',
    reportTypes: 'Raporti tüübid',
    chooseWhatToInclude: 'Vali, mida kaasata',
    feeding: 'Toitmine',
    feedingDescription: 'Toitmisseansid ja poolte ajastus',
    measurements: 'Mõõtmised',
    measurementsDescription: 'Kaal, pikkus, peaümbermõõt',
    timePeriod: 'Ajavahemik',
    days: ({ n }) => `${n} päeva`,
    personalNotes: 'Isiklikud märkused',
    personalNotesDescription: 'Lisa AI-le konteksti — salvestatakse ainult sellesse seadmesse',
    notesPlaceholder: 'nt hakkas sel nädalal hambaid saama, õhtuti tavapärasest närvilisem...',
    promptPreview: 'Prompti eelvaade',
    copyPrompt: 'Kopeeri prompt',
    copied: 'Kopeeritud',
    copyError: 'Automaatne kopeerimine ebaõnnestus — vali allolev tekst ja kopeeri see käsitsi.',
    pickTypeHint: 'Vali prompti loomiseks vähemalt üks raporti tüüp ülalt.',
    footerNote: 'Sinu andmed ei lahku sellest seadmest enne, kui sa need ise AI vestlusesse kleebid. See ei ole meditsiiniline nõuanne — muretsemist tekitavad asjad kontrolli alati oma lastearstiga.'
  },

  settings: {
    title: 'Seaded',
    appearance: 'Välimus',
    appearanceDescription: 'Vali, kuidas Baby Tracker sellel seadmel välja näeb',
    themes: {
      system: { label: 'Süsteemne', description: 'Kasuta seadme seadet' },
      light: { label: 'Hele', description: 'Vaikimisi soe palett' },
      dark: { label: 'Tume', description: 'Vaikimisi palett, ümber pööratud' },
      kindle: { label: 'Kindle', description: 'Must-valge, e-lugeri stiilis' },
      'kindle-dark': { label: 'Kindle tume', description: 'Must-valge öörežiim' }
    },
    language: 'Keel',
    languageDescription: 'Vali rakenduses kasutatav keel',
    feedingReminder: 'Toitmise meeldetuletus',
    feedingReminderDescription: 'Kasutatakse järgmise toitmisaja soovitamiseks avalehel',
    hours: 'Tunnid',
    minutes: 'Minutid',
    suggestsFeeding: ({ duration }) => `Soovitab toitmist iga ${duration} tagant pärast eelmise lõppu.`,
    significantInterval: 'Oluline intervall',
    significantIntervalDescription: 'Minimaalne kestus, mille korral loetakse toitmisintervall päris toitmiseks',
    sideSwitchesNote: ({ m }) => `Vahetused, mis on lühemad kui ${m}min, loetakse mürana ega mõjuta viimase toitmisaja leidmist.`,
    feedingNotifications: 'Toitmise teavitused',
    feedingNotificationsDescription: 'Saa sellel seadmel teavitusi järgmise toitmise kohta',
    notificationsUnsupported: 'Teavitusi ei toetata sellel seadmel.',
    notificationsBlocked: 'Teavitused on selle rakenduse jaoks blokeeritud. Luba need brauseri või seadme seadetes, et need sisse lülitada.',
    sendTestNotification: 'Saada testteavitus',
    sentCheckNotifications: 'Saadetud — kontrolli oma teavitusi',
    failedToSend: 'Saatmine ebaõnnestus',
    beforeFeeding: 'Enne toitmist',
    whenOverdue: 'Kui hilineb',
    minutesBefore: 'Minutit enne',
    notifyBefore: ({ m }) => `Teavita ${m} min enne soovitatud toitmisaega.`,
    minutesOverdue: 'Minutit hiljem',
    notifyOverdue: ({ m }) => `Teavita ${m} min pärast soovitatud toitmisaja möödumist.`,
    medicineList: 'Ravimite loend',
    medicineListDescription: 'Valikud, mis kuvatakse ravimisündmuse lisamisel',
    reset: 'Lähtesta',
    removeMedicine: ({ name }) => `Eemalda ${name}`,
    medicinePlaceholder: 'nt hambageel'
  },

  notifications: {
    feedingOverdueTitle: 'Toitmine hilineb',
    feedingApproachingTitle: 'Toitmisaeg läheneb',
    feedingOverdueBody: 'Soovitatud toitmisaeg on juba möödas.',
    feedingApproachingBody: 'Soovitatud toitmisaeg läheneb varsti.',
    testTitle: 'Testteavitus',
    testBody: 'Kui sa seda näed, siis toitmisteavitused töötavad sellel seadmel.',
    unsupportedNoBrowser: 'Teavitused vajavad brauserikeskkonda',
    unsupportedNoApi: 'See brauser ei toeta teavitusi',
    unsupportedNoServiceWorker: 'See brauser ei toeta taustateavitusi'
  }
}
