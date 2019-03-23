let express = require('express');
const Filter = require("../app/filter");
let router = express.Router();
const error_controller = require('../app/controller/error_controller');
const Controller = require('../app/controller/controller');
const SalesTracker = require('../app/sales_tracker');

router.get('/search/:sku_num', function(req, res, next) {
    let years = req.query.years;
    let st = new SalesTracker();
    const controller = new Controller();
    controller.constructGetResponse(res, st.search(req.params.sku_num, years));
});

module.exports = router;
