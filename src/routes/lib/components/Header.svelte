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
    departments: 'Login',
    register: 'Register',
    viewPDF: 'View PDF',
    profile: 'Profile',
    search: 'Search',
  }

  function goToProfile() {
    navigateTo('profile')
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

  <button on:click={goToProfile} class="ml-auto">
    <Icon
      icon="mdi:account-circle"
      class="text-blue-600"
      width="35"
      height="35"
    />
  </button>
</header>
