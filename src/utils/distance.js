// Calculate distance between two coordinates using Haversine formula
// Returns distance in kilometers

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth's radius in kilometers
  
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return Math.round(distance * 10) / 10 // Round to 1 decimal place
}

function toRad(deg) {
  return deg * (Math.PI / 180)
}

// Check if destination is within max distance from pickup
export function isWithinDistance(pickup, dropoff, maxDistanceKm = 200) {
  if (!pickup || !dropoff) return true // Allow if locations not set yet
  
  const distance = calculateDistance(
    pickup.lat, pickup.lng,
    dropoff.lat, dropoff.lng
  )
  
  return distance <= maxDistanceKm
}

