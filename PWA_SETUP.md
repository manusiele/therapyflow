# TherapyFlow PWA Setup

TherapyFlow is now a Progressive Web App (PWA) with the following features:

## Features

### 1. **Installable**
- Users can install the app on their devices (mobile, tablet, desktop)
- Install prompt appears automatically for eligible users
- Works on iOS, Android, Windows, macOS, and Linux

### 2. **Offline Support**
- Service Worker caches essential resources
- App works offline with cached content
- Automatic cache updates when online

### 3. **Push Notifications**
- Appointment reminders
- Message notifications
- Important updates
- Works even when app is closed

### 4. **App-like Experience**
- Standalone display mode (no browser UI)
- Custom splash screen
- Theme color integration
- Smooth animations

## Installation

### For Users

#### Mobile (iOS/Android)
1. Open TherapyFlow in your browser
2. Look for the install prompt at the bottom of the screen
3. Tap "Install" to add to home screen
4. Or use browser menu: "Add to Home Screen"

#### Desktop (Chrome/Edge)
1. Open TherapyFlow in your browser
2. Look for the install icon in the address bar
3. Click "Install" in the prompt
4. App will open in its own window

### For Developers

The PWA is automatically configured. Key files:

- `/public/manifest.json` - PWA manifest
- `/public/sw.js` - Service Worker
- `/src/lib/registerServiceWorker.ts` - SW registration
- `/src/components/PWAInstallPrompt.tsx` - Install UI
- `/src/components/NotificationPermission.tsx` - Notification UI

## Notifications

### Setup
1. User must grant notification permission
2. Permission prompt appears 5 seconds after page load
3. Can be dismissed and will reappear after 7 days

### Sending Notifications (Backend)

```javascript
// Example: Send push notification from backend
const notification = {
  title: 'Appointment Reminder',
  body: 'Your session with Dr. Sarah Johnson starts in 1 hour',
  icon: '/logo/logo-icon.png',
  badge: '/logo/logo-icon.png',
  data: {
    url: '/patient'
  }
}

// Use Web Push API or Firebase Cloud Messaging
// to send notifications to subscribed users
```

### Testing Notifications

```javascript
// In browser console:
new Notification('Test', {
  body: 'This is a test notification',
  icon: '/logo/logo-icon.png'
})
```

## Caching Strategy

The Service Worker uses a **Cache First** strategy:
1. Check cache for resource
2. If found, return cached version
3. If not found, fetch from network
4. Cache the fetched resource

### Cached Resources
- Home page (/)
- Dashboard (/dashboard)
- Patient portal (/patient)
- Logo images
- Static assets

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Install | ✅ | ✅ | ✅ | ✅ |
| Offline | ✅ | ✅ | ✅ | ✅ |
| Push Notifications | ✅ | ✅ | ⚠️ | ✅ |

⚠️ Safari on iOS has limited push notification support

## Updating the PWA

When you deploy updates:
1. Service Worker detects new version
2. Downloads and caches new resources
3. Activates on next app launch
4. Old cache is automatically cleaned up

## Production Checklist

- [ ] Update logo files in `/public/logo/`
- [ ] Configure push notification service (Firebase/OneSignal)
- [ ] Set up HTTPS (required for PWA)
- [ ] Test on multiple devices
- [ ] Verify offline functionality
- [ ] Test notification delivery
- [ ] Update manifest.json with production URLs
- [ ] Add app screenshots to manifest

## Troubleshooting

### Install prompt not showing
- Check if already installed
- Ensure HTTPS is enabled
- Clear browser cache
- Check browser console for errors

### Notifications not working
- Verify permission is granted
- Check browser notification settings
- Ensure service worker is registered
- Test with simple notification first

### Offline mode not working
- Check service worker registration
- Verify cache is populated
- Check browser console for SW errors
- Try hard refresh (Ctrl+Shift+R)

## Resources

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA](https://web.dev/progressive-web-apps/)
- [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
