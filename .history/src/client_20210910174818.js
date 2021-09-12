export default function client() {
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  }

  let notifications = document.querySelectorAll('.notifications');

  function askForNotificationPermission() {
    Notification.requestPermission(function (result) {
      console.log('User Choice', result);
      if (result !== 'granted') {
        console.log('No notification permission granted!');
      } else {
        displayConfirmNotification();
      }
    });
  }

  if ('Notification' in window) {
    for (var i = 0; i < notifications.length; i++) {
      notifications[i].style.display = 'inline-block';
      notifications[i].addEventListener('click', askForNotificationPermission);
    }
  }

  function displayConfirmNotification() {
    var options = {
      body: 'You successfully subscribed to our Notification service!',
    };
    new Notification('Successfully subscribed!', options);
  }

  console.log('Registering service worker...');
  if ('serviceWorker' in navigator) {
    let swUrl = `${process.env.PUBLIC_URL}/sw.js`;
    navigator.serviceWorker
      .register(swUrl)
      .then(function (registration) {
        console.log('Service Worker Registered...', registration);
      })
      .catch(function (err) {
        console.log(err);
      });
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

      await fetch('http://localhost:4000/subscribe', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      console.log('Push Sent...');
    });
}
