// @ts-nocheck
import { writable, derived } from 'svelte/store'
import { browser } from '$app/environment'

export const audioPlayerStore = writable({
  id: null,
  title: '',
  thumbnail: '',
  category: '',
  artist: '',
  url: '',
  isVisible: false,
  isPlaying: false,
  isFavourite: false,
})

export const authStore = writable(false)
export const currentUserStore = writable(null)
export const currentPageStore = writable('home')
export const backPageStore = writable('home')
export const showSidebarStore = writable(false)

export const displayPdfStore = writable(null)
export const displayAudioStore = writable(null)

export const usersStore = writable([])

let storedLang = 'en'

try {
  storedLang = localStorage.getItem('language') || 'en'
} catch (error) {
  console.error('Error accessing localStorage for language:', error)
}

export const language = writable(storedLang)

language.subscribe((value) => {
  try {
    localStorage.setItem('language', value)
  } catch (error) {
    console.error('Error setting language in localStorage:', error)
  }
})

let initialFavourites = []
try {
  const stored = localStorage.getItem('favourites')
  if (stored) {
    initialFavourites = JSON.parse(stored)
  }
} catch (error) {
  console.warn('Failed to parse favouriteStore from localStorage:', error)
}

export const favouriteStore = writable(initialFavourites)

favouriteStore.subscribe((value) => {
  try {
    localStorage.setItem('favourites', JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save favouriteStore to localStorage:', error)
  }
})

let defaultTheme = 'light'

if (browser) {
  try {
    const storedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: light)'
    ).matches

    if (storedTheme) {
      defaultTheme = typeof storedTheme === 'string' ? storedTheme : 'light'
    } else {
      defaultTheme = prefersDark ? 'dark' : 'light'
    }
  } catch (e) {
    console.error('Error reading theme from localStorage:', e)
    defaultTheme = 'light'
  }
}

export const themeStore = writable(defaultTheme)

if (browser) {
  themeStore.subscribe((theme) => {
    try {
      console.log('Applying theme:', theme)
      localStorage.setItem('theme', theme)

      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
      root.setAttribute('data-theme', theme)
      root.style.colorScheme = theme

      document.body.classList.add('theme-applied')
      setTimeout(() => document.body.classList.remove('theme-applied'), 0)
    } catch (e) {
      console.error('Error applying theme:', e)
    }
  })
}

export function toggleTheme() {
  themeStore.update((t) => {
    const newTheme = t === 'light' ? 'dark' : 'light'

    if (browser) {
      const root = document.documentElement

      if (newTheme === 'light') {
        root.classList.remove('dark')
        root.classList.add('light')
      } else {
        root.classList.remove('light')
        root.classList.add('dark')
      }

      root.setAttribute('data-theme', newTheme)
      root.style.colorScheme = newTheme
      localStorage.setItem('theme', newTheme)

      document.body.classList.add('theme-applied')
      setTimeout(() => document.body.classList.remove('theme-applied'), 0)
    }

    return newTheme
  })
}
