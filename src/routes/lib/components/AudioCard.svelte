<script lang="ts">
  // @ts-nocheck
  export let audio
  import Icon from '@iconify/svelte'
  import { audioPlayerStore } from '../../../stores/appStore'
</script>

<div
  role="button"
  on:click={() => {
    if (audio.price.toLowerCase() === 'free') {
      const slug =
        audio?.url?.split('/').pop() || '1751157521012-deeplina-deka-hit-songs'
      audioPlayerStore.set({
        id: audio?.id,
        thumbnail: audio?.thumbnail,
        category: audio?.category,
        title: audio.name,
        url: slug,
        artist: audio.artist || 'Unknown',
        isFavourite: audio.is_favourite || 0,
        isVisible: true,
        isPlaying: true,
      })
    }
  }}
  class="relative aspect-[9/14] rounded-md overflow-hidden border border-gray-200 dark:border-slate-700 group cursor-pointer shadow-lg"
>
  <img
    src={audio.thumbnail ?? `https://picsum.photos/seed/${audio.id}/300/533`}
    alt="Audio Thumbnail"
    class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
  />

  <div
    class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
  ></div>

  <div class="absolute top-3 left-3 z-10">
    <Icon
      icon="mdi:music-circle"
      class="text-[#6257a5] "
      width="30"
      height="30"
    />
  </div>
  {#if audio.price.toLowerCase() !== 'free'}
    <div class="absolute bottom-3 right-3 z-10">
      <Icon icon="mdi:crown" class="text-yellow-500 " width="30" height="30" />
    </div>
  {/if}

  <div class="absolute inset-0 flex items-center justify-center z-10">
    <div class="p-2 bg-white/20 rounded-full">
      <Icon icon="mdi:play" class="text-[#6257a5]" width="35" height="35" />
    </div>
  </div>

  <div class="absolute bottom-0 left-0 w-full p-3 z-10 text-white">
    <p class="text-sm font-semibold line-clamp-2 font-serif">{audio.name}</p>
    <div class="text-xs text-gray-200 flex items-center gap-1 mt-1">
      <Icon icon="mdi:music" class="w-3.5 h-3.5 text-gray-300" />
      {audio.plays} plays
    </div>
  </div>
</div>
