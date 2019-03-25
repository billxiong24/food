let express = require('express');
const Filter = require("../app/filter");
let router = express.Router();
const error_controller = require('../app/controller/error_controller');
const Controller = require('../app/controller/controller');
const SalesTracker = require('../app/sales_tracker');

router.get('/search/:sku_num', function(req, res, next) {
    //number of years to query for  (e.g. 10 means query for the past 10 years.
    let years = req.query.years;

    let prodlines = req.query.prodlines;
    let customers = req.query.customers;

    customers = Controller.convertParamToArray(customers);
    prodlines = Controller.convertParamToArray(prodlines);
    let st = new SalesTracker();
    const controller = new Controller();
    controller.constructGetResponse(res, st.search(req.params.sku_num, years, prodlines, customers));
});

router.get('/total/:sku_num', function(req, res, next) {
    let start = req.query.start;

    let st = new SalesTracker();
    const controller = new Controller();
    controller.constructGetResponse(res, st.total(req.params.sku_num, start));
});

module.exports = router;
