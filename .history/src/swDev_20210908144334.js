export default function swDev() {
  let swUrl = `${process.env.PUBLIC_URL}/sw.js`;
  navigator.serviceWorker.register('../public/sw.js').then(function (res) {
    console.log('Service worker registed.', res);
  });
}
