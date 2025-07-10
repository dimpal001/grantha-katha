<script>
  // @ts-nocheck
  import Icon from '@iconify/svelte'
  import { onMount } from 'svelte'

  export let src = 'http://192.168.210.217:8080/static/note.pdf'

  let isLoading = true
  let images = []
  let currentIndex = 0

  async function loadPdfImages(pdfUrl) {
    const pdfjsLib = window.pdfjsLib

    if (!pdfjsLib) throw new Error('pdfjsLib not loaded')

    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

    const loadingTask = pdfjsLib.getDocument(pdfUrl)
    const pdf = await loadingTask.promise

    const result = []
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const viewport = page.getViewport({ scale: 2 })
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = viewport.width
      canvas.height = viewport.height

      await page.render({ canvasContext: context, viewport }).promise

      result.push(canvas.toDataURL('image/png'))
    }

    return result
  }

  function next() {
    if (currentIndex < images.length - 1) currentIndex++
  }

  function prev() {
    if (currentIndex > 0) currentIndex--
  }

  onMount(async () => {
    try {
      images = await loadPdfImages(src)
    } catch (e) {
      console.error('PDF Load Failed:', e)
    } finally {
      isLoading = false
    }
  })
</script>

<div class="viewer-container p-2">
  {#if isLoading}
    <div class="loading min-h-[500px] flex items-center">Loading PDF...</div>
  {:else}
    <div class="pdf-wrapper">
      <img src={images[currentIndex]} alt="PDF Page" class="pdf-page" />
    </div>
    <div class="controls">
      <Icon
        onclick={prev}
        icon="mdi:arrow-left"
        width="38"
        height="38"
        class="transition-colors bg-gray-200 p-2 rounded"
      />
      <span class="page-info text-sm"
        >Page {currentIndex + 1} of {images.length}</span
      >
      <Icon
        onclick={next}
        icon="mdi:arrow-right"
        width="38"
        height="38"
        class="transition-colors bg-gray-200 p-2 rounded"
      />
    </div>
  {/if}
</div>

<style>
  .viewer-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
  }

  .loading {
    font-size: 1.2rem;
    font-weight: bold;
    color: #444;
    margin-top: auto;
    margin-bottom: auto;
  }

  .pdf-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    max-height: 100%;
    width: 100%;
    overflow: auto;
  }

  .pdf-page {
    max-height: 90vh;
    max-width: 100%;
    object-fit: contain;
    border: none;
    box-shadow: none;
    border-radius: 0;
  }

  .controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem;
  }

  .nav-button {
    font-size: 1.2rem;
    padding: 0.4rem 1rem;
    background: #444;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }

  .nav-button:disabled {
    background: #aaa;
    cursor: not-allowed;
  }

  .page-info {
    font-size: 1rem;
    color: #333;
  }
</style>
