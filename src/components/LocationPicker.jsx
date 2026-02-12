import React, { useEffect, useState, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import { motion } from 'framer-motion'
import { useDebounce } from '../hooks/useDebounce'
import { calculateDistance } from '../utils/distance'

const MAX_DISTANCE_KM = 200

// Custom marker icons
const createIcon = (color, emoji) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background: ${color};
      width: 50px;
      height: 50px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      border: 3px solid white;
    ">
      <span style="transform: rotate(45deg); font-size: 24px;">${emoji}</span>
    </div>`,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
  })
}

const pickupIcon = createIcon('#22c55e', '📍')
const dropoffIcon = createIcon('#ef4444', '🎯')

// Component to handle map clicks
function MapClickHandler({ onLocationSelect, activeType }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(activeType, e.latlng)
    },
  })
  return null
}

// Component to recenter map
function MapController({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14)
    }
  }, [center, map])
  return null
}

// Helper function to detect if input is coordinates
function isCoordinateInput(input) {
  if (!input) return null
  // Match patterns like "28.6139, 77.2090" or "28.6139,77.2090" or "28.6139 77.2090"
  const coordPattern = /^\s*(-?\d+\.?\d*)\s*[,\s]\s*(-?\d+\.?\d*)\s*$/
  const match = input.trim().match(coordPattern)
  if (match) {
    const lat = parseFloat(match[1])
    const lng = parseFloat(match[2])
    // Validate lat/lng ranges (roughly for India region)
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng }
    }
  }
  return null
}

// Autocomplete Search component with debounce and coordinate detection
function LocationSearch({ onSearch, placeholder, value, onChange }) {
  const [query, setQuery] = useState(value || '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [coordsDetected, setCoordsDetected] = useState(null)
  const wrapperRef = useRef(null)
  
  // Debounce the query for autocomplete
  const debouncedQuery = useDebounce(query, 400)
  
  // Update query when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setQuery(value)
    }
  }, [value])

  // Check for coordinate input and autocomplete search
  useEffect(() => {
    const searchLocation = async () => {
      if (!debouncedQuery.trim() || debouncedQuery.length < 3) {
        setResults([])
        setCoordsDetected(null)
        return
      }
      
      // Check if input is coordinates - skip API call
      const coords = isCoordinateInput(debouncedQuery)
      if (coords) {
        console.log('[CabEasy] Coordinates detected:', coords)
        setCoordsDetected(coords)
        setResults([])
        setShowResults(false)
        return
      }
      
      setCoordsDetected(null)
      setLoading(true)
      try {
        // Restrict search to India only using countrycodes parameter
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(debouncedQuery)}&limit=5&addressdetails=1&countrycodes=in`
        )
        const data = await response.json()
        setResults(data)
        setShowResults(true)
      } catch (error) {
        console.error('Search failed:', error)
        setResults([])
      }
      setLoading(false)
    }

    searchLocation()
  }, [debouncedQuery])

  // Handle click outside to close results
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setQuery(newValue)
    onChange?.(newValue)
    setShowResults(true)
  }

  const handleSelect = (result) => {
    const shortAddress = result.display_name.split(',').slice(0, 3).join(', ')
    onSearch({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: shortAddress
    })
    setQuery(shortAddress)
    setResults([])
    setShowResults(false)
  }

  // Handle coordinate confirmation
  const handleUseCoordinates = () => {
    if (coordsDetected) {
      onSearch({
        lat: coordsDetected.lat,
        lng: coordsDetected.lng,
        address: `${coordsDetected.lat.toFixed(6)}, ${coordsDetected.lng.toFixed(6)}`
      })
      setCoordsDetected(null)
    }
  }

  const formatResultName = (result) => {
    // Show a cleaner address format
    const parts = result.display_name.split(',')
    if (parts.length > 3) {
      return parts.slice(0, 3).join(', ')
    }
    return result.display_name
  }

  return (
    <div className="search-container" ref={wrapperRef}>
      <div className="search-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder={placeholder}
          className="search-input"
        />
        {loading && <span className="search-loading">⏳</span>}
      </div>
      {/* Coordinate detection prompt */}
      {coordsDetected && (
        <div className="coords-detected">
          <span>📍 Coordinates detected: {coordsDetected.lat.toFixed(4)}, {coordsDetected.lng.toFixed(4)}</span>
          <button onClick={handleUseCoordinates} className="use-coords-btn">
            ✓ Use these coordinates
          </button>
        </div>
      )}
      {showResults && results.length > 0 && (
        <ul className="search-results">
          {results.map((result, idx) => (
            <li key={idx} onClick={() => handleSelect(result)}>
              <span className="result-icon">📍</span>
              <span className="result-text">{formatResultName(result)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function LocationPicker({ pickup, dropoff, onPickupChange, onDropoffChange }) {
  const [activeType, setActiveType] = useState('pickup')
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]) // Default: Delhi
  const [userLocation, setUserLocation] = useState(null)
  const [gettingLocation, setGettingLocation] = useState(false)
  const [pickupQuery, setPickupQuery] = useState('')
  const [dropoffQuery, setDropoffQuery] = useState('')
  const [distanceError, setDistanceError] = useState(null)
  const [currentDistance, setCurrentDistance] = useState(null)
  // Track if current location is used for pickup or dropoff (can only be used for one)
  const [currentLocUsedFor, setCurrentLocUsedFor] = useState(null) // 'pickup' | 'dropoff' | null

  // Validate distance between pickup and dropoff
  const validateDistance = useCallback((pickupLoc, dropoffLoc) => {
    if (!pickupLoc || !dropoffLoc) return { valid: true, distance: null }
    
    const distance = calculateDistance(
      pickupLoc.lat, pickupLoc.lng,
      dropoffLoc.lat, dropoffLoc.lng
    )
    
    console.log(`[CabEasy] Distance: ${distance} km`)
    
    return {
      valid: distance <= MAX_DISTANCE_KM,
      distance
    }
  }, [])

  // Get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(loc)
          setMapCenter([loc.lat, loc.lng])
        },
        (error) => {
          console.log('Geolocation error:', error)
        }
      )
    }
  }, [])

  const handleLocationSelect = async (type, latlng) => {
    // Reverse geocode to get address
    let address = ''
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`
      )
      const data = await response.json()
      if (data.display_name) {
        address = data.display_name.split(',').slice(0, 3).join(', ')
      }
    } catch (error) {
      console.log('Reverse geocode failed:', error)
    }

    const location = { lat: latlng.lat, lng: latlng.lng, address }
    
    if (type === 'pickup') {
      onPickupChange(location)
      setPickupQuery(address)
      setDistanceError(null)
      // Recalculate distance if dropoff exists
      if (dropoff) {
        const { valid, distance } = validateDistance(location, dropoff)
        setCurrentDistance(distance)
        if (!valid) {
          setDistanceError(`Radial distance is ${distance} km. Maximum allowed is ${MAX_DISTANCE_KM} km.`)
        }
      }
    } else {
      // Validate distance for dropoff
      if (pickup) {
        const { valid, distance } = validateDistance(pickup, location)
        setCurrentDistance(distance)
        if (!valid) {
          setDistanceError(`Radial distance is ${distance} km (straight-line). Maximum allowed is ${MAX_DISTANCE_KM} km. Please select a closer destination.`)
          return // Don't set the dropoff
        }
      }
      setDistanceError(null)
      onDropoffChange(location)
      setDropoffQuery(address)
    }
  }

  const handleSearchResult = (type, location) => {
    if (type === 'pickup') {
      onPickupChange(location)
      setMapCenter([location.lat, location.lng])
      setDistanceError(null)
      // Recalculate distance if dropoff exists
      if (dropoff) {
        const { valid, distance } = validateDistance(location, dropoff)
        setCurrentDistance(distance)
        if (!valid) {
          setDistanceError(`Radial distance is ${distance} km. Maximum allowed is ${MAX_DISTANCE_KM} km.`)
        }
      }
    } else {
      // Validate distance for dropoff
      if (pickup) {
        const { valid, distance } = validateDistance(pickup, location)
        setCurrentDistance(distance)
        if (!valid) {
          setDistanceError(`Radial distance is ${distance} km (straight-line). Maximum allowed is ${MAX_DISTANCE_KM} km. Please select a closer destination.`)
          return // Don't set the dropoff
        }
      }
      setDistanceError(null)
      onDropoffChange(location)
      setMapCenter([location.lat, location.lng])
    }
  }

  // Use current location for either pickup or destination
  const useCurrentLocation = useCallback(async (type) => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setGettingLocation(true)
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        
        // Reverse geocode to get address
        let address = 'Current Location'
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.lng}`
          )
          const data = await response.json()
          if (data.display_name) {
            address = data.display_name.split(',').slice(0, 3).join(', ')
          }
        } catch (error) {
          console.log('Reverse geocode failed:', error)
        }

        const location = { ...loc, address }
        
        if (type === 'pickup') {
          onPickupChange(location)
          setPickupQuery(address)
          setDistanceError(null)
          setCurrentLocUsedFor('pickup') // Track that current location is used for pickup
          // Recalculate distance if dropoff exists
          if (dropoff) {
            const { valid, distance } = validateDistance(location, dropoff)
            setCurrentDistance(distance)
            if (!valid) {
              setDistanceError(`Radial distance is ${distance} km. Maximum allowed is ${MAX_DISTANCE_KM} km.`)
            }
          }
        } else {
          // Validate distance for dropoff
          if (pickup) {
            const { valid, distance } = validateDistance(pickup, location)
            setCurrentDistance(distance)
            if (!valid) {
              setDistanceError(`Radial distance is ${distance} km (straight-line). Maximum allowed is ${MAX_DISTANCE_KM} km. Please select a closer destination.`)
              setGettingLocation(false)
              return // Don't set the dropoff
            }
          }
          setDistanceError(null)
          onDropoffChange(location)
          setDropoffQuery(address)
          setCurrentLocUsedFor('dropoff') // Track that current location is used for dropoff
        }
        
        setMapCenter([loc.lat, loc.lng])
        setGettingLocation(false)
      },
      (error) => {
        console.error('Geolocation error:', error)
        alert('Unable to get your location. Please enable location services.')
        setGettingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }, [onPickupChange, onDropoffChange, pickup, dropoff, validateDistance])

  return (
    <motion.div 
      className="location-picker"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="picker-header">
        <h2>📍 Set Locations</h2>
        <p>Search address, use current location, or tap on map</p>
      </div>

      <div className="location-inputs">
        {/* Pickup Location */}
        <div className={`location-input-group ${activeType === 'pickup' ? 'active' : ''}`}>
          <div className="input-label">
            <span className="dot pickup"></span>
            <span>Pickup Location</span>
          </div>
          <LocationSearch 
            onSearch={(loc) => handleSearchResult('pickup', loc)}
            placeholder="Search pickup address..."
            value={pickupQuery}
            onChange={setPickupQuery}
          />
          {pickup && (
            <div className="selected-location">
              ✓ {pickup.address || `${pickup.lat.toFixed(4)}, ${pickup.lng.toFixed(4)}`}
            </div>
          )}
          <div className="location-actions">
            <button 
              onClick={() => useCurrentLocation('pickup')} 
              className={`current-loc-btn ${currentLocUsedFor === 'dropoff' ? 'disabled-reason' : ''}`}
              disabled={gettingLocation || currentLocUsedFor === 'dropoff'}
              title={currentLocUsedFor === 'dropoff' ? 'Current location already used for destination' : ''}
            >
              {gettingLocation ? '⏳ Getting...' : 
               currentLocUsedFor === 'dropoff' ? '🚫 Used for destination' : 
               currentLocUsedFor === 'pickup' ? '✓ Current Location' : '📍 Use Current Location'}
            </button>
            <button 
              onClick={() => setActiveType('pickup')} 
              className={`select-btn ${activeType === 'pickup' ? 'active' : ''}`}
            >
              {activeType === 'pickup' ? '👆 Tap map to set' : '🗺️ Select on map'}
            </button>
          </div>
        </div>

        <div className="location-connector">
          <div className="connector-line"></div>
          <span className="connector-icon">↓</span>
        </div>

        {/* Destination Location */}
        <div className={`location-input-group ${activeType === 'dropoff' ? 'active' : ''}`}>
          <div className="input-label">
            <span className="dot dropoff"></span>
            <span>Destination</span>
          </div>
          <LocationSearch 
            onSearch={(loc) => handleSearchResult('dropoff', loc)}
            placeholder="Search destination address..."
            value={dropoffQuery}
            onChange={setDropoffQuery}
          />
          {dropoff && (
            <div className="selected-location destination">
              ✓ {dropoff.address || `${dropoff.lat.toFixed(4)}, ${dropoff.lng.toFixed(4)}`}
            </div>
          )}
          <div className="location-actions">
            <button 
              onClick={() => useCurrentLocation('dropoff')} 
              className={`current-loc-btn ${currentLocUsedFor === 'pickup' ? 'disabled-reason' : ''}`}
              disabled={gettingLocation || currentLocUsedFor === 'pickup'}
              title={currentLocUsedFor === 'pickup' ? 'Current location already used for pickup' : ''}
            >
              {gettingLocation ? '⏳ Getting...' : 
               currentLocUsedFor === 'pickup' ? '🚫 Used for pickup' : 
               currentLocUsedFor === 'dropoff' ? '✓ Current Location' : '📍 Use Current Location'}
            </button>
            <button 
              onClick={() => setActiveType('dropoff')} 
              className={`select-btn ${activeType === 'dropoff' ? 'active' : ''}`}
            >
              {activeType === 'dropoff' ? '👆 Tap map to set' : '🗺️ Select on map'}
            </button>
          </div>
        </div>
      </div>

      {/* Distance Info & Error */}
      {pickup && dropoff && currentDistance && !distanceError && (
        <div className="distance-info">
          <span>📏</span>
          <div className="distance-content">
            <span>Radial Distance: <strong>{currentDistance} km</strong></span>
            <span className="distance-note">ℹ️ Straight-line distance. Actual road distance may be higher.</span>
          </div>
        </div>
      )}
      
      {distanceError && (
        <div className="distance-error">
          <span>⚠️</span>
          <span>{distanceError}</span>
        </div>
      )}

      <div className="map-wrapper">
        <div className="map-hint">
          {activeType === 'pickup' 
            ? '🟢 Tap to set PICKUP location' 
            : '🔴 Tap to set DESTINATION'}
        </div>
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          className="map-container"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelect={handleLocationSelect} activeType={activeType} />
          <MapController center={mapCenter} />
          
          {pickup && (
            <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon} />
          )}
          {dropoff && (
            <Marker position={[dropoff.lat, dropoff.lng]} icon={dropoffIcon} />
          )}
        </MapContainer>
      </div>
    </motion.div>
  )
}
