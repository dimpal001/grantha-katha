<script lang="ts">
  import Icon from '@iconify/svelte'
  export let error: string = 'Something went wrong'
</script>

{#if error}
  <div
    class="error-box flex items-center gap-3 px-4 py-3 rounded border border-red-600 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 text-sm font-medium shadow-sm"
  >
    <Icon
      icon="mdi:alert-circle"
      class="text-red-600 dark:text-red-300"
      width="20"
      height="20"
    />
    <span>{error}</span>
  </div>
{/if}

<style>
  @keyframes slideUpFade {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .error-box {
    animation: slideUpFade 0.2s ease-out;
  }
</style>
