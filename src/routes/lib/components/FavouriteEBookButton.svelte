<script lang="ts">
  // @ts-nocheck
  import Icon from '@iconify/svelte'
  import { onMount } from 'svelte'
  import { displayPdfStore, favouriteStore } from '../../../stores/appStore'
  import { get } from 'svelte/store'
  import { toggleFavourite } from '../../../events/pdfEvents'

  let loading = false
  let currentPdf = null
  let favourites = []
  let matchedFavourite = null
  let isFavourite = false

  onMount(() => {
    currentPdf = get(displayPdfStore)
    const data = get(favouriteStore) || []
    favourites = data.filter((fav) => fav.type === 'ebook')
  })

  $: matchedFavourite = currentPdf?.id
    ? favourites.find((fav) => fav.book == currentPdf.id)
    : null

  $: isFavourite = !!matchedFavourite

  async function handleToggleFavourite() {
    if (!currentPdf) return

    loading = true
    try {
      const response = await toggleFavourite(matchedFavourite, currentPdf)
      if (!response.err) {
        isFavourite = !isFavourite
      }
    } catch (err) {
      console.error('Toggle favourite failed', err)
    } finally {
      loading = false
    }
  }
</script>

<button
  class="p-1 disabled:opacity-50 disabled:cursor-not-allowed"
  on:click={handleToggleFavourite}
  disabled={loading}
>
  {#if loading}
    <Icon icon="mdi:loading" class="w-7 h-7 animate-spin text-[#6257a5]" />
  {:else if isFavourite}
    <Icon icon="mdi:bookmark" class="w-7 h-7 text-[#6257a5]" />
  {:else}
    <Icon icon="mdi:bookmark-outline" class="w-7 h-7 text-[#6257a5]" />
  {/if}
</button>
