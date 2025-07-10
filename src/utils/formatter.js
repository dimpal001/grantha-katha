// @ts-nocheck
export function formatDate(dateStr) {
  if (!dateStr) return 'Invalid date'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return 'Invalid date'

  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
  return date.toLocaleDateString('en-US', options)
}

export function formatRelativeDate(dateStr) {
  if (!dateStr) return 'Invalid date'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return 'Invalid date'

  const now = new Date()
  now.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)

  const diffInMs = date.getTime() - now.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays > 1) return `${diffInDays} days left`
  if (diffInDays === 1) return '1 day left'
  if (diffInDays === 0) return 'Today'
  return 'Passed'
}

export function formatTime(timeStr) {
  if (!timeStr) return 'Invalid time'
  const date = new Date(timeStr)
  if (isNaN(date.getTime())) return 'Invalid time'

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}
