<script lang="ts">
  // @ts-nocheck
  import { navigateTo } from '$lib/navigation'
  export let pdf
  import Icon from '@iconify/svelte'
</script>

<div
  role="button"
  on:click={() => {
    if (pdf.price.toLowerCase() === 'free') {
      navigateTo('viewPdf')
    }
  }}
  class="relative w-full aspect-[9/14] rounded overflow-hidden shadow-lg border border-gray-200 dark:border-slate-700 group cursor-pointer"
>
  <img
    src={pdf.thumbnail ?? `https://picsum.photos/seed/${pdf.id}/300/450`}
    alt="PDF Thumbnail"
    class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
  />

  <div
    class="absolute inset-0 bg-gradient-to-t from-black to-transparent"
  ></div>

  <div class="absolute top-3 left-3 z-10 rounded-full p-1">
    <Icon icon="mdi:file-pdf-box" class="text-red-600" width="30" height="30" />
  </div>
  {#if pdf.price.toLowerCase() !== 'free'}
    <div class="absolute bottom-3 right-3 z-10">
      <Icon icon="mdi:crown" class="text-yellow-500 " width="30" height="30" />
    </div>
  {/if}

  <div class="absolute bottom-0 left-0 w-full p-3 z-10 text-white">
    <p class="text-sm font-semibold line-clamp-2 font-serif">{pdf.name}</p>
    <div class="text-xs text-gray-200 flex items-center gap-1 mt-1">
      <Icon icon="mdi:eye" class="w-3.5 h-3.5 text-gray-300" />
      {pdf.views}
    </div>
  </div>
</div>
