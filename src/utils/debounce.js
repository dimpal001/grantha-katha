// @ts-nocheck
import { writable } from 'svelte/store'

export function debounced(originalStore, delay = 300) {
  const debouncedStore = writable()

  let timeout
  originalStore.subscribe((value) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      debouncedStore.set(value)
    }, delay)
  })

  return debouncedStore
}
