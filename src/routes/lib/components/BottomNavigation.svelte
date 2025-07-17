<script lang="ts">
  // @ts-nocheck
  import { currentPageStore } from '../../../stores/appStore'
  import { navigateTo } from '$lib/navigation'
  import Icon from '@iconify/svelte'

  const items = [
    { label: 'Home', icon: 'mdi:home-outline', page: 'home' },
    { label: 'Audio Books', icon: 'mdi:headphones', page: 'audios' },
    {
      label: 'E-Books',
      icon: 'mdi:book-open-page-variant-outline',
      page: 'pdfs',
    },
    { label: 'Profile', icon: 'mdi:account-circle-outline', page: 'profile' },
  ]

  $: activePage = $currentPageStore
</script>

<nav
  class="fixed bottom-bar bottom-0 max-w-md mx-auto left-0 right-0 z-30 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md"
>
  <div class="flex justify-around items-center h-[75px] px-4">
    {#each items as item}
      <button
        on:click={() => navigateTo(item.page)}
        class="flex flex-col items-center justify-center text-sm focus:outline-none group"
      >
        <Icon
          icon={item.icon}
          class={`text-2xl mb-1 transition-colors duration-200
              ${
                activePage === item.page
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-500'
              }`}
        />
        <span
          class={`text-[11px] ${
            activePage === item.page
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-500'
          }`}
        >
          {item.label}
        </span>
      </button>
    {/each}
  </div>
</nav>

<style>
  .bottom-bar {
    padding-bottom: max(env(safe-area-inset-bottom), 0.2rem);
  }
</style>
