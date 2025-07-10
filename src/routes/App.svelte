<script>
  // @ts-nocheck

  import { onMount, onDestroy } from 'svelte'
  import Navigation from './lib/components/Navigation.svelte'
  import {
    authStore,
    currentUserStore,
    currentPageStore,
    showSidebarStore,
    backPageStore,
  } from '../stores/appStore.js'
  import Icon from '@iconify/svelte'
  import '../app.css'
  import Loading from './lib/components/Loading.svelte'
  import BackButton from './lib/components/BackButton.svelte'
  import Registration from './lib/screens/Registration.svelte'
  import Home from './lib/screens/Home.svelte'
  import Login from './lib/screens/Login.svelte'
  import FloatingAudioPlayer from './lib/screens/FloatingAudioPlayer.svelte'
  import PdfScreen from './lib/screens/PDFScreen.svelte'
  import Header from './lib/components/Header.svelte'
  import Profile from './lib/screens/Profile.svelte'
  import Search from './lib/screens/Search.svelte'

  let isAuthenticated = false
  let currentUser = null
  let currentPage = 'login'
  let sidebarElement
  let isLoading = true

  $: isAuthenticated = $authStore
  $: currentUser = $currentUserStore
  $: currentPage = $currentPageStore
  $: backPage = $backPageStore

  function toggleSidebar() {
    showSidebarStore.update((value) => !value)
  }

  $: pageTitles = {
    home: 'Grantha Katha',
    departments: 'Login',
    register: 'Register',
    viewPDF: 'View PDF',
  }

  onMount(() => {
    currentPageStore.subscribe((data) => {
      console.log(data)
    })
    setTimeout(() => {
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        const user = JSON.parse(savedUser)
        authStore.set(true)
        currentUserStore.set(user)
      } else {
        navigateTo('login')
      }

      const handleClickOutside = (event) => {
        if (
          $showSidebarStore &&
          sidebarElement &&
          !sidebarElement.contains(event.target)
        ) {
          showSidebarStore.set(false)
        }
      }

      document.addEventListener('click', handleClickOutside)

      isLoading = false

      onDestroy(() => {
        document.removeEventListener('click', handleClickOutside)
      })
    }, 2000)
  })

  function handleLogout() {
    authStore.set(false)
    currentUserStore.set(null)
    currentPageStore.set('login')
    localStorage.clear()
    showSidebarStore.set(false)
  }

  function goBack() {
    currentPageStore.set(backPage || 'login')
  }

  export function navigateTo(page) {
    currentPageStore.set(page)
    showSidebarStore.set(false)
  }
</script>

<svelte:head>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />

  <style>
    body {
      margin: 0;
      font-family: 'Inter', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      overscroll-behavior: none;
      height: 100vh;
      overflow: hidden;
    }
  </style>
</svelte:head>

{#if isLoading}
  <Loading />
{:else}
  <main
    class="min-h-screen bg-gray-50 dark:bg-slate-900 relative text-black/70 dark:text-white"
  >
    {#if !isAuthenticated}
      <!-- <header
        class="bg-blue-700 shadow-sm border-indigo-100 px-4 py-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <BackButton onClick={() => navigateTo('login')} />
          <h2 class="text-xl font-semibold text-white">
            {pageTitles[$currentPageStore] || 'Login'}
          </h2>
        </div>
      </header> -->

      <div class="flex-1 overflow-y-auto mb-12">
        {#if $currentPageStore === 'login'}
          <Login />
        {:else if $currentPageStore === 'register'}
          <Registration />
        {:else if $currentPageStore === 'viewPDF'}
          <PdfScreen />
        {/if}
      </div>
    {:else}
      <div class="flex flex-col h-screen">
        <Header />

        <div
          class="flex-1 overflow-y-auto mb-12"
          style="scrollbar-width: none;"
        >
          {#if $currentPageStore === 'home'}
            <Home />
          {:else if $currentPageStore === 'register'}
            <Registration />
          {:else if $currentPageStore === 'profile'}
            <Profile />
          {:else if $currentPageStore === 'search'}
            <Search />
          {/if}
        </div>
      </div>

      {#if $showSidebarStore}
        <div
          class="fixed inset-0 bg-black/30 z-30"
          on:click={toggleSidebar}
          aria-hidden="true"
        ></div>

        <Navigation {toggleSidebar} />
      {/if}
      <FloatingAudioPlayer />
    {/if}
  </main>
{/if}
