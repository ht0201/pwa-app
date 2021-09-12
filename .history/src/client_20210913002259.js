export default function client() {
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // eslint-disable-next-line no-restricted-globals
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  let notifications = document.querySelectorAll('.notifications');
  if ('Notification' in window) {
    for (var i = 0; i < notifications.length; i++) {
      notifications[i].addEventListener('click', askNotificationPermission);
    }
  }

  function askNotificationPermission() {
    Notification.requestPermission(function (result) {
      console.log('User Choice', result);
      if (result !== 'granted') {
        console.log('No notification permission granted!');
      } else {
        configurePushSub();
      }
    });
  }

  /* register service worker */
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

  /*  configurePushSub() { */
  function configurePushSub() {
    let reg;
    navigator.serviceWorker.ready
      .then((swreg) => {
        reg = swreg;
        return swreg.pushManager.getSubscription();
      })
      .then(async (sub) => {
        console.log('Registering Push...');
        if (sub) return sub;

        const response = await fetch('http://localhost:8081/vapidPublicKey');
        const vapidPublicKey = await response.text();
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
      })
      .then(async (pushSub) => {
        console.log('Push Registered...', pushSub);

        console.log('Sending Push...');
        await fetch('http://localhost:8081/subscribe', {
          method: 'POST',
          body: JSON.stringify(pushSub),
          headers: {
            'Content-type': 'application/json',
          },
        });
      })
      .then((resNotifi) => {
        console.log('Push Sent...', resNotifi);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
