<script lang="ts">
  import { fade } from 'svelte/transition';
  export let type: 'success' | 'error' = 'success';
  export let message: string;
  export let onClose: () => void;
</script>

<div
  class="fixed bottom-4 right-4 max-w-md"
  in:fade={{ duration: 200 }}
  out:fade={{ duration: 200 }}
>
  <div
    class={`rounded-lg p-4 flex items-center gap-3 shadow-lg ${
      type === 'success' 
        ? 'bg-green-50 text-green-800 border border-green-200' 
        : 'bg-red-50 text-red-800 border border-red-200'
    }`}
  >
    <span class="text-xl">
      {type === 'success' ? '🙏' : '⚠️'}
    </span>
    <p class="text-sm font-medium">{message}</p>
    <button 
      class="ml-auto text-sm opacity-75 hover:opacity-100"
      on:click={onClose}
    >
      ✕
    </button>
  </div>
</div>