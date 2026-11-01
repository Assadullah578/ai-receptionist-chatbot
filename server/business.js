import { booking, business, knowledge, services } from '../business.config.js'

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
const capitalize = (text) => text[0].toUpperCase() + text.slice(1)

// Date -> "2026-10-30" in the server's local time.
export function toDateString(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function parseDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function dayName(dateString) {
  return capitalize(DAYS[parseDate(dateString).getDay()])
}

// "2026-11-05" -> "Thursday, November 5"
export function formatDate(date) {
  return new Date(`${date}T00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

// "14:30" -> "2:30 PM"
export function formatTime(time) {
  const [hours, minutes] = time.split(':').map(Number)
  return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${hours < 12 ? 'AM' : 'PM'}`
}

export function hoursText(day) {
  const hours = business.hours[day]
  return hours ? `${formatTime(hours[0])} to ${formatTime(hours[1])}` : 'Closed'
}

// All booking start times on that day, e.g. ["09:00", "09:30", ...]. Empty when closed or in the past.
export function getSlots(dateString) {
  const hours = business.hours[DAYS[parseDate(dateString).getDay()]]
  if (!hours) return []

  const toMinutes = (time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3))
  const now = new Date()
  const isToday = dateString === toDateString(now)
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  const slots = []
  for (let m = toMinutes(hours[0]); m < toMinutes(hours[1]); m += booking.slotMinutes) {
    if (isToday && m <= nowMinutes) continue
    slots.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`)
  }
  return dateString < toDateString(now) ? [] : slots
}

// The business info as text for the AI's instructions.
export function businessInfoText() {
  return [
    `Business: ${business.name}, ${business.description}`,
    `Phone: ${business.phone}`,
    `Email: ${business.email}`,
    `Address: ${business.address}`,
    `Opening hours:\n${['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((d) => `${capitalize(d)}: ${hoursText(d)}`).join('\n')}`,
    services.length > 0 && `Services and prices:\n${services.map((s) => `- ${s.name}: ${s.price} (${s.description})`).join('\n')}`,
    knowledge.length > 0 && `Other info:\n${knowledge.map((k) => `- ${k}`).join('\n')}`,
  ]
    .filter(Boolean)
    .join('\n\n')
}
