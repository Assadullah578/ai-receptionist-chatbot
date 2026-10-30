# AI Receptionist Chatbot

An AI receptionist for a dental clinic (demo: "BrightSmile Dental") that any website can add with one `<script>` tag. It answers questions from the clinic's own information, books appointments, takes callback requests, and gives the clinic an admin dashboard.

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

## Using it for another business

- `server/clinic.js`: name, contact details, hours, services, prices and FAQs
- `src/config.ts`: text shown in the widget
