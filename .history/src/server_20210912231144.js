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

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/vapidPublicKey', function (req, res) {
  res.send(VAPID_PUBLIC_KEY);
});

app.post('/subscribe', function (req, res) {
  const payload = JSON.stringify({ title: 'Push test' });

  const subscription = req.body;
  //   res.sendStatus(201).json({});
  console.log(subscription);

  webPush
    .sendNotification(subscription, payload)
    .catch((err) => console.log(err));
});

app.listen(port, () => console.log(`Server started on port ${port}`));
