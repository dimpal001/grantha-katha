<script>
  // @ts-nocheck
  import { onMount } from 'svelte'
  import Layout from '../components/Layout.svelte'
  import NavigationBlock from '../components/NavigationBlock.svelte'
  import { afterNavigate } from '$app/navigation'
  import { translations } from '../../utils/translations'
  import Loading from '../lib/components/Loading.svelte'

  let lang = 'en'
  let terms = ''
  let loading = true

  function getLangFromURL() {
    const params = new URLSearchParams(window.location.search)
    const urlLang = params.get('lang')
    lang = urlLang && ['en', 'as'].includes(urlLang) ? urlLang : 'en'
  }

  onMount(() => {
    getLangFromURL()

    afterNavigate(() => {
      getLangFromURL()
    })
    terms = translations[lang]?.terms
    console.log(terms)
    loading = false
  })
</script>

{#if loading}
  <Loading />
{:else}
  <Layout>
    <NavigationBlock />
    <div class={`py-5 px-3 ${lang === 'as' && 'font-serif'}`}>
      {#if terms}
        <div class="mb-6">
          {#each terms.sections as section}
            <h3 class="text-lg font-bold text-[#6257a5] mb-2">
              {section.title}
            </h3>

            {#each section.subSections as point}
              <p class="mb-3">{point}</p>
            {/each}
          {/each}
        </div>
      {:else}
        <p class="border rounded-md p-5 border-black/20 text-black/50 text-sm">
          Policy not available.
        </p>
      {/if}
    </div>
  </Layout>
{/if}
