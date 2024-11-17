<script lang="ts">
  import { Sparkle, User } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { backOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';

  const conversations = [
    {
      title: '॥ कर्मयोग ॥',
      subtitle: 'Chapter 3: The Path of Selfless Action',
      conversations: [
        {
          role: 'user',
          message: 'O Krishna, how can I find purpose in my daily work?'
        },
        {
          role: 'krishna',
          message: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। Focus on your actions with devotion, not on their fruits.',
          verse: '2.47'
        },
        {
          role: 'user',
          message: 'But what if I face obstacles and failures?'
        },
        {
          role: 'krishna',
          message: 'योगस्थः कुरु कर्माणि। Remain steadfast in yoga, performing actions while staying balanced in success and failure.',
          verse: '2.48'
        }
      ]
    },
    {
      title: '॥ ज्ञानयोग ॥',
      subtitle: 'Chapter 4: The Path of Knowledge',
      conversations: [
        {
          role: 'user',
          message: 'How can I find inner peace in difficult times?'
        },
        {
          role: 'krishna',
          message: 'विद्या विनय संपन्ने। True peace comes from wisdom and humility, seeing the Divine in all beings.',
          verse: '4.19'
        },
        {
          role: 'user',
          message: 'What is the nature of true wisdom?'
        },
        {
          role: 'krishna',
          message: 'ज्ञानाग्निः सर्वकर्माणि। The fire of knowledge burns all karmic reactions to ashes.',
          verse: '4.37'
        }
      ]
    },
    {
      title: '॥ भक्तियोग ॥',
      subtitle: 'Chapter 12: The Path of Devotion',
      conversations: [
        {
          role: 'user',
          message: 'What is the easiest way to realize the Divine?'
        },
        {
          role: 'krishna',
          message: 'मय्यावेश्य मनो ये मां। Those who fix their minds on Me, with complete faith and devotion...',
          verse: '12.2'
        },
        {
          role: 'user',
          message: 'How should I practice this devotion?'
        },
        {
          role: 'krishna',
          message: 'मत्कर्मकृत् मत्परमो। Engage in works for Me, make Me your supreme goal, be devoted to Me.',
          verse: '11.55'
        }
      ]
    }
  ];

  let currentConversation = 0;
  let animate = false;

  function nextConversation() {
    animate = false;
    currentConversation = (currentConversation + 1) % conversations.length;
    setTimeout(() => (animate = true), 1000);
  }

  onMount(() => {
    setTimeout(() => (animate = true), 1000);
    const interval = setInterval(nextConversation, 15000);
    return () => clearInterval(interval);
  });
</script>

{#key currentConversation}
  <div 
    class="chat-container"
    in:fly={{ y: -50, duration: 1000 }}
  >
    <div class="chat-header">
      <div class="flex items-center justify-center gap-2 text-orange-600">
        <Sparkle class="h-5 w-5" />
        <span class="font-sanskrit text-lg">{conversations[currentConversation].title}</span>
      </div>
      <p class="text-sm text-gray-600 text-center mt-1">
        {conversations[currentConversation].subtitle}
      </p>
    </div>

    {#each conversations[currentConversation].conversations as { role, message, verse }, i (i)}
      {#if animate}
        <div
          class="message {role}"
          in:fly={{ y: 50, duration: 400, delay: 2000 * i, easing: backOut }}
        >
          <div class="avatar">
            {#if role === 'user'}
              <div class="seeker-avatar">
                <User class="h-6 w-6 text-orange-600" />
              </div>
            {:else}
              <div class="krishna-avatar">
                <img 
                  src="/krishna.webp" 
                  alt="Krishna" 
                  class="h-8 w-8 rounded-full"
                />
              </div>
            {/if}
          </div>
          
          <div class="message-content">
            <p>{message}</p>
            {#if verse}
              <span class="verse-reference">
                — Bhagavad Gita {verse}
              </span>
            {/if}
          </div>
        </div>
      {/if}
    {/each}
  </div>
{/key}

<style lang="scss">
  .chat-container {
    @apply mt-7 flex h-[80vh] w-full flex-col gap-4 p-6 bg-gradient-to-b from-orange-50/50 to-transparent rounded-xl 
           backdrop-blur-sm border border-orange-100/50 md:mt-0 md:h-auto;
  }

  .chat-header {
    @apply mb-4 select-none;
  }

  .message {
    @apply flex gap-3 p-4 rounded-lg transition-all duration-300;

    &.user {
      @apply bg-orange-50/50;
      
      .seeker-avatar {
        @apply w-10 h-10 rounded-full bg-orange-100/50 flex items-center justify-center;
      }
    }

    &.krishna {
      @apply bg-gradient-to-r from-orange-50/30 to-transparent;
      
      .krishna-avatar {
        @apply w-10 h-10 rounded-full bg-orange-100/50 flex items-center justify-center 
               ring-2 ring-orange-200 ring-offset-2;
      }

      .message-content {
        @apply font-sanskrit;
        
        .verse-reference {
          @apply block mt-2 text-sm text-orange-600/80 font-normal;
        }
      }
    }
  }

  .message-content {
    @apply flex-1;
  }

  .font-sanskrit {
    font-family: 'Sanskrit Text', serif;
  }
</style>
