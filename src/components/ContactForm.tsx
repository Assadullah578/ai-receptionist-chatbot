import { useState, type FormEvent } from 'react'
import { widget } from '../config'

// Shown when the AI needs the visitor's name and phone. The details are sent as a normal chat message.
export default function ContactForm({ onSubmit }: { onSubmit: (message: string) => void }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return setError('Please enter your name.')
    if (phone.replace(/\D/g, '').length < 7) return setError('Please enter a valid phone number.')
    onSubmit(`My name is ${name.trim()} and my phone number is ${phone.trim()}.`)
  }

  const text = widget.contactForm
  const inputClass = 'w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'

  return (
    <form onSubmit={submit} className="flex w-[85%] flex-col gap-2.5 self-start rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-brand/20">
      <p className="font-medium text-slate-700">{text.title}</p>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-slate-500">{text.nameLabel}</span>
        <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder={text.namePlaceholder} className={inputClass} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-slate-500">{text.phoneLabel}</span>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder={text.phonePlaceholder} className={inputClass} />
        <span className="text-[11px] text-slate-400">{text.phoneHint}</span>
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button className="cursor-pointer rounded-lg bg-brand py-2 font-medium text-white hover:bg-brand-dark">{text.submitButton}</button>
    </form>
  )
}
