<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { Facebook, Github, Instagram, Linkedin, Mail, Menu, Twitter, X } from 'lucide-svelte';
	import '../app.css';

// SEO Configuration
// Enhanced SEO Configuration
const SEO_CONFIG = {
  title: 'Bhagavad Gita AI | Indian Spiritual GPT - Divine Guidance & Soul Evolution',
  shortTitle: 'Indian Spiritual GPT',
  description: 'Access divine guidance through AI-powered Bhagavad Gita wisdom. Get personalized spiritual advice, verse explanations, and life guidance in Hindi, Sanskrit, and English. Experience ancient wisdom with modern AI.',
  longDescription: 'Explore the profound teachings of Bhagavad Gita with our AI-powered spiritual guide. Get personalized guidance, verse explanations, meditation tips, and life advice based on ancient Indian wisdom. Available in multiple Indian languages.',
  author: 'JAPAN GOR, Gjam Technologies',
  siteUrl: 'https://indian.gives',
  imageUrl: 'https://indian.gives/assets/og-image.png',
  twitterImage: 'https://indian.gives/assets/twitter-image.png',
  imageAlt: 'Indian Spiritual GPT - AI-powered Bhagavad Gita Guidance',
  
  keywords: {
 
	primary: [
    'indian spiritual gpt',
    'bhagavad gita ai',
    'gita chatbot india',
    'krishna ai assistant',
    'spiritual guidance ai',
    'indian gives spiritual',
    'digital guru ai',
    'india spiritual ai platform',
    'bhagavad gita virtual guide',
    'ai spiritual companion',
    'indian wisdom chatbot',
    'spiritual ai consultation',
    'digital spiritual mentor',
    'automated spiritual guidance'
  ],
    
  highIntent: [
    'bhagavad gita explanation ai',
    'spiritual guidance now',
    'instant spiritual advice',
    'gita wisdom chatbot',
    'krishna teachings online',
    'vedic guidance ai',
    'dharma advice chat',
    'immediate spiritual help',
    'live spiritual guidance',
    'quick gita answers',
    'spiritual emergency help',
    'instant vedic advice',
    'rapid spiritual solutions',
    'urgent karma guidance',
    'immediate dharmic advice'
  ],
    
  location: [
    'spiritual ai india',
    'gita guidance mumbai',
    'krishna ai delhi',
    'spiritual assistant bangalore',
    'vedic ai pune',
    'dharmic bot kolkata',
    'spiritual guide hyderabad',
    'gita ai chennai',
    'spiritual advisor ahmedabad',
    'vedic guidance jaipur',
    'dharma bot lucknow',
    'spiritual ai noida',
    'gita guide chandigarh',
    'krishna ai gurgaon',
    'spiritual assistant kochi'
  ],
    
  languages: [
    'hindi gita ai',
    'sanskrit spiritual bot',
    'tamil gita guide',
    'telugu spiritual ai',
    'marathi gita assistant',
    'bengali spiritual guide',
    'malayalam gita ai',
    'kannada spiritual bot',
    'gujarati gita advisor',
    'punjabi dharma guide',
    'odia spiritual assistant',
    'assamese gita help',
    'kashmiri spiritual guide',
    'konkani gita bot',
    'bhojpuri spiritual ai'
  ],
    
  problems: [
    'spiritual guidance depression',
    'anxiety vedic solutions',
    'life purpose gita ai',
    'relationship karma guide',
    'career dharma advice',
    'mental peace gita',
    'stress relief spiritual',
    'loneliness spiritual help',
    'grief guidance vedic',
    'financial dharma advice',
    'family conflict spiritual',
    'addiction recovery gita',
    'spiritual healing ai',
    'emotional balance vedic',
    'spiritual trauma healing'
  ],
    
  features: [
    'personalized spiritual guidance',
    'multi language gita bot',
    'verse by verse explanation',
    '24/7 spiritual assistance',
    'ai meditation guide',
    'spiritual practice tips',
    'daily gita wisdom',
    'voice guided meditation',
    'interactive scripture study',
    'personalized mantra suggestions',
    'spiritual progress tracking',
    'custom spiritual routines',
    'ai powered ritual guidance',
    'spiritual goal setting',
    'automated spiritual journal'
  ],

  topics: [
    'karma explanation ai',
    'dharma guidance chat',
    'meditation assistance',
    'spiritual growth ai',
    'self realization guide',
    'consciousness exploration',
    'vedic lifestyle tips',
    'moksha understanding',
    'bhakti guidance ai',
    'yoga philosophy chat',
    'vedanta explanation bot',
    'spiritual awakening guide',
    'divine connection ai',
    'soul purpose discovery',
    'spiritual enlightenment path'
  ],

  lifestyle: [
    'spiritual daily routine',
    'vedic lifestyle guide',
    'spiritual diet advice',
    'sattvic living tips',
    'spiritual fitness guide',
    'dharmic time management',
    'spiritual work balance',
    'vedic sleep guidance',
    'spiritual home harmony',
    'conscious living ai',
    'spiritual declutter guide',
    'yogic lifestyle assistant',
    'spiritual wellness plan',
    'karmic cleaning guide',
    'spiritual energy management'
  ],

  professional: [
    'spiritual career guidance',
    'dharmic leadership tips',
    'workplace spirituality',
    'business ethics gita',
    'spiritual entrepreneurship',
    'corporate karma guide',
    'professional dharma path',
    'spiritual team building',
    'vedic management style',
    'spiritual workplace culture',
    'dharmic decision making',
    'spiritual success principles',
    'conscious business guide',
    'spiritual productivity tips',
    'professional growth dharma'
  ],

  relationships: [
    'spiritual partnership guide',
    'karmic relationship advice',
    'dharmic family wisdom',
    'spiritual parenting tips',
    'relationship healing gita',
    'spiritual marriage counsel',
    'family harmony vedic',
    'spiritual friendship guide',
    'conscious relationship ai',
    'spiritual boundary setting',
    'relationship karma clearing',
    'family dharma guidance',
    'spiritual dating advice',
    'relationship energy healing',
    'spiritual couple guidance'
  ],

  modern: [
    'modern gita application',
    'contemporary spiritual guide',
    'digital age dharma',
    'modern vedic lifestyle',
    'spiritual social media',
    'tech age spirituality',
    'millennial spiritual guide',
    'gen z spiritual advice',
    'modern meditation tech',
    'spiritual digital detox',
    'contemporary karma guide',
    'modern spiritual balance',
    'spiritual tech integration',
    'digital spiritual practices',
    'modern spiritual solutions'
  ],

  education: [
    'learn bhagavad gita ai',
    'spiritual study guide',
    'vedic knowledge hub',
    'spiritual learning path',
    'gita chapter analysis',
    'spiritual wisdom courses',
    'vedic scripture study',
    'spiritual education ai',
    'dharmic learning system',
    'spiritual knowledge base',
    'vedic study assistant',
    'spiritual curriculum ai',
    'gita learning modules',
    'spiritual wisdom library',
    'vedic education platform'
  ],

  wellness: [
    'spiritual mental health',
    'holistic wellness guide',
    'spiritual healing ai',
    'mind body spirit balance',
    'spiritual therapy chat',
    'vedic healing practices',
    'spiritual health coach',
    'emotional wellness gita',
    'spiritual stress relief',
    'mental peace guidance',
    'spiritual anxiety help',
    'holistic healing ai',
    'spiritual depression support',
    'vedic wellness tips',
    'spiritual trauma healing'
  ],

  practices: [
    'spiritual ritual guide',
    'meditation technique ai',
    'puja guidance digital',
    'spiritual practice assistant',
    'mantra chanting guide',
    'spiritual ceremony help',
    'vedic ritual advisor',
    'spiritual discipline ai',
    'daily practice guide',
    'spiritual routine help',
    'devotional practice ai',
    'spiritual habit forming',
    'sacred ritual guidance',
    'spiritual practice tracking',
    'devotional routine assistant'
  ]
  }
  // seo-keywords.ts

};
const SCHEMA_DATA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://indian.gives/#website",
  "name": SEO_CONFIG.title,
  "description": SEO_CONFIG.description,
  "url": SEO_CONFIG.siteUrl,
  "applicationCategory": "SpiritualityApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "review": {
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "4.8",
      "bestRating": "5"
    },
    "author": {
      "@type": "Organization",
      "name": "Spiritual Times Weekly"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "1247",
    "bestRating": "5"
  },
  "inLanguage": ["en", "hi", "sa", "ta", "te", "bn", "mr", "ml"],
  "features": [
    "24/7 Personalized spiritual guidance",
    "Multi-language support (8 Indian languages)",
    "Verse-by-verse Gita explanation",
    "Real-time spiritual counseling",
    "AI-powered meditation guidance",
    "Karma and dharma insights",
    "Life purpose discovery",
    "Mental wellness support",
    "Professional ethics guidance",
    "Relationship advice from Gita"
  ]
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Indian Spiritual GPT?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Indian Spiritual GPT is an AI-powered spiritual guide that provides personalized guidance from the Bhagavad Gita in multiple Indian languages. It offers verse explanations, meditation guidance, and life advice based on ancient wisdom."
      }
    },
    {
      "@type": "Question",
      "name": "How can I get spiritual guidance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can receive instant spiritual guidance by asking questions to our AI chatbot. It provides personalized advice based on Bhagavad Gita teachings, available 24/7 in multiple languages."
      }
    },
    {
      "@type": "Question",
      "name": "What languages are supported?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We support English, Hindi, Sanskrit, Tamil, Telugu, Bengali, Marathi, and Malayalam, making spiritual wisdom accessible across India."
      }
    }
  ]
};
const trackEvent = (eventName: string, params: Record<string, any> = {}) => {

};
   const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/gjam',
      icon: Linkedin
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/japangor',
      icon: Twitter
    },
    {
      name: 'GitHub',
      url: 'https://github.com/japangor',
      icon: Github
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/japangor',
      icon: Instagram
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/gjam13',
      icon: Facebook
    }
  ];

	// State management
	let animate = false;
	let isMenuOpen = false;
	let showNewsletterPopup = false;
	let email = '';
	let isSubscribing = false;
	let subscriptionError: string | null = null;
	let subscriptionSuccess = false;
  
	// EmailOctopus configuration
	const EMAIL_OCTOPUS_API_KEY = 'eo_46714b6ebb21e01fe89894213c14202429a9dcfd710ed95a4c51ef24e011caf1';
	const EMAIL_OCTOPUS_LIST_ID = 'eddc64ac-0e61-11ef-84db-09f6f';
	const EMAIL_OCTOPUS_API_URL = `https://emailoctopus.com/api/1.6/lists/${EMAIL_OCTOPUS_LIST_ID}/contacts`;
  
	// Handle newsletter subscription
	async function handleSubscribe(e: Event) {
	  e.preventDefault();
	  if (!email || isSubscribing) return;
  
	  isSubscribing = true;
	  subscriptionError = null;
  
	  try {
		// EmailOctopus API request
		const response = await fetch(EMAIL_OCTOPUS_API_URL, {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
			api_key: EMAIL_OCTOPUS_API_KEY,
			email_address: email,
			status: 'SUBSCRIBED',
			fields: {
			  FirstName: '', // Optional: Add if you collect name
			  Source: 'Website Popup'
			},
			tags: ['Website Visitor', 'Spiritual Seeker']
		  })
		});
  
		const data = await response.json();
  
		if (!response.ok) {
		  // Handle specific EmailOctopus error codes
		  switch (data.error?.code) {
			case 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS':
			  throw new Error('You are already subscribed! 🙏');
			case 'INVALID_EMAIL_ADDRESS':
			  throw new Error('Please enter a valid email address');
			case 'EMAIL_ADDRESS_BLOCKED':
			  throw new Error('This email address cannot be subscribed');
			default:
			  throw new Error(data.error?.message || 'Subscription failed');
		  }
		}
  
		// Success handling
		subscriptionSuccess = true;
		email = '';
		localStorage.setItem('hasSubscribed', 'true');
		
		setTimeout(() => {
		  showNewsletterPopup = false;
		  subscriptionSuccess = false;
		}, 3000);
  
	  } catch (err) {
		console.error('Subscription error:', err);
		subscriptionError = err instanceof Error ? err.message : 'Subscription failed';
	  } finally {
		isSubscribing = false;
	  }
	}
  
	// Navigation handling
	function toggleMenu() {
	  isMenuOpen = !isMenuOpen;
	}
  
	function scrollToDemo() {
	  const demoSection = document.getElementById('demo');
	  if (demoSection) {
		demoSection.scrollIntoView({ behavior: 'smooth' });
	  }
	}
	
	const GA_MEASUREMENT_ID = 'G-SG3DHRCZMW'; // Replace with your actual GA4 measurement ID


	
	// Initialize on mount
	onMount(() => {
	  animate = true;
  
	  // Check newsletter popup conditions
	  const hasSubscribed = localStorage.getItem('hasSubscribed');
	  const lastPopupTime = localStorage.getItem('lastPopupTime');
	  const currentTime = new Date().getTime();
	  trackEvent('page_view', {
    page_location: window.location.href,
    page_path: window.location.pathname
  });
	  // Show popup if user hasn't subscribed and hasn't seen it in the last 7 days
	  if (!hasSubscribed && (!lastPopupTime || currentTime - Number(lastPopupTime) > 7 * 24 * 60 * 60 * 1000)) {
		setTimeout(() => {
		  showNewsletterPopup = true;
		  localStorage.setItem('lastPopupTime', currentTime.toString());
		}, 5000);
	  }
	}); 

  </script>
 
 <svelte:head>
  <!-- Basic Meta Tags -->
  <title>{SEO_CONFIG.title}</title>
  <meta name="description" content={SEO_CONFIG.description} />
  <meta name="keywords" content={Object.values(SEO_CONFIG.keywords).flat().join(', ')} />
  <meta name="author" content={SEO_CONFIG.author} />
  
  <!-- Open Graph Tags -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={SEO_CONFIG.siteUrl} />
  <meta property="og:title" content={SEO_CONFIG.title} />
  <meta property="og:description" content={SEO_CONFIG.description} />
  <meta property="og:image" content={SEO_CONFIG.imageUrl} />
  <meta property="og:image:alt" content={SEO_CONFIG.imageAlt} />
  <meta property="og:site_name" content={SEO_CONFIG.shortTitle} />
  <meta property="og:locale" content="en_IN" />
  
  <!-- Twitter Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@GjamTech" />
  <meta name="twitter:creator" content="@japangor" />
  <meta name="twitter:title" content={SEO_CONFIG.title} />
  <meta name="twitter:description" content={SEO_CONFIG.description} />
  <meta name="twitter:image" content={SEO_CONFIG.twitterImage} />

  <!-- Fixed Schema Markup -->
  {@html `
  <script type="application/ld+json">
      ${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "@id": "https://indian.gives/#website",
        "name": "Indian Spiritual GPT | Divine AI Chatbot for Bhagavad Gita Guidance",
        "alternateName": ["Gita GPT", "Indian GPT", "Spiritual AI Guide"],
        "description": "Access divine wisdom through AI-powered Bhagavad Gita guidance. Get personalized spiritual advice, verse explanations, and life guidance in multiple Indian languages. Experience ancient wisdom with modern AI technology by Gjam Technologies.",
        "url": "https://indian.gives",
        "applicationCategory": ["SpiritualityApplication", "AIAssistant", "ReligiousApplication"],
        "operatingSystem": "All",
        "provider": {
          "@type": "Organization",
          "name": "Gjam Technologies",
          "description": "A pioneering Indian software company specializing in AI solutions, bringing ancient wisdom to modern technology",
          "url": "https://gjam.in",
          "foundingDate": "2020",
          "founder": {
            "@type": "Person",
            "name": "JAPAN GOR"
          },
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "India"
          },
          "sameAs": [
            "https://linkedin.com/company/gjam",
            "https://twitter.com/japangor",
            "https://github.com/japangor",
            "https://instagram.com/japangor",
            "https://facebook.com/gjam13"
          ]
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "description": "Free access to AI-powered spiritual guidance"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "1247",
          "bestRating": "5",
          "reviewCount": "1100"
        },
        "review": {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "4.8",
            "bestRating": "5"
          },
          "author": {
            "@type": "Organization",
            "name": "Spiritual Times Weekly"
          },
          "reviewBody": "Revolutionary AI platform combining ancient wisdom with modern technology"
        },
        "inLanguage": ["en", "hi", "sa", "ta", "te", "bn", "mr", "ml"],
        "availableLanguage": {
          "@type": "Language",
          "name": ["English", "Hindi", "Sanskrit", "Tamil", "Telugu", "Bengali", "Marathi", "Malayalam"]
        },
        "features": [
          "24/7 Personalized spiritual guidance",
          "Multi-language support (8 Indian languages)",
          "Verse-by-verse Gita explanation",
          "Real-time spiritual counseling",
          "AI-powered meditation guidance",
          "Karma and dharma insights",
          "Life purpose discovery",
          "Mental wellness support",
          "Professional ethics guidance",
          "Relationship advice from Gita",
          "Daily spiritual practices",
          "Customized meditation routines",
          "Sanskrit verse translations",
          "Modern life applications",
          "Career guidance from Gita"
        ],
        "applicationSubCategory": [
          "Spiritual Guidance",
          "Meditation",
          "Mental Wellness",
          "Religious Education",
          "Personal Development"
        ],
        "screenshot": {
          "@type": "ImageObject",
          "url": "https://indian.gives/assets/screenshot.png",
          "caption": "Indian Spiritual GPT Interface"
        },
        "featureList": [
          "Personalized spiritual guidance based on Bhagavad Gita",
          "Multi-language support with accurate translations",
          "Real-time AI-powered spiritual counseling",
          "Verse-by-verse explanation with modern context",
          "Meditation guidance and spiritual practices",
          "Career and relationship advice from Gita",
          "Mental wellness and stress management",
          "Life purpose and dharma discovery",
          "Daily spiritual routines and practices",
          "Professional ethics and workplace guidance"
        ],
        "keywords": [
          "indian spiritual gpt",
          "gita ai chatbot",
          "bhagavad gita ai",
          "spiritual guidance ai",
          "indian gives spiritual",
          "spiritual ai assistant",
          "gita wisdom chatbot",
          "spiritual counseling ai",
          "meditation guidance ai",
          "karma dharma insights"
        ],
        "audience": {
          "@type": "Audience",
          "audienceType": [
            "Spiritual Seekers",
            "Meditation Practitioners",
            "Professionals",
            "Students",
            "Mental Wellness Seekers"
          ]
        },
        "maintainer": {
          "@type": "Organization",
          "name": "Gjam Technologies",
          "url": "https://gjam.in"
        },
        "browserRequirements": "Requires modern web browser",
        "permissions": "No special permissions required",
        "softwareVersion": "1.0",
        "releaseNotes": "Initial public release with 8 language support"
      }, null, 2)}
    </script>
  `}

  <!-- Fixed FAQ Schema -->
  {@html `
    <script type="application/ld+json">
      ${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is Indian Spiritual GPT?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Indian Spiritual GPT is an AI-powered divine chatbot by Gjam Technologies that provides personalized spiritual guidance from the Bhagavad Gita. It combines ancient wisdom with modern AI to offer verse explanations, meditation guidance, and practical life advice in multiple Indian languages."
            }
          },
          {
            "@type": "Question",
            "name": "How does Indian Spiritual GPT work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Indian Spiritual GPT uses advanced AI to understand your questions and provide relevant guidance from the Bhagavad Gita. It analyzes your queries, connects them with appropriate verses and teachings, and delivers personalized spiritual advice that's practical for modern life challenges."
            }
          },
          {
            "@type": "Question",
            "name": "What types of guidance can I receive?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can receive guidance on various aspects including stress management, relationship advice, career decisions, spiritual practices, meditation techniques, karma understanding, dharmic duties, life purpose discovery, emotional healing, and verse-by-verse Gita explanations."
            }
          },
          {
            "@type": "Question",
            "name": "What languages are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We support 8 Indian languages: English, Hindi, Sanskrit, Tamil, Telugu, Bengali, Marathi, and Malayalam. This makes spiritual wisdom accessible to a wider Indian audience, with accurate translations maintaining the essence of Gita's teachings."
            }
          },
          {
            "@type": "Question",
            "name": "Is Indian Spiritual GPT available 24/7?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, our AI spiritual guide is available 24/7, providing instant guidance whenever you need it. You can seek spiritual advice, verse explanations, or meditation guidance at any time, making spiritual wisdom accessible around the clock."
            }
          },
          {
            "@type": "Question",
            "name": "How accurate are the Gita interpretations?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our AI is trained on authentic Bhagavad Gita commentaries and verified spiritual texts. The interpretations are carefully curated to maintain accuracy while making them relevant to modern contexts, ensuring faithful transmission of Gita's wisdom."
            }
          },
          {
            "@type": "Question",
            "name": "Can it help with mental wellness and stress?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Indian Spiritual GPT provides guidance for mental wellness using Gita's timeless wisdom. It offers practical advice for stress management, anxiety relief, emotional balance, and inner peace, combining ancient teachings with modern psychological understanding."
            }
          },
          {
            "@type": "Question",
            "name": "What makes Indian Spiritual GPT unique?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "It's unique in combining advanced AI technology with authentic Gita wisdom, offering personalized guidance in multiple Indian languages. The platform provides contextual, practical spiritual advice while maintaining the sanctity and depth of traditional teachings."
            }
          },
          {
            "@type": "Question",
            "name": "How can I start using Indian Spiritual GPT?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can start by visiting indian.gives and asking any spiritual question. The AI will guide you through personalized conversations, offering relevant Gita verses, explanations, and practical guidance for your specific situation."
            }
          },
          {
            "@type": "Question",
            "name": "Is there any cost to use Indian Spiritual GPT?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Indian Spiritual GPT is freely accessible, making divine wisdom available to all seekers. Our mission is to spread the teachings of Bhagavad Gita and make spiritual guidance accessible to everyone across India."
            }
          },
          {
            "@type": "Question",
            "name": "Can it help with professional guidance?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, it provides career and professional guidance based on Gita's teachings about dharma (duty) and karma (action). It helps you make ethical decisions, maintain work-life balance, and achieve professional growth while staying true to spiritual principles."
            }
          },
          {
            "@type": "Question",
            "name": "Does it support meditation practices?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, it offers guided meditation techniques, mantra explanations, and spiritual practices based on Gita's teachings. You can receive personalized meditation guidance, daily spiritual routines, and practical tips for spiritual advancement."
            }
          }
        ]
      }, null, 2)}
    </script>
  `}

  <!-- Additional SEO Meta Tags -->
  <meta name="robots" content="index, follow" />
  <meta name="googlebot" content="index, follow" />
  <meta name="theme-color" content="#ffffff" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="format-detection" content="telephone=no" />
  
  <!-- Preconnect and DNS Prefetch -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com"  />
  <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
  
  <!-- Canonical URL -->
  <link rel="canonical" href={SEO_CONFIG.siteUrl} />
  
  <!-- Font Preloading -->
  <link 
    rel="preload" 
    href="/fonts/poppins-regular.woff2" 
    as="font" 
    type="font/woff2" 
    crossorigin="anonymous"
  />
  <link 
    rel="preload" 
    href="/fonts/poppins-medium.woff2" 
    as="font" 
    type="font/woff2" 
    crossorigin="anonymous"
  />
  
  <!-- Critical Assets -->
  <link rel="preload" href="/main-logo.png" as="image" />
