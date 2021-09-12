export default function swDev() {
  let swUrl = `${process.env.PUBLIC_URL}/sw.js`;
  navigator.serviceWorker.register(swUrl).then(function (res) {
    console.log('Service worker registed.', res);
  });

  const button = document.getElementById('notifications');
  button.addEventListener('click', () => {
    Notification.requestPermission().then((result) => {
      if (result === 'granted') {
        console.log('User choice', result);
        displayNotification();
      } else {
        console.log('No notification permission granted!');
      }
    });
  });

  function displayNotification() {
    const randomItem = Math.floor(Math.random() * games.length);
    const notifTitle = games[randomItem].name;
    const notifBody = `Created by ${games[randomItem].author}.`;
    const notifImg = `data/img/${games[randomItem].slug}.jpg`;
    const options = {
      body: notifBody,
      icon: notifImg,
    };
    new Notification(notifTitle, options);
    setTimeout(randomNotification, 30000);
  }
}
