<script lang="ts">
  import Icon from '@iconify/svelte'

  export let label: string = ''
  export let className: string = ''
  export let showArrow: boolean = false
  export let onIconClick: (() => void) | null = null
  export let leftIcon: string | null = null

  const isNonLatin = label && !/^[\x00-\x7F]*$/.test(label)
</script>

{#if label}
  <div
    role="button"
    on:click={() => onIconClick?.()}
    class={`${className} flex items-center justify-between w-full py-2`}
  >
    <div class="flex items-center gap-2">
      {#if leftIcon}
        <Icon icon={leftIcon} class="w-6 h-6 text-[#6257a5] dark:text-white" />
      {/if}
      <h2
        class="font-semibold text-[#6257a5] dark:text-white"
        class:font-serif={isNonLatin}
      >
        {label}
      </h2>
    </div>
    {#if showArrow}
      <Icon icon="mdi:chevron-right" class="w-5 h-5 cursor-pointer" />
    {/if}
  </div>
{/if}
