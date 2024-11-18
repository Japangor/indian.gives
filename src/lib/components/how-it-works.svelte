<script lang="ts">
	import { CircleUser, Bot, LucideDotSquare, Sparkles, LucideTorus, BookText, MessageCircle } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { backIn, backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import IntersectionObserver from 'svelte-intersection-observer';
	let fileFormats = ['pdf', 'ppt', 'doc', 'png', 'jpg', 'txt'];

	let conversation = [
		{
            role: "How can I find inner peace?",
            message: "॥ श्रीकृष्ण उवाच ॥\n\nAs mentioned in Chapter 2, Verse 66: नास्ति बुद्धिरयुक्तस्य न चायुक्तस्य भावना।\nन चाभावयतः शान्तिरशान्तस्य कुतः सुखम्॥\n\nFor one who is not connected in divine consciousness, there is no peace. And how can there be any happiness without peace?",
        },
        {
            role: "What is my life's purpose?",
            message: "Remember what I taught Arjuna - स्वधर्मे निधनं श्रेयः परधर्मो भयावहः। Your purpose lies in fulfilling your dharma with devotion and detachment.",
        },
        {
            role: "How to deal with difficult emotions?",
            message: "As I explain in the Gita - प्रकृतेः क्रियमाणानि गुणैः कर्माणि सर्वशः। Learn to observe emotions as movements of nature, without attachment.",
        }
	];

	let stepsCtn: HTMLDivElement;
</script>


<div class="mt-14 space-y-24 md:px-24" bind:this={stepsCtn}>
    <IntersectionObserver threshold={0.4} once element={stepsCtn} let:intersecting>
        {#if intersecting}
            <!-- Step 1: Begin Journey -->
            <div class="journey-start ctn" in:fly={{ x: -50, duration: 1000 }}>
                <div class="left stepCtn">
                    <span class="step">
                        <LucideDotSquare class="h-5 w-5" />
                        <span>Step 1: Begin Your Journey</span>
                    </span>
                    <h2>Start Your Spiritual Quest</h2>
                    <p>
                        Experience divine guidance through the timeless wisdom of <span class="text-primary font-sanskrit">श्रीमद्भगवद्गीता</span>. 
                        Begin your transformation with Krishna's eternal teachings.
                    </p>
                </div>
                <div class="right assetCtn divine-glow" in:fly={{ x: 50, duration: 1000, delay: 400 }}>
                    <a href="https://indian.gives" class="cta-button">
                        <Sparkles class="h-5 w-5" />
                        <span>Begin Divine Journey</span>
                        <span class="sanskrit-text">यात्रा आरंभ करें</span>
                    </a>
                </div>
            </div>

            <!-- Step 2: Choose Topics -->
            <div class="topics ctn" in:fly={{ x: -50, duration: 1000, delay: 800 }}>
                <div class="container mx-auto px-4 py-12">
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
                      <!-- Dharma -->
                      <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group cursor-pointer">
                        <div class="flex flex-col items-center space-y-4">
                          <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div class="text-center">
                            <h3 class="font-bold text-gray-900">Dharma</h3>
                            <p class="text-sm text-gray-600 mt-1">Righteous Living & Duty</p>
                          </div>
                        </div>
                      </div>
                  
                      <!-- Karma -->
                      <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group cursor-pointer">
                        <div class="flex flex-col items-center space-y-4">
                          <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </div>
                          <div class="text-center">
                            <h3 class="font-bold text-gray-900">Karma</h3>
                            <p class="text-sm text-gray-600 mt-1">Action & Consequences</p>
                          </div>
                        </div>
                      </div>
                  
                      <!-- Meditation -->
                      <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group cursor-pointer">
                        <div class="flex flex-col items-center space-y-4">
                          <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <div class="text-center">
                            <h3 class="font-bold text-gray-900">Meditation</h3>
                            <p class="text-sm text-gray-600 mt-1">Inner Peace & Focus</p>
                          </div>
                        </div>
                      </div>
                  
                      <!-- Purpose -->
                      <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group cursor-pointer">
                        <div class="flex flex-col items-center space-y-4">
                          <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div class="text-center">
                            <h3 class="font-bold text-gray-900">Purpose</h3>
                            <p class="text-sm text-gray-600 mt-1">Life's Direction & Goals</p>
                          </div>
                        </div>
                      </div>
                  
                      <!-- Peace -->
                      <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group cursor-pointer">
                        <div class="flex flex-col items-center space-y-4">
                          <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                          </div>
                          <div class="text-center">
                            <h3 class="font-bold text-gray-900">Peace</h3>
                            <p class="text-sm text-gray-600 mt-1">Mental & Emotional Balance</p>
                          </div>
                        </div>
                      </div>
                  
                      <!-- Devotion -->
                      <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group cursor-pointer">
                        <div class="flex flex-col items-center space-y-4">
                          <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                          <div class="text-center">
                            <h3 class="font-bold text-gray-900">Devotion</h3>
                            <p class="text-sm text-gray-600 mt-1">Divine Love & Service</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <style>
                    /* Optional: Add custom animations for hover effects */
                    .group:hover {
                      transform: translateY(-2px);
                    }
                    
                    /* Ensure primary color is defined */
                    :root {
                      --primary-color: #7c3aed;
                      --primary-rgb: 124, 58, 237;
                    }
                  </style>

                <div class="right stepCtn" in:fly={{ x: 50, duration: 1000, delay: 900 }}>
                    <span class="step">
                        <BookText class="h-5 w-5" />
                        <span>Step 2: Choose Your Path</span>
                    </span>
                    <h2>Explore Divine Topics</h2>
                    <p>
                        Discover wisdom about Dharma, Karma, meditation, life's purpose, inner peace, 
                        and devotion through Krishna's teachings.
                    </p>
                </div>
            </div>

            <!-- Step 3: Divine Dialogue -->
            <div class="ask ctn" in:fly={{ x: -50, duration: 1000, delay: 1000 }}>
                <div class="left stepCtn">
                    <span class="step">
                        <MessageCircle class="h-5 w-5" />
                        <span>Step 3: Divine Dialogue</span>
                    </span>
                    <h2>Seek Krishna's Guidance</h2>
                    <p>
                        Ask any question about life, dharma, or spiritual growth. Receive personalized guidance 
                        based on Bhagavad Gita's eternal wisdom.
                    </p>
                </div>
              
            </div>
        {/if}
    </IntersectionObserver>
</div>

<style lang="scss">
	h2 {
		@apply text-lg font-bold md:text-2xl;
	}

	.step {
		@apply rounded-full bg-blue-200 px-3 py-1 text-sm font-medium shadow;
	}

	.stepCtn {
		@apply space-y-2;
	}

	.ctn {
		@apply grid  gap-3 md:grid-cols-2 md:gap-36;
	}

	.assetCtn {
		background-image: linear-gradient(
			180deg,
			rgba(149, 97, 246, 0.1) 0%,
			rgba(235, 245, 247, 0.1) 100%
		);

		@apply flex h-[170px] w-full items-center justify-center rounded-lg;
	}
</style>
