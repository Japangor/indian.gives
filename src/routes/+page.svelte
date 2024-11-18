<script lang="ts">
	import AnimatedChat from '$lib/components/animated-chat.svelte';
	import { Clock, Globe2, Sparkles, Users } from 'lucide-svelte';
	import IntersectionObserver from 'svelte-intersection-observer';
	import { backOut } from 'svelte/easing';
	import HowItWorks from '$lib/components/how-it-works.svelte';
	import { fade, fly } from 'svelte/transition';
	import Testimonials from '$lib/components/testimonials.svelte';
	import Pricing from '$lib/components/pricing.svelte';
	import Faqs from '$lib/components/faqs.svelte';
	import { onMount } from 'svelte';
	import type { Verse, VerseMatch, AIResponse, Message } from '$lib/types';
	const suggestions = [
    "How can I find inner peace? 🧘",
    "What is my life's purpose? 🎯",
    "How to overcome fear? 💪",
    "Guide me about Karma Yoga 🔄",
    "How to maintain life balance? ⚖️"
  ];

	const whyUs = [
    {
        title: 'Divine Answers from Bhagavad Gita',
        description:
            'Ask any spiritual question and receive precise guidance directly from relevant Bhagavad Gita verses and Krishna\'s timeless wisdom.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>'
    },
    {
        title: 'Multi-Language Sanskrit Support',
        description: 'Access verses in Sanskrit with transliteration and translations in multiple languages for deeper understanding.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-languages"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>'
    },
    {
        title: 'Personalized Spiritual Analysis',
        description:
            'Receive customized interpretations and guidance based on your specific life situation and spiritual questions.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-handshake"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/><path d="m18 15-2-2"/><path d="m15 18-2-2"/></svg>'
    },
    {
        title: 'Interactive Karma Testing',
        description:
            'Evaluate your actions and decisions against Gita\'s teachings about Karma, Dharma, and righteous living.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scale"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>'
    },
    {
        title: 'Chapter & Verse Summaries',
        description: 'Get instant summaries and key teachings from any chapter or verse of the Bhagavad Gita.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>'
    },
    {
        title: 'AI-Powered Krishna\'s Wisdom',
        description:
            'Experience divine guidance through our advanced AI model trained on Vedic wisdom and authentic Gita commentaries.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lotus"><path d="M12 2a4 4 0 0 0-4 4 7 7 0 0 0 4 6 7 7 0 0 0 4-6 4 4 0 0 0-4-4Z"/><path d="M12 12c-4-3-4-7-4-7"/><path d="M12 12c4-3 4-7 4-7"/><path d="M15 20c-3-1-6-3-3-13"/><path d="M9 20c3-1 6-3 3-13"/><path d="M12 22c4-2 6-3 6-12"/><path d="M12 22c-4-2-6-3-6-12"/></svg>'
    }
];
	let imgCtn: HTMLDivElement;
	let whyUsCtn: HTMLElement;
	const stats = [
  {
    icon: Users,
    value: '10,000+',
    label: 'Spiritual Seekers',
    sublabel: 'From 50+ Countries'
  },
  {
    icon: Globe2,
    value: '10+',
    label: 'Languages',
    sublabel: 'Including Sanskrit & Regional'
  },
  {
    icon: Clock,
    value: '24/7',
    label: 'Divine Guidance',
    sublabel: 'Instant Spiritual Support'
  }
];
  // Existing props

 // Improved state management
 let question = '';
  let loading = false;
  let response: AIResponse | null = null;
  let verses: Verse[] = [];
  let error: string | null = null;

  // Improved verses loading

  // Improved verse loading with type safety
  async function loadVerses() {
    try {
      const response = await fetch('/api/verses');
      if (!response.ok) throw new Error('Failed to load verses');
      const data = await response.json();
      verses = data.map((verse: any) => ({
        index: Number(verse.index),
        text: String(verse.text)
      }));
    } catch (err) {
      console.error('Error loading verses:', err);
      error = 'Failed to load verses database';
    }
  }



