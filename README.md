# 🚕 CabEasy - One-Tap Cab Booking for Seniors

A simple, accessible web app that helps elderly people book cabs without confusion. Family members can create easy booking links with pre-filled pickup and destination locations.

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

# 🚀 Deployment Guide

## Option 1: Vercel (Recommended - Free)

### Step 1: Push to GitHub
```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit - CabEasy"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/cab-easy.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **"Add New Project"**
3. Import your `cab-easy` repository
4. Vercel auto-detects Vite - just click **"Deploy"**
5. Wait ~1 minute, get your URL: `https://cab-easy.vercel.app`

### Custom Domain (Optional)
1. In Vercel dashboard → Settings → Domains
2. Add your domain (e.g., `cabeasy.yourdomain.com`)
3. Update DNS as instructed

---

## Option 2: Netlify (Free)

### Step 1: Build the project
```bash
npm run build
```

### Step 2: Deploy
1. Go to [netlify.com](https://netlify.com) and sign up
2. Drag & drop the `dist` folder to Netlify
3. Get instant URL: `https://random-name.netlify.app`

### Or via CLI:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

---

## Option 3: GitHub Pages (Free)

### Step 1: Update vite.config.js
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/cab-easy/', // Add this line (your repo name)
})
```

### Step 2: Install gh-pages
```bash
npm install -D gh-pages
```

### Step 3: Add deploy script to package.json
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### Step 4: Deploy
```bash
npm run deploy
```

Your app will be at: `https://YOUR_USERNAME.github.io/cab-easy/`

---

## Option 4: Self-Hosted (VPS/Server)

### Using Nginx
```bash
# Build
npm run build

# Copy dist folder to server
scp -r dist/* user@your-server:/var/www/cabeasy/

# Nginx config (/etc/nginx/sites-available/cabeasy)
server {
    listen 80;
    server_name cabeasy.yourdomain.com;
    root /var/www/cabeasy;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🌐 After Deployment

Once deployed, share your URL with family:

1. **Direct Link**: `https://your-app.vercel.app`
2. **With Pre-filled Trip**: 
   ```
   https://your-app.vercel.app/?plat=28.6139&plng=77.209&paddr=Home&dlat=28.5355&dlng=77.391&daddr=Hospital
   ```

### Create Shortcuts
- **Android**: Open in Chrome → Menu → "Add to Home Screen"
- **iOS**: Open in Safari → Share → "Add to Home Screen"

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
