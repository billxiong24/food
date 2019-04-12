const express = require('express');
const Users = require('../app/users');
const router = express.Router();
const Filter = require('../app/filter');
const error_controller = require('../app/controller/error_controller');

const axios = require('axios');
const { checkUserRead, checkUserWrite } = require('./guard');

router.get('/logout', function (req, res, next) {
  if (req.session.user && req.sessionID) {
    req.session.destroy();
    res.status(200).send();
  } else {
    res.status(304).json({});
  }
});

router.get('/search', checkUserRead, function (req, res, next) {
  let names = req.query.names;
  const users = new Users();
  let orderKey = req.query.orderKey;
  let asc = (!req.query.asc) || req.query.asc == "1";
  let limit = parseInt(req.query.limit) || 0;
  let offset = parseInt(req.query.offset) || 0;

  if (!names) {
    names = [];
  }
  else if (!Array.isArray(names)) {
    names = [names];
  }

  const filter = new Filter();
  filter.setOrderKey(orderKey).setAsc(asc).setOffset(offset).setLimit(limit);

  users.search(names, filter)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json({
        error: error_controller.getErrMsg(err)
      });
    });
});

// Verify User password
router.post('/', function (req, res, next) {
  if (!req.body.uname || !req.body.password) {
    return res.status(400).send({
      error: "Must include username(uname) and password in POST request"
    });
  }

  const users = new Users();

  users.verify(req.body)
    .then((result) => {
      result = logUserInAndSetToken(req, result);
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json({
        error: err
      });
    });
});

router.get('/netid', (req, res, next) => {
  res.redirect("https://oauth.oit.duke.edu/oauth/authorize.php?client_id=" + process.env.COLAB_CLIENT_ID +
    "&redirect_uri=" + process.env.COLAB_REDIRECT_URI +
    "&client_secret=" + process.env.COLAB_CLIENT_SECRET +
    "&response_type=token&state=1234&scope=basic")
});

router.post('/netid', function (req, res, next) {
  console.log(req.body);
  axios.get('https://api.colab.duke.edu/identity/v1/', {
    headers: {
      'x-api-key': process.env.COLAB_CLIENT_ID,
      'Authorization': `Bearer ${req.body.access_token}`
    },
    withCredentials: false,
  })
    .then((response) => {
      let netid = "netid_" + response.data.netid;
      userInfo.netid = netid;

      const users = new Users();

      users.getUser(userInfo)
        .then((result) => {
          result = logUserInAndSetToken(req, result);
          res.status(200).json(result);
        })
        .catch((err) => {
          userInfo.password = netid;
          users.create(userInfo)
            .then(() => {
              users.getUser(userInfo)
                .then((user) => {
                  user = logUserInAndSetToken(req, user);
                  res.status(201).json(user);
                })
            })
            .catch((err) => {
              res.status(400).json({
                error: err
              });
            })
        })
    })
    .catch((err) => {
      res.status(400).json({
        error: "Invalid OIT Access Token"
      })
    })


});

router.put('/create', checkUserWrite, function (req, res, next) {
  if (!req.body.password) {
    return res.status(400).send({
      error: "Must include password parameter in PUT request."
    });
  }

  if (req.body.uname.search(/netid/i) >= 0) {
    return res.status(400).send({
      error: "Username must not include the phrase 'netid'."
    });
  }

  const users = new Users();

  users.create(req.body)
    .then((result) => {
      res.status(201).json({});
    })
    .catch((err) => {
      res.status(409).json({
        error: err
      });
    });
});

router.put('/update/:id', checkUserWrite, function (req, res, next) {
  let id = req.params.id;
  if (isNaN((id))) {
    return res.status(400).json({
      error: "Malformed URL."
    });
  }
  if (id == 7) {
    return res.status(401).json({
      error: "You are not authorized to do this."
    })
  }

  let val = req.body.admin;

  if (typeof val === "string") {
    if (val.toLocaleLowerCase === 'true') val = true;
    else if (val.toLocaleLowerCase === 'false') val = false;
  }
  req.body.admin = val;

  const users = new Users();

  console.log(req.body);

  users.update(req.body, req.params.id)
    .then((result) => {
      res.status(200).json({
        rowCount: result.rowCount
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: error_controller.getErrMsg(err)
      });
    });
});

router.delete('/:id', checkUserWrite, function (req, res, next) {
  const users = new Users();
  let id = req.params.id;
  if (isNaN((id))) {
    return res.status(400).json({
      error: "Malformed URL."
    });
  }

  if (id == 7) {
    return res.status(401).json({
      error: "You are not authorized to do this."
    })
  }

  users.remove(req.params.id)
    .then((result) => {
      res.status(200).json({});
    })
    .catch((err) => {
      res.status(409).json({
        error: err
      })
    })
});

function logUserInAndSetToken(req, user) {
  req.session.user = user.uname;
  req.session.admin = user.admin;
  req.session.user_id = user.id;
  req.session.core_read = user.uname ? true : false;
  user.core_read = req.session.core_read;
  req.session.core_write = (user.prod_mgr || user.admin);
  user.core_write = req.session.core_write;
  req.session.sales_read = (user.analyst || user.prod_mgr || user.bus_mgr || user.manlines.length > 0 || user.admin);
  user.sales_read = req.session.sales_read;
  req.session.sales_write = (user.prod_mgr || user.admin);
  user.sales_write = req.session.sales_write;
  req.session.goals_read = (user.analyst || user.prod_mgr || user.bus_mgr || user.manlines.length > 0 || user.admin);
  user.goals_read = req.session.goals_read;
  req.session.goals_write = (user.bus_mgr || user.admin);
  user.goals_write = req.session.goals_write;
  req.session.schedule_read = (user.analyst || user.prod_mgr || user.bus_mgr || user.manlines.length > 0 || user.admin);
  user.schedule_read = req.session.schedule_read;
  req.session.schedule_write = user.manlines;
  user.schedule_write = req.session.schedule_write;
  req.session.user_read = user.admin;
  user.user_read = req.session.user_read;
  req.session.user_write = user.admin;
  user.user_write = req.session.user_write;
  return user;
}

module.exports = router;
