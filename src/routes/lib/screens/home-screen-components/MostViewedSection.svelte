<script lang="ts">
  // @ts-nocheck
  import Icon from '@iconify/svelte'
  import Label from '../../components/Label.svelte'
  import { navigateTo } from '$lib/navigation'
  import { backPageStore, language } from '../../../../stores/appStore'
  import { fetchMostViewedPDF } from '../../../../events/pdfEvents'
  import { onMount } from 'svelte'
  import PdfCard from '../../components/PDFCard.svelte'
  import PdfSkeleton from '../../components/PDFSkeleton.svelte'
  import { translations } from '../../../../utils/translations'

  let pdfs = []
  let loading = true

  const fetchData = async () => {
    const response = await fetchMostViewedPDF()
    console.log(response.result)
    if (response && !response.err) {
      pdfs = response.result
    }
    loading = false
  }

  onMount(fetchData)
</script>

<div class="pt-4">
  <Label
    leftIcon="ri:book-2-line"
    label={translations[$language]?.label2}
    showArrow
    onIconClick={() => {
      navigateTo('pdfs')
    }}
  />

  <div class="grid grid-cols-2 gap-3 mt-2">
    {#if loading}
      {#each Array(4) as _, i}
        <PdfSkeleton />
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