// Load verses on mount
onMount(async () => {
  try {
    const response = await fetch('/api/verses');
    if (!response.ok) throw new Error('Failed to load verses');
    verses = await response.json();
  } catch (err) {
    console.error('Error loading verses:', err);
    error = 'Failed to load verses database';
  }
});

// Find matching verses
function findMatchingVerses(query: string): VerseMatch[] {
    if (!verses.length || !query) return [];
    
    const questionWords = new Set(
      query.toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 2)
    );

    const matches = verses
      .filter(verse => verse && verse.text) // Add null check
      .map(verse => {
        const verseText = (verse.text || '').toLowerCase();
        const score = Array.from(questionWords)
          .filter(word => verseText.includes(word)).length;
        
        return {
          reference: verse.index,
          text: verse.text,
          score,
          chapter: Math.floor(verse.index / 1000),
          verse: verse.index % 1000
        };
      })
      .filter(verse => verse.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return matches;
  }

// Generate response


async function generateResponse(query: string, matchedVerses: VerseMatch[]): Promise<string> {
    if (!matchedVerses.length) {
      throw new Error('No matching verses found');
    }

    const versesContext = matchedVerses
      .map(v => `Chapter ${v.chapter}, Verse ${v.verse}: ${v.text}`)
      .join('\n');

    const messages: Message[] = [
      {
        role: "system",
        content: `You are Krishna providing divine guidance based on the Bhagavad Gita. 
                Your responses should be compassionate, wise, and practical.`
      },
      {
        role: "user",
        content: `Question: ${query}
                Verses: ${versesContext}
                
                Provide guidance in this format:
                1. Divine Answer (Brief and compassionate)
                2. Verse Wisdom (How these verses apply)
                3. Practical Steps (Daily life application)
                4. Sanskrit Blessing (A relevant shloka with meaning)`
      }
    ];

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    });

    if (!response.ok) {
      throw new Error('Failed to generate response');
    }

    const data = await response.json();
    return data.response;
  }

  // Improved submit handler with better error checking
  async function handleSubmit() {
    if (!question?.trim()) {
      error = 'Please enter a question';
      return;
    }

    if (!verses.length) {
      error = 'Verses database not loaded. Please try again.';
      return;
    }
    
    loading = true;
    error = null;
    
    try {
      const matchedVerses = findMatchingVerses(question);
      if (!matchedVerses.length) {
        throw new Error('No relevant verses found. Please try a different question.');
      }
      
      const aiResponse = await generateResponse(question, matchedVerses);
      response = {
        answer: aiResponse,
        verses: matchedVerses
      };
    } catch (err) {
      console.error('Error:', err);
      error = err instanceof Error ? err.message : 'An unexpected error occurred';
      response = null;
    } finally {
      loading = false;
    }
  }

  // Improved suggestion handler
  function handleSuggestion(suggestion: string) {
    if (!suggestion) return;
    question = suggestion;
    handleSubmit();
  }

  // Load verses on mount
  onMount(() => {
    loadVerses();
  });
</script>

