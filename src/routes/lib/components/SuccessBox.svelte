<script lang="ts">
  import Icon from '@iconify/svelte'

  export let success: string = 'Operation completed successfully.'
</script>

{#if success}
  <div
    class="success-box flex items-center gap-3 px-4 py-3 rounded border border-green-600 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-200 text-sm font-medium shadow-sm"
  >
    <Icon
      icon="mdi:check-circle"
      class="text-green-600 dark:text-green-300"
      width="20"
      height="20"
    />
    <span>{success}</span>
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

  .success-box {
    animation: slideUpFade 0.2s ease-out;
  }
</style>
