# AI Receptionist Chatbot

A configurable AI chatbot that any website can add with one `<script>` tag, shown here as a receptionist for a demo dental clinic ("BrightSmile Dental"). It answers questions from the business's own information, takes bookings and callback requests, and comes with an admin dashboard.

**Stack:** React, TypeScript, Tailwind CSS, Shadow DOM (widget), Node.js + Express, MySQL, Google Gemini (function calling).

## Features

- Answers questions about services, prices, hours, insurance and location, using only the clinic's information
- Books appointments: checks real free times, asks the patient to confirm, then saves the booking (no double bookings)
- Saves callback requests when a visitor wants a person or isn't ready to book
- Never gives medical advice; sends emergencies to the clinic's phone
- Widget: quick replies, typing indicator, booking confirmation card, full-screen on phones, styles isolated with Shadow DOM
- Admin dashboard: appointments (cancel/restore), callback requests, and every conversation

## Setup

1. Create a MySQL database and fill in `.env` (copy `.env.example`). Tables are created automatically.
2. Get a free Gemini API key at https://aistudio.google.com/apikey and set `GEMINI_API_KEY`.
3. Choose an `ADMIN_PASSWORD` for the dashboard.

## Commands

- `npm run server`: start the API on http://localhost:3000
- `npm run dev`: start the widget at http://localhost:5173 and the dashboard at http://localhost:5173/admin.html
- `npm run build`: create `dist/chatbot.js` (the widget) and `dist/admin/` (the dashboard)

To add the chatbot to a website, put `<script src="chatbot.js"></script>` just before `</body>`.

## Deploying

One Node.js server hosts everything: the API, the widget (`/chatbot.js`), the dashboard (`/admin`) and the demo clinic page (`/`). `render.yaml` sets this up on Render. It needs a cloud MySQL database, connected with the `DB_*` settings, including `DB_CA_CERT` for encrypted connections. Set `TZ` to the clinic's time zone.

To add the chatbot to a website, use `<script src="https://YOUR-SERVER/chatbot.js"></script>`.

## Using it for another business

Everything specific to the business is in one file, [business.config.js](business.config.js):

- Business details, opening hours, services and prices
- What the AI knows, its role, greeting, style and rules
- Which features are on: service cards, booking, callback requests
- Words like "appointment" and "patient", so it fits any industry
- Widget colours, icons, quick replies and all form text
- WhatsApp template, dashboard text and the demo website

Change that file, restart the server (or redeploy), and the chatbot becomes a different business.
