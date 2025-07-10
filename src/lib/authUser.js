// @ts-nocheck
// src/lib/hooks/useAuthUser.js
import { get } from 'svelte/store'
import { currentUserStore } from '../stores/appStore.js'

export function useAuthUser(callback = null) {
  const authUser = get(currentUserStore)

  if (callback && typeof callback === 'function') {
    currentUserStore.subscribe((value) => {
      if (value) callback(value)
    })
  }

  return authUser
}
