const express = require('express');
const Users = require('../app/users');
const router = express.Router();

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.status(200).send("Logged out successfully");
});

// Verify User password
router.post('/', function(req, res, next) {
    if(!req.body.uname || !req.body.password) {
      return res.status(400).send({
          error: "Must include username(uname) and password in POST request"
      });
    }

    const users = new Users();

    users.verify(req.body)
    .then((result) => {
        req.session.user = result.uname;
        req.session.admin = result.admin;
        req.session.id = result.id;
        res.status(200).json(result);
    })
    .catch((err) => {
        res.status(400).json({
            error: err
        });
    });
});

router.post('/netid', function(req, res, next) {
  if(!req.body.uname || req.body.uname.search(/^[a-zA-Z]{2,3}[0-9]+$/i) < 0) {
    return res.status(400).send({
      error: "Must include valid netid"
    })
  }

  req.body.uname = "netid_" + req.body.uname;

  const users = new Users();

  users.getUser(req.body)
  .then((result) => {
    req.session.user = result.uname;
    req.session.admin = result.admin;
    req.session.id = result.id;
    res.status(200).json(result);
  })
  .catch((err) => {
    users.create(req.body)
      .then(() => {
        users.getUser(req.body)
        .then((user) => {
          req.session.user = user.uname;
          req.session.admin = user.admin;
          req.session.id = user.id;
          res.status(201).json(user);
        })
      })
      .catch((err) => {
        res.status(400).json({
            error: err
        });
      })
  })
});

router.put('/:name', function(req, res, next) {
    if(!req.body.password) {
        return res.status(400).send({
            error: "Must include password parameter in PUT request."
        });
    }

    if(req.body.uname.search(/netid/i) >= 0) {
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

router.delete('/:name', function(req, res, next) {
    const users = new Users();

    users.remove(req.params.name)
    .then((result) => {
        res.status(200).json({});
    })
    .catch((err) => {
        res.status(409).json({
            error: err
        })
    })
});

module.exports = router;
