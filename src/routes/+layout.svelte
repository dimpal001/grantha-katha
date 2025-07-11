<script lang="ts">
  // @ts-nocheck
  import '../app.css'
  import { onMount } from 'svelte'
  import { pwaInfo } from 'virtual:pwa-info'

  let webManifestLink = ''
  $: webManifestLink = pwaInfo?.webManifest?.linkTag || ''

  onMount(async () => {
    if ('serviceWorker' in navigator) {
      const { registerSW } = await import('virtual:pwa-register/svelte')
      registerSW({ immediate: true })
    }
  })
</script>

<svelte:head>
  <meta name="theme-color" content="#6257a5" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <link rel="apple-touch-icon" href="/icons/pwa-512-512.png" />
  {@html webManifestLink}
</svelte:head>

<slot />
