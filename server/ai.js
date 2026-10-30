import { GoogleGenAI } from '@google/genai'
import { clinic, clinicInfoText, dayName, toDateString } from './clinic.js'
import { runTool, toolDeclarations } from './tools.js'

if (!process.env.GEMINI_API_KEY) console.warn('GEMINI_API_KEY is missing in .env, so the chatbot cannot reply.')
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  // Give up after 15 seconds instead of retrying for minutes when Gemini is busy.
  httpOptions: { timeout: 15000, retryOptions: { attempts: 1 } },
})

// If a model is busy or slow, try the next one. Flash-Lite is fastest, so it gets a second try at the end.
const MODELS = ['gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-flash-lite-latest']

function systemPrompt() {
  const now = new Date()
  const today = toDateString(now)
  const time = now.toTimeString().slice(0, 5)

  return `You are the friendly AI receptionist for ${clinic.name}, chatting with visitors on the clinic's website.
Today is ${dayName(today)}, ${today}. The time now is ${time}.

What you do:
- Answer questions using only the clinic information below. If something isn't covered, say you're not sure and offer to have the team contact them (save_contact_request).
- When the visitor asks what you offer or about prices in general, or wants to book without saying which service, call show_services.
- Book appointments. You need: service, date, time, full name and phone number. Ask for missing details one or two at a time.
- To get the visitor's name and phone number, call show_contact_form instead of asking for them in text. Do this once the service, date and time are chosen.
- Always call check_available_times before suggesting times, and offer 3 or 4 options instead of the full list.
- When you have all the details, call book_appointment. The first call does not book yet: it tells you to show the details and ask the patient to confirm. When they say yes, call it again with the same details. Never say an appointment is booked until book_appointment returns success.
- If the visitor wants to talk to a person, has a complaint, or isn't ready to book, offer a callback: get their name and phone with show_contact_form, then call save_contact_request.

Safety:
- Never diagnose, give medical advice, or recommend medicine. For symptoms, suggest booking a visit.
- For severe pain, swelling, bleeding or a knocked-out tooth, tell them to call the clinic now at ${clinic.phone} (or 911 if it is life-threatening), and offer an Emergency Visit.

Style: warm and short (1 to 3 sentences, or a short list). Plain language. Use **bold** only for key details like dates and times. Write times like "2:30 PM". Never invent prices, times or policies.

Clinic information:
${clinicInfoText()}`
}

async function generate(contents) {
  for (let i = 0; i < MODELS.length; i++) {
    try {
      return await ai.models.generateContent({
        model: MODELS[i],
        contents,
        config: { systemInstruction: systemPrompt(), tools: [{ functionDeclarations: toolDeclarations }] },
      })
    } catch (error) {
      if (i === MODELS.length - 1) throw error
      console.warn(`${MODELS[i]} failed (${error.message}), trying again`)
    }
  }
}

// messages: the whole conversation so far, as [{ role, content }], ending with the user's new message.
// Returns { text, widget }: widget holds what the chat widget should display with the reply
// (services, the contact form, or a booked appointment).
export async function getReply(messages, threadId) {
  // Gemini calls the assistant role "model".
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
  const widget = {}

  // Gemini may call tools a few times (check times, then book) before it answers.
  for (let step = 0; step < 5; step++) {
    const response = await generate(contents)
    const calls = response.functionCalls
    if (!calls?.length) return { text: response.text || "Sorry, I didn't catch that. Could you rephrase?", widget }

    contents.push(response.candidates[0].content)
    const results = []
    for (const call of calls) {
      const result = await runTool(call.name, call.args ?? {}, { threadId, turn: messages.length })
      Object.assign(widget, result.widget)
      results.push({ functionResponse: { id: call.id, name: call.name, response: result.response } })
    }
    contents.push({ role: 'user', parts: results })
  }

  return { text: `Sorry, something went wrong. Please call us at ${clinic.phone}.`, widget: {} }
}
