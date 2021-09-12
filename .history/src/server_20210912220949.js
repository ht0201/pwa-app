const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const express = require('express');
const webPush = require('web-push');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client')));

let VAPID_PUBLIC_KEY =
  'BBYv_6CDFrsQlljHZQd4SlcZNNt-V8fKNRHNmqe6tWJxV2yLzBg0jl8-FVPYWzz4hixZgdodBzh1WYf-QYHYTKo';

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/vapidPublicKey', function (req, res) {
  res.send(VAPID_PUBLIC_KEY);
});

app.post('/subscribe', function (req, res) {
  const payload = JSON.stringify({ title: 'Push test' });

  const subscription = req.body;
  res.sendStatus(201).json({});
  console.log(subscription);

  webPush
    .sendNotification(subscription, payload)
    .catch((err) => console.log(err));
});

const port = 8081;
app.listen(port, () => console.log(`Server started on port ${port}`));
