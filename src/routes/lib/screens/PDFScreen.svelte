<script lang="ts">
  // @ts-nocheck
  import { onMount } from 'svelte'
  import Loading from '../components/Loading.svelte'
  import PdfViewer from '../components/PDFViewer.svelte'

  let loading = true
  let error = ''
  let pdfUrl = ''

  onMount(() => {
    pdfUrl = '/static/note.pdf'
    loading = false
  })
</script>

<div class="">
  <PdfViewer />
</div>

<style>
  .viewer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    height: 100vh;
    background: #f4f4f4;
  }

  .pdf-frame {
    width: 100%;
    height: 100%;
    border: none;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
  }

  .error {
    color: red;
    margin-top: 1rem;
  }
</style>
