<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { Facebook, Github, Instagram, Linkedin, Mail, Menu, Twitter, X } from 'lucide-svelte';
	import '../app.css';
  
	// SEO Configuration
	const title = 'Bhagavad Gita AI Chatbot | Indian Spiritual GPT by Gjam Technologies';
	const description = 'Explore the teachings of the Bhagavad Gita with Indian Spiritual GPT, a divine AI chatbot by Gjam Technologies. Get personalized spiritual guidance today';
	const keywords = [
	  'Bhagavad Gita',
	  'Indian Spiritual GPT',
	  'AI Chatbot',
	  'Krishna AI',
	  'Gjam Technologies',
	  'Divine Guidance',
	  'Gita AI',
	  // ... your other keywords
	];
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
  
	// Initialize on mount
	onMount(() => {
	  animate = true;
  
	  // Check newsletter popup conditions
	  const hasSubscribed = localStorage.getItem('hasSubscribed');
	  const lastPopupTime = localStorage.getItem('lastPopupTime');
	  const currentTime = new Date().getTime();
	  
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
	<meta name="author" content="Japangor, Gjam Technologies" />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://indian.gives/" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="https://indian.gives/assets/og-image.png" />
  
	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://indian.gives/" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="https://indian.gives/assets/twitter-image.png" />
  
	<!-- Preload Important Assets -->
	<link rel="preload" href="/main-logo.png" as="image" />
	<link rel="preload" href="/student.webp" as="image" />
	
	<!-- Canonical URL -->
	<link rel="canonical" href="https://indian.gives/" />
  
	<!-- Schema.org Markup -->
	<script type="application/ld+json">
	  {JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: title,
		description,
		url: 'https://indian.gives',
		author: {
		  '@type': 'Person',
		  name: 'Japangor',
		  url: 'https://gjam.in',
		},
		publisher: {
		  '@type': 'Organization',
		  name: 'Gjam Technologies',
		  logo: 'https://indian.gives/assets/logo.png',
		},
		mainEntityOfPage: {
		  '@type': 'WebPage',
		  '@id': 'https://indian.gives',
		},
	  })}
	</script>
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
