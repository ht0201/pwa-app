export default function swDev() {
  navigator.serviceWorker.register('../public/sw.js').then(function (res) {
    console.log('Service worker registed.', res);
  });
}
