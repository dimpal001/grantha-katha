<script>
  // @ts-nocheck
  import Icon from '@iconify/svelte'
  import {
    authStore,
    currentPageStore,
    currentUserStore,
  } from '../../../stores/appStore'
  import Label from '../components/Label.svelte'
  import { useAuthUser } from '$lib/authUser'

  $: user = useAuthUser()

  function logout() {
    authStore.set(false)
    currentUserStore.set(null)
    currentPageStore.set('login')
    localStorage.clear()
  }

  function goToFavourites() {
    currentPageStore.set('favourites')
  }
</script>

{#if user}
  <main
    class="min-h-full dark:bg-slate-900 text-gray-800 dark:text-white flex flex-col"
  >
    <div class="px-6 pt-8 pb-4 flex items-center gap-4">
      <div class="bg-blue-100 dark:bg-[#6257a5] p-3 rounded-full">
        <Icon
          icon="mdi:account-circle"
          class="text-[#6257a5] dark:text-[#6257a5]"
          width="64"
          height="64"
        />
      </div>
      <div>
        <h2 class="text-2xl font-bold">{user?.name}</h2>
        <p class="text-gray-500 dark:text-gray-300">{user?.email || ''}</p>
      </div>
    </div>

    <!-- <section class="px-6 py-4 space-y-2">
      <Label label="Account Settings" />

      <div
        class="bg-gray-200 dark:bg-slate-800 rounded shadow-sm divide-y divide-gray-300 dark:divide-gray-700"
      >
        <div class="flex items-center justify-between px-5 py-4">
          <span>Change Password</span>
          <Icon
            icon="mdi:chevron-right"
            class="text-gray-400"
            width="20"
            height="20"
          />
        </div>
        <div class="flex items-center justify-between px-5 py-4">
          <span>Update Name</span>
          <Icon
            icon="mdi:chevron-right"
            class="text-gray-400"
            width="20"
            height="20"
          />
        </div>
      </div>
    </section> -->

    <!-- <section class="px-6 py-4 space-y-2">
      <Label label="Your Favourites" />

      <div
        class="bg-gray-200 dark:bg-slate-800 rounded shadow-sm divide-y divide-gray-300 dark:divide-gray-700"
      >
        <div class="flex items-center justify-between px-5 py-4">
          <span>Favourite Books</span>
          <Icon
            icon="mdi:chevron-right"
            class="text-gray-400"
            width="20"
            height="20"
          />
        </div>
        <div class="flex items-center justify-between px-5 py-4">
          <span>Favourite Songs</span>
          <Icon
            icon="mdi:chevron-right"
            class="text-gray-400"
            width="20"
            height="20"
          />
        </div>
      </div>
    </section> -->

    <div class="flex-grow"></div>

    <div class="px-6 py-7">
      <button
        on:click={logout}
        class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded shadow-md transition"
      >
        <Icon icon="mdi:logout" class="inline mr-2" width="20" height="20" />
        Logout
      </button>
    </div>
  </main>
{/if}
