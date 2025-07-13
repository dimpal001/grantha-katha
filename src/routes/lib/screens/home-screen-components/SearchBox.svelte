<script lang="ts">
  import { navigateTo } from '$lib/navigation'
  import Icon from '@iconify/svelte'
</script>

<div
  class="flex items-center bg-white dark:bg-slate-800 p-4 rounded-md shadow-sm border border-gray-200 dark:border-slate-700 cursor-pointer"
  on:click={() => navigateTo('search')}
>
  <Icon icon="mdi:magnify" class="text-gray-500" width="22" height="22" />
  <span class="ml-3 text-gray-500 dark:text-gray-300 text-base"
    >Search audio books, eBooks...</span
  >
</div>
