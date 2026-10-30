// Everything the AI receptionist knows about the clinic. Edit this file to use the chatbot for another business.
export const clinic = {
  name: 'BrightSmile Dental',
  phone: '(555) 123-4567',
  email: 'hello@brightsmile.example',
  address: '123 Maple Avenue, Springfield',
  parking: 'Free parking behind the building.',

  // Opening hours by weekday (0 = Sunday). Missing days are closed.
  hours: {
    1: ['09:00', '17:00'],
    2: ['09:00', '17:00'],
    3: ['09:00', '17:00'],
    4: ['09:00', '19:00'],
    5: ['09:00', '17:00'],
    6: ['09:00', '13:00'],
  },
  slotMinutes: 30,

  services: [
    { name: 'Check-up & Cleaning', price: '$120', icon: '🪥', description: 'Exam, X-rays and professional cleaning' },
    { name: 'Teeth Whitening', price: '$350', icon: '✨', description: 'In-office whitening, up to 8 shades brighter' },
    { name: 'Filling', price: 'from $150', icon: '🦷', description: 'Tooth-colored fillings for cavities' },
    { name: 'Root Canal', price: 'from $700', icon: '🩺', description: 'Treatment to save an infected tooth' },
    { name: 'Dental Implant Consultation', price: 'Free', icon: '🔩', description: 'Find out if implants are right for you' },
    { name: 'Braces / Invisalign Consultation', price: 'Free', icon: '😁', description: 'Options for straightening your teeth' },
    { name: 'Emergency Visit', price: '$90', icon: '🚑', description: 'Same-day care for pain or injury' },
  ],

  insurance: ['Delta Dental', 'Cigna', 'Aetna', 'MetLife', 'Guardian'],

  faqs: [
    'New patients are welcome. Please arrive 10 minutes early to fill in a short form.',
    'Payment by card, cash, or insurance. 0% payment plans are available for treatments over $500.',
    'Children are seen from age 3.',
    'Cancellations need 24 hours notice.',
  ],
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

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
  return DAY_NAMES[parseDate(dateString).getDay()]
}

// All appointment start times on that day, e.g. ["09:00", "09:30", ...]. Empty when closed or in the past.
export function getSlots(dateString) {
  const date = parseDate(dateString)
  const hours = clinic.hours[date.getDay()]
  if (!hours) return []

  const toMinutes = (time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3))
  const now = new Date()
  const isToday = dateString === toDateString(now)
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  const slots = []
  for (let m = toMinutes(hours[0]); m < toMinutes(hours[1]); m += clinic.slotMinutes) {
    if (isToday && m <= nowMinutes) continue
    slots.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`)
  }
  return dateString < toDateString(now) ? [] : slots
}

// The clinic info as text for the AI's instructions.
export function clinicInfoText() {
  const hours = DAY_NAMES.map((day, i) => `${day}: ${clinic.hours[i] ? clinic.hours[i].join(' - ') : 'Closed'}`)
  return [
    `Clinic: ${clinic.name}`,
    `Phone: ${clinic.phone}`,
    `Email: ${clinic.email}`,
    `Address: ${clinic.address}. ${clinic.parking}`,
    `Opening hours:\n${hours.join('\n')}`,
    `Services and prices:\n${clinic.services.map((s) => `- ${s.name}: ${s.price} (${s.description})`).join('\n')}`,
    `Insurance accepted: ${clinic.insurance.join(', ')}`,
    `Other info:\n${clinic.faqs.map((f) => `- ${f}`).join('\n')}`,
  ].join('\n\n')
}
