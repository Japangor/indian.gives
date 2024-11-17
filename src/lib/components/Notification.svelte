<script lang="ts">
    import { fade } from 'svelte/transition';
    import { CheckCircle2, AlertCircle } from 'lucide-svelte';
  
    export let type: 'success' | 'error' = 'success';
    export let message: string;
  </script>
  
  <div
    class="fixed bottom-4 right-4 max-w-md"
    in:fade={{ duration: 200 }}
    out:fade={{ duration: 200 }}
  >
    <div
      class={`rounded-lg p-4 flex items-center gap-3 shadow-lg ${
        type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
      }`}
    >
      {#if type === 'success'}
        <CheckCircle2 class="w-5 h-5" />
      {:else}
        <AlertCircle class="w-5 h-5" />
      {/if}
      <p class="text-sm">{message}</p>
    </div>
  </div>