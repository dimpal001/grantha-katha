<!-- === PopularCategorySection.svelte === -->
<script lang="ts">
  //@ts-nocheck
  import Icon from '@iconify/svelte'
  import Label from '../../components/Label.svelte'
  import { navigateTo } from '$lib/navigation'

  let categories = [
    {
      name: 'শ্ৰৱ্য গ্ৰন্থ',
      icon: 'mdi:headphones',
      color: 'bg-purple-100 text-purple-600',
      link: 'audios',
    },
    {
      name: 'ই-গ্ৰন্থ',
      icon: 'mdi:file-document',
      color: 'bg-blue-100 text-blue-600',
      link: 'pdfs',
    },
  ]
</script>

<div class="">
  <div class="grid grid-cols-2 gap-4">
    {#each categories as category}
      <div
        role="button"
        onclick={() => {
          navigateTo(category.link)
        }}
        class={`flex items-center gap-3 p-3 rounded ${category.color} shadow-sm cursor-pointer hover:scale-[1.03] transition-all`}
      >
        <Icon icon={category.icon} width="24" height="24" />
        <span class="font-bold font-serif text-base">{category.name}</span>
      </div>
    {/each}
  </div>
</div>
