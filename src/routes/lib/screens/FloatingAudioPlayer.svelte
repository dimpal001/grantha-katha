<script lang="ts">
  // @ts-nocheck
  import Icon from '@iconify/svelte'
  import { audioPlayerStore } from '../../../stores/appStore'
  import { onMount, onDestroy } from 'svelte'
  import { writable } from 'svelte/store'
  import SongPlayingAnimation from '../components/SongPlayingAnimation.svelte'

  const baseUrl = 'https://audiostream.backendservices.in'

  let audioRef: HTMLAudioElement
  let Hls: any = null
  let hls: any = null
  let currentTime = writable(0)
  let duration = writable(0)
  let isExpanded = true
  let lastPlayedUrl = null
  let state
  $: state = $audioPlayerStore

  function getStreamUrl(url: string) {
    if (!url) return ''
    const audioId = url.replace(
      /^(https?:\/\/[^\/]+\/audios\/|http:\/\/localhost:\d+\/)/,
      ''
    )
    return `${baseUrl}/audios/${audioId}/stream`
  }

  $: if (state.url && state.isPlaying && audioRef) {
    const streamUrl = getStreamUrl(state.url)

    isExpanded = true

    const needsNewPlay =
      state.url !== lastPlayedUrl || !audioRef.src || audioRef.src === ''

    if (needsNewPlay) {
      playAudio(streamUrl)
      audioRef.addEventListener('timeupdate', updateTime)
      audioRef.addEventListener('loadedmetadata', updateDuration)
      lastPlayedUrl = state.url
    } else if (audioRef.paused) {
      audioRef.play().catch(console.error)
    }
  }

  onMount(async () => {
    Hls = (await import('hls.js')).default

    if (audioRef && state.url) {
      const streamUrl = getStreamUrl(state.url)
      playAudio(streamUrl)
    }
  })

  onDestroy(() => {
    if (audioRef) {
      audioRef.removeEventListener('timeupdate', updateTime)
      audioRef.removeEventListener('loadedmetadata', updateDuration)
    }
    if (hls) {
      hls.destroy()
      hls = null
    }
  })

  function updateTime() {
    currentTime.set(audioRef?.currentTime || 0)
  }

  function updateDuration() {
    duration.set(audioRef?.duration || 0)
  }

  function playAudio(streamUrl: string) {
    if (!audioRef || !Hls?.isSupported()) return

    if (hls) {
      console.log('destroy')
      hls.destroy()
      hls = null
    }

    hls = new Hls()
    console.log('Should play')
    hls.loadSource(streamUrl)
    hls.attachMedia(audioRef)

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      audioRef.play().catch(console.error)
    })
  }

  function togglePlay() {
    if (!audioRef) return

    if (state.isPlaying) {
      audioRef.pause()
    } else {
      if (audioRef.src === '' || audioRef.readyState === 0) {
        const streamUrl = getStreamUrl(state.url)
        playAudio(streamUrl)
        lastPlayedUrl = state.url
      } else {
        audioRef.play().catch(console.error)
      }
    }

    audioPlayerStore.update((s) => ({ ...s, isPlaying: !s.isPlaying }))
  }

  function closePlayer() {
    if (audioRef) {
      audioRef.pause()
      audioRef.src = ''
      audioRef.load()
    }

    if (hls) {
      hls.destroy()
      hls = null
    }

    lastPlayedUrl = null

    audioPlayerStore.set({
      title: '',
      artist: '',
      category: '',
      url: '',
      isVisible: false,
      isPlaying: false,
    })

    isExpanded = false
  }

  function toggleExpand() {
    if (isExpanded) {
      closePlayer()
    } else {
      isExpanded = true
    }
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0')
    return `${m}:${s}`
  }
</script>

