import { createRoot } from 'react-dom/client'
import '../index.css'
import AdminApp from './AdminApp'

// The dashboard is a normal page, so it doesn't need a Shadow DOM.
createRoot(document.getElementById('root')!).render(<AdminApp />)
