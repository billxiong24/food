let express = require('express');
const Ingredient = require('../app/ingredient');
let router = express.Router();
const Filter = require("../app/filter");
const error_controller = require('../app/controller/error_controller');


//TODO 22P02
router.get('/search', function(req, res, next) {
    let names = req.query.names;
    let list = req.query.skus;
    let orderKey = req.query.orderKey;
    let asc = (!req.query.asc) || req.query.asc == "1"; 
    let limit = parseInt(req.query.limit) || 0;
    let offset = parseInt(req.query.offset) || 0;

    const filter = new Filter();
    filter.setOrderKey(orderKey).setAsc(asc).setOffset(req.query.offset).setLimit(req.query.limit);

    const ing = new Ingredient();
    if(!names) {
        names = [];
    }
    else if(!Array.isArray(names)) {
        names = [names];
    }

    if(!list) {
        list = [];
    }
    else if (!Array.isArray(list)) {
        list = [list];
    }

    ing.search(names, list, filter).then((result) => {
        res.status(200).json(result.rows);
    })
    .catch((err) => {
        res.status(400).json({
            error: error_controller.getErrMsg(err)
        });
    });
});

router.post('/', function(req, res, next) {
    const ing = new Ingredient();
    ing.create(req.body)
    .then((result) => {
        //HTTP 201 is successful addition
        res.status(201).json({
            rowCount: result.rowCount
        });
    })
    .catch((err) => {
        //HTTP 409 is conflict status
        res.status(409).json({
            error: error_controller.getErrMsg(err)
        });
    });
});

router.get('/:id/skus', function(req, res, next) {
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });

    }

    const ing = new Ingredient();
    ing.getSkus(id)
    .then((result) => {
        res.status(200).json(result.rows);
    })
    .catch((err) => {
        res.status(400).json({
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

    if(Object.keys(req.body).length === 0) {
        return req.json({
            rowCount: 0
        });
    }
    const ing = new Ingredient();
    ing.update(req.body, id)
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

router.delete('/:id', function(req, res, next) {
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }
    const ing = new Ingredient();
    ing.remove(id)
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
