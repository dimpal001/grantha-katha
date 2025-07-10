<!-- === PopularCategorySection.svelte === -->
<script lang="ts">
  import Icon from '@iconify/svelte'
  import Label from '../../components/Label.svelte'

  let categories = [
    {
      name: 'EBooks',
      icon: 'mdi:file-document',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      name: 'EBook Audios',
      icon: 'mdi:book-open',
      color: 'bg-purple-100 text-purple-600',
    },
  ]
</script>

<div class="">
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
