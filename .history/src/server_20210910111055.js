import webPush from 'web-push';
import express from 'express';

import bodyParser from 'body-parser';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.json());

let VAPID_PUBLIC_KEY =
  'BNjG5LYLWqs_UYNe5SfI9pYBT28f3AXsHtpdo5RYgAK3bojf_4p5eahl_Q63_hVs7vxQLTaH7aKT0OBLN_B4eS8';

let VAPID_PRIVATE_KEY = 'THKcJ5LtEc-RdOyxK_EctL7kDzN5d9Opa3V4-fWR-V8';

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.log(
    'You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY ' +
      'environment variables. You can use the following ones:'
  );
  console.log(webPush.generateVAPIDKeys());
  return;
}

webPush.setVapidDetails(
  'mailto:test@test.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

module.exports = function (app, route) {
  app.get(route + 'vapidPublicKey', function (req, res) {
    res.send(process.env.VAPID_PUBLIC_KEY);
  });

  app.post(route + 'subscribe', function (req, res) {
    const subscription = req.body;
    res.sendStatus(201).json({});
    const payload = JSON.stringify({ title: 'Push test' });
    setTimeout(function () {
      webPush
        .sendNotification(subscription, payload)
        .then(() => res.sendStatus(201))
        .catch((err) => console.log(err));
    }, 2000);
  });

  /*  app.post(route + 'sendNotification', function (req, res) {
    const subscription = req.body.subscription;
    const payload = req.body.payload;
    const options = {
      TTL: req.body.ttl,
    };

    setTimeout(function () {
      webPush
        .sendNotification(subscription, payload, options)
        .then(function () {
          res.sendStatus(201);
        })
        .catch(function (err) {
          console.log(err);
          res.sendStatus(500);
        });
    }, req.body.delay * 1000);
  }); */
};
