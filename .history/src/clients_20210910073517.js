export default function clients() {
  /* function determineAppServerKey() {
    let vapidPublicKey =
      'BLILHqqgzJb2YnCd5dNXvh3bT-B0ixe-T2KNrQl4aPcQ_mDNljd_OKcEdHOoXbU8-XWG-DvFcFuP_FWwPzoOjk8';
    return urlBase64ToUint8Array(vapidPublicKey);
  } */

  function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  let swUrl = `${process.env.PUBLIC_URL}/sw.js`;
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('Service worker registed.', registration);
      return registration.pushManager
        .getSubscription()
        .then(async (subscription) => {
          if (subscription) return subscription;

          const response = await fetch('./vapidPublicKey');
          const vapidPublicKey = await response.text();
          const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

          registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
          });
        });
    })
    .then(function (subscription) {
      fetch('./register', {
        method: 'post',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription,
        }),
      });

      document.getElementById('doIt').onclick = function () {
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
      };
    });

  const button = document.getElementById('notifications');
  button.addEventListener('click', () => {
    Notification.requestPermission().then((result) => {
      console.log('User choice', result);
      if (result === 'granted') {
        console.log('User choice ', result);
        displayNotification();
      } else {
        console.log('No notification permission granted!');
      }
    });
  });

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
