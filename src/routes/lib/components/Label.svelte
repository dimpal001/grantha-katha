<script lang="ts">
  import Icon from '@iconify/svelte'
  export let label: string = ''
  export let showArrow: boolean = false
</script>

{#if label}
  <div class="flex items-center justify-between w-full mb-4">
    <h2 class="text-lg font-semibold text-black/80 dark:text-white">
      {label}
    </h2>
    {#if showArrow}
      <Icon icon="mdi:chevron-right" class="w-5 h-5" />
    {/if}
  </div>
{/if}
