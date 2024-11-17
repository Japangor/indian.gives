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
  
  export interface AIResponse {
    answer: string;
    verses: VerseMatch[];
  }
  
  export interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }