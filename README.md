# 🚕 CabEasy - One-Tap Cab Booking for Seniors

A simple, accessible web app that helps elderly people book cabs without confusion. Family members can create easy booking links with pre-filled pickup and destination locations.

[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://cab-easy.vercel.app/)

**🌐 Live:** [https://cab-easy.vercel.app/](https://cab-easy.vercel.app/)

## ✨ Features

- **📍 Easy Location Selection** - Map-based or search-based location picker (India only)
- **🔗 Deep Links** - One-tap booking for Uber, Ola, Rapido & Google Maps
- **📱 QR Code Sharing** - Generate QR codes for easy sharing with elderly family members
- **👴 Elderly-Friendly UI** - Large buttons, high contrast, simple navigation
- **📏 Distance Limit** - 200km maximum distance to prevent accidental long bookings
- **🌐 No Backend Required** - Everything works via URL parameters
- **📤 Multiple Sharing Options** - WhatsApp, SMS, Email, or direct link copy

## 🚀 Quick Start (Development)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 How It Works

### For Family Members (Setup)
1. Open CabEasy in your browser
2. Set the pickup location (use search or tap on map)
3. Set the destination (use search or tap on map)
4. Click "Share Booking Link"
5. Share the QR code or link with your elderly family member

### For Elderly Users (Booking)
1. Open the shared link or scan the QR code
2. See big, clear buttons for each cab service
3. Tap any button to open the cab app with everything pre-filled!

## 🔗 Supported Cab Platforms (India)

| Platform | Deep Link Support | Notes |
|----------|-------------------|-------|
| **Uber** | ✅ Full | Opens with pickup & dropoff pre-filled |
| **Ola** | ✅ Full | Opens booking page with locations |
| **Rapido** | ✅ Full | Opens with coordinates |
| **Google Maps** | ✅ Full | Shows directions & cab options |

---

## 🌐 Live App

This project is deployed on **Vercel**. Try it here:

**[https://cab-easy.vercel.app/](https://cab-easy.vercel.app/)**

Please use it and let me know how you like it.

**Tip:** You can add it to your home screen for quick access — on Android (Chrome → Add to Home Screen) or iOS (Safari → Share → Add to Home Screen).

---

## 🛠 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Leaflet + OpenStreetMap** - Free maps (no API key needed!)
- **Framer Motion** - Smooth animations
- **QRCode.react** - QR code generation

## 📱 URL Parameters

The app uses URL parameters to store trip information:

```
?plat=28.6139&plng=77.2090&paddr=Home&dlat=28.5355&dlng=77.3910&daddr=Hospital&name=Doctor%20Visit
```

| Parameter | Description |
|-----------|-------------|
| `plat` | Pickup latitude |
| `plng` | Pickup longitude |
| `paddr` | Pickup address (optional) |
| `dlat` | Dropoff latitude |
| `dlng` | Dropoff longitude |
| `daddr` | Dropoff address (optional) |
| `name` | Trip name (optional) |

## 🎨 Accessibility Features

- ✅ High contrast colors
- ✅ Large touch targets (min 48px)
- ✅ Clear typography (18px base)
- ✅ Reduced motion support
- ✅ Keyboard navigation
- ✅ Screen reader friendly

## 📄 License

MIT License - Feel free to use and modify!

---

Made with ❤️ for our elderly loved ones
