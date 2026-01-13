export interface SermonPoint {
    id: number;
    title: string;
    content: string;
}

export interface SermonData {
    id?: string;
    title: string;
    date: string;
    theme: string;
    mainVerse: string;
    mainVerseText: string;
    objective: string;
    introOpening: string;
    introContext: string;
    introHook: string;
    expoHistorical: string;
    expoCultural: string;
    expoAnalysis: string;
    expoSupportVerses: string;
    expoSupportVersesText: string;
    points: SermonPoint[];
    appPersonal: string;
    appFamily: string;
    appChurch: string;
    appSociety: string;
    concSummary: string;
    concAction: string;
    concPrayer: string;
    notesImages: string;
    notesStats: string;
    notesQuotes: string;
    notesGeneral: string;
}

export const emptySermon: SermonData = {
    title: '',
    date: new Date().toISOString().split('T')[0],
    theme: '',
    mainVerse: '',
    mainVerseText: '',
    objective: '',
    introOpening: '',
    introContext: '',
    introHook: '',
    expoHistorical: '',
    expoCultural: '',
    expoAnalysis: '',
    expoSupportVerses: '',
    expoSupportVersesText: '',
    points: [{ id: 1, title: '', content: '' }],
    appPersonal: '',
    appFamily: '',
    appChurch: '',
    appSociety: '',
    concSummary: '',
    concAction: '',
    concPrayer: '',
    notesImages: '',
    notesStats: '',
    notesQuotes: '',
    notesGeneral: ''
};
