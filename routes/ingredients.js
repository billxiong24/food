let express = require('express');
const Ingredient = require('../app/ingredient');
let router = express.Router();
const Filter = require("../app/filter");
const error_controller = require('../app/controller/error_controller');
const Controller = require('../app/controller/controller');


//TODO 22P02
router.get('/search', function(req, res, next) {
    let names = req.query.names;
    let list = req.query.skus;
    let orderKey = req.query.orderKey;
    let asc = (!req.query.asc) || req.query.asc == "1"; 
    let limit = parseInt(req.query.limit) || 0;
    let offset = parseInt(req.query.offset) || 0;

    const filter = new Filter();
    filter.setOrderKey(orderKey).setAsc(asc).setOffset(offset).setLimit(limit);

    names = Controller.convertParamToArray(names);
    list = Controller.convertParamToArray(list);

    const ing = new Ingredient();
    const controller = new Controller();
    controller.constructGetResponse(res, ing.search(names, list, filter));
});

router.post('/', function(req, res, next) {
    const ing = new Ingredient();
    const controller = new Controller();
    controller.constructPostResponse(res, ing.create(req.body));
});

router.get('/:id/skus', function(req, res, next) {
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }

    const ing = new Ingredient();
    const controller = new Controller();
    controller.constructGetResponse(res, ing.getSkus(id));
});

router.put('/:id', function(req, res, next) {
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }

    if(Object.keys(req.body).length === 0) {
        return req.json({
            rowCount: 0
        });
    }
    const ing = new Ingredient();
    const controller = new Controller();
    controller.constructUpdateResponse(res, ing.update(req.body, id));
});

router.delete('/:id', function(req, res, next) {
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }
    const ing = new Ingredient();
    const controller = new Controller();
    controller.constructDeleteResponse(res, ing.remove(id));
});

module.exports = router;
