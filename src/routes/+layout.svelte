<script>
  // @ts-nocheck
  import { onMount } from 'svelte'
  let deferredPrompt = null
  let showInstall = false

  let { children } = $props()
  onMount(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt = e
      showInstall = true
    })
  })

  async function handleInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User chose: ${outcome}`)
      deferredPrompt = null
      showInstall = false
    }
  }
</script>

{@render children()}

{#if showInstall}
  <button on:click={handleInstall} class="install-button"> Install App </button>
{/if}