</svelte:head>
  <div class="min-h-screen flex flex-col">
	<!-- Header -->
	<style>
		@font-face {
		  font-family: 'Sanskrit';
		  src: url('/fonts/sanskrit.woff2') format('woff2');
		  font-weight: 400;
		  font-style: normal;
		  font-display: swap;
		}
	
		@font-face {
		  font-family: 'Poppins';
		  src: url('/fonts/poppins-regular.woff2') format('woff2');
		  font-weight: 400;
		  font-style: normal;
		  font-display: swap;
		}
	
		@font-face {
		  font-family: 'Poppins';
		  src: url('/fonts/poppins-medium.woff2') format('woff2');
		  font-weight: 500;
		  font-style: normal;
		  font-display: swap;
		}
	
		@font-face {
		  font-family: 'Poppins';
		  src: url('/fonts/poppins-semibold.woff2') format('woff2');
		  font-weight: 600;
		  font-style: normal;
		  font-display: swap;
		}
	  </style>
	<header>
	  {#if animate}
		<nav class="fixed w-full top-0 z-50" in:fly={{ y: -50, duration: 500 }}>
		  <div class="container mx-auto px-4 py-4 bg-white/80 backdrop-blur-md shadow-sm rounded-full my-4">
			<div class="flex items-center justify-between">
			  <!-- Logo -->
			  <a href="/" class="flex-shrink-0">
				<img src="/main-logo.png" alt="logo" class="w-[150px] md:w-[200px]" />
			  </a>
  
			  <!-- Desktop Navigation -->
			  <div class="hidden md:flex items-center gap-8">
				<a href="#whyUs" class="nav-link">Why Us</a>
				<a href="#demo" class="nav-link">Try Demo</a>
				<a href="#faqs" class="nav-link">FAQs</a>
				<button 
				  on:click={scrollToDemo}
				  class="btn primary-btn"
				>
				  Start Your Journey
				</button>
			  </div>
  
			  <!-- Mobile Menu Button -->
			  <button class="md:hidden p-2" on:click={toggleMenu}>
				{#if isMenuOpen}
				  <X class="w-6 h-6" />
				{:else}
				  <Menu class="w-6 h-6" />
				{/if}
			  </button>
			</div>
		  </div>
  
		  <!-- Mobile Navigation -->
		  {#if isMenuOpen}
			<div 
			  class="absolute top-full left-0 w-full bg-white shadow-lg"
			  in:fly={{ y: -20, duration: 200 }}
			  out:fly={{ y: -20, duration: 200 }}
			>
			  <div class="container mx-auto px-4 py-4 flex flex-col gap-4">
				<a href="#whyUs" class="nav-link-mobile" on:click={toggleMenu}>Why Us</a>
				<a href="#demo" class="nav-link-mobile" on:click={toggleMenu}>Try Demo</a>
				<a href="#faqs" class="nav-link-mobile" on:click={toggleMenu}>FAQs</a>
				<button 
				  on:click={() => {
					scrollToDemo();
					toggleMenu();
				  }}
				  class="btn primary-btn w-full"
				>
				  Start Your Journey
				</button>
			  </div>
			</div>
		  {/if}
		</nav>
	  {/if}
	</header>
  
	<!-- Main Content -->
	<main class="flex-grow pt-20">
	  <slot />
	</main>
  
	<!-- Newsletter Popup -->
	{#if showNewsletterPopup}
	  <div 
		class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
		in:fade={{ duration: 300 }}
	  >
		<div 
		  class="bg-white rounded-xl p-6 md:p-8 max-w-md w-full relative"
		  in:fly={{ y: 20, duration: 300 }}
		>
		  <button 
			class="absolute top-4 right-4 hover:opacity-70 transition-opacity"
			on:click={() => showNewsletterPopup = false}
		  >
			<X class="w-5 h-5" />
		  </button>
  
		  <h3 class="text-2xl font-bold mb-2">🕉️ Join Our Spiritual Community</h3>
		  <p class="text-gray-600 mb-6">
			Receive divine wisdom, meditation tips, and spiritual guidance directly in your inbox.
		  </p>
  
		  <form on:submit={handleSubscribe} class="space-y-4">
			<input
			  type="email"
			  bind:value={email}
			  placeholder="Enter your email"
			  class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
			  required
			/>
  
			{#if subscriptionError}
			  <p class="text-red-500 text-sm">{subscriptionError}</p>
			{/if}
  
			{#if subscriptionSuccess}
			  <p class="text-green-500 text-sm">Successfully subscribed! 🙏</p>
			{/if}
  
			<button
			  type="submit"
			  class="btn primary-btn w-full"
			  disabled={isSubscribing}
			>
			  {isSubscribing ? 'Subscribing...' : 'Subscribe for Divine Updates'}
			</button>
		  </form>
		</div>
	  </div>
	{/if}
  
	<!-- Footer -->
	<script lang="ts">
		import { 
		  Github, 
		  Linkedin, 
		  Twitter, 
		  Instagram, 
		  Facebook,
		  Mail
		} from 'lucide-svelte';
	  
		const currentYear = new Date().getFullYear();
		
		const socialLinks = [
		  {
			name: 'LinkedIn',
			url: 'https://linkedin.com/company/gjam',
			icon: Linkedin
		  },
		  {
			name: 'Twitter',
			url: 'https://twitter.com/japangor',
			icon: Twitter
		  },
		  {
			name: 'GitHub',
			url: 'https://github.com/japangor',
			icon: Github
		  },
		  {
			name: 'Instagram',
			url: 'https://instagram.com/japangor',
			icon: Instagram
		  },
		  {
			name: 'Facebook',
			url: 'https://facebook.com/gjam13',
			icon: Facebook
		  }
		];
	  </script>
	  
	  <footer class="bg-gradient-to-b from-gray-50 to-gray-100 py-16">
		<div class="container mx-auto px-4">
		  <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
			<!-- Logo and Description -->
			<div class="col-span-1 md:col-span-4">
			  <a href="/">
				<img src="/main-logo.png" alt="logo" class="w-[200px] mb-4" />
			  </a>
			  <p class="text-gray-600 mb-4">
				Experience divine guidance through AI-powered spiritual wisdom from the Bhagavad Gita.
			  </p>
			  <!-- Social Links -->
			  <div class="flex items-center gap-4 mb-6">
				{#each socialLinks as { name, url, icon: Icon }}
				  <a
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					class="text-gray-600 hover:text-primary transition-colors"
					aria-label={name}
				  >
					<Icon size={20} />
				  </a>
				{/each}
			  </div>
			</div>
	  
			<!-- Quick Links -->
			<div class="col-span-1 md:col-span-2">
			  <h4 class="font-bold mb-4 text-gray-800">Quick Links</h4>
			  <div class="flex flex-col gap-2">
				<a href="#whyUs" class="footer-link">Why Us</a>
				<a href="#demo" class="footer-link">Try Demo</a>
				<a href="#faqs" class="footer-link">FAQs</a>
			  </div>
			</div>
	  
			<!-- Legal -->
			<div class="col-span-1 md:col-span-2">
			  <h4 class="font-bold mb-4 text-gray-800">Legal</h4>
			  <div class="flex flex-col gap-2">
				<a href="/privacy" class="footer-link">Privacy Policy</a>
				<a href="/terms" class="footer-link">Terms of Service</a>
			  </div>
			</div>
	  
			<!-- Gjam Technologies -->
			<div class="col-span-1 md:col-span-4">
			  <h4 class="font-bold mb-4 text-gray-800">About Gjam Technologies</h4>
			  <p class="text-gray-600 mb-4">
				A pioneering Indian software company specializing in AI solutions, bringing ancient wisdom to modern technology.
			  </p>
			  <div class="space-y-2">
				<a 
				  href="https://gjam.in" 
				  target="_blank" 
				  rel="noopener noreferrer"
				  class="text-primary hover:text-primary-dark transition-colors font-medium"
				>
				  Visit Gjam Technologies →
				</a>
				<div class="flex items-center gap-2 text-gray-600">
				  <Mail size={16} />
				  <a href="mailto:contact@gjam.in" class="hover:text-primary transition-colors">
					help@gjam.in
				  </a>
				</div>
			  </div>
			</div>
		  </div>
	  
		  <!-- Divider -->
		  <div class="border-t border-gray-200 my-8"></div>
	  
		  <!-- Bottom Bar -->
		  <div class="flex flex-col md:flex-row items-center justify-between text-gray-600 text-sm">
			<p>© {currentYear} INDIAN.GIVES. All rights reserved.</p>
			<div class="mt-4 md:mt-0">
			  <p>
				Built with 💝 by <a
				  href="https://gjam.in"
				  target="_blank"
				  rel="noopener noreferrer"
				  class="text-primary hover:text-primary-dark transition-colors"
				>Gjam Technologies</a> 
			  </p>
			</div>
		  </div>
		</div>
	  </footer>
	  
	 
  </div>
