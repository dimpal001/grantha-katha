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
  <meta name="theme-color" content="#6257a5" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <link rel="apple-touch-icon" href="/icons/pwa-512x512.png" />
  <link rel="manifest" href="/manifest.webmanifest" />
</svelte:head>

<App />
