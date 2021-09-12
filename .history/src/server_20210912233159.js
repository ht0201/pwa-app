const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const express = require('express');
const webPush = require('web-push');

const port = 8081;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client')));

let VAPID_PUBLIC_KEY =
  'BFWzKF0fHNbVSG_-JYuE2TDz2FD1lAEfuiDy8qjr1ceznYStg01ZryNMiCm3A7mHle3XDnihN2AUvrP6M8ggIsc';

let VAPID_PRIVATE_KEY = 'BkQ3oLBXBI4j7YR5WOtowC-v95su8B9PSzGIwbdGEYA';

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.log(
    'You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY ' +
      'environment variables. You can use the following ones:'
  );
  console.log(webPush.generateVAPIDKeys());
  return;
}

webPush.setVapidDetails(
  'https://serviceworke.rs/',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/vapidPublicKey', function (req, res) {
  res.send(VAPID_PUBLIC_KEY);
});

app.post('/subscribe', function (req, res) {
  const payload = JSON.stringify({ title: 'Push test' });

  const subscription = req.body;

  console.log(subscription);
  res.sendStatus(201).json({});

  webPush
    .sendNotification(subscription, payload)
    .catch((err) => console.log(err));
});

app.listen(port, () => console.log(`Server started on port ${port}`));
