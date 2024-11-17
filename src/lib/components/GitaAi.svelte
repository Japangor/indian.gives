<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import type { Verse, VerseMatch, AIResponse } from '$lib/gita-ai';
  import { loadVerses, findMatchingVerses, generateResponse, formatResponse } from '$lib/gita-ai';
  
  // Props
  export let apiKey: string;
  
  // State
  let verses: Verse[] = [];
  let question = '';
  let loading = false;
  let response: AIResponse | null = null;
  let error: string | null = null;

  // Suggestions
  const suggestions = [
    "How can I find inner peace? 🧘",
    "What is my life's purpose? 🎯",
    "How to overcome fear? 💪",
    "Guide me about Karma Yoga 🔄",
    "How to maintain life balance? ⚖️"
  ];

  async function handleSubmit() {
    if (!question.trim()) return;
    
    loading = true;
    error = null;
    
    try {
      // Find matching verses
      const matchedVerses = findMatchingVerses(question, verses);
      
      // Generate response
      const aiResponse = await generateResponse(question, matchedVerses, apiKey);
      
      // Update response state
      response = {
        answer: aiResponse,
        verses: matchedVerses
      };
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred';
      console.error('Error:', err);
    } finally {
      loading = false;
    }
  }

  function handleSuggestion(suggestion: string) {
    question = suggestion;
    handleSubmit();
  }

  onMount(async () => {
    try {
      verses = await loadVerses();
    } catch (err) {
      error = 'Failed to load verses database';
      console.error(err);
    }
  });
</script>

<div class="gita-ai-container">
  <div class="search-container">
    <!-- Question Input -->
    <input
      type="text"
      bind:value={question}
      placeholder="🔍 Ask your spiritual question here..."
      class="question-input"
    />

    <!-- Suggestions -->
    <div class="suggestions-grid">
      {#each suggestions as suggestion}
        <button
          class="suggestion-btn"
          on:click={() => handleSuggestion(suggestion)}
        >
          {suggestion}
        </button>
      {/each}
    </div>

    <!-- Submit Button -->
    <button
      class="submit-btn"
      on:click={handleSubmit}
      disabled={loading}
    >
      {loading ? '॥ Seeking divine wisdom... ॥' : '🙏 Seek Divine Guidance'}
    </button>
  </div>

  <!-- Error Message -->
  {#if error}
    <div class="error-container" in:fade>
      {error}
    </div>
  {/if}

  <!-- Response -->
  {#if response}
    <div class="response-container" in:fly={{ y: 20, duration: 500 }}>
      <!-- Divine Answer -->
      <div class="divine-answer">
        <div class="krishna-speaks">॥ श्री कृष्ण उवाच ॥</div>
        <div class="answer-text">
          {@html formatResponse(response.answer)}
        </div>
      </div>

      <!-- Referenced Verses -->
      {#if response.verses.length}
        <div class="verses-section">
          <h3>📜 Referenced Verses</h3>
          {#each response.verses as verse}
            <div class="verse-box" in:fly={{ y: 20, duration: 300 }}>
              <div class="verse-header">
                Chapter {verse.chapter}, Verse {verse.verse}
              </div>
              <div class="verse-text">{verse.text}</div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  .gita-ai-container {
    --primary: #ff9933;
    @apply max-w-4xl mx-auto p-4;
  }

  .search-container {
    @apply bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20;
  }

  .question-input {
    @apply w-full p-4 rounded-lg border border-primary/30 bg-white/10 
           focus:ring-2 focus:ring-primary focus:border-transparent;
  }

  .suggestions-grid {
    @apply grid grid-cols-1 md:grid-cols-2 gap-3 my-4;
  }

  .suggestion-btn {
    @apply text-left p-3 rounded-lg border border-primary/20 
           hover:bg-primary/10 transition-colors;
  }

  .submit-btn {
    @apply w-full bg-gradient-to-r from-primary to-primary-dark
           text-white py-3 rounded-lg transition-all
           hover:shadow-lg hover:scale-[1.02]
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .response-container {
    @apply mt-8 bg-white/10 backdrop-blur-md rounded-xl p-6
           border border-white/20;
  }

  .divine-answer {
    @apply prose max-w-none;
  }

  .krishna-speaks {
    @apply text-primary text-lg mb-4;
  }

  .verses-section {
    @apply mt-8 space-y-4;

    h3 {
      @apply text-xl font-bold text-primary;
    }
  }

  .verse-box {
    @apply bg-white/5 backdrop-blur-sm rounded-lg p-4
           border-l-4 border-primary hover:translate-x-1
           transition-transform;
  }

  .verse-header {
    @apply text-primary mb-2;
  }

  .verse-text {
    @apply text-white/90;
  }

  .error-container {
    @apply mt-4 p-4 bg-red-500/10 text-red-400 rounded-lg
           border border-red-500/20;
  }
</style>