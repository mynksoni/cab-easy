import React from 'react'
import { motion } from 'framer-motion'
import { cabPlatforms } from '../utils/cabDeepLinks'

export default function CabLinks({ pickup, dropoff, onShare }) {
  const isReady = pickup && dropoff

  const handleCabClick = (platform) => {
    if (!isReady) return
    
    const link = platform.generateLink(pickup, dropoff)
    
    // Log deep link for debugging
    console.log('='.repeat(50))
    console.log('[CabEasy] Platform:', platform.name)
    console.log('[CabEasy] Deep Link:', link)
    console.log('[CabEasy] Pickup:', JSON.stringify(pickup, null, 2))
    console.log('[CabEasy] Dropoff:', JSON.stringify(dropoff, null, 2))
    console.log('='.repeat(50))
    
    // Use popup window for better mobile experience (especially Uber with logged-in account)
    // Popup dimensions optimized for mobile booking flow
    const width = Math.min(500, window.innerWidth - 40)
    const height = Math.min(700, window.innerHeight - 40)
    const left = (window.innerWidth - width) / 2
    const top = (window.innerHeight - height) / 2
    
    const popup = window.open(
      link,
      `${platform.name}_booking`,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    )
    
    // Fallback: if popup blocked, open in new tab
    if (!popup || popup.closed) {
      console.log('[CabEasy] Popup blocked, opening in new tab')
      const anchor = document.createElement('a')
      anchor.href = link
      anchor.target = '_blank'
      anchor.rel = 'noopener noreferrer'
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      className="cab-links"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="cab-links-header">
        <h2>🚕 Book Your Ride</h2>
        <p>
          {isReady 
            ? 'Tap any platform to book instantly!'
            : 'Set pickup and destination first'}
        </p>
      </div>

      {!isReady && (
        <div className="cab-links-disabled">
          <div className="disabled-icon">👆</div>
          <p>Please select both pickup and destination locations above</p>
        </div>
      )}

      {isReady && (
        <>
          <motion.div 
            className="cab-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {cabPlatforms.map((platform) => (
              <motion.button
                key={platform.id}
                className="cab-button"
                style={{ 
                  backgroundColor: platform.bgColor,
                  color: platform.color 
                }}
                onClick={() => handleCabClick(platform)}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="cab-icon">{platform.icon}</span>
                <span className="cab-name">{platform.name}</span>
                {platform.subtitle && (
                  <span className="cab-subtitle">{platform.subtitle}</span>
                )}
              </motion.button>
            ))}
          </motion.div>

          <motion.div 
            className="share-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="share-divider">
              <span>or share this trip</span>
            </div>
            <button className="share-button" onClick={onShare}>
              <span>📤</span>
              <span>Share Booking Link</span>
            </button>
            <p className="share-hint">
              Create a shareable link for your family member to easily book this trip
            </p>
          </motion.div>
        </>
      )}
    </motion.div>
  )
}
