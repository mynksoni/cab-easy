import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateShareableUrl } from '../utils/cabDeepLinks'

export default function ShareModal({ isOpen, onClose, pickup, dropoff }) {
  const [tripName, setTripName] = useState('')
  const [copied, setCopied] = useState(false)

  if (!isOpen || !pickup || !dropoff) return null

  const shareableUrl = generateShareableUrl(pickup, dropoff, tripName)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tripName || 'CabEasy - Book a Ride',
          text: `Book a cab from ${pickup.address || 'pickup'} to ${dropoff.address || 'destination'}`,
          url: shareableUrl
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      copyToClipboard()
    }
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="modal-content"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}>✕</button>
          
          <div className="modal-header">
            <h2>📤 Share This Trip</h2>
            <p>Send this link to your family member for easy booking</p>
          </div>

          <div className="modal-body">
            <div className="trip-name-input">
              <label>Trip Name (optional)</label>
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="e.g., Home to Hospital"
              />
            </div>

            <div className="trip-summary">
              <div className="trip-point">
                <span className="point-icon pickup">📍</span>
                <span>{pickup.address || `${pickup.lat.toFixed(4)}, ${pickup.lng.toFixed(4)}`}</span>
              </div>
              <div className="trip-arrow">↓</div>
              <div className="trip-point">
                <span className="point-icon dropoff">🎯</span>
                <span>{dropoff.address || `${dropoff.lat.toFixed(4)}, ${dropoff.lng.toFixed(4)}`}</span>
              </div>
            </div>

            <div className="qr-section">
              <div className="qr-container">
                <QRCodeSVG 
                  value={shareableUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#1a1a2e"
                />
              </div>
              <p className="qr-hint">Scan with phone camera to open</p>
            </div>

            <div className="link-section">
              <div className="link-display">
                <input 
                  type="text" 
                  value={shareableUrl} 
                  readOnly 
                  className="link-input"
                />
                <button onClick={copyToClipboard} className="copy-btn">
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>

            <div className="share-actions">
              <button onClick={shareNative} className="primary-share-btn">
                <span>📤</span>
                <span>Share Link</span>
              </button>
              
              <div className="share-options">
                <a 
                  href={`https://wa.me/?text=${encodeURIComponent(`Book a cab easily! ${shareableUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-option whatsapp"
                >
                  💬 WhatsApp
                </a>
                <a 
                  href={`sms:?body=${encodeURIComponent(`Book a cab easily! ${shareableUrl}`)}`}
                  className="share-option sms"
                >
                  📱 SMS
                </a>
                <a 
                  href={`mailto:?subject=${encodeURIComponent(tripName || 'Easy Cab Booking')}&body=${encodeURIComponent(`Book a cab easily using this link: ${shareableUrl}`)}`}
                  className="share-option email"
                >
                  ✉️ Email
                </a>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <p>💡 The recipient will see big, easy buttons to book on Uber, Ola, and more!</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

