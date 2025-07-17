<script>
  // @ts-nocheck
  import { onMount } from 'svelte'
  import { language } from '../../stores/appStore'
  import { get } from 'svelte/store'

  const lang = get(language)

  const links = [
    { label: 'About Us', href: `/about-us?lang=${lang}` },
    { label: 'Terms & Conditions', href: `/terms-and-conditions?lang=${lang}` },
    { label: 'Privacy Policy', href: `/privacy-policy?lang=${lang}` },
    { label: 'Piracy Policy', href: `/piracy-policy?lang=${lang}` },
  ]

  let pathname = ''

  onMount(() => {
    pathname = window.location.pathname
  })

  const getPathname = (url) => {
    const a = document.createElement('a')
    a.href = url
    return a.pathname
  }

  const navigate = (href) => {
    window.location.href = href
  }
</script>

<div
  class="flex flex-col items-start bg-stone-200 dark:bg-slate-800 divide-y divide-black/20 dark:divide-white/10 rounded-md overflow-hidden"
>
  {#each links as link}
    <button
      on:click={() => navigate(link.href)}
      class={`py-3 px-5 w-full text-start font-semibold transition-colors duration-200
        ${
          pathname === getPathname(link.href)
            ? 'bg-[#6257a5] text-white dark:bg-[#6257a5] dark:text-white'
            : 'bg-transparent text-black dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10'
        }`}
    >
      {link.label}
    </button>
  {/each}
</div>
