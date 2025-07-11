<script>
  import { onMount } from 'svelte'
  import MostListenedSection from './home-screen-components/MostListenedSection.svelte'
  import MostViewedSection from './home-screen-components/MostViewedSection.svelte'
  import PopularCategorySecion from './home-screen-components/PopularCategorySecion.svelte'
  import SearchBox from './home-screen-components/SearchBox.svelte'
  import { backPageStore } from '../../../stores/appStore'
  import ImageCarousel from './home-screen-components/ImageCarousel.svelte'

  onMount(() => {
    backPageStore.set('home')
  })
</script>

<div class="p-5 max-w-lg mx-auto space-y-7 mb-10">
  <SearchBox />
  <ImageCarousel />
  <PopularCategorySecion />
  <MostListenedSection />
  <MostViewedSection />
</div>
