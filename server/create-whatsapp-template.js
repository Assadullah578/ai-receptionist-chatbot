// Creates the WhatsApp booking confirmation template, then shows its status. Run once:
//   npm run whatsapp:template
// Use this instead of WhatsApp Manager's Message templates page. Meta must approve the template before messages can be sent.
import { clinic } from './clinic.js'

const { WHATSAPP_TOKEN, WHATSAPP_BUSINESS_ACCOUNT_ID, WHATSAPP_TEMPLATE } = process.env
const name = WHATSAPP_TEMPLATE || 'appointment_confirmation'
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
    language: 'en',
    category: 'UTILITY',
    components: [
      {
        type: 'BODY',
        text: `Hi {{1}}, your {{2}} at ${clinic.name} is confirmed for {{3}} at {{4}}. Call ${clinic.phone} if you need to reschedule.`,
        example: { body_text: [['Emma Wilson', 'Teeth Whitening', 'Wednesday, November 11', '10:00 AM']] },
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
