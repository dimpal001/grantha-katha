<script lang="ts">
  import Icon from '@iconify/svelte'

  export let label: string = ''
  export let showArrow: boolean = false
  export let onIconClick: (() => void) | null = null
  export let leftIcon: string | null = null
</script>

{#if label}
  <div
    role="button"
    on:click={() => onIconClick?.()}
    class="flex items-center justify-between w-full mb-4 py-2"
  >
    <div class="flex items-center gap-2">
      {#if leftIcon}
        <Icon icon={leftIcon} class="w-6 h-6 text-[#6257a5]" />
      {/if}
      <h2 class="font-semibold text-xl text-[#6257a5] font-serif">
        {label}
      </h2>
    </div>
    {#if showArrow}
      <Icon icon="mdi:chevron-right" class="w-5 h-5 cursor-pointer" />
    {/if}
  </div>
{/if}
