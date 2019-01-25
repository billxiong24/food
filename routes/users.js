const express = require('express');
const Users = require('../app/users');
const router = express.Router();

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
          error: "Muse include username(uname) and password in POST request"
      });
    }

    const users = new Users();

    users.verify(req.body)
    .then((result) => {
        res.status(200).json(result);
    })
    .catch((err) => {
        res.status(400).json({
            error: err
        });
    });
});

router.put('/:name', function(req, res, next) {
    if(!req.body.password) {
        return res.status(400).send({
            error: "Must include password parameter in PUT request."
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
