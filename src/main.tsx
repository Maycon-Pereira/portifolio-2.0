import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { I18nProvider } from './hooks/useI18nHook'
import './style.css'

ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
        <I18nProvider>
            <App />
        </I18nProvider>
    </React.StrictMode>,
)
