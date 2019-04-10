let express = require('express');
const Filter = require("../app/filter");
let router = express.Router();
const error_controller = require('../app/controller/error_controller');
const Controller = require('../app/controller/controller');
const Customer = require('../app/customers');

const { checkSalesRead } = require('./guard');

router.get('/search', checkSalesRead, function(req, res, next) {
    let name = req.query.name;

    const controller = new Controller();
    const customer = new Customer();
    controller.constructGetResponse(res, customer.search(name));
});

module.exports = router;
