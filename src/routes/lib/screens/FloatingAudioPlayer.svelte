<script lang="ts">
  // @ts-nocheck
  import { audioPlayerStore } from '../../../stores/appStore'
  import { onMount, onDestroy } from 'svelte'
  import { writable } from 'svelte/store'
  import SongPlayingAnimation from '../components/SongPlayingAnimation.svelte'
  import { toggleFavourite } from '../../../events/audioEvents'
  import Icon from '@iconify/svelte'

  const baseUrl = 'https://audiostream.backendservices.in'

  let audioRef: HTMLAudioElement
  let Hls: any = null
  let hls: any = null
  let currentTime = writable(0)
  let duration = writable(0)
  let isExpanded = true
  let lastPlayedUrl = null
  let currentUrlIndex = 0
  let state
  $: state = $audioPlayerStore
  $: progress = $duration ? ($currentTime / $duration) * 100 : 0

  $: currentEpisode = currentUrlIndex + 1
  $: totalEpisodes = state.urls?.length || 1

  function getStreamUrl(url: string) {
    if (!url) return ''
    const audioId = url.replace(
      /^(https?:\/\/[^\/]+\/audios\/|http:\/\/localhost:\d+\/)/,
      ''
    )
    return `${baseUrl}/audios/${audioId}/stream`
  }

  $: if (state.urls?.length && state.isPlaying && audioRef) {
    const currentUrl = state.urls[currentUrlIndex]
    const streamUrl = getStreamUrl(currentUrl)

    isExpanded = true

    const needsNewPlay =
      currentUrl !== lastPlayedUrl || !audioRef.src || audioRef.src === ''

    if (needsNewPlay) {
      playAudio(streamUrl)
      audioRef.addEventListener('timeupdate', updateTime)
      audioRef.addEventListener('loadedmetadata', updateDuration)
      lastPlayedUrl = currentUrl
    } else if (audioRef.paused) {
      audioRef.play().catch(console.error)
    }
  }

  onMount(async () => {
    Hls = (await import('hls.js')).default

    if (audioRef && state.urls?.length) {
      const streamUrl = getStreamUrl(state.urls[currentUrlIndex])
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
    if (!audioRef) return

    if (Hls.isSupported()) {
      if (hls) {
        hls.destroy()
        hls = null
      }

      hls = new Hls({
        enableWorker: true,
        maxBufferLength: 30,
      })

      hls.loadSource(streamUrl)
      hls.attachMedia(audioRef)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        audioRef.play().catch((err) => console.error('play() error:', err))
      })

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data)
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError()
              break
            default:
              hls.destroy()
              break
          }
        }
      })
    } else if (audioRef.canPlayType('application/vnd.apple.mpegurl')) {
      audioRef.src = streamUrl
      audioRef.addEventListener('loadedmetadata', () => {
        audioRef.play()
      })
    }
  }

  function togglePlay() {
    if (!audioRef) return

    if (state.isPlaying) {
      audioRef.pause()
    } else {
      if (audioRef.src === '' || audioRef.readyState === 0) {
        const streamUrl = getStreamUrl(state.urls[currentUrlIndex])
        playAudio(streamUrl)
        lastPlayedUrl = state.urls[currentUrlIndex]
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
    currentUrlIndex = 0

    audioPlayerStore.set({
      id: null,
      title: '',
      artist: '',
      category: '',
      urls: [],
      isVisible: false,
      isPlaying: false,
      isFavourite: false,
      thumbnail: '',
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

  async function toggleIsFavourite() {
    const response = await toggleFavourite(state.id, !state.is_favourite)
    if (!response.err) {
      audioPlayerStore.set({
        ...state,
        isFavourite: !state.is_favourite,
      })
    }
  }

  function seekForward(seconds: number) {
    if (!audioRef) return
    const newTime = Math.min(
      audioRef.currentTime + seconds,
      audioRef.duration || Infinity
    )
    audioRef.currentTime = newTime
    currentTime.set(newTime)
    if (state.isPlaying) {
      audioRef.play().catch((e) => console.error('Seek forward play error:', e))
    }
  }

  function seekBackward(seconds: number) {
    if (!audioRef) return
    const newTime = Math.max(audioRef.currentTime - seconds, 0)
    audioRef.currentTime = newTime
    currentTime.set(newTime)
    if (state.isPlaying) {
      audioRef
        .play()
        .catch((e) => console.error('Seek backward play error:', e))
    }
  }

  function playNextAudio() {
    if (!state.urls?.length) return
    currentUrlIndex = (currentUrlIndex + 1) % state.urls.length
    playAudio(getStreamUrl(state.urls[currentUrlIndex]))
    lastPlayedUrl = state.urls[currentUrlIndex]
  }

  function playPreviousAudio() {
    if (!state.urls?.length) return
    currentUrlIndex =
      (currentUrlIndex - 1 + state.urls.length) % state.urls.length
    const streamUrl = getStreamUrl(state.urls[currentUrlIndex])
    playAudio(streamUrl)
    lastPlayedUrl = state.urls[currentUrlIndex]
  }
</script>

{#if state.isVisible}
  {#if isExpanded}
    <div class="fixed inset-0 z-30 max-w-md mx-auto overflow-hidden">
      <div
        class="absolute max-w-md mx-auto inset-0 z-10 bg-cover bg-center filter blur-md brightness-75"
        style="background-image: url('{state?.thumbnail}')"
      ></div>

      <div
        class="absolute max-w-md mx-auto inset-0 z-20 bg-gradient-to-b from-black/70 via-black/50 to-[#1e1b4b]/80"
      ></div>

      <div
        class="relative flex flex-col justify-between pb-10 z-30 h-full shadow-xl w-full max-w-md mx-auto text-white overflow-hidden animate-fade-in backdrop-blur-md bg-white/10 border border-white/10"
      >
        <div
          class="flex justify-between items-center p-4 border-b border-white/10"
        >
          <span class="font-semibold text-sm text-white/80">
            Playing episode {currentEpisode} of {totalEpisodes}
          </span>

          <div class="flex items-center gap-4">
            <Icon
              onclick={toggleExpand}
              icon="mdi:close"
              width="24"
              height="24"
              class="cursor-pointer hover:text-white"
            />
          </div>
        </div>

        <div class="flex justify-center py-8 h-64">
          <img
            src={state?.thumbnail}
            alt="Thumbnail"
            class={`h-full aspect-square rounded-xl shadow-2xl object-cover`}
          />
        </div>

        <div class="flex justify-center mb-2">
          {#if state.isPlaying}
            <SongPlayingAnimation />
          {:else}
            <Icon
              icon="mdi:music"
              width="32"
              height="32"
              class="text-white/70"
            />
          {/if}
        </div>

        <div class="text-center px-6 mb-2">
          <h2 class="text-2xl font-bold font-serif line-clamp-2">
            {state.title}
          </h2>
          <p class="text-sm font-medium text-white/60 mt-1">
            Episode {currentEpisode}
          </p>
        </div>

        <div class="w-full px-6">
          <input
            type="range"
            min="0"
            max={$duration || 0}
            value={$currentTime || 0}
            on:input={(e) => {
              audioRef.currentTime = +e.target.value
              currentTime.set(+e.target.value)
            }}
            style="--progress: {progress}%"
            class="w-full h-3 pt-1 rounded-md appearance-none cursor-pointer custom-range"
          />
          <div class="flex justify-between text-xs text-white/60 mt-1">
            <span>{formatTime($currentTime || 0)}</span>
            <span>{formatTime($duration || 0)}</span>
          </div>
        </div>

        <div class="flex items-center justify-center gap-6 py-4">
          <!-- <button on:click={playPreviousAudio} disabled={totalEpisodes === 1}>
            <Icon
              icon="mdi:skip-previous"
              width="28"
              class="text-white hover:scale-110 transition-transform"
            />
          </button> -->

          <button on:click={() => seekBackward(15)}>
            <!-- <Icon
              icon="mdi:rewind"
              width="28"
              class="text-white hover:scale-110 transition-transform"
            /> -->
            <Icon
              icon="mdi:skip-backward-outline"
              width="28"
              class="text-white hover:scale-110 transition-transform"
            />
          </button>
          <div style="display: none">
            <Icon icon="mdi:play-circle" />
            <Icon icon="mdi:pause-circle" />
          </div>

          <button on:click={togglePlay}>
            <Icon
              icon={state.isPlaying ? 'mdi:pause-circle' : 'mdi:play-circle'}
              width="70"
              height="70"
              class="text-white hover:scale-105 transition-transform"
            />
          </button>

          <button on:click={() => seekForward(15)}>
            <!-- <Icon
              icon="mdi:fast-forward"
              width="28"
              class="text-white hover:scale-110 transition-transform"
            /> -->
            <Icon
              icon="mdi:skip-forward-outline"
              width="28"
              class="text-white hover:scale-110 transition-transform"
            />
          </button>

          <!-- <button on:click={playNextAudio} disabled={totalEpisodes === 1}>
            <Icon
              icon="mdi:skip-next"
              width="28"
              class="text-white hover:scale-110 transition-transform"
            />
          </button> -->
        </div>

        <div class="flex items-center justify-center gap-3 px-6">
          <Icon icon="mdi:volume-low" width="20" class="text-white/70" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audioRef?.volume}
            on:input={(e) => (audioRef.volume = +e.target.value)}
            class="w-32 h-1 appearance-none rounded-full bg-white/30 accent-white"
          />
          <Icon icon="mdi:volume-high" width="20" class="text-white/70" />
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
      class="fixed bottom-0 left-0 z-50 right-0 bg-white dark:bg-slate-800 border-t p-5 px-6 shadow-lg flex items-center justify-between z-50 transition-all animate-fade-in"
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

  input[type='range'].custom-range {
    --track-height: 6px;
    --thumb-size: 14px;
    --thumb-active-size: 18px;
    --fill-color: #4f46e5;
    --track-color: #e2e8f0;
    appearance: none;
    width: 100%;
    height: var(--track-height);
    border-radius: 9999px;
    cursor: pointer;
    background: linear-gradient(
      to right,
      var(--fill-color) 0%,
      var(--fill-color) var(--progress, 0%),
      var(--track-color) var(--progress, 0%),
      var(--track-color) 100%
    );
  }

  input[type='range'].custom-range::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    background: var(--fill-color);
    border: 2px solid #ffffff;
    border-radius: 50%;
    cursor: pointer;
    margin-top: calc((var(--track-height) - var(--thumb-size)) / 2);
    transition: transform 0.2s ease;
  }

  input[type='range'].custom-range:active::-webkit-slider-thumb {
    transform: scale(1.5);
  }

  input[type='range'].custom-range::-moz-range-track {
    height: var(--track-height);
    background: var(--track-color);
    border-radius: 9999px;
  }

  input[type='range'].custom-range::-moz-range-progress {
    background: var(--fill-color);
    height: var(--track-height);
    border-radius: 9999px;
  }

  input[type='range'].custom-range::-moz-range-thumb {
    height: var(--thumb-size);
    width: var(--thumb-size);
    background: var(--fill-color);
    border: 2px solid #ffffff;
    border-radius: 50%;
    transition: transform 0.2s ease;
  }

  input[type='range'].custom-range:active::-moz-range-thumb {
    transform: scale(1.2);
  }

  .rotate {
    animation: rotate 5s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
