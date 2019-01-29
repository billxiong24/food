let express = require('express');
const Ingredient = require('../app/ingredient');
let router = express.Router();


router.get('/dummyData', function(req, res, next) {

    let data = [
    {
        "name":"Cheddar Cheese",
        "num":53,
        "vend_info":"Walmart",
        "pkg_size":"345lbs",
        "pkg_cost":"45",
        "comments":"cheese is awesome",
        "id":1
    },
    {
        "name":"Chicken Thigh",
        "num":6,
        "vend_info":"Target",
        "pkg_size":"345lbs",
        "pkg_cost":"45",
        "comments":"how about them thighs tho",
        "id":1
    },
    {
        "name":"2% Milk",
        "num":6,
        "vend_info":"Walmart",
        "pkg_size":"345lbs",
        "pkg_cost":"45",
        "comments":"got milk","id":1
    },
    {
        "name":"Georgian Oranges",
        "num":12,
        "vend_info":null,
        "pkg_size":"55 gallons",
        "pkg_cost":"10",
        "comments":null,
        "id":9
    },
    {
        "name":"Water",
        "num":698,
        "vend_info":"Ozark",
        "pkg_size":"5lbs",
        "pkg_cost":"45",
        "comments":"its not actually spring water",
        "id":2
    },
    {
        "name":"Sesame Seeds",
        "num":698,
        "vend_info":"Haldirams'",
        "pkg_size":"5lbs",
        "pkg_cost":"45",
        "comments":"that indian thing",
        "id":76
    },
    {
        "name":"Cauliflower",
        "num":698,
        "vend_info":"Albertson's",
        "pkg_size":"5lbs",
        "pkg_cost":"45",
        "comments":"Call me Flower ;)",
        "id":234
    },
    {
        "name":"Rice",
        "num":5633,
        "vend_info":"Its better than the university",
        "pkg_size":"266",
        "pkg_cost":"5300",
        "comments":null,
        "id":12
    }];
    res.status(200).json(data);
});

router.get('/search', function(req, res, next) {
    let name = req.query.name;
    let list = req.query.skus;
    let orderKey = req.query.orderKey;
    let asc = req.query.asc == "1"; 

    const ing = new Ingredient();
    if(!list) {
        list = [];
    }
    else if (!Array.isArray(list)) {
        list = [list];
    }

    ing.search(name, list, orderKey ? orderKey : null, asc).then((result) => {
        res.json(result.rows);
    })
    .catch((err) => {
        res.json({
            error: err
        });
    });
});

router.post('/', function(req, res, next) {
    //{
        //name: req.body.name,
        //num: req.body.num,
        //vend_info: req.body.vend_info,
        //pkg_size: req.body.pkg_size,
        //pkg_cost: req.body.pkg_cost,
        //comments: req.body.comments
    //};
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
            error: err
        });
    });
});

router.get('/:id/skus', function(req, res, next) {
    let id = req.params.id;
    if(!id) {
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
            error: err
        });
    });
});

router.put('/:id', function(req, res, next) {

    if(Object.keys(req.body).length === 0) {
        return req.json({
            rowCount: 0
        });
    }
    const ing = new Ingredient();
    ing.update(req.body, req.params.id)
    .then((result) => {
        res.status(200).json({
            rowCount: result.rowCount
        });
    })
    .catch((err) => {
        res.status(409).json({
            error: err
        });
    });
});

router.delete('/:id', function(req, res, next) {
    let id = req.params.id;
    const ing = new Ingredient();
    ing.remove(id)
    .then((result) => {
        res.status(200).json({
            rowCount: result.rowCount
        });
    })
    .catch((err) => {
        res.status(409).json({
            error: err
        });
    });
});

module.exports = router;
