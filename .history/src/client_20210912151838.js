export default function client() {
  // let VAPID_PUBLIC_KEY =
  //   'BGfOuB77WPqcWtWsLLc6jKt6zLKsWD0t6gXu60bdcb0qXWKlXpOeo61J8pa4_JoFuhN1PhtsqOmp0M3gvRYmdIE';

  // function urlBase64ToUint8Array(base64String) {
  //   const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  //   const base64 = (base64String + padding)
  //     .replace(/-/g, '+')
  //     .replace(/_/g, '/');

  //   const rawData = window.atob(base64);
  //   const outputArray = new Uint8Array(rawData.length);

  //   for (let i = 0; i < rawData.length; ++i) {
  //     outputArray[i] = rawData.charCodeAt(i);
  //   }
  //   return outputArray;
  // }

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

  // function displayNotification() {
  //   var options = {
  //     body: 'Successfully subscribed Notification!',
  //   };
  //   new Notification('Successfully subscribed!', options);
  // }

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
      .then((sub) => {
        console.log('Registering Push...');
        if (sub) return sub;

        // const response = await fetch('http://localhost:4000/vapidPublicKey');
        // const vapidPublicKey = urlBase64ToUint8Array(response);

        let VAPID_PUBLIC_KEY =
          'BBYv_6CDFrsQlljHZQd4SlcZNNt-V8fKNRHNmqe6tWJxV2yLzBg0jl8-FVPYWzz4hixZgdodBzh1WYf-QYHYTKo';
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: VAPID_PUBLIC_KEY,
        });
      })
      .then(async (pushSub) => {
        console.log('Push Registered...', pushSub);

        console.log('Sending Push...');
        await fetch('http://localhost:4000/subscribe', {
          method: 'POST',
          body: JSON.stringify(pushSub),
          headers: {
            'Content-type': 'application/json',
          },
        });

        console.log('Push Sent...', pushSub);
      })
      // .then((resPush) => {
      //   if (resPush.ok) {
      //     displayNotification();
      //   }
      // })
      .catch((err) => {
        console.log(err);
      });
  }
}
