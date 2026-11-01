// Sends WhatsApp messages with Meta's WhatsApp Cloud API.
// Setup: https://developers.facebook.com/docs/whatsapp/cloud-api/get-started
import { whatsapp } from '../business.config.js'
import { formatDate, formatTime } from './business.js'

const { WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_COUNTRY_CODE } = process.env

export const whatsappEnabled = Boolean(WHATSAPP_TOKEN && WHATSAPP_PHONE_NUMBER_ID)
if (!whatsappEnabled) console.warn('WhatsApp is not set up in .env, so booking confirmations will not be sent.')

// "+92 300 1234567" -> "923001234567". Numbers without a country code get WHATSAPP_COUNTRY_CODE in front.
function toWhatsAppNumber(phone) {
  const digits = phone.replace(/\D/g, '')
  if (phone.trim().startsWith('+')) return digits
  if (digits.startsWith('00')) return digits.slice(2)
  return `${WHATSAPP_COUNTRY_CODE ?? ''}${digits.replace(/^0/, '')}`
}

// WhatsApp only allows businesses to start a conversation with an approved template.
// The template's body has 4 placeholders: {{1}} name, {{2}} service, {{3}} date, {{4}} time.
export async function sendBookingConfirmation({ name, phone, service, date, time }) {
  if (!whatsappEnabled) return

  const res = await fetch(`https://graph.facebook.com/v23.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: toWhatsAppNumber(phone),
      type: 'template',
      template: {
        name: whatsapp.template,
        language: { code: whatsapp.language },
        components: [
          {
            type: 'body',
            parameters: [name, service, formatDate(date), formatTime(time)].map((text) => ({ type: 'text', text })),
          },
        ],
      },
    }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message ?? `WhatsApp API error ${res.status}`)
  console.log(`WhatsApp confirmation sent to ${toWhatsAppNumber(phone)}`)
}
