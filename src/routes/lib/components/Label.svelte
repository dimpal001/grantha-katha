<script lang="ts">
  import Icon from '@iconify/svelte'

  export let label: string = ''
  export let showArrow: boolean = false
  export let onIconClick: (() => void) | null = null
</script>

{#if label}
  <div class="flex items-center justify-between w-full mb-4">
    <h2 class="font-semibold text-lg text-[#6257a5]">
      {label}
    </h2>
    {#if showArrow}
      <Icon
        icon="mdi:chevron-right"
        class="w-5 h-5 cursor-pointer"
        onclick={() => onIconClick?.()}
      />
    {/if}
  </div>
{/if}
