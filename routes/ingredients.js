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

    const ing = new Ingredient();
    if(!list || list.length == 0) {
        ing.searchByName(name).then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            res.json({
                error: err
            });
        })
    }
    else {
        if(!Array.isArray(list)) {
            let temp = [];
            temp.push(list);
            list = temp;
        }
        ing.search(name, list).then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            res.json({
                error: err
            });
        });
    }
});

//TODO rendering page
router.get('/:name', function(req, res, next) {
    res.status(200).json({});
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
        res.status(201).json({});
    })
    .catch((err) => {
        //HTTP 409 is conflict status
        res.status(409).json({
            error: err
        });
    });
});

router.put('/:name', function(req, res, next) {
    const ing = new Ingredient();
    ing.update(req.body, req.params.name)
    .then((result) => {
        res.status(200).json({
            rowCount: result.rowCount
        });
    })
    .catch((err) => {
        res.status(409).json({
            error: "There was an error updating the ingredient. Check that the updated ingredients do not already exist."
        });
    });
});

router.delete('/:name', function(req, res, next) {
    let name = req.params.name;
    const ing = new Ingredient();
    ing.remove(name)
    .then((result) => {
        res.status(200).json({
            rowCount: result.rowCount
        });
    })
    .catch((err) => {
        res.status(409).json({
            error: "Error deleting resource. Make sure request is propery formatted."
        });
    });
});

module.exports = router;
