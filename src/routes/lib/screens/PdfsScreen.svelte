<script lang="ts">
  // @ts-nocheck
  import Icon from '@iconify/svelte'
  import Label from '../components/Label.svelte'
  import { navigateTo } from '$lib/navigation'
  import { backPageStore } from '../../../stores/appStore'
  import { fetchAllPdfs } from '../../../events/pdfEvents'
  import { onMount } from 'svelte'
  import PdfCard from '../components/PDFCard.svelte'
  import PdfSkeleton from '../components/PDFSkeleton.svelte'

  let pdfs = []
  let loading = true
  let selectedCategory = 'All'

  const categories = [
    'All',
    'উপন্যাস',
    'জীবনী',
    'বুৰঞ্জী',
    'ধর্মীয়',
    'অকাল্পনিক',
    'চুটি গল্প',
  ]

  const fetchData = async (category = 'All') => {
    loading = true
    const response = await fetchAllPdfs(category === 'All' ? null : category)
    if (response && !response.err) {
      pdfs = response.result
    } else {
      pdfs = []
    }
    loading = false
  }

  function selectCategory(category) {
    selectedCategory = category
    fetchData(category)
  }

  onMount(() => fetchData())
</script>

<div class="p-4 min-h-screen">
  <div
    style="scrollbar-width: none;"
    class="flex gap-2 overflow-scroll items-start pb-4"
  >
    {#each categories as category}
      <button
        on:click={() => selectCategory(category)}
        class={`px-3 py-1 rounded-md border font-serif text-nowrap ${
          selectedCategory === category
            ? 'bg-[#6257a5] text-white border-[#504596]'
            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-white border-gray-300'
        }`}
      >
        {category}
      </button>
    {/each}
  </div>

  <div class="grid grid-cols-2 gap-3">
    {#if loading}
      {#each Array(5) as _, i}
        <PdfSkeleton />
      {/each}
    {:else if pdfs.length === 0}
      <div class="col-span-2 text-center text-gray-400 py-10">
        No PDFs found in this category.
      </div>
    {:else}
      {#each pdfs as pdf}
        <PdfCard {pdf} />
      {/each}
    {/if}
  </div>
</div>

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.4s ease-out;
  }

  .animate-pulse {
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>
