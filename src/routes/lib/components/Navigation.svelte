<script lang="ts">
  // @ts-nocheck

  import {
    authStore,
    backPageStore,
    currentPageStore,
    currentUserStore,
  } from '../../../stores/appStore.js'
  import Icon from '@iconify/svelte'
  import { useAuthUser } from '$lib/authUser.js'

  let { toggleSidebar, sidebarElement } = $props()

  const navigateTo = (page) => {
    backPageStore.set('dashboard')
    currentPageStore.set(page)
    toggleSidebar()
  }

  const user = useAuthUser()

  const menuItems = [
    { icon: 'mdi:view-dashboard', label: 'Dashboard', page: 'dashboard' },
    { icon: 'mdi:domain', label: 'Departments', page: 'departments' },
    { icon: 'mdi:folder-outline', label: 'Projects', page: 'projects' },
    { icon: 'mdi:calendar-check', label: 'Attendance', page: 'attendance' },
  ]

  const adminMenuItems = [
    { icon: 'mdi:file-chart', label: 'Reports', page: 'reports' },
    { icon: 'mdi:account-group', label: 'Users', page: 'users' },
  ]

  const logout = () => {
    currentUserStore.set(null)
    localStorage.clear()
    authStore.set(false)
    navigateTo('login')
  }
</script>

<div
  bind:this={sidebarElement}
  class="fixed left-0 top-0 bottom-0 w-80 mobile-bg-card z-50 shadow-2xl flex flex-col overflow-hidden animate-slide-up"
  style="border-right: 1px solid rgb(var(--border));"
  role="region"
  aria-labelledby="sidebar-heading"
>
  <!-- User Profile Header -->
  <div class="gradient-primary text-white p-6">
    <button
      onclick={() => {
        navigateTo('userDetails')
      }}
      class="flex items-center gap-4 w-full text-left hover:bg-white/10 rounded-xl p-3 transition-colors"
    >
      <div class="bg-white/20 p-3 rounded-full">
        <Icon icon="mdi:account-circle" class="text-white w-8 h-8" />
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-lg truncate">
          {$currentUserStore?.name || 'Guest User'}
        </h3>
        <p class="text-blue-100 text-sm truncate">
          {$currentUserStore?.email || 'guest@example.com'}
        </p>
        <div class="flex items-center gap-2 mt-1">
          <div class="status-dot status-online"></div>
          <span class="text-xs text-blue-100 capitalize">
            {$currentUserStore?.role || 'user'}
          </span>
        </div>
      </div>
      <Icon icon="mdi:chevron-right" class="text-white/60 w-5 h-5" />
    </button>
  </div>

  <!-- Navigation Menu -->
  <nav class="flex-1 overflow-y-auto p-4">
    <div class="space-y-2">
      {#each menuItems as item}
        <button
          onclick={() => navigateTo(item.page)}
          class="mobile-nav-item w-full"
        >
          <div class="p-2 rounded-lg transition-colors">
            <Icon icon={item.icon} width="20" height="20" />
          </div>
          <span class="font-medium">{item.label}</span>
        </button>
      {/each}

      {#if user?.role === 'admin'}
        <div class="border-t my-4 pt-4 border-white/20">
          <p
            class="text-xs font-semibold mobile-text-secondary uppercase tracking-wider px-4 mb-2"
          >
            Administration
          </p>
          {#each adminMenuItems as item}
            <button
              onclick={() => navigateTo(item.page)}
              class="mobile-nav-item w-full"
            >
              <div class="p-2 rounded-lg transition-colors">
                <Icon icon={item.icon} width="20" height="20" />
              </div>
              <span class="font-medium">{item.label}</span>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </nav>

  <!-- Logout Button -->
  <div class="p-4 border-t border-white/20">
    <button
      onclick={() => logout()}
      class="mobile-button flex justify-center items-center gradient-danger"
    >
      <Icon icon="mdi:logout" class="w-5 h-5 mr-2" />
      <span> Sign Out </span>
    </button>
  </div>
</div>
