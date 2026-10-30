import { clinic, dayName, getSlots } from './clinic.js'
import { db } from './db.js'
import { sendBookingConfirmation, whatsappEnabled } from './whatsapp.js'

// The actions Gemini can take. It decides when to call them; runTool() does the work.
export const toolDeclarations = [
  {
    name: 'show_services',
    description:
      'Show the clinic\'s services and prices as cards in the chat. Use it when the visitor asks what services you offer or about prices in general, or wants to book but has not picked a service.',
    parametersJsonSchema: { type: 'object', properties: {} },
  },
  {
    name: 'check_available_times',
    description: 'Get the free appointment times for one date. Always call this before suggesting or booking a time.',
    parametersJsonSchema: {
      type: 'object',
      properties: { date: { type: 'string', description: 'Date as YYYY-MM-DD' } },
      required: ['date'],
    },
  },
  {
    name: 'book_appointment',
    description: 'Book an appointment. Only call this after the patient has confirmed all the details.',
    parametersJsonSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: "Patient's full name" },
        phone: { type: 'string', description: "Patient's phone number" },
        service: { type: 'string', enum: clinic.services.map((s) => s.name) },
        date: { type: 'string', description: 'Date as YYYY-MM-DD' },
        time: { type: 'string', description: 'Start time as HH:MM (24-hour), from check_available_times' },
      },
      required: ['service', 'date', 'time'],
    },
  },
  {
    name: 'show_contact_form',
    description:
      'Show a form in the chat where the visitor types their name and phone number. Use it whenever you need their name and phone (to book or for a callback) instead of asking in text.',
    parametersJsonSchema: { type: 'object', properties: {} },
  },
  {
    name: 'save_contact_request',
    description:
      "Save the visitor's details so the clinic team can contact them. Use it when they want to talk to a person, have a question you cannot answer, or are not ready to book.",
    parametersJsonSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        contact: { type: 'string', description: 'Phone number or email' },
        reason: { type: 'string', description: 'Short summary of what they need' },
      },
      required: ['name', 'contact', 'reason'],
    },
  },
]

async function freeTimes(date) {
  const [booked] = await db.query("SELECT time FROM appointments WHERE date = ? AND status = 'booked'", [date])
  const bookedTimes = booked.map((a) => a.time)
  return getSlots(date).filter((time) => !bookedTimes.includes(time))
}

const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value ?? '')

// Bookings waiting for the patient's "yes", by thread. The first book_appointment call only saves the details here,
// so the patient always gets to confirm before anything is booked.
const pendingBookings = new Map()

// threadId: the conversation. turn: which user message is being answered.
// Returns { response } for Gemini, plus { widget } with things for the chat widget to display:
// { services }, { showContactForm: true } or { appointment }.
export async function runTool(name, args, { threadId, turn }) {
  if (name === 'show_services') {
    return {
      response: { shown: true, message: 'The services and prices are now shown as cards under your message (refer to them as "below"). Keep your text to one short sentence and do not repeat the list.' },
      widget: { services: clinic.services },
    }
  }

  if (name === 'show_contact_form') {
    return {
      response: { shown: true, message: 'The form is now shown below your reply. Briefly ask the visitor to fill it in, then wait.' },
      widget: { showContactForm: true },
    }
  }

  if (name === 'check_available_times') {
    if (!isDate(args.date)) return { response: { error: 'Date must be YYYY-MM-DD' } }
    const times = await freeTimes(args.date)
    if (times.length === 0) {
      return { response: { date: args.date, day: dayName(args.date), message: 'No free times on this day (closed, fully booked, or in the past).' } }
    }
    return { response: { date: args.date, day: dayName(args.date), free_times: times } }
  }

  if (name === 'book_appointment') {
    const { name: patient, phone, service, date, time } = args
    // No name or phone yet: show the form, in case the AI forgot to call show_contact_form.
    if (!patient?.trim() || !phone?.trim()) {
      return {
        response: { status: 'need_details', message: 'The name and phone form is now shown below your reply. Ask the visitor to fill it in.' },
        widget: { showContactForm: true },
      }
    }
    if (!clinic.services.some((s) => s.name === service)) return { response: { error: 'Unknown service' } }
    if (!isDate(date)) return { response: { error: 'Date must be YYYY-MM-DD' } }
    if (!(await freeTimes(date)).includes(time)) return { response: { error: 'That time is not available. Check available times again.' } }

    // Same details as last time and the patient has replied since then: book it. Otherwise ask them to confirm first.
    const key = [patient.trim().toLowerCase(), phone.replace(/\D/g, ''), service, date, time].join('|')
    const pending = pendingBookings.get(threadId)
    if (pending?.key !== key || pending.turn === turn) {
      pendingBookings.set(threadId, { key, turn })
      return {
        response: {
          status: 'not_booked_yet',
          message: 'Show these details to the patient and ask them to confirm. After they say yes, call book_appointment again with the same details.',
        },
      }
    }
    pendingBookings.delete(threadId)

    const [result] = await db.query(
      'INSERT INTO appointments (thread_id, name, phone, service, date, time) VALUES (?, ?, ?, ?, ?, ?)',
      [threadId, patient.trim(), phone.trim(), service, date, time],
    )
    const appointment = { id: result.insertId, name: patient.trim(), service, date, time }

    // Send the WhatsApp confirmation in the background, so a WhatsApp problem never blocks the booking.
    sendBookingConfirmation({ ...appointment, phone: phone.trim() }).catch((error) =>
      console.error('WhatsApp confirmation failed:', error.message),
    )

    const note = whatsappEnabled ? 'A confirmation is being sent to their WhatsApp; mention it.' : undefined
    return { response: { success: true, appointment, note }, widget: { appointment } }
  }

  if (name === 'save_contact_request') {
    const { name: visitor, contact, reason } = args
    if (!visitor?.trim() || !contact?.trim()) return { response: { error: 'Name and phone or email are required' } }
    await db.query('INSERT INTO leads (thread_id, name, contact, reason) VALUES (?, ?, ?, ?)', [threadId, visitor.trim(), contact.trim(), reason ?? ''])
    return { response: { success: true } }
  }

  return { response: { error: `Unknown tool: ${name}` } }
}
