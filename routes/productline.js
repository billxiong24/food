let express = require('express');
const ProductLine = require('../app/productline');
let router = express.Router();
const Filter = require('../app/filter');
const error_controller = require('../app/controller/error_controller');

router.get('/search', function(req, res, next) {
    let names = req.query.names;
    const prdline = new ProductLine();
    let orderKey = req.query.orderKey;
    let asc = (!req.query.asc) || req.query.asc == "1"; 
    let limit = parseInt(req.query.limit) || 0;
    let offset = parseInt(req.query.offset) || 0;

    if(!names) {
        names = [];
    }
    else if(!Array.isArray(names)) {
        names = [names];
    }

    const filter = new Filter();
    filter.setOrderKey(orderKey).setAsc(asc).setOffset(req.query.offset).setLimit(req.query.limit);

    prdline.search(names, filter)
    .then((result) => {
        res.status(200).json(result.rows);
    })
    .catch((err) => {
        res.status(400).json({
            error: error_controller.getErrMsg(err)
        });
    });
});


router.post('/', function(req, res, next) {
    const prdline = new ProductLine();
    prdline.create(req.body)
    .then((result) => {
        res.status(201).json(result.rows[0]);
    })
    .catch((err) => {
        res.status(409).json({
            error: error_controller.getErrMsg(err)
        });
    });
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
    
    prdline.update(req.body, req.params.id)
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

router.delete('/:id', function(req, res, next) {
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }
    const prdline = new ProductLine();

    prdline.remove(req.params.id)
    .then((result) => {
        res.status(200).json({
            rowCount: result.rowCount
        });
    })
    .catch((err) => {
        res.status(409).json({
            error: error_controller.getErrMsg(err)
        });
    });
});

module.exports = router;
