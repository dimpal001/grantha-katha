// @ts-nocheck
import { currentPageStore } from '../stores/appStore'

export function navigateTo(page) {
  console.log('Navigating to:', page)
  currentPageStore.set(page)

  // Subscribe to see the current value
  currentPageStore.subscribe((value) => {
    console.log('Current page is now:', value)
  })()
}
