<script>
  // @ts-nocheck
  import Icon from '@iconify/svelte'
  import {
    authStore,
    currentPageStore,
    currentUserStore,
    language,
    themeStore,
  } from '../../../stores/appStore'
  import Label from '../components/Label.svelte'
  import { useAuthUser } from '$lib/authUser'
  import { navigateTo } from '$lib/navigation'
  import DropdownSheet from '../components/DropdownSheet.svelte'
  import BottomSheet from '../components/BottomSheet.svelte'
  import Button from '../components/Button.svelte'
  import ErrorBox from '../components/ErrorBox.svelte'
  import { deleteAccount } from '../../../events/authEvents'
  import BottomNavigation from '../components/BottomNavigation.svelte'

  $: user = useAuthUser()

  let footerLinks = [
    {
      label: 'About Us',
      href: 'https://granthakatha.com/aboutus',
    },
    {
      label: 'Terms & Conditions',
      href: 'https://granthakatha.com/termsandconditions',
    },
    {
      label: 'Privacy Policy',
      href: 'https://granthakatha.com/privacypolicy',
    },
    {
      label: 'Contact Us',
      href: 'https://granthakatha.com/contacts',
    },
    {
      label: 'How to Order',
      href: 'https://granthakatha.com/howtoorder',
    },
    {
      label: 'Our Team',
      href: 'https://granthakatha.com/ourteam',
    },
  ]

  let showDeleteAccountSheet = false
  let error = null
  let deleting = false

  function logout() {
    authStore.set(false)
    currentUserStore.set(null)
    currentPageStore.set('login')
    localStorage.clear()
  }

  function goToFavourites() {
    currentPageStore.set('favourites')
  }

  const handleDelete = async () => {
    try {
      deleting = true
      const response = await deleteAccount()
      if (response.err) {
        error =
          response.result || 'Unable to delete your account, Please try again.'
      } else {
        logout()
      }
    } catch (error) {
      error = 'Unable to delete your account, Please try again.'
    } finally {
      deleting = false
      showDeleteAccountSheet = false
    }
  }
</script>

{#if user}
  <main
    class="dark:bg-slate-900 text-gray-800 dark:text-white flex flex-col pb-32"
  >
    <div class="px-6 pt-8 pb-4 flex items-center gap-4">
      <div class="bg-blue-100 dark:bg-[#6257a5] p-3 rounded-full">
        <Icon
          icon="mdi:account-circle"
          class="text-[#6257a5] dark:text-white"
          width="64"
          height="64"
        />
      </div>
      <div>
        <h2 class="text-2xl font-bold">{user?.name}</h2>
        <p class="text-gray-500 dark:text-gray-300">{user?.email || ''}</p>
      </div>
    </div>

    <section class="px-6 py-3">
      <Label label="Settings" />

      <div
        class="bg-gray-200 dark:bg-slate-800 rounded-md shadow-sm divide-y divide-gray-300 dark:divide-gray-700"
      >
        <DropdownSheet
          label="App Language"
          options={[
            { id: 'as', name: 'Assamese' },
            { id: 'en', name: 'English' },
          ]}
          optionLabel="name"
          optionValue="id"
          showLabel={false}
          value={$language}
          onChange={(val) => {
            language.set(val)
          }}
          className="w-full"
        />
        <DropdownSheet
          label="App Theme"
          options={[
            { id: 'dark', name: 'Dark Theme' },
            { id: 'light', name: 'Light Theme' },
          ]}
          optionLabel="name"
          optionValue="id"
          showLabel={false}
          value={$themeStore}
          onChange={(val) => {
            themeStore.set(val)
          }}
          className="w-full"
        />
        <!-- <button
          on:click={() => navigateTo('changePassword')}
          class="flex items-center justify-between px-5 py-4 w-full"
        >
          <span>Change Password</span>
          <Icon
            icon="mdi:chevron-right"
            class="text-gray-400"
            width="20"
            height="20"
          />
        </button>
        <button
          on:click={() => navigateTo('updateName')}
          class="flex items-center justify-between px-5 py-4 w-full"
        >
          <span>Update Name</span>
          <Icon
            icon="mdi:chevron-right"
            class="text-gray-400"
            width="20"
            height="20"
          />
        </button> -->
      </div>
    </section>

    <section class="px-6 py-3">
      <Label label="Explore" />

      <div
        class="bg-gray-200 dark:bg-slate-800 text-sm rounded-md shadow-sm divide-y divide-gray-300 dark:divide-gray-700"
      >
        {#each footerLinks as link}
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-between px-5 py-5 hover:bg-gray-300 dark:hover:bg-slate-700 transition-colors duration-150"
          >
            <span>{link.label}</span>
            <Icon
              icon="mdi:chevron-right"
              class="text-gray-400"
              width="20"
              height="20"
            />
          </a>
        {/each}
      </div>
    </section>

    <section class="px-6 py-3">
      <Label label="Accounts" />
      <div
        class="bg-gray-200 dark:bg-slate-800 rounded-md shadow-sm divide-y divide-gray-300 dark:divide-gray-700 overflow-hidden"
      >
        <button
          on:click={() => (showDeleteAccountSheet = !showDeleteAccountSheet)}
          class="flex items-center justify-between px-5 font-semibold text-red-600 py-4 w-full"
        >
          <span>Delete Account</span>
          <Icon
            icon="mdi:chevron-right"
            class="text-gray-400"
            width="20"
            height="20"
          />
        </button>
        <BottomSheet
          showSheet={showDeleteAccountSheet}
          closeOnOverlayClick={false}
          label="Delete Account?"
        >
          <div
            class="space-y-4 text-center text-sm text-gray-700 dark:text-gray-300"
          >
            <div class="flex justify-center">
              <Icon icon="mdi:alert-circle" class="w-10 h-10 text-red-600" />
            </div>

            <p class="text-base font-semibold text-red-700 dark:text-red-400">
              This action is irreversible.
            </p>

            <p>
              Deleting your account will permanently remove all your data,
              including subscriptions and saved content. Are you sure you want
              to continue?
            </p>

            <Button
              isLoading={deleting}
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-800 text-sm"
              label="Yes, Delete My Account"
            />

            <button
              on:click={() => (showDeleteAccountSheet = false)}
              class="w-full px-4 py-2 text-gray-600 dark:text-gray-300 mt-2"
            >
              Cancel
            </button>
          </div>
        </BottomSheet>
      </div>
    </section>

    <div class="flex-grow"></div>

    <div class="px-6">
      {#if error}
        <ErrorBox {error} />
      {/if}
    </div>

    <div class="px-6 py-7">
      <button
        on:click={logout}
        class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-md shadow-md transition"
      >
        <Icon icon="mdi:logout" class="inline mr-2" width="20" height="20" />
        Logout
      </button>
    </div>

    <BottomNavigation />
  </main>
{/if}
