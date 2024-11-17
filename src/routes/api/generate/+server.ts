// src/routes/api/verses/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

const VERSES = [
  {
    index: 1001,
    text: "O Arjuna, now I shall fully describe to you this knowledge both phenomenal and numinous, knowing which nothing else remains to be known in this world."
  },
  {
    index: 1002,
    text: "This knowledge is the king of education, the most secret of all secrets. It is the purest knowledge, and because it gives direct perception of the self by realization, it is the perfection of religion. It is everlasting, and it is joyfully performed."
  },
  // Add more verses here...
];

export const GET = (async () => {
  try {
    return json(VERSES);
  } catch (err) {
    throw error(500, 'Failed to load verses');
  }
}) satisfies RequestHandler;


import { OPENAI_API_KEY } from '$env/static/private';

export const POST = (async ({ request }) => {
  try {
    const { messages } = await request.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      throw error(500, 'OpenAI API request failed');
    }

    const data = await response.json();
    return json({ response: data.choices[0].message.content });
  } catch (err) {
    console.error('Error:', err);
    throw error(500, 'Failed to generate response');
  }
}) satisfies RequestHandler;