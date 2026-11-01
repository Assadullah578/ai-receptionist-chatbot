import { apiUrl } from './config'

export type Appointment = { id: number; name: string; service: string; date: string; time: string }

export type Service = { name: string; price: string; icon: string; description: string }

export type Message = {
  role: 'user' | 'assistant'
  content: string
  services?: Service[] // show the services as cards
  showContactForm?: boolean // the AI asked for the visitor's name and phone
  appointment?: Appointment // an appointment was just booked
}

export async function createThread(): Promise<{ threadId: number; messages: Message[] }> {
  const res = await fetch(`${apiUrl}/threads`, { method: 'POST' })
  if (!res.ok) throw new Error('Could not start chat')
  return res.json()
}

export async function sendMessage(threadId: number, content: string): Promise<Message> {
  const res = await fetch(`${apiUrl}/threads/${threadId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  if (!res.ok) throw new Error('Could not send message')
  return res.json()
}
