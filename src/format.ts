// "appointments" -> "Appointments"
export function capitalize(text: string) {
  return text[0].toUpperCase() + text.slice(1)
}

// "2026-11-05" -> "Thursday, November 5"
export function formatDate(date: string) {
  return new Date(`${date}T00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

// "14:30" -> "2:30 PM"
export function formatTime(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${hours < 12 ? 'AM' : 'PM'}`
}
