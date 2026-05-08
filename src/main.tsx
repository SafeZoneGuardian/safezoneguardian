import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.tsx'
import './index.css'

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App crashed:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', color: '#e2e8f0', background: '#0a1020', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Etwas ist schiefgelaufen</h1>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem', maxWidth: '400px', textAlign: 'center' }}>
            Die Anwendung hat einen Fehler festgestellt. Bitte lade die Seite neu.
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
            style={{ padding: '0.75rem 1.5rem', background: '#22d3ee', color: '#0f1622', border: 'none', borderRadius: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Seite neu laden
          </button>
          <details style={{ marginTop: '2rem', color: '#64748b', fontSize: '0.75rem', maxWidth: '500px' }}>
            <summary>Fehlerdetails</summary>
            <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {this.state.error?.message}
            </pre>
          </details>
        </div>
      )
    }
    return this.props.children
  }
}

const rootEl = document.getElementById("root")
if (rootEl) {
  createRoot(rootEl).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  )
} else {
  console.error('Root element #root not found in document')
}
