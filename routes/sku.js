let express = require('express');
const Sku = require('../app/sku');
const Filter = require("../app/filter");
let router = express.Router();
const error_controller = require('../app/controller/error_controller');
const Controller = require('../app/controller/controller');

//TODO 22P02, 42703
router.get('/search', function(req, res, next) {
    let names = req.query.names;
    let ingredients = req.query.ingredients;
    let prodlines = req.query.prodlines;
    let orderKey = req.query.orderKey;
    let asc = (!req.query.asc) || req.query.asc == "1"; 
    let limit = parseInt(req.query.limit) || 0;
    let offset = parseInt(req.query.offset) || 0;

    const filter = new Filter();
    filter.setOrderKey(orderKey).setAsc(asc).setOffset(offset).setLimit(limit);

    names = Controller.convertParamToArray(names) 
    ingredients = Controller.convertParamToArray(ingredients) 
    prodlines = Controller.convertParamToArray(prodlines) 
    const sku = new Sku();
    const controller = new Controller();
    controller.constructGetResponse(res, sku.search(names, ingredients, prodlines, filter));
});

router.get('/:id/ingredients', function(req, res, next) {
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }

    const sku = new Sku();
    const controller = new Controller();
    controller.constructGetResponse(res, sku.getIngredients(id));
});

router.get('/:id/manufacturing_lines', function(req, res, next) {
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }

    const sku = new Sku();
    const controller = new Controller();
    controller.constructGetResponse(res, sku.getManufacturingLines(id));
});

//TODO 23503, 22P02, 
router.post('/', function(req, res, next) {
    req.body.man_lines = Controller.convertParamToArray(req.body.man_lines);
    console.log(req.body);
    const sku = new Sku();
    const controller = new Controller();
    controller.constructPostResponse(res, sku.create(req.body));
});


//TODO 23505, 22P02, 42703 
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

    const sku = new Sku();
    const controller = new Controller();
    controller.constructUpdateResponse(res, sku.update(req.body, req.params.id));
});

//TODO 22P02
router.delete('/:id', function(req, res, next) {
    if(isNaN((req.params.id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }
    const sku = new Sku();
    const controller = new Controller();
    controller.constructDeleteResponse(res, sku.remove(req.params.id));
});

module.exports = router;
