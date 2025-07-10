<script>
  // @ts-nocheck
  export let src =
    'https://www.bbau.ac.in/Docs/FoundationCourse/TM/MPDC105/Lecture%20Writing%20Skills%20Note%20Taking.pdf'

  let isLoading = true

  function handleLoad() {
    isLoading = false
  }
</script>

<div class="viewer-container">
  {#if isLoading}
    <div class="loading">Loading PDF...</div>
  {/if}
  <iframe {src} on:load={handleLoad}></iframe>
</div>

<style>
  .viewer-container {
    position: relative;
    width: 100%;
    height: 100vh;
  }

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  .loading {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    z-index: 10;
    font-size: 1.2rem;
    font-weight: bold;
  }
</style>
