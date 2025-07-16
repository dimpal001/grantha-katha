<script lang="ts">
  //@ts-nocheck
  import Icon from '@iconify/svelte'
  import Label from '../../components/Label.svelte'
  import { navigateTo } from '$lib/navigation'
  import { translations } from '../../../../utils/translations'
  import { language } from '../../../../stores/appStore'
  import { get } from 'svelte/store'

  $: categories = [
    {
      name: translations[$language]?.category1,
      icon: 'mdi:headphones',
      color: 'bg-purple-100 text-purple-600',
      link: 'audios',
    },
    {
      name: translations[$language]?.category2,
      icon: 'ri:book-2-line',
      color: 'bg-blue-100 text-blue-600',
      link: 'pdfs',
    },
  ]

  function isNonLatin(text) {
    return text && !/^[\x00-\x7F]*$/.test(text)
  }
</script>

<div class="">
  <div class="grid grid-cols-2 gap-4">
    {#each categories as category}
      <div
        role="button"
        on:click={() => navigateTo(category.link)}
        class={`flex items-center gap-3 p-3 rounded-md ${category.color} shadow-sm cursor-pointer hover:scale-[1.03] transition-all`}
      >
        <Icon icon={category.icon} width="24" height="24" />
        <span
          class="font-bold text-base {isNonLatin(category.name)
            ? 'font-serif'
            : ''}">{category.name}</span
        >
      </div>
    {/each}
  </div>
</div>
