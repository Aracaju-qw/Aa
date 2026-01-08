
export type Theme = 'Ofertório' | 'Doutrina' | 'Sexta Profética' | 'Celebrando em Família' | 'Círculo de Oração' | 'Geral';

export interface Sermon {
  id: string;
  title: string;
  theme: Theme;
  content: string;
  date: string;
  tags: string[];
}

export interface QuickNote {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
}

export interface NotebookHistoryItem {
  id: string;
  content: string;
  timestamp: string;
  preview: string;
}

export interface TranslationResult {
  original: string;
  translated: string;
  transliteration?: string;
  morphology: string;
  lexicalRoot: string;
  meanings: string;
  exegesis: string;
  hermeneutics: string;
  biblicalExamples: { verse: string; context: string }[];
  thematicConcordance: string[];
}

export interface CommentaryResult {
  passage: string;
  analysis: string;
  historicalContext: string;
  theologicalInsights: string;
  practicalApplication: string;
  intertextuality: string;
  suggestedOutline: string[];
}

export interface BiographyResult {
  name: string;
  historicalContext: string;
  culturalContext: string;
  worldContext: string;
  references: { book: string; reference: string }[];
}

export interface DeepDiveResult {
  reference: string;
  intro: {
    author: string;
    dating: string;
    recipients: string;
  };
  histGeo: {
    politics: string;
    geography: string;
  };
  cultArch: {
    customs: string;
    archaeology: string;
  };
  literary: {
    genre: string;
    structure: string;
  };
  lingTheo: {
    keywords: { term: string; lang: string; meaning: string }[];
    themes: string;
    canon: string;
  };
}

export interface TimelineEvent {
  period: string;
  event: string;
  description: string;
  globalHistory: string;
  reference: string;
}

export interface TheologicalDefinition {
  term: string;
  etymology: string;
  definition: string;
  historicalDevelopment: string;
  opposingViews: string;
  biblicalFoundation: string;
}

export enum NavSection {
  Dashboard = 'dashboard',
  Generator = 'generator',
  Gallery = 'gallery',
  Translator = 'translator',
  Dictionary = 'dictionary',
  PortugueseDictionary = 'portuguese-dictionary',
  ThemeGallery = 'theme-gallery',
  QuickNotes = 'quick-notes',
  BiblicalCommentary = 'biblical-commentary',
  BiblicalBiography = 'biblical-biography',
  BiblicalDeepDive = 'biblical-deep-dive',
  ChronologicalTimeline = 'chronological-timeline',
  UniversalSearch = 'universal-search',
  Bible = 'bible'
}
