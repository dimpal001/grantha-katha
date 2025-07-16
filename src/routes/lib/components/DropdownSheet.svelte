<script lang="ts">
  // @ts-nocheck
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'
  import Icon from '@iconify/svelte'

  export let label: string = ''
  export let icon: string = ''
  export let isIconButton: boolean = false

  export let options: any[] = []
  export let optionLabel: string = 'label'
  export let optionValue: string = 'value'
  export let className: string = ''
  export let showLabel: boolean = true
  export let value: any = null
  export let placeholder: string = ''
  export let onChange: (val: any) => void = () => {}

  let showSheet = false

  function selectOption(option) {
    value = option[optionValue]
    onChange(value)
    showSheet = false
  }

  function getOptionFromValue(val) {
    return options.find((opt) => opt[optionValue] === val)
  }
</script>

<div class="space-y-1">
  {#if isIconButton}
    <button
      class="p-3 text-sm flex items-center justify-center"
      on:click={() => (showSheet = true)}
    >
      <Icon {icon} class="w-7 h-7 text-black/70 dark:text-white/80" />
    </button>
  {:else}
    {#if showLabel}
      <label class="text-sm text-black/70 dark:text-white/90 font-medium">
        {label}
      </label>
    {/if}
    <button
      class={`${className} p-5 text-left text-sm flex justify-between items-center`}
      on:click={() => (showSheet = true)}
    >
      <div class="flex items-center gap-2 truncate">
        {#if getOptionFromValue(value)?.icon}
          <Icon
            icon={getOptionFromValue(value).icon}
            class="w-5 h-5 shrink-0"
          />
        {/if}
        <span class="truncate">
          {getOptionFromValue(value)?.[optionLabel] || placeholder + label}
        </span>
      </div>
      <Icon icon="mdi:chevron-down" width="20" height="20" />
    </button>
  {/if}
</div>

{#if showSheet}
  <div
    class="fixed inset-0 z-40 -top-10 bg-black/30"
    on:click={() => (showSheet = false)}
  ></div>

  <div
    style="scrollbar-width: none;"
    class="fixed bottom-0 px-5 pb-5 left-0 right-0 z-50 bg-white dark:bg-slate-800 rounded-t-3xl overflow-y-scroll max-h-[60%] shadow-2xl transition-all"
    transition:fly={{ y: 300, duration: 250 }}
  >
    <div
      class="w-20 mx-auto mt-5 rounded-full h-1 bg-black/60 dark:bg-slate-600"
    ></div>

    <div
      class="p-5 border-b border-slate-200 dark:border-slate-600 font-medium text-center text-black/70 dark:text-white/70"
    >
      {label}
    </div>

    {#if options.length > 0}
      <div class="divide-y divide-slate-200 dark:divide-slate-600">
        {#each options as opt}
          <button
            on:click={() => selectOption(opt)}
            class="w-full text-left px-5 py-4 hover:bg-gray-100 dark:hover:bg-slate-600 text-sm flex items-center justify-between gap-2 text-black/60 dark:text-white/60"
          >
            <div class="flex items-center gap-2 truncate">
              {#if opt.icon}
                <Icon icon={opt.icon} class="w-5 h-5 shrink-0" />
              {/if}
              <span class="truncate">{opt[optionLabel]}</span>
            </div>

            {#if opt[optionValue] === value}
              <Icon icon="mdi:check" class="w-4 h-4 text-green-500" />
            {/if}
          </button>
        {/each}
      </div>
    {:else}
      <p class="text-sm text-center p-4 text-black/70 dark:text-white/70">
        No data found
      </p>
    {/if}
  </div>
{/if}
