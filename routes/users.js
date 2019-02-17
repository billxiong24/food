const express = require('express');
const Users = require('../app/users');
const router = express.Router();

router.get('/logout', function(req, res, next) {
  req.session.destroy();
});

router.get('/:name', function(req, res, next) {
    let name = req.params.name;
    const users = new Users();

    users.checkExisting({uname: name})
    .then((result)=>{
          res.status(200).json(result.rows);
    })
    .catch((err) => {
          res.json({
            error: err
          });
    });
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
    res.status(200).json(result);
  })
  .catch((err) => {
    users.create(req.body)
      .then((result) => {
        req.session.user = req.body.uname;
        req.session.admin = false;
        res.status(201).json({});
      })
  })

  // users.verifyNetId(req.body)
  // .then((result) => {
  //   // req.session.user = result.uname;
  //   // req.session.admin = result.admin;
  //   res.status(200).json(result);
  // })
  // .catch((err) => {
  //   res.status(400).json({
  //     error: err
  //   })
  // })
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