{#if state.isVisible}
  {#if isExpanded}
    <div class="fixed inset-0 flex z-30">
      <div
        class="rounded z-50 bg-[#dddddd] dark:bg-slate-900 text-gray-800 dark:text-white flex flex-col w-full max-w-xl mx-auto animate-fade-in"
      >
        <div
          class="flex justify-between items-center p-4 border-b border-black/10"
        >
          <span class="font-bold text-gray-700 dark:text-gray-300"
            >Playing episode 1 of 1</span
          >
          <button on:click={toggleExpand}>
            <Icon icon="mdi:close" width="28" height="28" />
          </button>
        </div>

        <div class="flex justify-center py-12">
          <img
            src={state?.thumbnail}
            alt="Thumbnail"
            class="w-48 h-48 shadow-md rounded-full object-cover"
          />
        </div>

        <div class="flex justify-center mb-5">
          {#if state.isPlaying}
            <SongPlayingAnimation />
          {:else}
            <Icon
              icon="mdi:music"
              class="text-[#6257a5]"
              width="35"
              height="35"
            />
          {/if}
        </div>

        <div class="text-center flex-col flex justify-center px-6">
          <h2 class="text-3xl font-bold line-clamp-2 font-serif">
            {state.title}
          </h2>
          <p class="text-lg font-bold text-gray-600 dark:text-gray-400 mt-1">
            Episode 1
          </p>
        </div>

        <div class="w-full px-10 mt-4">
          <input
            type="range"
            min="0"
            max={$duration || 0}
            value={$currentTime || 0}
            on:input={(e) => {
              audioRef.currentTime = +e.target.value
              currentTime.set(+e.target.value)
            }}
            class="w-full h-3 pt-1 rounded-lg appearance-none cursor-pointer custom-range"
          />
          <div
            class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1"
          >
            <span>{formatTime($currentTime || 0)}</span>
            <span>{formatTime($duration || 0)}</span>
          </div>
        </div>

        <div class="flex items-center justify-center px-6 mt-3 gap-3">
          <Icon icon="mdi:volume-high" width="20" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audioRef?.volume || 1}
            on:input={(e) => (audioRef.volume = +e.target.value)}
            class="w-2/4 h-3 pt-1 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 custom-range"
          />
        </div>

        <div class="flex justify-center gap-3 items-center py-6">
          <button><Icon icon="mdi:shuffle" width="35" /></button>
          <button><Icon icon="mdi:skip-previous" width="45" /></button>
          <button on:click={togglePlay}>
            <Icon
              icon={state.isPlaying ? 'mdi:pause-circle' : 'mdi:play-circle'}
              width="80"
              height="80"
              class="text-[#6257a5] dark:text-[#6257a5]"
            />
          </button>
          <button><Icon icon="mdi:skip-next" width="45" /></button>
          <button><Icon icon="mdi:repeat" width="35" /></button>
        </div>

        <audio
          bind:this={audioRef}
          preload="metadata"
          id="player"
          class="hidden"
        />
      </div>
    </div>
  {:else}
    <div
      class="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t p-5 px-6 shadow-lg flex items-center justify-between z-50 transition-all animate-fade-in"
      on:click|self={toggleExpand}
    >
      <div class="flex items-center gap-4 overflow-hidden">
        <div class="relative flex items-center justify-center w-10 h-10">
          {#if state.isPlaying}
            <SongPlayingAnimation />
          {:else}
            <Icon
              icon="mdi:music"
              class="text-[#6257a5]"
              width="24"
              height="24"
            />
          {/if}
        </div>

        <div class="truncate">
          <p
            class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate"
          >
            {state.title}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
            {state.category}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          on:click|stopPropagation={togglePlay}
          class="transition-transform hover:scale-110 focus:outline-none"
        >
          <Icon
            icon={state.isPlaying ? 'mdi:pause-circle' : 'mdi:play-circle'}
            width="37"
            height="37"
            class="text-[#6257a5]"
          />
        </button>
        <button
          on:click|stopPropagation={closePlayer}
          class="transition-transform hover:scale-110 focus:outline-none"
        >
          <Icon
            icon="mdi:close"
            width="24"
            height="24"
            class="text-gray-500 dark:text-gray-400"
          />
        </button>
      </div>

      <audio
        bind:this={audioRef}
        preload="metadata"
        id="player"
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

  input[type='range'] {
    appearance: none;
    background: #0c0c0c;
    border-radius: 9999px;
    height: 6px;
  }

  input[type='range'].custom-range {
    background: #444444;
  }

  input[type='range']::-webkit-slider-thumb {
    appearance: none;
    height: 14px;
    width: 14px;
    background: #4f46e5;
    border-radius: 50%;
    cursor: pointer;
    margin-top: -6px;
  }

  input[type='range']::-moz-range-thumb {
    height: 14px;
    width: 14px;
    background: #4f46e5;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }

  input[type='range']::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 9999px;
  }

  input[type='range']::-moz-range-track {
    height: 6px;
    border-radius: 9999px;
    background: #e2e8f0;
  }
</style>
