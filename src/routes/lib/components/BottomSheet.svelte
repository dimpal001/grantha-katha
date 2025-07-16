<script lang="ts">
  import { fly } from 'svelte/transition'
  export let label: string = ''
  export let showSheet: boolean = false
  export let closeOnOverlayClick: boolean = true
</script>

{#if showSheet}
  <div
    class="fixed max-w-md mx-auto inset-0 z-40 bg-black/30"
    on:click={() => {
      if (closeOnOverlayClick) showSheet = false
    }}
  />

  <div
    style="scrollbar-width: none;"
    class="fixed max-w-md mx-auto bottom-0 px-5 pb-5 left-0 right-0 z-50 bg-white dark:bg-slate-800 rounded-t-3xl overflow-y-auto max-h-[60%] shadow-2xl transition-all"
    transition:fly={{ y: 300, duration: 250 }}
  >
    <div
      class="w-20 mx-auto mt-5 rounded-full h-1 bg-black/60 dark:bg-slate-600"
    />

    {#if label}
      <div
        class="p-5 border-b border-slate-200 dark:border-slate-600 font-medium text-center text-black/70 dark:text-white/70"
      >
        {label}
      </div>
    {/if}

    <div class="p-4">
      <slot />
    </div>
  </div>
{/if}
