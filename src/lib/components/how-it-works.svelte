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
                <div class="left topic-grid assetCtn">
                    {#each ['Dharma', 'Karma', 'Meditation', 'Purpose', 'Peace', 'Devotion'] as topic}
                        <div class="topic-card">
                            <LucideTorus class="h-5 w-5 text-primary" />
                            <span>{topic}</span>
                        </div>
                    {/each}
                </div>

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
