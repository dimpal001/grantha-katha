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
  import Header from './lib/components/Header.svelte'
  import Profile from './lib/screens/Profile.svelte'
  import Search from './lib/screens/Search.svelte'
  import PdfViewer from './lib/components/PDFViewer.svelte'
  import AudioScreen from './lib/screens/AudioScreen.svelte'
  import PdfsScreen from './lib/screens/PdfsScreen.svelte'
  import ForgotPassword from './lib/screens/ForgotPassword.svelte'
  import ChangePassword from './lib/screens/ChangePassword.svelte'
  import UpdateName from './lib/screens/UpdateName.svelte'

  let isAuthenticated = false
  let currentUser = null
  let currentPage = 'login'
  let sidebarElement
  let isLoading = true
  let scrollContainer

  $: isAuthenticated = $authStore
  $: currentUser = $currentUserStore
  $: currentPage = $currentPageStore
  $: backPage = $backPageStore

  function toggleSidebar() {
    showSidebarStore.update((value) => !value)
  }

  $: if (scrollContainer && $currentPageStore) {
    scrollContainer.scrollTo({ top: 0, behavior: 'auto' })
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
    }, 500)
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
  <script
    src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
  ></script>
  <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>

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
  <main class="bg-black">
    <div
      class="min-h-screen max-w-md mx-auto bg-gray-50 dark:bg-slate-900 relative text-black/70 dark:text-white"
    >
      {#if !isAuthenticated}
        <div class="flex-1 overflow-y-auto mb-12">
          {#if $currentPageStore === 'login'}
            <Login />
          {:else if $currentPageStore === 'register'}
            <Registration />
          {:else if $currentPageStore === 'forgotPassword'}
            <ForgotPassword />
          {/if}
        </div>
      {:else}
        <div class="flex flex-col h-screen">
          <Header />
          <div
            bind:this={scrollContainer}
            class="flex-1 overflow-y-auto"
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
            {:else if $currentPageStore === 'viewPdf'}
              <PdfViewer />
            {:else if $currentPageStore === 'audios'}
              <AudioScreen />
            {:else if $currentPageStore === 'pdfs'}
              <PdfsScreen />
            {:else if $currentPageStore === 'changePassword'}
              <ChangePassword />
            {:else if $currentPageStore === 'updateName'}
              <UpdateName />
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
      {/if}

      <FloatingAudioPlayer />
    </div>
  </main>
{/if}
