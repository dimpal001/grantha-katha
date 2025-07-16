// @ts-nocheck
import { currentPageStore } from '../stores/appStore'

export function navigateTo(page) {
  console.log('Navigating to:', page)
  currentPageStore.set(page)

  currentPageStore.subscribe((value) => {
    console.log('Current page is now:', value)
  })()
}
