<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.js';

	const faqs = [
    {
        question: "How is GitaGPT different from regular AI chatbots?",
        answer: `GitaGPT is specifically trained on the Bhagavad Gita, ancient Vedic scriptures, and authentic commentaries by realized spiritual masters. Unlike general AI, it provides guidance based on timeless spiritual wisdom, complete with Sanskrit verses, transliterations, and practical spiritual insights. It's designed to be your personal guide in understanding and applying the Gita's teachings in your life.`
    },
    {
        question: "Is this just a translation tool for the Bhagavad Gita?",
        answer: `No, GitaGPT is much more than a translation tool. While it provides accurate translations in multiple languages, it offers personalized spiritual guidance by understanding your specific situation and connecting it with relevant Gita teachings. It's like having a conversation with a knowledgeable spiritual guide who can explain complex philosophical concepts in simple terms and provide practical applications.`
    },
    {
        question: "In which languages is GitaGPT available?",
        answer: `GitaGPT currently supports 10+ languages including Sanskrit, English, Hindi, Bengali, Tamil, Telugu, Kannada, Malayalam, Gujarati, Marathi, and Punjabi. Each response includes the original Sanskrit verse along with translation and explanation in your preferred language.`
    },
    {
        question: "How accurate is the spiritual guidance?",
        answer: `All responses are based directly on the Bhagavad Gita and authenticated Vedic scriptures. Our AI model is trained on commentaries by respected spiritual masters and scholars. Each guidance includes references to specific verses and chapters, allowing you to verify the sources yourself.`
    },
    {
        question: "What types of questions can I ask?",
        answer: `You can ask any questions about life, dharma, spirituality, relationships, work, meditation, karma yoga, devotion, or personal growth. From philosophical inquiries to practical daily life situations, GitaGPT provides guidance based on the Gita's timeless wisdom.`
    },
    {
        question: "Are there any subscription plans?",
        answer: `Yes, we offer both free and premium plans. The free plan gives you access to basic guidance, while premium plans include features like detailed verse analysis, multiple language support, personalized spiritual practice recommendations, and unlimited questions. You can cancel your premium subscription anytime.`
    },
    {
        question: "How does the verse recommendation work?",
        answer: `Our advanced AI analyzes your question to understand its spiritual essence and matches it with the most relevant verses from the Bhagavad Gita. It then provides a comprehensive response including the original Sanskrit, translation, philosophical insight, and practical guidance for application in daily life.`
    },
    {
        question: "Can GitaGPT help with meditation and spiritual practices?",
        answer: `Absolutely! GitaGPT can guide you in understanding different types of yoga (karma, bhakti, dhyana, etc.), recommend specific meditation techniques, provide mantras with proper pronunciation, and help establish a daily spiritual practice aligned with the Gita's teachings.`
    },
    {
        question: "What makes indian.gives unique compared to other spiritual websites?",
        answer: `indian.gives combines ancient wisdom with modern technology to provide personalized, accessible spiritual guidance. Unlike static websites or general chat platforms, we offer interactive divine guidance, verse-specific insights, multiple language support, and practical spiritual solutions tailored to your unique situation.`
    },
    {
        question: "Can I use this for group study or teaching?",
        answer: `Yes! GitaGPT is an excellent resource for group study, teaching, and spiritual discussions. Premium plans include features for creating study guides, chapter summaries, and themed compilations of verses. Many spiritual teachers and study groups use our platform to enhance their understanding and teaching of the Bhagavad Gita.`
    },
    {
        question: "How do you ensure the sanctity of the spiritual teachings?",
        answer: `We maintain the sanctity of the Bhagavad Gita by strictly adhering to authentic scriptural sources and respected commentaries. Our AI is programmed to provide guidance with appropriate reverence and humility, always pointing back to the original teachings and encouraging direct scripture study.`
    },
    {
        question: "Is there a mobile app available?",
        answer: `Yes, indian.gives is fully optimized for mobile use through your web browser. Access divine guidance anytime, anywhere. We also offer offline verse access and meditation timers in our premium plans. A dedicated mobile app is coming soon!`
    }
];
</script>

<div class="mt-5 md:px-24">
	<Accordion.Root>
		{#each faqs as { question, answer }, i (i)}
			<Accordion.Item value="item-{i + 1}" class="">
				<Accordion.Trigger class=" text-left font-semibold"
					><span class="w-[85%] md:w-auto">{question}</span></Accordion.Trigger
				>
				<Accordion.Content class="text-base text-black">
					{answer}
				</Accordion.Content>
			</Accordion.Item>
		{/each}
	</Accordion.Root>
</div>
