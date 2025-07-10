<script>
  // @ts-nocheck
  import Icon from '@iconify/svelte'
  import BackButton from './BackButton.svelte'
  import { currentPageStore, backPageStore } from '../../../stores/appStore'
  import { navigateTo } from '$lib/navigation'

  $: currentPage = $currentPageStore
  $: backPage = $backPageStore

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
  class="sticky top-0 z-30 flex items-center justify-between px-5 py-3 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-slate-700"
>
  {#if currentPage !== 'home'}
    <div class="flex items-center gap-3">
      <BackButton onClick={() => navigateTo('home')} />
      <h2 class="text-xl font-bold text-[#6257a5]">
        {pageTitles[currentPage] ?? 'Page'}
      </h2>
    </div>
  {:else}
    <div class="flex justify-center items-center gap-2">
      <img src="/logo.png" class="w-10 h-10" alt="" />
      <h1 class="text-2xl font-bold text-[#6257a5] tracking-tight">
        গ্ৰন্থকথা
      </h1>
    </div>
  {/if}

  <button
    on:click={() => navigateTo('profile')}
    class="ml-auto p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
    aria-label="Go to Profile"
  >
    <Icon
      icon="mdi:account-circle"
      class="text-[#6257a5] dark:text-indigo-400"
      width="32"
      height="32"
    />
  </button>
</header>
