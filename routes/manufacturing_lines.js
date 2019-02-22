let express = require('express');
const Sku = require('../app/sku');
const Filter = require("../app/filter");
let router = express.Router();
const error_controller = require('../app/controller/error_controller');
const Controller = require('../app/controller/controller');
const ManufacturingLine = require('../app/manufacturing_line');

router.get('/search', function(req, res, next) {
    let name = req.query.name || "";
    let orderKey = req.query.orderKey;
    let asc = (!req.query.asc) || req.query.asc == "1"; 
    let limit = parseInt(req.query.limit) || 0;
    let offset = parseInt(req.query.offset) || 0;

    const filter = new Filter();
    filter.setOrderKey(orderKey).setAsc(asc).setOffset(offset).setLimit(limit);

    const ml = new ManufacturingLine();
    const controller = new Controller();
    controller.constructGetResponse(res, ml.search(name, filter));
});

router.get('/:id/skus', function(req, res, next) {
    if(isNaN((req.params.id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }

    const ml = new ManufacturingLine();
    const controller = new Controller();
    controller.constructGetResponse(res, ml.getSkus(req.params.id));
});

router.get('/sku_mapping', function(req, res, next) {
    let skus = Controller.convertParamToArray(req.query.skus);
    const ml = new ManufacturingLine();
    ml.getSKUMapping(skus).then((result) => {
        res.status(200).json(result);
    })
    .catch((err) => {
        res.status(400).json({
            error: error_controller.getErrMsg(err)
        });
    });
});

router.put('/sku_mapping', function(req, res, next) {
    let skus = Controller.convertParamToArray(req.body.skus);
    const ml = new ManufacturingLine();
    const controller = new Controller();
    controller.constructUpdateResponse(res, ml.remapSkus(skus, req.body.all, req.body.none), false);
});

router.post('/', function(req, res, next) {
    const ml = new ManufacturingLine();
    const controller = new Controller();
    controller.constructPostResponse(res, ml.create(req.body));
});

router.post('/:id/skus', function(req, res, next) {
    if(!req.body.skus || req.body.skus.length == 0) {
        return res.status(400).json({
            rowCount: 0
        });
    }
    let skus = Controller.convertParamToArray(req.body.skus) 
    const ml = new ManufacturingLine();
    const controller = new Controller();
    controller.constructRowCountPostResponse(res, ml.addSkus(req.params.id, skus));
});

router.put('/:id', function(req, res, next) {
    if(isNaN((req.params.id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }
    //nothing to update
    if(Object.keys(req.body).length === 0) {
        return res.json({
            rowCount: 0
        });
    }

    const ml = new ManufacturingLine();
    const controller = new Controller();
    controller.constructUpdateResponse(res, ml.update(req.body, req.params.id));
});


router.delete('/:id', function(req, res, next) {
    if(isNaN((req.params.id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }

    const ml = new ManufacturingLine();
    const controller = new Controller();
    controller.constructDeleteResponse(res, ml.remove(req.params.id));

});

module.exports = router;
