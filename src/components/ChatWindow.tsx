import { useEffect, useRef, useState, type FormEvent } from 'react'
import { createThread, sendMessage, type Message } from '../api'
import { business, widget } from '../config'
import ContactForm from './ContactForm'
import MessageBubble from './MessageBubble'

export default function ChatWindow({ hidden, onClose }: { hidden: boolean; onClose: () => void }) {
  const [threadId, setThreadId] = useState<number | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  async function startChat() {
    setThreadId(null)
    setMessages([])
    try {
      const thread = await createThread()
      setThreadId(thread.threadId)
      setMessages(thread.messages)
    } catch {
      setMessages([{ role: 'assistant', content: `Sorry, I can't connect right now. Please call us at **${business.phone}**.` }])
    }
  }

  // A new thread starts when the chatbot is first opened, and again with the "new chat" button.
  useEffect(() => {
    startChat()
  }, [])

  // Keep the newest message in view.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  async function send(content: string) {
    if (!content.trim() || !threadId || loading) return

    setInput('')
    setMessages((m) => [...m, { role: 'user', content }])
    setLoading(true)

    try {
      const reply = await sendMessage(threadId, content)
      setMessages((m) => [...m, reply])
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    }
    setLoading(false)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    send(input)
  }

  const showQuickReplies = threadId && messages.length === 1 && !loading
  // The form belongs to the latest reply only; it goes away once the visitor sends anything.
  const showContactForm = messages.at(-1)?.showContactForm && !loading

  return (
    <div
      className={`${hidden ? 'hidden' : 'flex'} fixed inset-0 flex-col overflow-hidden bg-white sm:static sm:h-[600px] sm:max-h-[calc(100vh-7rem)] sm:w-[380px] sm:rounded-2xl sm:shadow-2xl sm:ring-1 sm:ring-slate-200`}
    >
      <header className="flex items-center gap-3 bg-gradient-to-r from-brand to-brand-end px-4 py-3 text-white">
        <div className="flex size-10 items-center justify-center rounded-full bg-white text-xl">{widget.icon}</div>
        <div className="flex-1">
          <p className="font-semibold">{business.name}</p>
          <p className="flex items-center gap-1.5 text-xs text-white/80">
            <span className="size-2 rounded-full bg-emerald-300" />
            {widget.subtitle}
          </p>
        </div>
        <button onClick={startChat} title="Start a new chat" aria-label="Start a new chat" className="cursor-pointer rounded-full p-2 hover:bg-white/15">
          ↻
        </button>
        <button onClick={onClose} title="Close" aria-label="Close chat" className="cursor-pointer rounded-full p-2 hover:bg-white/15">
          ✕
        </button>
      </header>

      <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto bg-slate-50 p-4">
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} onSend={send} />
        ))}

        {showQuickReplies && (
          <div className="flex flex-wrap gap-2">
            {widget.quickReplies.map((text) => (
              <button
                key={text}
                onClick={() => send(text)}
                className="cursor-pointer rounded-full border border-brand/30 bg-white px-3 py-1.5 text-brand-dark hover:bg-brand-light"
              >
                {text}
              </button>
            ))}
          </div>
        )}

        {showContactForm && <ContactForm onSubmit={send} />}

        {loading && (
          <div className="flex gap-1 self-start rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
            {[0, 150, 300].map((delay) => (
              <span key={delay} className="size-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${delay}ms` }} />
            ))}
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex gap-2 border-t border-slate-200 bg-white p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={widget.inputPlaceholder}
          aria-label="Message"
          className="flex-1 rounded-full border border-slate-300 px-4 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <button
          disabled={!input.trim() || loading}
          aria-label="Send"
          className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-brand text-white hover:bg-brand-dark disabled:cursor-default disabled:opacity-40"
        >
          ➤
        </button>
      </form>
      <p className="bg-white pb-2 text-center text-[11px] text-slate-400">
        {widget.disclaimer}
      </p>
    </div>
  )
}
