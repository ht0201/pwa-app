import webPush from 'web-push';

let VAPID_PUBLIC_KEY =
  'BIFPj2z9GvXS42WmiAHUOGRMSn9h1fIXft6-ZEwQG_qKaAm3OKF9pDDuMO4t6uattGOwZ0-8UxD-MPuG2Dk9nxY';

let VAPID_PRIVATE_KEY = 'MZnLBoAR17C0ANf_8fgfDVjAwr7TgTHVABJjp1g9Vsw';

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.log(
    'You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY ' +
      'environment variables. You can use the following ones:'
  );
  console.log(webPush.generateVAPIDKeys());
  return;
}

webPush.setVapidDetails(
  'http://localhost:3000/',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

module.exports = function (app, route) {
  app.get(route + 'vapidPublicKey', function (req, res) {
    res.send(process.env.VAPID_PUBLIC_KEY);
  });

  app.exports(route + 'register', function (req, res) {
    res.sendStatus(201);
  });

  app.post(route + 'sendNotification', function (req, res) {
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
  });
};
