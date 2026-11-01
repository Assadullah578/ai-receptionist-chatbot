// Creates the WhatsApp booking confirmation template, then shows its status. Run once:
//   npm run whatsapp:template
// Use this instead of WhatsApp Manager's Message templates page. Meta must approve the template before messages can be sent.
import { services, whatsapp } from '../business.config.js'

const { WHATSAPP_TOKEN, WHATSAPP_BUSINESS_ACCOUNT_ID } = process.env
const name = whatsapp.template
const url = `https://graph.facebook.com/v23.0/${WHATSAPP_BUSINESS_ACCOUNT_ID}/message_templates`
const headers = { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' }

if (!WHATSAPP_TOKEN || !WHATSAPP_BUSINESS_ACCOUNT_ID) {
  console.error('Set WHATSAPP_TOKEN and WHATSAPP_BUSINESS_ACCOUNT_ID in .env first.')
  process.exit(1)
}

const created = await fetch(url, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    name,
    language: whatsapp.language,
    category: 'UTILITY',
    components: [
      {
        type: 'BODY',
        text: whatsapp.message,
        example: { body_text: [['Emma Wilson', services[0]?.name ?? 'Booking', 'Wednesday, November 11', '10:00 AM']] },
      },
    ],
  }),
}).then((res) => res.json())

if (created.error) console.log('Could not create the template:', created.error.error_user_msg || created.error.message)
else console.log(`Template "${name}" created.`)

// Show the template's current status (it may already have existed).
const list = await fetch(`${url}?name=${name}&fields=name,language,status,rejected_reason`, { headers }).then((res) => res.json())
for (const t of list.data ?? []) {
  console.log(`Status of "${t.name}" (${t.language}): ${t.status}${t.rejected_reason && t.rejected_reason !== 'NONE' ? ` (${t.rejected_reason})` : ''}`)
}
