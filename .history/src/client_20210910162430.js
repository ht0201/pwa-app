export default function client() {
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  }

  console.log('Registering service worker...');
  let swUrl = `${process.env.PUBLIC_URL}/sw.js`;
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('Service Worker Registered...', registration);

      console.log('Registering Push...');
      return registration.pushManager
        .getSubscription()
        .then(async (subscription) => {
          if (subscription) return subscription;

          const response = await fetch('http://localhost:4000/vapidPublicKey');
          console.log(response);
          const vapidPublicKey = await response.text();

          return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
          });
        });
    })
    .then(async (subscription) => {
      console.log('Push Registered...', subscription);

      console.log('Sending Push...');

      const button = document.getElementById('notifications');
      button.addEventListener('click', () => {
        Notification.requestPermission().then((result) => {
          if (result === 'granted') {
            await fetch('http://localhost:4000/subscribe', {
              method: 'POST',
              headers: {
                'Content-type': 'application/json',
              },
              body: JSON.stringify(subscription),
            });
          }
        });
      });

      console.log('Push Sent...');
    });
}
