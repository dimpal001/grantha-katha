<script>
  // @ts-nocheck
  import Icon from '@iconify/svelte'
  import BackButton from './BackButton.svelte'
  import { currentPageStore, backPageStore } from '../../../stores/appStore'
  import { navigateTo } from '$lib/navigation'

  $: currentPage = $currentPageStore
  $: backPage = $backPageStore

  console.log(currentPage)

  const pageTitles = {
    home: 'Grantha Katha',
    profile: 'Profile',
    search: 'Search',
    viewPdf: 'শ্ৰৱ্য গ্ৰন্থ',
    audios: 'শ্ৰৱ্য গ্ৰন্থ',
    pdfs: 'ই-গ্ৰন্থ',
  }
</script>

<header
  class="shadow-sm text-black/80 px-4 py-4 flex items-center justify-between"
>
  {#if currentPage !== 'home'}
    <div class="flex items-center gap-3">
      <BackButton onClick={() => navigateTo('home')} />
      <h2 class="text-xl font-semibold">
        {pageTitles[currentPage]}
      </h2>
    </div>
  {:else}
    <h1 class="text-xl font-bold">Grantha Katha</h1>
  {/if}

  <button
    on:click={() => {
      navigateTo('profile')
    }}
    class="ml-auto"
  >
    <Icon
      icon="mdi:account-circle"
      class="text-[#6257a5]"
      width="35"
      height="35"
    />
  </button>
</header>
