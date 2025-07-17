<script>
  // @ts-nocheck
  import { onMount } from 'svelte'
  import Layout from '../components/Layout.svelte'
  import NavigationBlock from '../components/NavigationBlock.svelte'
  import { afterNavigate } from '$app/navigation'
  import { translations } from '../../utils/translations'
  import Loading from '../lib/components/Loading.svelte'

  let lang = 'en'
  let policy = ''
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
    policy = translations[lang]?.privacy
    loading = false
  })
</script>

{#if loading}
  <Loading />
{:else}
  <Layout>
    <NavigationBlock />
    <div class={`py-5 px-3 ${lang === 'as' && 'font-serif'}`}>
      {#if policy}
        <div class="mb-6 space-y-3">
          {#each policy.intro as item}
            <p>{item}</p>
          {/each}
        </div>

        {#each policy.sections as section}
          <h2 class="text-xl font-semibold mt-4 mb-2 text-[#6257a5]">
            {section.title}
          </h2>
          {#each section.content as para}
            {#if Array.isArray(para)}
              <ul class="list-disc pl-5 mb-2">
                {#each para as item}
                  <li>{item}</li>
                {/each}
              </ul>
            {:else}
              <p class="mb-2">{para}</p>
            {/if}
          {/each}

          {#if section.subSections}
            {#each section.subSections as sub}
              <h3 class="text-lg font-medium mt-4">{sub.subtitle}</h3>
              {#each sub.content as para}
                {#if Array.isArray(para)}
                  <ul class="list-disc pl-5 mb-2">
                    {#each para as item}
                      <li>{item}</li>
                    {/each}
                  </ul>
                {:else}
                  <p class="mb-2">{para}</p>
                {/if}
              {/each}
            {/each}
          {/if}
        {/each}
      {:else}
        <p class="border rounded-md p-5 border-black/20 text-black/50 text-sm">
          Policy not available.
        </p>
      {/if}
    </div>
  </Layout>
{/if}
