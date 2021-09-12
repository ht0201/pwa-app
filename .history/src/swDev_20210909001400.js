export default function swDev() {
  let swUrl = `${process.env.PUBLIC_URL}/sw.js`;
  navigator.serviceWorker.register(swUrl).then(function (res) {
    return res.pushManager
      .getSubscription()
      .then(async (subscription) => {
        // registration part
        console.log('Service worker registed.', res);
        if (subscription) {
          return subscription;
        }
      })
      .then((subscription) => {
        const response = await fetch('./vapidPublicKey');
        const vapidPublicKey = await response.text();
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

        return res.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
      });
  });

  const button = document.getElementById('notifications');
  button.addEventListener('click', () => {
    Notification.requestPermission().then((result) => {
      console.log('User choice', result);
      if (result === 'granted') {
        displayNotification();
      } else {
        console.log('No notification permission granted!');
      }
    });
  });

  function displayNotification() {
    new Notification('Successfully subscribed !');
  }
}
