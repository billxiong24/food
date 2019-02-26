let express = require('express');
const ProductLine = require('../app/productline');
let router = express.Router();
const Filter = require('../app/filter');
const error_controller = require('../app/controller/error_controller');
const Controller = require('../app/controller/controller');

router.get('/search', function(req, res, next) {
    let names = req.query.names;
    let orderKey = req.query.orderKey;
    let asc = (!req.query.asc) || req.query.asc == "1"; 
    let limit = parseInt(req.query.limit) || 0;
    let offset = parseInt(req.query.offset) || 0;

    const prdline = new ProductLine();
    const controller = new Controller();
    names = Controller.convertParamToArray(names) 

    const filter = new Filter();
    filter.setOrderKey(orderKey).setAsc(asc).setOffset(req.query.offset).setLimit(req.query.limit);

    controller.constructGetResponse(res, prdline.search(names, filter));
});

router.post('/', function(req, res, next) {
    const prdline = new ProductLine();
    const controller = new Controller();
    controller.constructPostResponse(res, prdline.create(req.body));
});

router.put('/:id', function(req, res, next) {
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }

    if(!req.body.name) {
        return res.status(400).send({
            error: "Required parameters not set."
        });
    }
    const prdline = new ProductLine();
    const controller = new Controller();
    controller.constructUpdateResponse(res, prdline.update(req.body, req.params.id));
});

router.delete('/:id', function(req, res, next) {
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }
    const prdline = new ProductLine();
    const controller = new Controller();
    controller.constructDeleteResponse(res, prdline.remove(req.params.id));
});

module.exports = router;
