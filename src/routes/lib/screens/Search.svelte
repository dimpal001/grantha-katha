<script lang="ts">
  // @ts-nocheck
  import Icon from '@iconify/svelte'
  import { onMount } from 'svelte'
  import { fetchAudios } from '../../../events/audioEvents'
  import { fetchPdfs } from '../../../events/pdfEvents'
  import { debounced } from '../../../utils/debounce'
  import { writable } from 'svelte/store'
  import PdfCard from '../components/PDFCard.svelte'
  import AudioCard from '../components/AudioCard.svelte'
  import AudioSkeleton from '../components/AudioSkeleton.svelte'
  import PdfSkeleton from '../components/PDFSkeleton.svelte'

  const query = writable('')
  const debouncedQuery = debounced(query, 400)
  let isTyping = false

  let suggestions = [
    'বিনিময়',
    'নামঘোষা',
    'ভূপেন হাজৰিকা',
    'শব্দমালা',
    'বিশ্ববিদ্যালয়',
  ]

  let audioResults = []
  let pdfResults = []
  let loading = false

  $: if ($debouncedQuery?.trim()) {
    loadSearchResults($debouncedQuery)
  }

  async function loadSearchResults(searchQuery) {
    loading = true
    audioResults = []
    pdfResults = []

    const [audiosRes, pdfsRes] = await Promise.all([
      fetchAudios(searchQuery),
      fetchPdfs(searchQuery),
    ])

    if (audiosRes && !audiosRes.err) {
      audioResults = audiosRes.result
    }

    if (pdfsRes && !pdfsRes.err) {
      pdfResults = pdfsRes.result
    }

    loading = false
  }

  function handleFocus() {
    isTyping = true
  }

  function handleBlur() {
    setTimeout(() => (isTyping = false), 200)
  }

  function selectSuggestion(tag) {
    query.set(tag)
    loadSearchResults(tag)
  }
</script>

<main
  class="min-h-screen dark:bg-slate-900 text-gray-800 dark:text-white p-5 space-y-4 transition-all duration-300 ease-in-out"
>
  <div
    class="flex items-center gap-2 py-3 px-4 bg-gray-200 dark:bg-slate-800 rounded-md shadow-sm transition-all duration-200"
  >
    <Icon
      icon="mdi:magnify"
      class="text-gray-500 dark:text-gray-300"
      width="24"
      height="24"
    />
    <input
      bind:value={$query}
      placeholder="Search audio books, eBooks..."
      class="bg-transparent outline-none w-full placeholder:text-gray-400 text-base"
      on:focus={handleFocus}
      on:blur={handleBlur}
    />
    {#if $query}
      <button
        on:click={() => query.set('')}
        class="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700"
      >
        <Icon
          icon="mdi:close-circle"
          class="text-gray-400"
          width="20"
          height="20"
        />
      </button>
    {/if}
  </div>

  {#if !$query && !isTyping}
    <div class="space-y-2 animate-fade-in">
      <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400">
        Suggested Topics
      </h3>
      <div class="flex flex-wrap gap-2">
        {#each suggestions as tag}
          <span
            class="px-3 py-1 font-serif bg-[#cecae2] dark:bg-[#6257a5] text-[#6257a5] dark:text-[#6257a5] rounded-md text-sm transition hover:scale-105 cursor-pointer"
            on:click={() => selectSuggestion(tag)}
          >
            #{tag}
          </span>
        {/each}
      </div>
    </div>
  {/if}

  {#if $query}
    <div class="animate-fade-in-up space-y-6">
      <p class="text-sm text-gray-500">
        Showing results for "<strong>{$query}</strong>"
      </p>

      {#if loading || audioResults.length > 0}
        <div>
          <h4
            class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2"
          >
            Audios
          </h4>
          <div class="grid grid-cols-2 gap-3">
            {#if loading}
              {#each Array(2) as _, i}
                <AudioSkeleton />
              {/each}
            {:else if audioResults.length > 0}
              {#each audioResults as audio}
                <AudioCard {audio} />
              {/each}
            {:else}
              <div class="text-sm text-gray-500">No audio found.</div>
            {/if}
          </div>
        </div>
      {/if}

      {#if loading || pdfResults.length > 0}
        <div>
          <h4
            class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2"
          >
            PDFs
          </h4>
          <div class="grid grid-cols-2 gap-3">
            {#if loading}
              {#each Array(2) as _, i}
                <PdfSkeleton />
              {/each}
            {:else if pdfResults.length > 0}
              {#each pdfResults as pdf}
                <PdfCard {pdf} />
              {/each}
            {:else}
              <div class="text-sm text-gray-500">No PDFs found.</div>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</main>

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
  }

  .animate-fade-in-up {
    animation: fade-in 0.4s ease-out forwards;
  }

  .animate-pulse {
    animation: pulse 1.5s infinite ease-in-out;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.7;
    }
    50% {
      opacity: 1;
    }
  }
</style>
