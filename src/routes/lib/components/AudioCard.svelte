<script lang="ts">
  export let audio
  import Icon from '@iconify/svelte'
  import { audioPlayerStore } from '../../../stores/appStore'
</script>

<div
  role="button"
  on:click={() => {
    audioPlayerStore.set({
      title: audio.name,
      url:
        audio.url ||
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      artist: audio.artist || 'Unknown',
      isVisible: true,
      isPlaying: true,
    })
  }}
  class="p-4 bg-white dark:bg-slate-800 rounded flex justify-between items-center border border-gray-200 dark:border-slate-700 shadow-sm"
>
  <div class="flex items-center gap-3">
    <Icon
      icon="mdi:music-circle"
      class="text-green-600"
      width="24"
      height="24"
    />
    <span class="text-sm font-medium">{audio.name}</span>
  </div>
  <div class="text-xs text-gray-500">{audio.plays} plays</div>
</div>
