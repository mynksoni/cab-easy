import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LocationPicker from './components/LocationPicker'
import CabLinks from './components/CabLinks'
import ShareModal from './components/ShareModal'
import BookingView from './components/BookingView'
import { parseUrlParams } from './utils/cabDeepLinks'

function App() {
  const [pickup, setPickup] = useState(null)
  const [dropoff, setDropoff] = useState(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isBookingMode, setIsBookingMode] = useState(false)
  const [tripName, setTripName] = useState('')

  // Check for URL parameters on load (for shared links)
  useEffect(() => {
    const params = parseUrlParams()
    if (params) {
      setPickup(params.pickup)
      setDropoff(params.dropoff)
      setTripName(params.tripName)
      setIsBookingMode(true) // Show simplified booking view
    }
  }, [])

  // If in booking mode (opened from shared link), show simplified view
  if (isBookingMode && pickup && dropoff) {
    return (
      <div className="app booking-mode">
        <BookingView 
          pickup={pickup} 
          dropoff={dropoff} 
          tripName={tripName} 
        />
        <button 
          className="switch-mode-btn"
          onClick={() => setIsBookingMode(false)}
        >
          ⚙️ Edit Trip
        </button>
      </div>
    )
  }

  return (
    <div className="app">
      {/* Hero Section */}
      <motion.header 
        className="hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-content">
          <motion.div 
            className="logo"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            🚕
          </motion.div>
          <h1>CabEasy</h1>
          <p className="tagline">One-tap cab booking for seniors</p>
          <p className="subtitle">
            Create easy booking links for your loved ones. 
            No app confusion, no typing addresses.
          </p>
        </div>
        <div className="hero-decoration">
          <div className="floating-emoji e1">🚗</div>
          <div className="floating-emoji e2">🚙</div>
          <div className="floating-emoji e3">🛺</div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* How It Works */}
          <motion.section 
            className="how-it-works"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3>How It Works</h3>
            <div className="steps">
              <div className="step">
                <span className="step-number">1</span>
                <span className="step-icon">📍</span>
                <span className="step-text">Set pickup & destination</span>
              </div>
              <div className="step-arrow">→</div>
              <div className="step">
                <span className="step-number">2</span>
                <span className="step-icon">📤</span>
                <span className="step-text">Share link with family</span>
              </div>
              <div className="step-arrow">→</div>
              <div className="step">
                <span className="step-number">3</span>
                <span className="step-icon">👆</span>
                <span className="step-text">They tap to book!</span>
              </div>
            </div>
          </motion.section>

          {/* Location Picker */}
          <LocationPicker
            pickup={pickup}
            dropoff={dropoff}
            onPickupChange={setPickup}
            onDropoffChange={setDropoff}
          />

          {/* Cab Links */}
          <CabLinks
            pickup={pickup}
            dropoff={dropoff}
            onShare={() => setIsShareModalOpen(true)}
          />
        </div>
      </main>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        pickup={pickup}
        dropoff={dropoff}
      />

      {/* Footer */}
      <footer className="footer">
        <p>Made with ❤️ for our elderly loved ones</p>
        <p className="footer-note">
          CabEasy is not affiliated with any cab company. 
          We simply make booking easier!
        </p>
        <p className="footer-copyright">
          © {new Date().getFullYear()} CabEasy. Open source under MIT License.
        </p>
      </footer>
    </div>
  )
}

export default App

