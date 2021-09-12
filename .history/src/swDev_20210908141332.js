export default function swDev() {
  navigator.serviceWorker
    .register('./swDev.js', { scope: '/public' })
    .then(function () {
      console.log('Service worker registed.');
    });
}
