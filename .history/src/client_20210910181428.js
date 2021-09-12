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
        console.log('Registering Push...');
        reg = swreg;
        return swreg.pushManager.getSubscription();
      })
      .then(async (sub) => {
        if (sub) return sub;

        const response = await fetch('http://localhost:4000/vapidPublicKey');
        const vapidPublicKey = urlBase64ToUint8Array(response);
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidPublicKey,
        });
      })
      .then(async (pushSub) => {
        console.log('Push Registered...', pushSub);

        console.log('Sending Push...');
        await fetch('http://localhost:4000/subscribe', {
          method: 'POST',
          body: JSON.stringify(pushSub),
          header: {
            'Content-type': 'application/json',
          },
        });

        console.log('Push Sent...');
      })
      .then((res) => {
        if (res.ok) {
          displayConfirmNotification();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
