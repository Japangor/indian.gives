<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { Facebook, Github, Instagram, Linkedin, Mail, Menu, Twitter, X } from 'lucide-svelte';
	import '../app.css';

// SEO Configuration
const title = 'Bhagavad Gita AI Chatbot | Indian Spiritual GPT by Gjam Technologies';
const description = 'Explore the teachings of the Bhagavad Gita with Indian Spiritual GPT, a divine AI chatbot by Gjam Technologies. Get personalized spiritual guidance today';
const keywords = [
  // Primary Brand Keywords
  'INDIAN.GIVES',
  'indian gives spiritual',
  'indian gives gita',
  'indian gives ai',
  'indian gives chatbot',
  
  // Core Search Terms
  'india gita gpt',
  'india gita ai',
  'india gita',
  'indian gita bot',
  'gita ai chat',
  'krishna ai chatbot',
  'bhagavad gita artificial intelligence',
  
  // Location-Specific Keywords
  'indian spiritual ai',
  'india spiritual chatbot',
  'bhagavad gita ai india',
  'spiritual ai mumbai',
  'krishna ai delhi',
  'vedic ai bangalore',
  'dharmic ai pune',
  'indian spiritual guide',
  
  // Language & Cultural Keywords
  'hindi gita ai',
  'sanskrit gita bot',
  'tamil gita ai',
  'telugu gita assistant',
  'malayalam gita guide',
  'bengali gita explanation',
  'marathi gita wisdom',
  
  // Spiritual Practice Keywords
  'digital spiritual guru',
  'ai meditation guide',
  'virtual spiritual assistant',
  'online sanskrit teacher',
  'dharma ai guide',
  'karma explanation ai',
  'yoga philosophy ai',
  
  // Scripture & Teaching Keywords
  'gita chapter summary ai',
  'bhagavad gita verse explanation',
  'krishna teachings digital',
  'arjuna dialogue ai',
  'mahabharata story ai',
  'vedic wisdom bot',
  'upanishad explanation ai',
  
  // Modern Application Keywords
  'modern life gita guidance',
  'daily spiritual wisdom',
  'work life dharma',
  'spiritual productivity',
  'mindfulness ai guide',
  'stress management gita',
  'spiritual career guidance',
  
  // Personal Growth Keywords
  'self-realization ai',
  'spiritual development guide',
  'personal transformation ai',
  'inner peace assistant',
  'spiritual journey companion',
  'consciousness expansion ai',
  'spiritual awakening guide',
  
  // Specific Use Cases
  'gita for depression',
  'anxiety spiritual guidance',
  'relationship karma advice',
  'family dharma guidance',
  'business ethics gita',
  'leadership krishna teachings',
  'decision making gita',
  
  // Technical Features
  'ai powered spiritual guide',
  'machine learning gita',
  'nlp spiritual assistant',
  'intelligent spiritual chat',
  'automated guru assistance',
  'smart spiritual guidance',
  'personalized dharma advice',
  
  // Educational Keywords
  'learn bhagavad gita online',
  'gita study companion',
  'spiritual education ai',
  'vedic learning platform',
  'sanskrit learning assistant',
  'hindu philosophy tutor',
  'spiritual wisdom courses',
  
  // Community Keywords
  'spiritual community ai',
  'bhakti network digital',
  'devotee connection platform',
  'spiritual seekers network',
  'global spiritual community',
  'divine wisdom sharing',
  'spiritual social platform',
  
  // Lifestyle Keywords
  'sattvic living guide',
  'spiritual lifestyle ai',
  'vedic daily routine',
  'spiritual diet advice',
  'ayurvedic lifestyle bot',
  'spiritual wellness ai',
  'holistic living guide',
  
  // Meditation & Practice
  'guided meditation ai',
  'digital spiritual practices',
  'virtual puja guide',
  'mantra meditation assistant',
  'spiritual ritual guidance',
  'devotional practice ai',
  'spiritual sadhana guide',
  
  // Professional Context
  'corporate spirituality',
  'workplace dharma',
  'professional ethics gita',
  'business leadership krishna',
  'management lessons gita',
  'organizational dharma',
  'work-life balance spiritual',
  
  // Youth & Modern Context
  'gita for millennials',
  'gen z spiritual guide',
  'modern spiritual wisdom',
  'contemporary gita application',
  'youth spiritual guidance',
  'spiritual social media',
  'digital age dharma',
  
  // Emotional Support
  'spiritual counseling ai',
  'emotional healing gita',
  'mental peace guidance',
  'spiritual therapy assistant',
  'psychological wellness vedic',
  'emotional balance krishna',
  'spiritual mental health',
  
  // Technology Integration
  'spiritual chatbot platform',
  'ai devotional assistant',
  'digital spiritual services',
  'smart spiritual guidance',
  'automated spiritual advice',
  'tech-enabled spirituality',
  'spiritual innovation platform',
  
  // Competitive Keywords
  'best spiritual ai',
  'top gita chatbot',
  'leading spiritual assistant',
  'premium spiritual guidance',
  'advanced spiritual ai',
  'trusted gita guide',
  'verified spiritual wisdom',
  
  // Trust & Authority
  'authentic spiritual guidance',
  'verified vedic wisdom',
  'trusted gita interpretation',
  'authentic krishna teachings',
  'certified spiritual guide',
  'authorized gita ai',
  'reliable spiritual advice',
  
  // Regional Variations
  'UK spiritual guidance',
  'USA gita wisdom',
  'Australian spiritual ai',
  'Canadian dharma guide',
  'European spiritual assistant',
  'global spiritual platform',
  'international gita guide',
  
  // Existential Questions
  'meaning of life ai',
  'purpose finding guide',
  'spiritual truth seeker',
  'existence questions gita',
  'life purpose guidance',
  'spiritual path finder',
  'divine purpose assistant'
];    const currentYear = new Date().getFullYear();
  
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


	const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};
	// Initialize on mount
	onMount(() => {
	  animate = true;
  
	  // Check newsletter popup conditions
	  const hasSubscribed = localStorage.getItem('hasSubscribed');
	  const lastPopupTime = localStorage.getItem('lastPopupTime');
	  const currentTime = new Date().getTime();
	  trackEvent('page_view', {
    page_title: title,
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
	<!-- SEO Meta Tags -->
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords.join(', ')} />
	<meta name="author" content="Gurdeep Singh, Gjam Technologies" />
  
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://indian.gives/" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="https://indian.gives/assets/og-image.png" />
	<meta property="og:image:alt" content="Bhagavad Gita AI Chatbot by Gjam Technologies" />
	<meta property="og:site_name" content="Indian Spiritual GPT" />
  
	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://indian.gives/" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="https://indian.gives/assets/twitter-image.png" />
	<meta name="twitter:image:alt" content="Bhagavad Gita AI Chatbot by Gjam Technologies" />
	<meta name="twitter:site" content="@GjamTech" />
	<meta name="twitter:creator" content="@GurdeepSinghGjam" />
  
	<!-- Preload Important Assets -->
	<link rel="preload" href="/main-logo.png" as="image" />
	<link rel="preload" href="/student.webp" as="image" />
	<link rel="preload" href="/fonts/sanskrit-font.woff2" as="font" type="font/woff2" crossorigin />
  
	<!-- Favicons -->
	<link rel="icon" href="/favicon.ico" sizes="any" />
	<link rel="icon" href="/icon.svg" type="image/svg+xml" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/manifest.webmanifest" />
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-SG3DHRCZMW"></script>

	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
	  
		gtag('config', 'G-SG3DHRCZMW');
	  </script>
	<!-- Canonical URL -->
	<link rel="canonical" href="https://indian.gives/" />
	<meta property="og:site_name" content="Indian Spiritual GPT" />
	<meta property="og:locale" content="en_IN" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	
	<!-- Mobile Meta Tags -->
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="theme-color" content="#ffffff" />
	<!-- Schema.org Markup -->
	<script type="application/ld+json">
	  {JSON.stringify({
		'@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': title,
      'description': description,
      'url': 'https://indian.gives',
      'applicationCategory': 'SpiritualityApplication',
      'operatingSystem': 'All',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'review': {
        '@type': 'Review',
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': '4.8',
          'bestRating': '5'
        },
        'author': {
          '@type': 'Organization',
          'name': 'Spiritual Times Weekly'
        }
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.9',
        'ratingCount': '1247',
        'bestRating': '5'
      },
      'inLanguage': ['en', 'hi', 'sa'],
      'features': [
        'Personalized spiritual guidance',
        'Multi-language support',
        'Verse-by-verse explanation',
        'Real-time chat interaction',
        'Available 24/7'
      ]
    })}
  </script>

  <!-- Additional Meta Tags for Social Sharing -->
  <meta property="og:site_name" content="Indian Spiritual GPT" />
  <meta property="og:locale" content="en_IN" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  </svelte:head>
  
  <div class="min-h-screen flex flex-col">
	<!-- Header -->
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