<section id="hero">
	<div class="left">
		<span class="tag gradient-border">
			<Sparkles strokeWidth="1" class="w-5 text-primary md:w-auto" />
			<p class="flex flex-col text-center">
				<span>🕉️ Divine AI Guidance | दैवीय एआई मार्गदर्शन</span>
				<span class="text-xs">Available in 10+ Languages</span>
			</p>
		</span>

		<h1 class="mb-4">
			<span class="block text-2xl font-semibold text-primary">॥ श्रीमद्भगवद्गीता ॥</span>
			Timeless Wisdom Through Modern AI
		</h1>
		
		<p class="sub">
			<span class="block mb-2">Experience the divine guidance of Bhagavad Gita in your language. Get instant answers, personalized insights, and practical spiritual guidance.</span>
			<span class="block text-sm text-gray-600">
				भगवद्गीता से दैवीय मार्गदर्शन प्राप्त करें | 
				ਭਗਵਤ ਗੀਤਾ ਤੋਂ ਦਿਵਯ ਮਾਰਗਦਰਸ਼ਨ |
				பகவத் கீதையின் தெய்வீக வழிகாட்டல்
			</span>
		</p>

		<div class="flex flex-col sm:flex-row gap-4 mt-6">
			<a
				href="#demo"
				class="btn primary-btn flex items-center justify-center gap-2 text-center"
			>
				<span>Start Your Spiritual Journey</span>
				<span class="text-sm">यात्रा आरंभ करें</span>
			</a>
			
			<a
				href="#demo"
				class="btn secondary-btn flex items-center justify-center gap-2 text-center"
			>
				Try Demo / डेमो देखें
			</a>
		</div>

		<!-- <div class="stats mt-8 flex flex-wrap items-center gap-6">
			<div class="stat-item flex items-center gap-3">
				<div class="users flex items-center -space-x-4">
					<img width="40" height="40" src="/seeker1.webp" alt="spiritual seeker" class="ring ring-primary" />
					<img width="40" height="40" src="/seeker2.webp" alt="spiritual seeker" class="ring ring-primary" />
					<img width="40" height="40" src="/seeker3.webp" alt="spiritual seeker" class="ring ring-primary" />
				</div>
				<p class="text-sm">
					<span class="block font-bold text-primary">10,000+ Seekers</span>
					<span class="text-xs text-gray-600">From 50+ Countries</span>
				</p>
			</div>

			<div class="divider hidden md:block">|</div>

			<div class="stat-item">
				<p class="text-sm">
					<span class="block font-bold text-primary">10+ Languages</span>
					<span class="text-xs text-gray-600">Including Sanskrit & Regional</span>
				</p>
			</div>

			<div class="divider hidden md:block">|</div>

			<div class="stat-item">
				<p class="text-sm">
					<span class="block font-bold text-primary">24/7 Guidance</span>
					<span class="text-xs text-gray-600">Instant Divine Support</span>
				</p>
			</div>
		</div> -->
	</div>

	<div class="right">
		<AnimatedChat />

	</div>
</section>



