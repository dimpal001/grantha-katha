<script lang="ts">
  import Icon from '@iconify/svelte'

  export let id = ''
  export let label = ''
  export let type = 'text'
  export let value: string | Date = ''
  export let className = ''
  export let placeholder = ''
  export let min = 0
  export let max = 100000
  export let required = false
  export let disabled = false
  export let icon = ''
  export let trailingIcon = ''
  export let onInput: (value: string) => void = () => {}

  $: formattedValue =
    type === 'date' && value instanceof Date
      ? value.toISOString().split('T')[0]
      : type === 'date' && typeof value === 'string' && value
        ? new Date(value).toISOString().split('T')[0]
        : value

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement
    onInput(target.value)
  }
</script>

<div class="flex flex-col gap-1 w-full">
  {#if label}
    <label
      for={id}
      class="text-sm font-medium text-black/70 dark:text-white/90"
    >
      {label}
    </label>
  {/if}

  <div class="relative">
    {#if icon}
      <div
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-white/50"
      >
        <Icon {icon} class="w-5 h-5" />
      </div>
    {/if}

    <input
      {id}
      {min}
      {max}
      {type}
      bind:value={formattedValue}
      {placeholder}
      {required}
      {disabled}
      on:input={handleInput}
      class={`w-full bg-white dark:bg-slate-800 
                ${icon ? 'pl-10' : 'pl-4'} 
                ${trailingIcon ? 'pr-10' : 'pr-4'} 
                py-4 border dark:border-slate-700 border-gray-300 
                rounded placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:border-blue-500 ${className}`}
    />

    {#if trailingIcon}
      <div
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 dark:text-white/50"
      >
        <Icon icon={trailingIcon} class="w-5 h-5" />
      </div>
    {/if}
  </div>
</div>
