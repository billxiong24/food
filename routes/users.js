const express = require('express');
const Users = require('../app/users');
const router = express.Router();
var { checkAdmin } = require('./guard');
const Filter = require('../app/filter');
const error_controller = require('../app/controller/error_controller');

router.get('/logout', function(req, res, next) {
  if(req.session.user && req.sessionID) {
    req.session.destroy();
    res.status(200).send();
  } else {
    res.status(304).json({});
  }
});

router.get('/search', checkAdmin, function (req, res, next) {
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
      res.status(200).json(result.rows);
    })
    .catch((err) => {
      res.status(400).json({
        error: error_controller.getErrMsg(err)
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
        console.log("SETTING SESSION");
        req.session.user = result.uname;
        req.session.admin = result.admin;
        req.session.user_id = result.id;
        console.log(req.session);
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
    req.session.user_id = result.id;
    res.status(200).json(result);
  })
  .catch((err) => {
    users.create(req.body)
      .then(() => {
        users.getUser(req.body)
        .then((user) => {
          req.session.user = user.uname;
          req.session.admin = user.admin;
          req.session.user_id = user.id;
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

router.put('/create', checkAdmin, function(req, res, next) {
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

router.put('/update/:id', checkAdmin, function(req, res, next) {
  let id = req.params.id;
  if (isNaN((id))) {
    return res.status(400).json({
      error: "Malformed URL."
    });
  }
  if(id == 7) {
    return res.status(401).json({
      error: "You are not authorized to do this."
    })
  }

  let val = req.body.admin;

  if(typeof val === "string") {
    if(val.toLocaleLowerCase === 'true') val = true;
    else if(val.toLocaleLowerCase === 'false') val = false;
  }
  req.body.admin = val;

  const users = new Users();

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

router.delete('/:id', checkAdmin, function(req, res, next) {
    const users = new Users();
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }
    
    if(id == 7) {
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

module.exports = router;
