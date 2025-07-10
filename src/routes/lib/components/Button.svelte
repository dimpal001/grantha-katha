<script lang="ts">
  export let id = ''
  export let label = ''
  export let className = ''
  export let type: 'button' | 'submit' | 'reset' = 'button'
  export let disabled = false
  export let isLoading = false
  export let pill = false
  export let onClick: (event: MouseEvent) => void = () => {}

  function handleClick(event: MouseEvent) {
    if (!disabled && !isLoading) {
      onClick(event)
    }
  }
</script>

<button
  {id}
  {type}
  disabled={disabled || isLoading}
  on:click={handleClick}
  class={`${className} w-full flex items-center justify-center py-3 bg-[#6257a5] text-white ${pill ? 'rounded-full' : 'rounded'} hover:bg-[#524991] disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-lg font-semibold`}
>
  {#if isLoading}
    <span class="spinner my-2"></span>
  {:else if label}
    {label}
  {:else}
    Button
  {/if}
</button>

<style>
  .spinner {
    border: 2px solid transparent;
    border-top-color: white;
    border-right-color: white;
    border-radius: 50%;
    width: 1em;
    height: 1em;
    animation: spin 0.75s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
