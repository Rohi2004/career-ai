import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return React.createElement('div', {
        style: {
          padding: '40px',
          fontFamily: 'Inter, sans-serif',
          maxWidth: '800px',
          margin: '40px auto',
        }
      },
        React.createElement('h1', { style: { color: '#ef4444', marginBottom: '16px' } }, '⚠️ Application Error'),
        React.createElement('p', { style: { color: '#475569', marginBottom: '16px' } }, 'Something went wrong while rendering the application.'),
        React.createElement('pre', {
          style: {
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px',
            overflow: 'auto',
            fontSize: '14px',
            color: '#0f172a',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }
        }, String(this.state.error)),
        this.state.errorInfo && React.createElement('pre', {
          style: {
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '16px',
            overflow: 'auto',
            fontSize: '12px',
            color: '#991b1b',
            marginTop: '12px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }
        }, this.state.errorInfo.componentStack)
      );
    }
    return this.props.children;
  }
}

console.log('[CareerAI] main.jsx executing...');

const rootEl = document.getElementById('root');
if (!rootEl) {
  console.error('[CareerAI] FATAL: #root element not found!');
} else {
  console.log('[CareerAI] Mounting React app...');
  try {
    createRoot(rootEl).render(
      React.createElement(StrictMode, null,
        React.createElement(ErrorBoundary, null,
          React.createElement(App)
        )
      )
    );
    console.log('[CareerAI] React render() called successfully');
  } catch (e) {
    console.error('[CareerAI] FATAL mount error:', e);
    rootEl.innerHTML = '<div style="padding:40px;font-family:sans-serif"><h1 style="color:red">Mount Error</h1><pre>' + e.message + '</pre></div>';
  }
}
