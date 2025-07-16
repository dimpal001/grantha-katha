<script>
  // @ts-nocheck
  import Icon from '@iconify/svelte'
  import { onMount } from 'svelte'
  import { get } from 'svelte/store'
  import { displayPdfStore } from '../../../stores/appStore'

  export let src = '/data/audiobook/ebook.pdf'

  let isLoading = true
  let currentIndex = 0
  let totalPages = 0
  let currentPageImage = null
  let pdfDoc = null

  let scale = 1
  let lastScale = 1
  let startDistance = null

  async function loadPdfPage(index) {
    if (!pdfDoc) return
    const page = await pdfDoc.getPage(index + 1)
    const viewport = page.getViewport({ scale: 2 })
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = viewport.width
    canvas.height = viewport.height
    await page.render({ canvasContext: context, viewport }).promise
    currentPageImage = canvas.toDataURL('image/png')
  }

  async function loadPdf(pdfUrl) {
    const pdfjsLib = window.pdfjsLib
    if (!pdfjsLib) throw new Error('pdfjsLib not loaded')
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
    const loadingTask = pdfjsLib.getDocument(pdfUrl)
    pdfDoc = await loadingTask.promise
    totalPages = pdfDoc.numPages
    await loadPdfPage(currentIndex)
  }

  function next() {
    if (currentIndex < totalPages - 1) {
      currentIndex++
      loadPdfPage(currentIndex)
    }
  }

  function prev() {
    if (currentIndex > 0) {
      currentIndex--
      loadPdfPage(currentIndex)
    }
  }

  function handleWheel(event) {
    event.preventDefault()
    if (event.deltaY < 0) {
      scale = Math.min(scale + 0.1, 5)
    } else {
      scale = Math.max(scale - 0.1, 0.5)
    }
  }

  function handleTouchStart(event) {
    if (event.touches.length === 2) {
      const dx = event.touches[0].clientX - event.touches[1].clientX
      const dy = event.touches[0].clientY - event.touches[1].clientY
      startDistance = Math.sqrt(dx * dx + dy * dy)
    }
  }

  function handleTouchMove(event) {
    if (event.touches.length === 2 && startDistance) {
      const dx = event.touches[0].clientX - event.touches[1].clientX
      const dy = event.touches[0].clientY - event.touches[1].clientY
      const newDistance = Math.sqrt(dx * dx + dy * dy)
      const delta = newDistance - startDistance
      scale = Math.min(Math.max(scale + delta * 0.005, 0.5), 5)
      startDistance = newDistance
    }
  }

  onMount(async () => {
    try {
      const pdf = get(displayPdfStore)
      await loadPdf(pdf.url || '/data/audiobook/ebook.pdf')
    } catch (e) {
      console.error('PDF Load Failed:', e)
    } finally {
      isLoading = false
    }
  })
</script>

<div class="viewer-container p-2 mb-10">
  {#if isLoading}
    <div class="loading min-h-[500px] md:min-h-[700px] flex items-center">
      <Icon icon="mdi:loading" class="animate-spin text-[#6257a5] w-12 h-12" />
    </div>
  {:else}
    <div
      class="zoomable-container"
      on:wheel={handleWheel}
      on:touchstart={handleTouchStart}
      on:touchmove={handleTouchMove}
    >
      {#if currentPageImage}
        <img
          src={currentPageImage}
          alt="PDF Page"
          class="pdf-page"
          style="transform: scale({scale}); transform-origin: top left;"
        />
      {/if}
    </div>

    <div class="controls">
      <Icon
        onclick={prev}
        icon="mdi:arrow-left"
        width="38"
        height="38"
        class="p-2 dark:bg-white/60 rounded-md dark:text-black text-white bg-black/80"
      />
      <span class=" text-sm text-black/60 dark:text-white">
        Page {currentIndex + 1} of {totalPages}
      </span>
      <Icon
        onclick={next}
        icon="mdi:arrow-right"
        width="38"
        height="38"
        class="p-2 dark:bg-white/60 rounded-md dark:text-black text-white bg-black/80"
      />
    </div>
  {/if}
</div>

<style>
  .viewer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .loading {
    font-size: 1.2rem;
    font-weight: bold;
    color: #444;
  }

  .zoomable-container {
    width: 100%;
    height: 65vh;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    touch-action: auto;
  }

  .pdf-page {
    transition: transform 0.2s ease;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    pointer-events: none; /* prevents accidental image drag */
  }

  .controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem;
  }
</style>
