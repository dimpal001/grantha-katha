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

<svelte:head>
  <title>Grantha Katha - Powered by Tale tuneX</title>
  <meta
    name="description"
    content="Assamese audiobooks and eBooks on Grantha Katha – your destination for Assamese literature, articles, and newsletters. Immerse yourself in Assam’s literary heritage!"
  />
</svelte:head>

<App />
