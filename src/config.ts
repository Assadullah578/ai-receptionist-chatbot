// All business settings live in business.config.js at the project root. Change them there.
import { widget } from '../business.config.js'

export { business, dashboard, features, labels, widget } from '../business.config.js'

// The API lives on the same server that hosts chatbot.js, even when the widget is embedded on another website.
const script = document.currentScript as HTMLScriptElement | null
const serverUrl = script?.src ? new URL(script.src).origin : location.origin

export const apiUrl = import.meta.env.DEV ? 'http://localhost:3000/api' : `${serverUrl}/api`

// Replaces the default theme colours from index.css with the ones in business.config.js.
export function applyColors(element: HTMLElement) {
  const { primary, primaryDark, primaryLight, gradientEnd } = widget.colors
  element.style.setProperty('--color-brand', primary)
  element.style.setProperty('--color-brand-dark', primaryDark)
  element.style.setProperty('--color-brand-light', primaryLight)
  element.style.setProperty('--color-brand-end', gradientEnd)
}
