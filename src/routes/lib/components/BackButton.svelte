<script lang="ts">
  import Icon from '@iconify/svelte'
  export let onClick: (event: MouseEvent) => void = () => {}

  function handleClick(event: MouseEvent) {
    onClick(event)
  }
</script>

<Icon
  onclick={handleClick}
  icon="mdi:arrow-left"
  width="35"
  height="35"
  class="transition-colors text-[#6257a5] bg-transparent p-1 rounded"
/>

<style>
  button {
    outline: none;
    border: none;
    background: transparent;
    cursor: pointer;
  }
</style>
