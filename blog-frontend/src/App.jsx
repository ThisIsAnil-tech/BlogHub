import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CookieConsent from './components/common/CookieConsent'
import routes from './routes'
import './styles/index.css'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <CookieConsent />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {routes.map((route, index) => (
            <Route 
              key={index} 
              path={route.path} 
              element={route.element}
            />
          ))}
        </Routes>
      </main>
      <Footer />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--color-primary)',
            color: 'white',
            borderRadius: '0.5rem',
          },
          success: {
            iconTheme: {
              primary: 'white',
              secondary: 'var(--color-primary)',
            },
          },
        }}
      />
    </div>
  )
}

export default App