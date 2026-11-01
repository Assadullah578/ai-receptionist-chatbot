import { useEffect, useState } from 'react'
import ChatWindow from './components/ChatWindow'
import { widget } from './config'

export default function App() {
  const [open, setOpen] = useState(false)
  const [started, setStarted] = useState(false) // stays true after the first open, so closing keeps the conversation
  const [showTeaser, setShowTeaser] = useState(false)

  // Show a small invitation bubble a few seconds after the page loads.
  useEffect(() => {
    const timer = setTimeout(() => setShowTeaser(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  function toggle() {
    setOpen(!open)
    setStarted(true)
    setShowTeaser(false)
  }

  return (
    <div className="fixed right-5 bottom-5 z-[2147483647] flex flex-col items-end gap-3 text-sm text-slate-900">
      {started && <ChatWindow hidden={!open} onClose={() => setOpen(false)} />}

      {showTeaser && !started && (
        <div className="flex max-w-64 items-start gap-2 rounded-2xl rounded-br-sm bg-white p-3 shadow-lg ring-1 ring-slate-200">
          <button onClick={toggle} className="cursor-pointer text-left text-slate-700">
            {widget.teaser}
          </button>
          <button onClick={() => setShowTeaser(false)} aria-label="Dismiss" className="cursor-pointer text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>
      )}

      <button
        onClick={toggle}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className={`${open ? 'max-sm:hidden' : ''} flex size-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-end text-2xl text-white shadow-lg transition hover:scale-105`}
      >
        {open ? '✕' : widget.launcherIcon}
      </button>
    </div>
  )
}
