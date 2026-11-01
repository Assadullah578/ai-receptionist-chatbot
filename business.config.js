// ============================================================================
// BUSINESS SETTINGS: change this one file to use the chatbot for any business.
// The server, AI, chat widget, dashboard and demo page all read from here.
//
// After changing it: restart the server, or redeploy if the site is live.
// Secrets (API keys, passwords) never go here. They belong in .env.
// ============================================================================

// ---------- The business ----------
export const business = {
  name: 'BrightSmile Dental',
  description: 'a family dental clinic', // finishes the sentence "BrightSmile Dental is ..."
  phone: '(555) 123-4567',
  email: 'hello@brightsmile.example',
  address: '123 Maple Avenue, Springfield',

  // Opening hours. Use 24-hour times. Set a day to null when closed.
  hours: {
    monday: ['09:00', '17:00'],
    tuesday: ['09:00', '17:00'],
    wednesday: ['09:00', '17:00'],
    thursday: ['09:00', '19:00'],
    friday: ['09:00', '17:00'],
    saturday: ['09:00', '13:00'],
    sunday: null,
  },
}

// ---------- What the chatbot can do ----------
export const features = {
  services: true, // show services or products as cards in the chat
  booking: true, // check free times and take bookings (needs at least one service below)
  contactRequests: true, // take callback requests and save them as leads
}

export const booking = {
  slotMinutes: 30, // length of each booking; one booking can be made per time slot
}

// ---------- The words for this kind of business ----------
// Examples: a gym might use "class", "classes", "member", "class", "classes".
export const labels = {
  booking: 'appointment',
  bookings: 'appointments',
  customer: 'patient',
  service: 'service',
  services: 'services',
}

// ---------- Services or products ----------
// These appear as cards in the chat and are the only things that can be booked.
export const services = [
  { name: 'Check-up & Cleaning', price: '$120', icon: '🪥', description: 'Exam, X-rays and professional cleaning' },
  { name: 'Teeth Whitening', price: '$350', icon: '✨', description: 'In-office whitening, up to 8 shades brighter' },
  { name: 'Filling', price: 'from $150', icon: '🦷', description: 'Tooth-colored fillings for cavities' },
  { name: 'Root Canal', price: 'from $700', icon: '🩺', description: 'Treatment to save an infected tooth' },
  { name: 'Dental Implant Consultation', price: 'Free', icon: '🔩', description: 'Find out if implants are right for you' },
  { name: 'Braces / Invisalign Consultation', price: 'Free', icon: '😁', description: 'Options for straightening your teeth' },
  { name: 'Emergency Visit', price: '$90', icon: '🚑', description: 'Same-day care for pain or injury' },
]

// ---------- What the AI knows ----------
// The AI answers only from this information, so add anything customers often ask.
export const knowledge = [
  'Parking: free parking behind the building.',
  'Insurance accepted: Delta Dental, Cigna, Aetna, MetLife, Guardian.',
  'New patients are welcome. Please arrive 10 minutes early to fill in a short form.',
  'Payment by card, cash, or insurance. 0% payment plans are available for treatments over $500.',
  'Children are seen from age 3.',
  'Cancellations need 24 hours notice.',
]

// ---------- How the AI behaves ----------
export const assistant = {
  role: 'AI receptionist',
  greeting: `Hi! 👋 I'm the virtual receptionist at ${business.name}. I can answer questions or book an appointment for you. How can I help?`,
  style: 'Warm and short (1 to 3 sentences, or a short list). Plain language.',

  // Rules specific to this business. Important safety rules belong here.
  rules: [
    'Never diagnose, give medical advice, or recommend medicine. For symptoms, suggest booking a visit.',
    `For severe pain, swelling, bleeding or a knocked-out tooth, tell them to call the clinic now at ${business.phone} (or 911 if it is life-threatening), and offer an Emergency Visit.`,
  ],
}

// ---------- Chat widget ----------
export const widget = {
  // Colours as hex codes.
  colors: {
    primary: '#0d9488', // buttons, your messages, links
    primaryDark: '#0f766e', // hover states and prices
    primaryLight: '#f0fdfa', // soft backgrounds
    gradientEnd: '#0891b2', // second colour in the header and chat button
  },

  icon: '🦷', // shown in the chat header
  launcherIcon: '💬', // shown on the round chat button
  subtitle: 'AI receptionist · replies instantly',
  teaser: '👋 Need a dental appointment? I can book it for you.', // bubble shown after a few seconds
  quickReplies: ['Book an appointment', 'Our services', 'Opening hours', 'Do you accept my insurance?'],
  inputPlaceholder: 'Type your message...',
  disclaimer: `AI assistant, not medical advice. Emergency? Call ${business.phone}`,

  // The button on each service card, and the message it sends. {service} is the service's name.
  serviceButton: 'Book',
  serviceMessage: "I'd like to book {service}.",

  bookedTitle: 'Appointment booked',

  // The form that collects a visitor's details.
  contactForm: {
    title: 'Your details',
    nameLabel: 'Full name',
    namePlaceholder: 'Jane Smith',
    phoneLabel: 'WhatsApp number',
    phonePlaceholder: '+1 555 000 0000',
    phoneHint: "Include your country code. We'll send your confirmation on WhatsApp.",
    submitButton: 'Send details',
  },
}

// ---------- WhatsApp booking confirmation ----------
export const whatsapp = {
  template: 'appointment_confirmation', // the template's name in Meta
  language: 'en', // the template's language in Meta

  // Used when creating the template with `npm run whatsapp:template`.
  // Keep the placeholders: {{1}} name, {{2}} service, {{3}} date, {{4}} time.
  // If you change this text, use a new template name above and run that command again.
  message: `Hi {{1}}, your {{2}} at ${business.name} is confirmed for {{3}} at {{4}}. Call ${business.phone} if you need to reschedule.`,
}

// ---------- Admin dashboard ----------
export const dashboard = {
  subtitle: 'AI receptionist dashboard',
}

// ---------- Demo website (the page at "/") ----------
export const website = {
  title: 'BrightSmile Dental | AI Receptionist Demo',
  notice: "Portfolio demo: BrightSmile Dental is a fictional clinic. Please don't enter real personal or medical information.",
  headline: 'Gentle dental care for your whole family',
  subheadline: 'Check-ups, whitening, fillings and more, with a friendly team that makes every visit easy.',
  hint: '💬 Try the AI receptionist in the corner: ask a question or book a visit',
  servicesSubtitle: 'Clear prices, no surprises.',
  footer: 'A fictional clinic created to demonstrate an AI receptionist chatbot.',
}
