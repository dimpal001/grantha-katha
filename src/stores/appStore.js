// @ts-nocheck
import { writable, derived } from 'svelte/store'
import { browser } from '$app/environment'

export const audioPlayerStore = writable({
  title: '',
  artist: '',
  url: '',
  isVisible: false,
  isPlaying: false,
})
export const authStore = writable(false)
export const currentUserStore = writable(null)
export const todaysAttendance = writable(null)
export const currentPageStore = writable('home')
export const backPageStore = writable('home')
export const showSidebarStore = writable(false)

export const displayproject_id = writable(null)
export const displayuser_id = writable(null)
export const displaydepartment_id = writable(null)
export const displaytimesheet_id = writable(null)

export const editableDepartment = writable(null)
export const editableProject = writable(null)
export const editabletask_id = writable(null)
export const editableUser = writable(null)

export const usersStore = writable([])
export const departmentsStore = writable([])
export const projectsStore = writable([])
export const tasksStore = writable([])
export const attendanceStore = writable([])
export const timesheetsStore = writable([])
export const activitiesStore = writable([])

export const currentUserDepartments = derived(
  [currentUserStore, departmentsStore],
  ([$currentUser, $departments]) => {
    if (!$currentUser) return []

    if ($currentUser.role === 'admin') {
      return $departments
    } else if ($currentUser.role === 'manager') {
      return $departments.filter((d) => d.manager === $currentUser.id)
    } else {
      return $departments.filter((d) => d.user_ids.includes($currentUser.id))
    }
  }
)

export const currentUserProjects = derived(
  [currentUserStore, projectsStore, departmentsStore],
  ([$currentUser, $projects, $departments]) => {
    if (!$currentUser) return []

    if ($currentUser.role === 'admin') {
      return $projects
    } else if ($currentUser.role === 'manager') {
      const managedDepts = $departments.filter(
        (d) => d.manager === $currentUser.id
      )
      const deptIds = managedDepts.map((d) => d.id)
      return $projects.filter((p) =>
        p.department_ids.some((id) => deptIds.includes(id))
      )
    } else {
      return $projects.filter((p) => p.assignedUsers.includes($currentUser.id))
    }
  }
)

export const currentUserTasks = derived(
  [currentUserStore, tasksStore, currentUserProjects],
  ([$currentUser, $tasks, $userProjects]) => {
    if (!$currentUser) return []

    if ($currentUser.role === 'admin') {
      return $tasks
    } else if ($currentUser.role === 'manager') {
      const project_ids = $userProjects.map((p) => p.id)
      return $tasks.filter((t) => project_ids.includes(t.project_id))
    } else {
      return $tasks.filter((t) => t.assignedTo === $currentUser.id)
    }
  }
)

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
