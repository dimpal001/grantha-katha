<script>
  import '../../app.css'
  import { goto } from '$app/navigation'
  import { afterNavigate } from '$app/navigation'
  import { onMount } from 'svelte'
  import BackButton from '../lib/components/BackButton.svelte'

  let headerTitle = ''

  function updatePageTitle() {
    const pathname = window.location.pathname
    if (pathname === '/about-us') {
      document.title = 'About Us - Grantha Katha'
      headerTitle = 'About Us'
    } else if (pathname === '/privacy-policy') {
      document.title = 'Privacy Policy - Grantha Katha'
      headerTitle = 'Privacy Policy'
    } else if (pathname === '/terms-and-conditions') {
      document.title = 'Terms & Conditions - Grantha Katha'
      headerTitle = 'Terms & Conditions'
    } else {
      document.title = 'Grantha Katha'
    }
  }

  onMount(() => {
    updatePageTitle()

    afterNavigate(() => {
      updatePageTitle()
    })
  })
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="bg-black">
  <div
    class="min-h-screen mx-auto max-w-md bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100"
  >
    <header
      class="bg-white dark:bg-slate-800 shadow p-4 flex gap-3 items-center"
    >
      <BackButton onClick={() => goto('/')} />
      <h1 class="font-bold text-lg pt-1 text-[#6257a5] dark:text-indigo-300">
        {headerTitle}
      </h1>
    </header>

    <main class="p-4">
      <slot />
    </main>
  </div>
</div>
