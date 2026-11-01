import { createRoot } from 'react-dom/client'
import App from './App'
import { applyColors } from './config'
import styles from './index.css?inline'

// The chatbot lives inside a Shadow DOM so the website's CSS can't touch it (and ours can't touch the website).
const host = document.createElement('div')
applyColors(host)
document.body.appendChild(host)
const shadow = host.attachShadow({ mode: 'open' })

const style = document.createElement('style')
style.textContent = styles
shadow.appendChild(style)

// Tailwind's @property rules are ignored inside a Shadow DOM, so they go on the page instead.
const pageStyle = document.createElement('style')
pageStyle.textContent = styles.match(/@property[^}]+\}/g)?.join('\n') ?? ''
document.head.appendChild(pageStyle)

const container = document.createElement('div')
shadow.appendChild(container)
createRoot(container).render(<App />)
