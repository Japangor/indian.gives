// src/lib/gita-ai/index.ts
import type { Verse, VerseMatch, AIResponse } from './types';

// Type definitions
export interface Verse {
  index: number;
  text: string;
}

export interface VerseMatch {
  reference: number;
  text: string;
  score: number;
  chapter: string;
  verse: string;
}

export interface AIResponse {
  answer: string;
  verses: VerseMatch[];
}

// Load and cache verses
let versesCache: Verse[] | null = null;

export async function loadVerses(): Promise<Verse[]> {
  if (versesCache) return versesCache;

  try {
    const response = await fetch('/verses/only_verses.csv');
    const text = await response.text();
    
    // Parse CSV content
    const rows = text.split('\n').slice(1); // Skip header
    const verses = rows
      .filter(row => row.trim())
      .map(row => {
        const [index, text] = row.split(',');
        return {
          index: parseInt(index),
          text: text.replace(/"/g, '')
        };
      });

    versesCache = verses;
    return verses;
  } catch (error) {
    console.error('Error loading verses:', error);
    throw new Error('Failed to load verses database');
  }
}

// Find matching verses
export function findMatchingVerses(question: string, verses: Verse[], topK: number = 3): VerseMatch[] {
  try {
    const questionWords = new Set(question.toLowerCase().split(/\s+/));
    const matches: VerseMatch[] = [];

    for (const verse of verses) {
      const verseText = verse.text.toLowerCase();
      const score = Array.from(questionWords)
        .filter(word => word.length > 2) // Ignore very short words
        .reduce((count, word) => count + (verseText.includes(word) ? 1 : 0), 0);

      if (score > 0) {
        matches.push({
          reference: verse.index,
          text: verse.text,
          score,
          chapter: Math.floor(verse.index / 1000).toString(),
          verse: (verse.index % 1000).toString()
        });
      }
    }

    return matches
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  } catch (error) {
    console.error('Error finding verses:', error);
    return [];
  }
}

// Generate response using OpenAI
export async function generateResponse(
  question: string,
  verses: VerseMatch[],
  apiKey: string
): Promise<string> {
  try {
    const versesContext = verses
      .map(v => `Chapter ${v.chapter}, Verse ${v.verse}: ${v.text}`)
      .join('\n');

    const messages = [
      {
        role: "system",
        content: `You are Krishna providing divine guidance based on the Bhagavad Gita. 
                 Your responses should be compassionate, wise, and practical.`
      },
      {
        role: "user",
        content: `Question: ${question}
                 Verses: ${versesContext}
                 
                 Provide guidance in this format:
                 1. Divine Answer(HINDI AND ENGLISH WITH REAL LIFE MEANING) (Brief and compassionate)
                 2. Verse Wisdom (How these verses apply)
                 3. Practical Steps (Daily life application)
                 4. Sanskrit Blessing (A relevant shloka with meaning)`
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate response');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate divine guidance');
  }
}

// Utility function to format response
export function formatResponse(text: string): string {
  return text.replace(/\n/g, '<br>');
}