import type { Service } from '../api'

// The clinic's services as cards. Clicking "Book" sends a booking request as the visitor's message.
export default function ServiceList({ services, onBook }: { services: Service[]; onBook?: (message: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      {services.map((service) => (
        <div key={service.name} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xl">{service.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-slate-800">{service.name}</p>
            <p className="text-xs text-slate-500">{service.description}</p>
            <p className="mt-0.5 text-xs font-semibold text-teal-700">{service.price}</p>
          </div>
          {onBook && (
            <button
              onClick={() => onBook(`I'd like to book ${service.name}.`)}
              className="shrink-0 cursor-pointer rounded-full border border-teal-200 px-3 py-1 text-xs font-medium text-teal-700 hover:bg-teal-50"
            >
              Book
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
