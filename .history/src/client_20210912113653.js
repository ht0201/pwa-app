export default function client() {
  // let VAPID_PUBLIC_KEY =
  //   'BGfOuB77WPqcWtWsLLc6jKt6zLKsWD0t6gXu60bdcb0qXWKlXpOeo61J8pa4_JoFuhN1PhtsqOmp0M3gvRYmdIE';

  // function urlBase64ToUint8Array(base64String) {
  //   const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  //   const base64 = (base64String + padding)
  //     .replace(/\\-/g, '+')
  //     .replace(/_/g, '/');
  //   const rawData = window.atob(base64);
  //   return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  // }

  let notifications = document.querySelectorAll('.notifications');

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

  if ('Notification' in window) {
    for (var i = 0; i < notifications.length; i++) {
      notifications[i].addEventListener('click', askNotificationPermission);
    }
  }

  function displayNotification() {
    var options = {
      body: 'Successfully subscribed Notification!',
    };
    new Notification('Successfully subscribed!', options);
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

        let VAPID_PUBLIC_KEY =
          'BGfOuB77WPqcWtWsLLc6jKt6zLKsWD0t6gXu60bdcb0qXWKlXpOeo61J8pa4_JoFuhN1PhtsqOmp0M3gvRYmdIE';

        // const response = await fetch('/vapidPublicKey');
        // const vapidPublicKey = urlBase64ToUint8Array(response);
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: VAPID_PUBLIC_KEY,
        });
      })
      .then(async (pushSub) => {
        console.log('Push Registered...', pushSub);

        console.log('Sending Push...');
        return await fetch('http://localhost:4000/subscribe', {
          method: 'POST',
          body: JSON.stringify(pushSub),
          header: {
            'Content-type': 'application/json',
          },
        });
      })
      .then((resPush) => {
        console.log('Push Sent...', resPush);
        if (resPush.ok) {
          displayNotification();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
