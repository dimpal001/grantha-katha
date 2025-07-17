<script>
  // @ts-nocheck
  import { onMount } from 'svelte'
  import Layout from '../components/Layout.svelte'
  import NavigationBlock from '../components/NavigationBlock.svelte'
  import { afterNavigate } from '$app/navigation'
  import { translations } from '../../utils/translations'
  import Loading from '../lib/components/Loading.svelte'
  import { get } from 'svelte/store'
  import { language } from '../../stores/appStore'

  let lang = get(language) || 'en'
  let aboutUs = {}
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
      aboutUs = translations[lang]?.aboutUs || translations['en'].aboutUs
    })

    aboutUs = translations[lang]?.aboutUs || translations['en'].aboutUs
    loading = false
  })
</script>

{#if loading}
  <Loading />
{:else}
  <Layout>
    <NavigationBlock />
    <div class={`py-5 px-3 space-y-6 ${lang === 'as' ? 'font-serif' : ''}`}>
      {#if aboutUs}
        <p class="text-base leading-7">{aboutUs.intro}</p>

        <section>
          <h2 class="text-xl font-semibold mt-4 mb-2 text-[#6257a5]">
            {aboutUs.visionTitle}
          </h2>
          <p>{aboutUs.vision}</p>
        </section>

        <section>
          <h2 class="text-xl font-semibold mt-4 mb-2 text-[#6257a5]">
            {aboutUs.missionTitle}
          </h2>
          <p>{aboutUs.mission}</p>
        </section>

        <section>
          <h2 class="text-xl font-semibold mt-4 mb-2 text-[#6257a5]">
            {aboutUs.whyChooseUs}
          </h2>
          <ul class="space-y-3">
            {#each aboutUs.features as feature}
              <li class="border-l-2 border-[#6257a5] pl-3">
                <h3 class="text-lg font-semibold">{feature.title}</h3>
                <p>{feature.description}</p>
              </li>
            {/each}
          </ul>
        </section>
      {:else}
        <p class="border rounded-md p-5 border-black/20 text-black/50 text-sm">
          About Us not available.
        </p>
      {/if}
    </div>
  </Layout>
{/if}
