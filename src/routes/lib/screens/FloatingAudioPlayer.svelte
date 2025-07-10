<script lang="ts">
  // @ts-nocheck
  import Icon from '@iconify/svelte'
  import { audioPlayerStore } from '../../../stores/appStore'
  import { onMount } from 'svelte'

  let audioRef: HTMLAudioElement
  let hasMounted = false
  let isExpanded = false

  let state
  $: state = $audioPlayerStore

  $: if (hasMounted && state.isVisible && state.isPlaying && audioRef) {
    console.log('calling')
    audioRef.play().catch((err) => {
      console.error('Playback failed:', err)
    })
  }

  onMount(() => {
    hasMounted = true
  })

  function togglePlay() {
    if (!audioRef) return
    if (state.isPlaying) {
      audioRef.pause()
    } else {
      audioRef.play().catch(console.error)
    }

    audioPlayerStore.update((s) => ({
      ...s,
      isPlaying: !s.isPlaying,
    }))
  }

  function closePlayer() {
    if (audioRef) audioRef.pause()
    audioPlayerStore.set({
      title: '',
      artist: '',
      url: '',
      isVisible: false,
      isPlaying: false,
    })
    isExpanded = false
  }

  function toggleExpand() {
    isExpanded = !isExpanded
  }
</script>

{#if state.isVisible}
  {#if isExpanded}
    <div
      class="fixed inset-0 z-50 bg-white dark:bg-slate-900 text-gray-800 dark:text-white flex flex-col animate-fade-in"
    >
      <div
        class="p-6 flex justify-between items-center border-b dark:border-slate-700"
      >
        <div>
          <h2 class="text-lg font-bold">{state.title}</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">{state.artist}</p>
        </div>
        <button on:click={toggleExpand}>
          <Icon icon="mdi:chevron-down" width="28" height="28" />
        </button>
      </div>

      <div
        class="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center"
      >
        <Icon
          icon="mdi:music-circle"
          width="80"
          height="80"
          class="text-green-500"
        />
        <h3 class="text-xl font-semibold">{state.title}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">{state.artist}</p>
        <p class="text-sm mt-2">
          Enjoy high quality audio streaming. This song is popular and highly
          rated by listeners.
        </p>
      </div>

      <div
        class="flex items-center justify-center gap-6 py-4 border-t dark:border-slate-700"
      >
        <button on:click={togglePlay}>
          <Icon
            icon={state.isPlaying ? 'mdi:pause-circle' : 'mdi:play-circle'}
            width="48"
            height="48"
            class="text-blue-600 dark:text-blue-400"
          />
        </button>
        <button on:click={closePlayer}>
          <Icon
            icon="mdi:close-circle"
            width="32"
            height="32"
            class="text-red-500"
          />
        </button>
      </div>

      <audio
        bind:this={audioRef}
        src={state.url}
        preload="auto"
        class="hidden"
      />
    </div>
  {:else}
    <div
      class="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t p-5 px-6 shadow-md flex items-center justify-between z-50 transition-all animate-fade-in"
      on:click|self={toggleExpand}
    >
      <div class="flex items-center gap-3 overflow-hidden">
        <Icon icon="mdi:music" class="text-green-600" width="24" height="24" />
        <div>
          <p class="text-sm font-medium truncate">{state.title}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
            {state.artist}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button on:click|stopPropagation={togglePlay}>
          <Icon
            icon={state.isPlaying ? 'mdi:pause-circle' : 'mdi:play-circle'}
            width="30"
            height="30"
          />
        </button>
        <button on:click|stopPropagation={closePlayer}>
          <Icon icon="mdi:close-circle" width="24" height="24" />
        </button>
      </div>

      <audio
        bind:this={audioRef}
        src={state.url}
        preload="auto"
        class="hidden"
      />
    </div>
  {/if}
{/if}

<style>
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .truncate {
    max-width: 140px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
