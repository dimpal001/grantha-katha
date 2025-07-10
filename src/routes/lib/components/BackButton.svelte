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
  width="38"
  height="38"
  class="transition-colors bg-gray-200 p-2 rounded"
/>

<style>
  button {
    outline: none;
    border: none;
    background: transparent;
    cursor: pointer;
  }
</style>
