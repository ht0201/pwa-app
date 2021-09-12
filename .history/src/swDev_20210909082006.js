export default function swDev() {
  function determineAppServerKey() {
    let vapidPublicKey =
      'BLILHqqgzJb2YnCd5dNXvh3bT-B0ixe-T2KNrQl4aPcQ_mDNljd_OKcEdHOoXbU8-XWG-DvFcFuP_FWwPzoOjk8';
    return urlBase64ToUint8Array(vapidPublicKey);
  }

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
  navigator.serviceWorker.register(swUrl).then(async function (res) {
    const subscription = await res.pushManager.getSubscription();
    // registration part
    console.log('Service worker registed.', res);
    if (subscription) {
      return subscription;
    } else {
      return res.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: determineAppServerKey,
      });
    }
    const subscription_1 = undefined;
    fetch('./register', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        subscription: subscription_1,
      }),
    });
  });

  // const button = document.getElementById('notifications');
  // button.addEventListener('click', () => {
  //   Notification.requestPermission().then((result) => {
  //     console.log('User choice', result);
  //     if (result === 'granted') {
  //       displayNotification();
  //     } else {
  //       console.log('No notification permission granted!');
  //     }
  //   });
  // });

  // function displayNotification() {
  //   new Notification('Successfully subscribed !');
  // }
}
