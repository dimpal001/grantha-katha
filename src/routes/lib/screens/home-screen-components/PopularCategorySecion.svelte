<!-- === PopularCategorySection.svelte === -->
<script lang="ts">
  import Icon from '@iconify/svelte'
  import Label from '../../components/Label.svelte'

  let categories = [
    {
      name: 'PDFs',
      icon: 'mdi:file-document',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      name: 'Songs',
      icon: 'mdi:music-note',
      color: 'bg-green-100 text-green-600',
    },
    {
      name: 'Ebooks',
      icon: 'mdi:book-open',
      color: 'bg-purple-100 text-purple-600',
    },
    { name: 'Podcasts', icon: 'mdi:podcast', color: 'bg-red-100 text-red-600' },
  ]
</script>

<div class="">
  <Label label="Popular Categories" />

  <div class="grid grid-cols-2 gap-4">
    {#each categories as category}
      <div
        class={`flex items-center gap-3 p-3 rounded ${category.color} shadow-sm cursor-pointer hover:scale-[1.03] transition-all`}
      >
        <Icon icon={category.icon} width="24" height="24" />
        <span class="font-medium text-base">{category.name}</span>
      </div>
    {/each}
  </div>
</div>
