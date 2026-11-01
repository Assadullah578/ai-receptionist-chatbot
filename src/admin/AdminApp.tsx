import { useEffect, useState, type FormEvent } from 'react'
import MessageBubble from '../components/MessageBubble'
import { apiUrl, business, dashboard, features, labels } from '../config'
import { capitalize, formatDate, formatTime } from '../format'

type Appointment = { id: number; thread_id: number | null; name: string; phone: string; service: string; date: string; time: string; status: 'booked' | 'cancelled' }
type Lead = { id: number; thread_id: number | null; name: string; contact: string; reason: string; created_at: string }
type Thread = { id: number; created_at: string; message_count: number; first_message: string }
type ChatMessage = { id: number; role: 'user' | 'assistant'; content: string }

const BOOKINGS_TAB = capitalize(labels.bookings)
const TABS = [features.booking && BOOKINGS_TAB, features.contactRequests && 'Leads', 'Conversations'].filter((tab) => tab !== false)

// Remember the password for this browser tab only.
function savedPassword() {
  try {
    return sessionStorage.getItem('adminPassword') ?? ''
  } catch {
    return ''
  }
}

async function adminFetch(path: string, password: string, options: RequestInit = {}) {
  const res = await fetch(`${apiUrl}/admin${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
  })
  if (!res.ok) throw new Error(res.status === 401 ? 'Wrong password' : 'Request failed')
  return res.json()
}

export default function AdminApp() {
  const [password, setPassword] = useState(savedPassword)
  const [loggedIn, setLoggedIn] = useState(false)
  const [checking, setChecking] = useState(Boolean(password)) // checking a saved password on page load
  const [error, setError] = useState('')
  const [tab, setTab] = useState(TABS[0])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [threads, setThreads] = useState<Thread[]>([])
  const [openThread, setOpenThread] = useState<number | null>(null)

  async function load(pw = password) {
    try {
      const [a, l, t] = await Promise.all([adminFetch('/appointments', pw), adminFetch('/leads', pw), adminFetch('/threads', pw)])
      setAppointments(a)
      setLeads(l)
      setThreads(t)
      setLoggedIn(true)
      setError('')
      try {
        sessionStorage.setItem('adminPassword', pw)
      } catch {
        // Saving is optional.
      }
    } catch (e) {
      setLoggedIn(false)
      setError((e as Error).message)
    }
    setChecking(false)
  }

  useEffect(() => {
    if (password) load()
  }, [])

  async function setStatus(id: number, status: Appointment['status']) {
    await adminFetch(`/appointments/${id}`, password, { method: 'PATCH', body: JSON.stringify({ status }) })
    load()
  }

  function login(e: FormEvent) {
    e.preventDefault()
    load()
  }

  if (checking) return <p className="mt-32 text-center text-sm text-slate-400">Loading…</p>

  if (!loggedIn) {
    return (
      <form onSubmit={login} className="mx-auto mt-32 flex w-80 flex-col gap-3 rounded-2xl bg-white p-6 text-sm shadow">
        <h1 className="text-lg font-semibold">{business.name} admin</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand"
        />
        {error && <p className="text-red-600">{error}</p>}
        <button className="cursor-pointer rounded-lg bg-brand py-2 font-medium text-white hover:bg-brand-dark">Log in</button>
      </form>
    )
  }

  const today = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD
  const upcoming = appointments.filter((a) => a.status === 'booked' && a.date >= today)

  return (
    // On larger screens the page fits the window and only the table scrolls.
    <div className="mx-auto flex max-w-6xl flex-col p-4 text-sm text-slate-800 sm:h-dvh sm:p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{business.name}</h1>
          <p className="text-slate-500">{dashboard.subtitle}</p>
        </div>
        <button onClick={() => load()} className="cursor-pointer rounded-lg bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
          ↻ Refresh
        </button>
      </header>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {features.booking && <Stat label={`Upcoming ${labels.bookings}`} value={upcoming.length} />}
        {features.contactRequests && <Stat label="Callback requests" value={leads.length} />}
        <Stat label="Conversations" value={threads.length} />
      </div>

      <nav className="mb-4 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`cursor-pointer rounded-full px-4 py-1.5 ${tab === t ? 'bg-brand text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'}`}
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="table-scroll min-h-0 overflow-auto rounded-2xl shadow-sm ring-1 ring-slate-200">
        {tab === BOOKINGS_TAB && (
          <Table headers={['Date', 'Time', capitalize(labels.customer), 'Phone', capitalize(labels.service), 'Status', '']} empty={appointments.length === 0}>
            {appointments.map((a) => (
              <tr key={a.id} className={`border-t border-slate-100 ${a.status === 'cancelled' ? 'text-slate-400' : ''}`}>
                <td className="px-4 py-3">{formatDate(a.date)}</td>
                <td className="px-4 py-3">{formatTime(a.time)}</td>
                <td className="px-4 py-3 font-medium">{a.name}</td>
                <td className="px-4 py-3">{a.phone}</td>
                <td className="px-4 py-3">{a.service}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${a.status === 'booked' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  {a.thread_id && <LinkButton onClick={() => setOpenThread(a.thread_id)}>View chat</LinkButton>}
                  <LinkButton onClick={() => setStatus(a.id, a.status === 'booked' ? 'cancelled' : 'booked')}>
                    {a.status === 'booked' ? 'Cancel' : 'Restore'}
                  </LinkButton>
                </td>
              </tr>
            ))}
          </Table>
        )}

        {tab === 'Leads' && (
          <Table headers={['Received', 'Name', 'Contact', 'Reason', '']} empty={leads.length === 0}>
            {leads.map((l) => (
              <tr key={l.id} className="border-t border-slate-100">
                <td className="px-4 py-3 whitespace-nowrap">{l.created_at.slice(0, 16)}</td>
                <td className="px-4 py-3 font-medium">{l.name}</td>
                <td className="px-4 py-3">{l.contact}</td>
                <td className="px-4 py-3">{l.reason}</td>
                <td className="px-4 py-3 text-right">{l.thread_id && <LinkButton onClick={() => setOpenThread(l.thread_id)}>View chat</LinkButton>}</td>
              </tr>
            ))}
          </Table>
        )}

        {tab === 'Conversations' && (
          <Table headers={['Started', 'First message', 'Messages', '']} empty={threads.length === 0}>
            {threads.map((t) => (
              <tr key={t.id} className="border-t border-slate-100">
                <td className="px-4 py-3 whitespace-nowrap">{t.created_at.slice(0, 16)}</td>
                <td className="max-w-md truncate px-4 py-3">{t.first_message}</td>
                <td className="px-4 py-3">{t.message_count}</td>
                <td className="px-4 py-3 text-right">
                  <LinkButton onClick={() => setOpenThread(t.id)}>View chat</LinkButton>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>

      {openThread && <ChatModal threadId={openThread} password={password} onClose={() => setOpenThread(null)} />}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-brand-dark">{value}</p>
    </div>
  )
}

function Table({ headers, empty, children }: { headers: string[]; empty: boolean; children: React.ReactNode }) {
  if (empty) return <p className="p-8 text-center text-slate-400">Nothing here yet.</p>
  return (
    <table className="w-full text-left">
      <thead className="sticky top-0 bg-slate-50 text-xs text-slate-500 uppercase">
        <tr>
          {headers.map((h) => (
            <th key={h} className="px-4 py-3 font-medium">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  )
}

function LinkButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="ml-3 cursor-pointer text-brand-dark hover:underline">
      {children}
    </button>
  )
}

function ChatModal({ threadId, password, onClose }: { threadId: number; password: string; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    adminFetch(`/threads/${threadId}/messages`, password).then(setMessages)
  }, [threadId])

  return (
    <div onClick={onClose} className="fixed inset-0 flex items-center justify-center bg-slate-900/40 p-4">
      <div onClick={(e) => e.stopPropagation()} className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <h2 className="font-semibold">Conversation #{threadId}</h2>
          <button onClick={onClose} aria-label="Close" className="cursor-pointer text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </header>
        <div className="flex flex-col gap-3 overflow-y-auto bg-slate-50 p-4">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
        </div>
      </div>
    </div>
  )
}
