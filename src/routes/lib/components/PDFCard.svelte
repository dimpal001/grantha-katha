<script lang="ts">
  import { navigateTo } from '$lib/navigation'
  export let pdf
  import Icon from '@iconify/svelte'
</script>

<div
  role="button"
  on:click={() => {
    navigateTo('viewPDF')
  }}
  class="p-4 bg-white dark:bg-slate-800 rounded flex justify-between items-center border border-gray-200 dark:border-slate-700 shadow-sm"
>
  <div class="flex items-center gap-3">
    <Icon icon="mdi:file-pdf-box" class="text-red-600" width="24" height="24" />
    <span class="text-sm font-medium">{pdf.name}</span>
  </div>
  <div class="text-xs text-gray-500">{pdf.views} views</div>
</div>
