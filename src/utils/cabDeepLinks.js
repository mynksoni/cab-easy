// Deep link generators for various cab platforms
// These links will open the respective apps with pre-filled pickup and drop locations

export const cabPlatforms = [
  {
    id: 'uber',
    name: 'Uber',
    icon: '🚗',
    color: '#000000',
    bgColor: '#ffffff',
    subtitle: 'Auto-fills locations',
    // Use universal link that works on both mobile and web
    generateLink: (pickup, dropoff) => {
      const pickupAddr = encodeURIComponent(pickup.address || 'Pickup')
      const dropoffAddr = encodeURIComponent(dropoff.address || 'Destination')
      return `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${pickup.lat}&pickup[longitude]=${pickup.lng}&pickup[nickname]=${pickupAddr}&dropoff[latitude]=${dropoff.lat}&dropoff[longitude]=${dropoff.lng}&dropoff[nickname]=${dropoffAddr}`
    }
  },
  {
    id: 'ola',
    name: 'Ola',
    icon: '🛺',
    color: '#ffffff',
    bgColor: '#1C8E41',
    subtitle: 'Auto-fills locations',
    // Ola web booking link
    generateLink: (pickup, dropoff) => {
      return `https://book.olacabs.com/?serviceType=p2p&utm_source=widget&lat=${pickup.lat}&lng=${pickup.lng}&pickup_name=${encodeURIComponent(pickup.address || 'Pickup')}&drop_lat=${dropoff.lat}&drop_lng=${dropoff.lng}&drop_name=${encodeURIComponent(dropoff.address || 'Destination')}`
    }
  },
  {
    id: 'google_maps',
    name: 'Google Maps',
    icon: '🗺️',
    color: '#ffffff',
    bgColor: '#4285F4',
    subtitle: 'Shows all cab options',
    generateLink: (pickup, dropoff) => {
      // Google Maps directions - shows Uber, Ola, Rapido options in India
      return `https://www.google.com/maps/dir/?api=1&origin=${pickup.lat},${pickup.lng}&destination=${dropoff.lat},${dropoff.lng}&travelmode=driving`
    }
  }
]

// Note: Rapido removed as they don't support location-based deep links
// Users can book Rapido via Google Maps which shows it as an option

// Generate a shareable URL with encoded locations
export const generateShareableUrl = (pickup, dropoff, tripName) => {
  const baseUrl = window.location.origin + window.location.pathname
  const params = new URLSearchParams({
    plat: pickup.lat,
    plng: pickup.lng,
    paddr: pickup.address || '',
    dlat: dropoff.lat,
    dlng: dropoff.lng,
    daddr: dropoff.address || '',
    name: tripName || ''
  })
  return `${baseUrl}?${params.toString()}`
}

// Parse URL parameters to get pre-filled locations
export const parseUrlParams = () => {
  const params = new URLSearchParams(window.location.search)
  const hasParams = params.has('plat') && params.has('dlat')
  
  if (!hasParams) return null
  
  return {
    pickup: {
      lat: parseFloat(params.get('plat')),
      lng: parseFloat(params.get('plng')),
      address: params.get('paddr') || ''
    },
    dropoff: {
      lat: parseFloat(params.get('dlat')),
      lng: parseFloat(params.get('dlng')),
      address: params.get('daddr') || ''
    },
    tripName: params.get('name') || ''
  }
}
