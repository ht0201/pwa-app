export default function swDev {
   navigator.serviceWorker.register('./swDev.js', {scope: '/public'})
}