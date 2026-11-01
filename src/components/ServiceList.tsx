import type { Service } from '../api'
import { widget } from '../config'

// The services as cards. The button sends a booking request as the visitor's message.
export default function ServiceList({ services, onBook }: { services: Service[]; onBook?: (message: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      {services.map((service) => (
        <div key={service.name} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-xl">{service.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-slate-800">{service.name}</p>
            <p className="text-xs text-slate-500">{service.description}</p>
            <p className="mt-0.5 text-xs font-semibold text-brand-dark">{service.price}</p>
          </div>
          {onBook && (
            <button
              onClick={() => onBook(widget.serviceMessage.replace('{service}', service.name))}
              className="shrink-0 cursor-pointer rounded-full border border-brand/30 px-3 py-1 text-xs font-medium text-brand-dark hover:bg-brand-light"
            >
              {widget.serviceButton}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
