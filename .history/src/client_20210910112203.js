export default function client() {
  let vapidPublicKey =
    'BNjG5LYLWqs_UYNe5SfI9pYBT28f3AXsHtpdo5RYgAK3bojf_4p5eahl_Q63_hVs7vxQLTaH7aKT0OBLN_B4eS8';

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
      return registration.pushManager.getSubscription().then((subscription) => {
        if (subscription) return subscription;

        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });
      });
    })
    .then(async (subscription) => {
      console.log('Push Registered...', subscription);

      console.log('Sending Push...');
      await fetch('/subscribe', {
        method: 'post',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      console.log('Push Sent...');

      /*   document.getElementById('notifications').onclick = function () {
        const payload = 'test notification';
        const delay = 2;
        const ttl = 4;

        fetch('./sendNotification', {
          method: 'post',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            subscription: subscription,
            payload: payload,
            delay: delay,
            ttl: ttl,
          }),
        });
      }; */
    });

  /* const button = document.getElementById('notifications');
  button.addEventListener('click', () => {
    Notification.requestPermission().then((result) => {
      console.log('User choice', result);
      if (result === 'granted') {
        console.log('User choice ', result);
      } else {
        console.log('No notification permission granted!');
      }
    });
  }); */

  /*  function displayNotification() {
   
    const notifTitle = '';
    const notifBody = `Created by ${games[randomItem].author}.`;
    const notifImg = `data/img/${games[randomItem].slug}.jpg`;
    const options = {
      body: notifBody,
      icon: notifImg,
    };
    new Notification(notifTitle, options);
    setTimeout(displayNotification, 30000);
  } */
}
