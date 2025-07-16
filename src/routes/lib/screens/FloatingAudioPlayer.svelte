<script lang="ts">
  // @ts-nocheck
  import Icon from '@iconify/svelte'
  import { audioPlayerStore } from '../../../stores/appStore'
  import { onMount, onDestroy } from 'svelte'
  import { writable } from 'svelte/store'
  import SongPlayingAnimation from '../components/SongPlayingAnimation.svelte'
  import { toggleFavourite } from '../../../events/audioEvents'

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
    console.log(state)
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
        maxBufferLength: 30, // optional optimization
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
      id: null,
      title: '',
      artist: '',
      category: '',
      url: '',
      isVisible: false,
      isPlaying: false,
      isFavourite: false,
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
    console.log(response)
    if (!response.err) {
      audioPlayerStore.set({
        id: state.id,
        title: state.title,
        artist: state.artist,
        category: state.category,
        isPlaying: state.isPlaying,
        isVisible: state.isVisible,
        thumbnail: state.thumbnail,
        url: state.url,
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
</script>

{#if state.isVisible}
  {#if isExpanded}
    <div class="fixed inset-0 flex z-30 mx-auto max-w-md">
      <div
        class="rounded-md z-50 bg-white dark:bg-slate-900 text-gray-800 flex flex-col w-full max-w-xl mx-auto animate-fade-in"
      >
        <div
          class="flex justify-between items-center p-4 border-b border-black/10"
        >
          <span class="font-bold text-gray-700 dark:text-gray-300"
            >Playing episode 1 of 1</span
          >
          <div
            class="flex items-center justify-end gap-4 text-black/80 dark:text-white/70"
          >
            <!-- <Icon
              onclick={toggleIsFavourite}
              icon={`${state.isFavourite ? 'mdi:bookmark' : 'mdi:bookmark-outline'}`}
              width="28"
              height="28"
            /> -->
            <Icon
              onclick={toggleExpand}
              icon="mdi:close"
              width="28"
              height="28"
            />
          </div>
        </div>

        <div class="flex justify-center py-12 md:py-8">
          <img
            src={state?.thumbnail}
            alt="Thumbnail"
            class={`w-56 h-56 md:w-40 md:h-40 shadow-md rounded-full object-cover ${state.isPlaying && 'rotate'} border-2 shadow-lg border-white/80`}
          />
        </div>

        <div class="flex justify-center mb-5">
          {#if state.isPlaying}
            <SongPlayingAnimation />
          {:else}
            <Icon
              icon="mdi:music"
              class="text-[#6257a5]"
              width="40"
              height="40"
            />
          {/if}
        </div>

        <div class="text-center flex-col flex justify-center px-6">
          <h2
            class="text-3xl md:text-xl dark:text-white/90 font-bold line-clamp-2 font-serif pt-5"
          >
            {state.title}
          </h2>
          <p class="text-lg font-bold text-gray-600 dark:text-white/70 mt-1">
            Episode 1
          </p>
        </div>

        <div class="w-full px-10 mt-4 md:mt-2">
          <input
            type="range"
            min="0"
            max={$duration || 0}
            value={$currentTime || 0}
            on:input={(e) => {
              audioRef.currentTime = +e.target.value
              currentTime.set(+e.target.value)
            }}
            class="w-full h-3 pt-1 rounded-md appearance-none cursor-pointer custom-range"
          />
          <div
            class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1"
          >
            <span>{formatTime($currentTime || 0)}</span>
            <span>{formatTime($duration || 0)}</span>
          </div>
        </div>

        <div class="flex justify-center gap-5 items-center py-6">
          <button on:click={() => seekBackward(15)}>
            <Icon
              icon="mdi:rewind-15"
              width="30"
              class="text-[#6257a5] dark:text-[#6257a5]"
            />
          </button>

          <button on:click={togglePlay}>
            <Icon
              icon={state.isPlaying ? 'mdi:pause-circle' : 'mdi:play-circle'}
              width="80"
              height="80"
              class="text-[#6257a5] dark:text-[#6257a5]"
            />
          </button>

          <button on:click={() => seekForward(15)}>
            <Icon
              icon="mdi:fast-forward-15"
              width="30"
              class="text-[#6257a5] dark:text-[#6257a5]"
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

  .rotate {
    animation: rotate 5s linear infinite;
  }

  input[type='range'].custom-range {
    --track-height: 6px;
    --thumb-size: 20px;
    --thumb-active-size: 24px;
    --fill-color: #f78f18;
  }

  input[type='range'].custom-range::-webkit-slider-runnable-track {
    height: var(--track-height);
    background: linear-gradient(
      to right,
      var(--fill-color) 0%,
      var(--fill-color) var(--progress, 0%),
      var(--track-color) var(--progress, 0%),
      var(--track-color) 100%
    );
    border-radius: 999px;
  }

  input[type='range'].custom-range::-webkit-slider-thumb {
    appearance: none;
    height: var(--thumb-size);
    width: var(--thumb-size);
    background: var(--fill-color);
    border: 2px solid var(--fill-color);
    border-radius: 50%;
    margin-top: calc((var(--track-height) - var(--thumb-size)) / 1.5);
    transition: transform 0.2s ease;
  }

  input[type='range'].custom-range:active::-webkit-slider-thumb {
    transform: scale(1.5);
  }

  input[type='range'].custom-range::-moz-range-track {
    height: var(--track-height);
    background: var(--track-color);
    border-radius: 999px;
  }

  input[type='range'].custom-range::-moz-range-progress {
    background: var(--fill-color);
    height: var(--track-height);
    border-radius: 999px;
  }

  input[type='range'].custom-range::-moz-range-thumb {
    height: var(--thumb-size);
    width: var(--thumb-size);
    background: var(--fill-color);
    border: 2px solid var(--fill-color);
    border-radius: 50%;
    transition: transform 0.2s ease;
  }

  input[type='range'].custom-range:active::-moz-range-thumb {
    transform: scale(2.5);
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
