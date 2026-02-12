import React from 'react'
import { motion } from 'framer-motion'
import { cabPlatforms } from '../utils/cabDeepLinks'

// This is the simplified view that elderly users will see
export default function BookingView({ pickup, dropoff, tripName }) {
  const handleCabClick = (platform) => {
    const link = platform.generateLink(pickup, dropoff)
    
    // Log deep link for debugging
    console.log('='.repeat(50))
    console.log('[CabEasy] Platform:', platform.name)
    console.log('[CabEasy] Deep Link:', link)
    console.log('[CabEasy] Pickup:', JSON.stringify(pickup, null, 2))
    console.log('[CabEasy] Dropoff:', JSON.stringify(dropoff, null, 2))
    console.log('='.repeat(50))
    
    // Use popup window for better mobile experience (especially Uber with logged-in account)
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
      transition: { staggerChildren: 0.15 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring', stiffness: 200 }
    }
  }

  return (
    <div className="booking-view">
      <motion.div 
        className="booking-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>🚕 {tripName || 'Your Ride'}</h1>
        <div className="booking-route">
          <div className="route-point">
            <span className="route-dot pickup"></span>
            <span className="route-text">
              {pickup.address || 'Pickup Location'}
            </span>
          </div>
          <div className="route-line"></div>
          <div className="route-point">
            <span className="route-dot dropoff"></span>
            <span className="route-text">
              {dropoff.address || 'Destination'}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="booking-instruction"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p>👇 Tap any button below to book your ride</p>
      </motion.div>

      <motion.div 
        className="booking-buttons"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {cabPlatforms.map((platform) => (
          <motion.button
            key={platform.id}
            className="big-cab-button"
            style={{ 
              backgroundColor: platform.bgColor,
              color: platform.color 
            }}
            onClick={() => handleCabClick(platform)}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="big-cab-icon">{platform.icon}</span>
            <div className="big-cab-info">
              <span className="big-cab-name">{platform.name}</span>
              {platform.subtitle && (
                <span className="big-cab-subtitle">{platform.subtitle}</span>
              )}
            </div>
            <span className="big-cab-action">Tap to Book →</span>
          </motion.button>
        ))}
      </motion.div>

      <motion.div 
        className="booking-help"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>🆘 Need help? Call your family member</p>
      </motion.div>
    </div>
  )
}
