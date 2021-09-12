export default function swDev() {
  let swUrl = `${process.env.PUBLIC_URL}/sw.js`;
  navigator.serviceWorker.register(swUrl).then(function (res) {
    console.log('Service worker registed.', res);
  });

  const button = document.getElementById('notifications');
  button.addEventListener('click', () => {
    Notification.requestPermission().then((result) => {
      console.log('User choice', result);
      if (result === 'granted') {
        console.log('User choice', result);
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
