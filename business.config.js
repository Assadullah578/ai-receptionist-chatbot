// ============================================================================
// BUSINESS SETTINGS: change this one file to use the chatbot for any business.
// The server, AI, chat widget, dashboard and demo page all read from here.
//
// After changing it: restart the server, or redeploy if the site is live.
// Secrets (API keys, passwords) never go here. They belong in .env.
// ============================================================================

// ---------- The business ----------
export const business = {
  name: 'IronPeak Gym',
  description: 'a friendly neighborhood gym', // finishes the sentence "IronPeak Gym is ..."
  phone: '(555) 987-6543',
  email: 'hello@ironpeak.example',
  address: '45 Summit Road, Springfield',

  // Opening hours. Use 24-hour times. Set a day to null when closed.
  hours: {
    monday: ['06:00', '22:00'],
    tuesday: ['06:00', '22:00'],
    wednesday: ['06:00', '22:00'],
    thursday: ['06:00', '22:00'],
    friday: ['06:00', '22:00'],
    saturday: ['08:00', '20:00'],
    sunday: ['08:00', '18:00'],
  },
}

// ---------- What the chatbot can do ----------
export const features = {
  services: true, // show services or products as cards in the chat
  booking: true, // check free times and take bookings (needs at least one service below)
  contactRequests: true, // take callback requests and save them as leads
}

export const booking = {
  slotMinutes: 60, // length of each booking; one booking can be made per time slot
}

// ---------- The words for this kind of business ----------
// Examples: a clinic might use "appointment", "appointments", "patient", "service", "services".
export const labels = {
  booking: 'session',
  bookings: 'sessions',
  customer: 'member',
  service: 'session type',
  services: 'session types',
}

// ---------- Services or products ----------
// These appear as cards in the chat and are the only things that can be booked.
export const services = [
  { name: 'Free Gym Tour', price: 'Free', icon: '👋', description: 'See the gym and meet the team' },
  { name: 'Personal Training', price: '$60', icon: '💪', description: 'One-on-one session with a certified trainer' },
  { name: 'Fitness Assessment', price: '$35', icon: '📋', description: 'Check your starting point and set goals' },
  { name: 'Nutrition Consultation', price: '$45', icon: '🥗', description: 'General healthy eating guidance from a coach' },
  { name: 'Private Yoga Session', price: '$50', icon: '🧘', description: 'One-on-one yoga for flexibility and balance' },
  { name: 'Boxing Coaching', price: '$55', icon: '🥊', description: 'One-on-one technique and conditioning' },
]

// ---------- What the AI knows ----------
// The AI answers only from this information, so add anything customers often ask.
export const knowledge = [
  'Memberships: Basic $30 a month (gym floor only), Plus $45 a month (gym floor and group classes), Premium $70 a month (everything, plus one personal training session each month).',
  'There is no joining fee. Memberships can be cancelled with 30 days notice.',
  'Day pass: $12.',
  'Group classes are included with Plus and Premium memberships: Yoga, HIIT, Spin and Boxing. Ask the front desk for the weekly timetable.',
  'Facilities: free weights, cardio machines, a functional training area, showers and lockers.',
  'Bring a towel and a padlock for the lockers.',
  'Free parking is available in front of the building.',
  'Members must be at least 16 years old. Ages 14 and 15 can join with a parent or guardian.',
  'Sessions can be cancelled free of charge with 24 hours notice.',
]

// ---------- How the AI behaves ----------
export const assistant = {
  role: 'AI gym assistant',
  greeting: `Hey! 💪 I'm the virtual assistant at ${business.name}. I can tell you about memberships or book a session for you. How can I help?`,
  style: 'Upbeat, encouraging and short (1 to 3 sentences, or a short list). Plain language.',

  // Rules specific to this business. Important safety rules belong here.
  rules: [
    'Never give medical advice, diagnose injuries, or recommend medication, supplements or specific diets. Suggest speaking to a doctor about injuries or health conditions.',
    'If someone describes chest pain, trouble breathing, fainting or a serious injury, tell them to stop exercising and call 911 right away.',
    'Group classes are not booked through this chat. Membership sign-ups are handled by the team, so offer a callback or a Free Gym Tour.',
  ],
}

// ---------- Chat widget ----------
export const widget = {
  // Colours as hex codes.
  colors: {
    primary: '#ea580c', // buttons, your messages, links
    primaryDark: '#c2410c', // hover states and prices
    primaryLight: '#fff7ed', // soft backgrounds
    gradientEnd: '#dc2626', // second colour in the header and chat button
  },

  icon: '🏋️', // shown in the chat header
  launcherIcon: '💬', // shown on the round chat button
  subtitle: 'AI gym assistant · replies instantly',
  teaser: '💪 Ready to start? I can book your free gym tour.', // bubble shown after a few seconds
  quickReplies: ['Book a free tour', 'Sessions & prices', 'Membership plans', 'Opening hours'],
  inputPlaceholder: 'Type your message...',
  disclaimer: `AI assistant, not medical advice. Questions? Call ${business.phone}`,

  // The button on each service card, and the message it sends. {service} is the service's name.
  serviceButton: 'Book',
  serviceMessage: "I'd like to book {service}.",

  bookedTitle: 'Session booked',

  // The form that collects a visitor's details.
  contactForm: {
    title: 'Your details',
    nameLabel: 'Full name',
    namePlaceholder: 'Alex Morgan',
    phoneLabel: 'WhatsApp number',
    phonePlaceholder: '+1 555 000 0000',
    phoneHint: "Include your country code. We'll send your confirmation on WhatsApp.",
    submitButton: 'Send details',
  },
}

// ---------- WhatsApp booking confirmation ----------
export const whatsapp = {
  template: 'gym_session_confirmation', // the template's name in Meta
  language: 'en', // the template's language in Meta

  // Used when creating the template with `npm run whatsapp:template`.
  // Keep the placeholders: {{1}} name, {{2}} service, {{3}} date, {{4}} time.
  // If you change this text, use a new template name above and run that command again.
  message: `Hi {{1}}, your {{2}} at ${business.name} is confirmed for {{3}} at {{4}}. Call ${business.phone} if you need to reschedule.`,
}

// ---------- Admin dashboard ----------
export const dashboard = {
  subtitle: 'AI gym assistant dashboard',
}

// ---------- Demo website (the page at "/") ----------
export const website = {
  title: 'IronPeak Gym | AI Assistant Demo',
  notice: "Portfolio demo: IronPeak Gym is a fictional gym. Please don't enter real personal or health information.",
  headline: 'Stronger starts here',
  subheadline: 'Modern equipment, expert trainers and a community that keeps you going.',
  hint: '💬 Try the AI assistant in the corner: ask about memberships or book a session',
  servicesSubtitle: 'One-on-one sessions with our team.',
  footer: 'A fictional gym created to demonstrate an AI assistant chatbot.',
}
