import { createRoot } from 'react-dom/client'
import '../index.css'
import { applyColors } from '../config'
import AdminApp from './AdminApp'

applyColors(document.documentElement)

// The dashboard is a normal page, so it doesn't need a Shadow DOM.
createRoot(document.getElementById('root')!).render(<AdminApp />)
