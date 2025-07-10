<script lang="ts">
  // @ts-nocheck
  import Icon from '@iconify/svelte'
  import Label from '../../components/Label.svelte'
  import { navigateTo } from '$lib/navigation'
  import { backPageStore } from '../../../../stores/appStore'
  import { fetchMostViewedPDF } from '../../../../events/pdfEvents'
  import { onMount } from 'svelte'
  import PdfCard from '../../components/PDFCard.svelte'

  let pdfs = []
  let loading = true

  const fetchData = async () => {
    const response = await fetchMostViewedPDF()
    if (response && !response.err) {
      pdfs = response.result
    }
    loading = false
  }

  onMount(fetchData)
</script>

<div>
  <Label label="Most Viewed PDFs" showArrow />

  <div class="space-y-3 mt-2">
    {#if loading}
      {#each Array(5) as _, i}
        <div
          class="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded shadow-sm border border-gray-200 dark:border-slate-700 animate-pulse"
        >
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 bg-red-300 rounded"></div>
            <div class="h-4 bg-gray-300 dark:bg-slate-600 rounded w-40"></div>
          </div>
          <div class="h-3 bg-gray-200 dark:bg-slate-600 rounded w-16"></div>
        </div>
      {/each}
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
