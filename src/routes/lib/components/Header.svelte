<script>
  // @ts-nocheck
  import Icon from '@iconify/svelte'
  import BackButton from './BackButton.svelte'
  import {
    currentPageStore,
    backPageStore,
    language,
  } from '../../../stores/appStore'
  import { navigateTo } from '$lib/navigation'
  import FavouriteEBookButton from './FavouriteEBookButton.svelte'
  import { translations } from '../../../utils/translations'

  $: currentPage = $currentPageStore
  $: backPage = $backPageStore

  const pageTitles = {
    home: 'Grantha Katha',
    profile: 'Profile',
    changePassword: 'Change Password',
    updateName: 'Update Name',
    search: 'Search',
    viewPdf: translations[$language].header2,
    audios: translations[$language].header1,
    pdfs: translations[$language].header2,
  }
  const isNonLatin =
    pageTitles[currentPage] && !/^[\x00-\x7F]*$/.test(pageTitles[currentPage])
</script>

<header
  class="sticky top-0 z-30 flex items-center justify-between px-5 py-3 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-slate-700"
>
  {#if currentPage !== 'home'}
    <div class="flex items-center gap-3">
      <BackButton onClick={() => navigateTo(backPage || 'home')} />
      <h2
        class="text-xl font-bold text-[#6257a5] dark:text-white"
        class:font-serif={isNonLatin}
      >
        {pageTitles[currentPage] ?? ''}
      </h2>
    </div>
  {:else}
    <div class="flex justify-center items-center gap-2">
      <img
        src="/logo.png"
        class="w-10 h-10 dark:filter dark:brightness-0 dark:invert"
        alt=""
      />
      <h1 class="text-2xl font-bold text-[#6257a5] dark:text-white font-serif">
        গ্ৰন্থকথা
      </h1>
    </div>
  {/if}

  <!-- {#if currentPage === 'viewPdf'}
    <FavouriteEBookButton />
  {:else} -->
  <button
    on:click={() => navigateTo('profile')}
    class="ml-auto p-1 rounded-full bg-slate-200 dark:hover:bg-slate-800 transition"
    aria-label="Go to Profile"
  >
    <Icon
      icon="mdi:account-circle"
      class="text-[#6257a5] dark:text-indigo-400"
      width="32"
      height="32"
    />
  </button>
  <!-- {/if} -->
</header>
