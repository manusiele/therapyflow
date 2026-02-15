export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration)
          
          // Check for updates periodically
          setInterval(() => {
            registration.update()
          }, 60000) // Check every minute
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    })
  }
}

export async function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }
  return Notification.permission === 'granted'
}

export function sendTestNotification() {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('TherapyFlow', {
      body: 'Notifications are enabled! You will receive appointment reminders.',
      icon: '/logo/logo-icon.png',
      badge: '/logo/logo-icon.png',
    })
  }
}
