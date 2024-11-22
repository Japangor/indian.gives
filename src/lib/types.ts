// src/lib/types.ts
export interface Verse {
    index: number;
    text: string;
  }
  
  export interface VerseMatch {
    reference: number;
    text: string;
    score: number;
    chapter: number;
    verse: number;
  }
  export interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
  export interface AIResponse {
    answer: string;
    verses: VerseMatch[];
  }
  export interface InteractionOption {
    id: string;
    label: string;
    icon: string;
    subOptions?: {
      id: string;
      label: string;
      query: string;
      context?: string;
    }[];
  }
  
  export interface Message {
    role: "system" | "user" | "assistant";
    content: string;
    context?: {
      feature?: 'karma' | 'meditation' | 'verse';
      type?: string;
    };
  }

  // types.ts
export interface KarmaAction {
  action: string;
  context: string;
  timestamp: Date;
  dharmaScore?: number;
  guidance?: string;
  verses?: VerseMatch[];
}

export interface MeditationSession {
  type: 'basic' | 'intermediate' | 'advanced';
  duration: number;
  mantras: string[];
  guidance: string;
  verses: VerseMatch[];
}

export interface SpiritualGoal {
  type: string;
  target: string;
  progress: number;
  startDate: Date;
  verses: VerseMatch[];
  insights: string[];
}

export interface DailyVerse {
  verse: VerseMatch;
  interpretation: string;
  application: string;
  practicalSteps: string[];
}

// Add to your existing Message type
