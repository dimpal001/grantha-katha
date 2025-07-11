<script lang="ts">
  // @ts-nocheck
  import Icon from '@iconify/svelte'
  import Label from '../../components/Label.svelte'
  import { navigateTo } from '$lib/navigation'
  import { audioPlayerStore, backPageStore } from '../../../../stores/appStore'
  import { fetchMostListenedAudio } from '../../../../events/audioEvents'
  import { onMount } from 'svelte'
  import AudioCard from '../../components/AudioCard.svelte'
  import AudioSkeleton from '../../components/AudioSkeleton.svelte'

  let audios = []
  let loading = true

  const fetchData = async () => {
    const response = await fetchMostListenedAudio()
    if (response && !response.err) {
      audios = response.result
    }
    loading = false
  }

  onMount(fetchData)
</script>

<div class="mb-20">
  <Label
    leftIcon="mdi:headphones"
    label="সৰ্বাধিক শুনা শ্ৰৱ্য গ্ৰন্থ"
    showArrow
    onIconClick={() => {
      navigateTo('audios')
    }}
  />

  <div class="grid grid-cols-2 gap-3 mt-2">
    {#if loading}
      {#each Array(4) as _, i}
        <AudioSkeleton />
      {/each}
    {:else}
      {#each audios as audio}
        <AudioCard {audio} />
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
