export default function swDev() {
  navigator.serviceWorker
    .register('./swDev.js', { scope: '/public' })
    .then(function (res) {
      console.log('Service worker registed.', res);
    });
}
