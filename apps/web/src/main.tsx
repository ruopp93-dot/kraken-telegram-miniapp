import React from 'react'
import ReactDOM from 'react-dom/client'
import WebApp from '@twa-dev/sdk'
import App from './App.tsx'
import './index.css'

// Initialize Telegram Web App
WebApp.ready()
WebApp.expand()

// Set theme colors
WebApp.setHeaderColor('#0B1220')
WebApp.setBackgroundColor('#0B1220')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
