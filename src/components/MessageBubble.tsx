import Markdown from 'react-markdown'
import type { Message } from '../api'
import { formatDate, formatTime } from '../format'
import ServiceList from './ServiceList'

// onSend lets cards inside the message send a chat message (left out in the admin dashboard).
export default function MessageBubble({ message, onSend }: { message: Message; onSend?: (message: string) => void }) {
  if (message.role === 'user') {
    return (
      <div className="max-w-[80%] self-end rounded-2xl rounded-br-sm bg-teal-600 px-3.5 py-2 whitespace-pre-wrap text-white">
        {message.content}
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-2 self-start ${message.services ? 'w-full' : 'max-w-[85%]'}`}>
      <div className="rounded-2xl rounded-bl-sm bg-white px-3.5 py-2 leading-relaxed text-slate-800 shadow-sm ring-1 ring-slate-100">
        <Markdown
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
            ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
            strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
            a: ({ children, href }) => (
              <a href={href} target="_blank" rel="noreferrer" className="text-teal-700 underline">
                {children}
              </a>
            ),
          }}
        >
          {message.content}
        </Markdown>
      </div>

      {message.services && <ServiceList services={message.services} onBook={onSend} />}

      {message.appointment && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5">
          <p className="mb-2 flex items-center gap-2 font-semibold text-emerald-800">
            <span className="flex size-5 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">✓</span>
            Appointment booked
          </p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-slate-700">
            <dt className="text-slate-500">Service</dt>
            <dd>{message.appointment.service}</dd>
            <dt className="text-slate-500">Date</dt>
            <dd>{formatDate(message.appointment.date)}</dd>
            <dt className="text-slate-500">Time</dt>
            <dd>{formatTime(message.appointment.time)}</dd>
            <dt className="text-slate-500">Name</dt>
            <dd>{message.appointment.name}</dd>
          </dl>
        </div>
      )}
    </div>
  )
}
