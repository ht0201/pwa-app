export default function swDev() {
  navigator.serviceWorker.register('./swDev.js').then(function (res) {
    console.log('Service worker registed.', res);
  });
}
