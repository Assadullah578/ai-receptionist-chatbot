import path from 'node:path'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import { getReply } from './ai.js'
import { clinic } from './clinic.js'
import { createTables, db } from './db.js'

const app = express()
app.set('trust proxy', 1) // the host's proxy tells us each visitor's real IP
app.use(cors())
app.use(express.json())

// Stop one visitor from using up the AI quota or guessing the admin password.
const limit = (perMinute) => rateLimit({ windowMs: 60_000, limit: perMinute, message: { error: 'Too many requests. Please wait a minute.' } })
app.use('/api/threads', limit(20))
app.use('/api/admin', limit(60))

// The demo clinic website, the widget (dist/chatbot.js) and the dashboard (dist/admin).
const root = path.resolve(import.meta.dirname, '..')
app.use(express.static(path.join(root, 'server/public')))
app.use(express.static(path.join(root, 'dist')))
app.get('/admin', (req, res) => res.redirect('/admin/admin.html'))

const GREETING = `Hi! 👋 I'm the virtual receptionist at ${clinic.name}. I can answer questions or book an appointment for you. How can I help?`

// ---------- Chat widget ----------

// Start a new conversation. Called when the chatbot opens.
app.post('/api/threads', async (req, res) => {
  const [result] = await db.query('INSERT INTO threads () VALUES ()')
  const threadId = result.insertId

  await db.query('INSERT INTO messages (thread_id, role, content) VALUES (?, ?, ?)', [threadId, 'assistant', GREETING])

  res.json({ threadId, messages: [{ role: 'assistant', content: GREETING }] })
})

// Send a message and get the receptionist's reply.
app.post('/api/threads/:threadId/messages', async (req, res) => {
  const { threadId } = req.params
  const content = req.body.content?.trim()
  if (!content) return res.status(400).json({ error: 'Message is empty' })

  const [threads] = await db.query('SELECT id FROM threads WHERE id = ?', [threadId])
  if (threads.length === 0) return res.status(404).json({ error: 'Thread not found' })

  await db.query('INSERT INTO messages (thread_id, role, content) VALUES (?, ?, ?)', [threadId, 'user', content])

  // Send the whole conversation to the AI. The greeting is skipped because the conversation must start with the user.
  const [history] = await db.query('SELECT role, content FROM messages WHERE thread_id = ? ORDER BY id', [threadId])
  const conversation = history.slice(1)

  let reply
  try {
    reply = await getReply(conversation, threadId)
  } catch (error) {
    console.error('AI error:', error.message)
    return res.status(502).json({ error: 'Could not get a reply from the AI' })
  }

  await db.query('INSERT INTO messages (thread_id, role, content) VALUES (?, ?, ?)', [threadId, 'assistant', reply.text])

  // reply.widget may add: services, showContactForm, appointment.
  res.json({ role: 'assistant', content: reply.text, ...reply.widget })
})

// ---------- Admin dashboard (needs the ADMIN_PASSWORD from .env) ----------

app.use('/api/admin', (req, res, next) => {
  if (req.get('x-admin-password') !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Wrong password' })
  next()
})

app.get('/api/admin/appointments', async (req, res) => {
  const [appointments] = await db.query('SELECT * FROM appointments ORDER BY date DESC, time')
  res.json(appointments)
})

// Change an appointment's status, e.g. { status: "cancelled" }.
app.patch('/api/admin/appointments/:id', async (req, res) => {
  const { status } = req.body
  if (!['booked', 'cancelled'].includes(status)) return res.status(400).json({ error: 'Invalid status' })
  await db.query('UPDATE appointments SET status = ? WHERE id = ?', [status, req.params.id])
  res.json({ success: true })
})

app.get('/api/admin/leads', async (req, res) => {
  const [leads] = await db.query('SELECT * FROM leads ORDER BY id DESC')
  res.json(leads)
})

// Conversations where the visitor sent at least one message, newest first.
app.get('/api/admin/threads', async (req, res) => {
  const [threads] = await db.query(`
    SELECT t.id, t.created_at, COUNT(m.id) AS message_count,
      (SELECT content FROM messages WHERE thread_id = t.id AND role = 'user' ORDER BY id LIMIT 1) AS first_message
    FROM threads t
    JOIN messages m ON m.thread_id = t.id
    GROUP BY t.id
    HAVING message_count > 1
    ORDER BY t.id DESC
  `)
  res.json(threads)
})

app.get('/api/admin/threads/:threadId/messages', async (req, res) => {
  const [messages] = await db.query('SELECT id, role, content, created_at FROM messages WHERE thread_id = ? ORDER BY id', [
    req.params.threadId,
  ])
  res.json(messages)
})

await createTables()
app.listen(process.env.PORT, () => console.log(`API running on http://localhost:${process.env.PORT}`))