<section id="whyUs" class="min-h-screen pb-7 pt-14 md:min-h-[65vh]">
	<IntersectionObserver once threshold={0.3} element={whyUsCtn} let:intersecting>
		<h2>Why use INDIAN.GIVES?</h2>

		<div bind:this={whyUsCtn} class="mt-10 grid gap-8 md:grid-cols-3 md:px-24">
			{#each whyUs as { title, description, icon }, i (i)}
				{#if intersecting}
					<div
						in:fly={{ y: 45, duration: 500, delay: 100 * i, easing: backOut }}
						class="whyUs flex h-full gap-2"
					>
						<div class="text-primary">
							{@html icon}
						</div>
						<div class="content">
							<h3 class="pb-1 font-bold">{title}</h3>
							<p>{description}</p>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</IntersectionObserver>
</section>
<!-- Demo Section -->
<section id="demo" class="min-h-screen py-16 md:min-h-[75vh] bg-gradient-to-b from-purple-50 to-orange-50">
	<div class="container mx-auto max-w-4xl px-4">
	  <h2 class="text-center text-3xl font-bold mb-8">
		Experience Divine Guidance
		<span class="block text-lg font-normal text-gray-600 mt-2">Ask Krishna for guidance on any aspect of life</span>
	  </h2>
  
	  <div class="bg-white rounded-xl shadow-xl p-6 md:p-8">
		<!-- Question Input -->
		<div class="mb-6">
		  <input
			type="text"
			bind:value={question}
			placeholder="🔍 Ask your spiritual question here..."
			class="w-full p-4 rounded-lg border border-primary/30 focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 backdrop-blur-sm"
		  />
		</div>
  
		<!-- Suggestions -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
		  <!-- svelte-ignore missing-declaration -->
		  {#each suggestions as suggestion}
			<button
			  on:click={() => handleSuggestion(suggestion)}
			  class="text-left p-3 rounded-lg border border-primary/20 hover:bg-primary/10 transition-colors"
			>
			  {suggestion}
			</button>
		  {/each}
		</div>
  
		<!-- Submit Button -->
		<button
		  on:click={handleSubmit}
		  class="w-full bg-primary text-white py-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
		  disabled={loading}
		>
		  {loading ? '॥ Seeking divine wisdom... ॥' : '🙏 Seek Divine Guidance'}
		</button>
  
		<!-- Error Message -->
		{#if error}
		  <div class="mt-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200" in:fade>
			{error}
		  </div>
		{/if}
  
		<!-- Response -->
		{#if response}
		  <div class="mt-8 space-y-6" in:fly={{ y: 20, duration: 500 }}>
			<!-- Divine Answer -->
			<div class="bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg p-6">
			  <div class="text-primary text-lg mb-4">॥ श्री कृष्ण उवाच ॥</div>
			  <div class="prose max-w-none whitespace-pre-line">
				{response.answer}
			  </div>
			</div>
  
			<!-- Referenced Verses -->
			{#if response.verses.length}
			  <div class="space-y-4">
				<h3 class="text-xl font-bold text-primary">📜 Referenced Verses</h3>
				{#each response.verses as verse}
				  <div class="verse-box bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-primary/20" 
					   in:fly={{ y: 20, duration: 300 }}>
					<div class="text-primary mb-2">Chapter {verse.chapter}, Verse {verse.verse}</div>
					<div class="text-gray-700">{verse.text}</div>
				  </div>
				{/each}
			  </div>
			{/if}
		  </div>
		{/if}
	  </div>
	</div>
  </section>
<section id="howItWorks" class="min-h-screen py-16 md:min-h-[75vh]">
	<h2>How it works</h2>
	<p class="text-center">Using AI Studybud is very simple.</p>

	<HowItWorks />
</section>
<section id="subscribe" class="min-h-screen py-16 md:min-h-[75vh] bg-gradient-to-b from-white to-gray-50">
	<div class="container mx-auto px-4">
	  <div class="max-w-4xl mx-auto text-center mb-12">
		<h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
		  🕉️ Embrace Divine Wisdom Daily
		</h2>
		<p class="text-lg text-gray-600 mb-8">
		  Join our spiritual journey to discover timeless teachings of the Bhagavad Gita, 
		  delivered through modern AI technology. Receive personalized guidance, verses, 
		  and practical wisdom for your daily life.
		</p>
	  </div>
  
	  <div class="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-10">
		<div class="grid md:grid-cols-2 gap-8 mb-8">
		  <div class="flex items-start space-x-3">
			<div class="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
			  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
			  </svg>
			</div>
			<div>
			  <h3 class="font-semibold text-gray-900 mb-1">Daily Wisdom</h3>
			  <p class="text-gray-600 text-sm">Curated verses and interpretations from the Bhagavad Gita</p>
			</div>
		  </div>
  
		  <div class="flex items-start space-x-3">
			<div class="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
			  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
			  </svg>
			</div>
			<div>
			  <h3 class="font-semibold text-gray-900 mb-1">Spiritual Insights</h3>
			  <p class="text-gray-600 text-sm">AI-powered guidance for modern life challenges</p>
			</div>
		  </div>
  
		  <div class="flex items-start space-x-3">
			<div class="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
			  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
			  </svg>
			</div>
			<div>
			  <h3 class="font-semibold text-gray-900 mb-1">Meditation Tips</h3>
			  <p class="text-gray-600 text-sm">Practical meditation and mindfulness techniques</p>
			</div>
		  </div>
  
		  <div class="flex items-start space-x-3">
			<div class="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
			  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
			  </svg>
			</div>
			<div>
			  <h3 class="font-semibold text-gray-900 mb-1">Community Access</h3>
			  <p class="text-gray-600 text-sm">Join a community of spiritual seekers</p>
			</div>
		  </div>
		</div>
  
		<!-- EmailOctopus Embedded Form -->
		<div id="email-form-wrapper" class="mt-8">
		  <script async src="https://eocampaign1.com/form/ed6bb2fa-a571-11ef-b5c9-eda330e5b5ed.js" data-form="ed6bb2fa-a571-11ef-b5c9-eda330e5b5ed"></script>
		</div>
  
		<p class="text-center text-sm text-gray-500 mt-6">
		  Join 1000+ spiritual seekers receiving divine guidance every week
		</p>
	  </div>
	</div>
  </section>
  
<section id="testimonials" class="min-h-screen bg-gray-100 py-16 md:min-h-[75vh]">
	<h2>Testimonials</h2>
	<p class="text-center">Don't just take our word for it...</p>

	<Testimonials />
</section>

<!-- <section id="pricing" class="relative min-h-screen py-16 md:min-h-[75vh]">
	<div
		class="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
		style="background: linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.26) 34.2%, rgba(192, 132, 252, 0.1) 77.55%);"
	></div>

	<h2>Pricing</h2>
	<p class="text-center">Take a look at our affordable pricing plans.</p>

	<Pricing />
</section> -->

<section id="faqs" class="min-h-screen py-16 md:min-h-[75vh]">
	<h2>FAQs</h2>
	<p class="text-center">Frequently asked questions</p>

	<Faqs />
</section>

<style lang="scss">
	#hero {
		position: relative;
		min-height: 100vh;
		overflow: hidden; /* Ensure the pseudo-element doesn't cause scrolling issues */

		@apply grid pt-36 md:grid-cols-2 md:pt-40;
	}

	#hero::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #e5e5f7;
		opacity: 0.1;
		background-image: linear-gradient(#c5c5c5 4px, transparent 4px),
			linear-gradient(to right, #bbbbbb 4px, #e5e5f7 4px);
		background-size: 80px 80px;
		z-index: 0;
	}

	#hero .left {
		position: relative;
		z-index: 1;

		@apply md:w-[93%];
	}

	#hero .right {
		position: relative;
		z-index: 1;
	}

	.tag {
		@apply mb-4 flex w-full items-center gap-2 rounded-full border border-primary bg-purple-300 bg-opacity-20 px-5  py-1 text-sm font-semibold md:w-fit  md:text-base;
	}

	h1 {
		@apply text-3xl font-extrabold tracking-tight md:text-5xl;
	}

	.sub {
		@apply pt-3 text-left text-lg font-medium tracking-tight text-gray-700 md:pr-5;
	}

	
	.users img {
		@apply h-[40px] w-[40px] rounded-full ring ring-primary-light md:h-[50px] md:w-[50px];
	}

	section h2 {
		@apply text-center text-2xl font-extrabold md:text-3xl  md:tracking-tight;
	}

	#faqs {
		background-color: rgba(83, 242, 155, 0.1);
		background-image: linear-gradient(
			45deg,
			rgba(194, 255, 222, 0.4) 0%,
			rgba(252, 251, 229, 0.3) 80%
		);
	}

	#whyUs {
		background-color: #8ec5fc;
		background-image: linear-gradient(70deg, rgb(214, 234, 255) 0%, #f3e6ff 100%);
	}

	.gradient-border {
		--border-width: 2px;

		position: relative;
		background: #fff;
		width: fit-content;

		&::after {
			position: absolute;
			content: '';
			top: calc(-1 * var(--border-width));
			left: calc(-1 * var(--border-width));
			z-index: -1;
			border-radius: 999px;
			width: calc(100% + var(--border-width) * 2);
			height: calc(100% + var(--border-width) * 2);
			background: linear-gradient(
				60deg,
				hsl(0, 0%, 5%),
				hsl(269, 85%, 66%),
				hsl(314, 85%, 66%),
				hsl(359, 85%, 66%),
				hsl(44, 85%, 66%),
				hsl(89, 85%, 66%),
				hsl(134, 85%, 66%),
				hsl(179, 85%, 66%)
			);
			background-size: 300% 300%;
			background-position: 0 50%;
			animation: moveGradient 4s alternate infinite;
		}
	}

	@keyframes moveGradient {
		50% {
			background-position: 100% 50%;
		}
	}
</style>
