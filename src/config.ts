// The API lives on the same server that hosts chatbot.js, even when the widget is embedded on another website.
const script = document.currentScript as HTMLScriptElement | null
const serverUrl = script?.src ? new URL(script.src).origin : location.origin

// Text and contact details shown in the widget. Change these to use the chatbot for another business.
export const config = {
  apiUrl: import.meta.env.DEV ? 'http://localhost:3000/api' : `${serverUrl}/api`,
  name: 'BrightSmile Dental',
  phone: '(555) 123-4567',
  teaser: '👋 Need a dental appointment? I can book it for you.',
  quickReplies: ['Book an appointment', 'Our services', 'Opening hours', 'Do you accept my insurance?'],
}
