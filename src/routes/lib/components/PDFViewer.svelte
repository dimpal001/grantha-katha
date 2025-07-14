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
    <div class="loading min-h-[500px] flex items-center">
      <Icon icon="mdi:loading" class="animate-spin text-[#6257a5] w-12 h-12" />
    </div>
  {:else}
    <div class="pdf-wrapper">
      {#if currentPageImage}
        <img src={currentPageImage} alt="PDF Page" class="pdf-page" />
      {/if}
    </div>
    <div class="controls">
      <Icon
        onclick={prev}
        icon="mdi:arrow-left"
        width="38"
        height="38"
        class="transition-colors bg-gray-200 p-2 rounded-md cursor-pointer"
      />
      <span class="page-info text-sm">
        Page {currentIndex + 1} of {totalPages}
      </span>
      <Icon
        onclick={next}
        icon="mdi:arrow-right"
        width="38"
        height="38"
        class="transition-colors bg-gray-200 p-2 rounded-md cursor-pointer"
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

  .page-info {
    font-size: 1rem;
    color: #333;
  }
</style>
