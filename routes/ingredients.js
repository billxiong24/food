let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/ingredients', function(req, res, next) {
    let name = req.query.name;
    let list = req.query.skus;
});

module.exports = router;
