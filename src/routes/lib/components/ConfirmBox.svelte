<script>
  import Icon from '@iconify/svelte'
  import { createEventDispatcher } from 'svelte'
  import { scale } from 'svelte/transition'
  export let title = 'Are you sure?'
  export let description = ''
  export let open = false
  export let loading = false

  const dispatch = createEventDispatcher()

  function cancel() {
    if (!loading) dispatch('cancel')
  }

  function confirm() {
    if (!loading) dispatch('confirm')
  }
</script>

{#if open}
  <div
    class="fixed left-0 right-0 bottom-0 -top-10 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
  >
    <div
      class="bg-white dark:bg-slate-800 p-6 mx-7 rounded-2xl shadow-lg max-w-sm w-full space-y-4"
      in:scale
    >
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-300">{description}</p>

      <div class="flex justify-end gap-3 pt-4">
        <button
          class="px-4 py-2 disabled:opacity-50 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          on:click={cancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-60"
          on:click={confirm}
          disabled={loading}
        >
          {#if loading}
            <Icon
              icon="svg-spinners:90-ring-with-bg"
              class="animate-spin w-5 h-5 mx-auto"
            />
          {:else}
            Confirm
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}
