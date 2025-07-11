<script lang="ts">
  // @ts-nocheck
  import App from './App.svelte'
  import { onMount } from 'svelte'

  onMount(async () => {
    if ('serviceWorker' in navigator) {
      const { registerSW } = await import('virtual:pwa-register/svelte')
      registerSW({ immediate: true })
    }
  })
</script>

<App />
