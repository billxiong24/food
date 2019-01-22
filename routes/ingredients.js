let express = require('express');
const Ingredient = require('../app/ingredient');
let router = express.Router();


router.get('/dummyData', function(req, res, next) {

    let data = [{"name":"name","num":6,"vend_info":"vending","pkg_size":"345lbs","pkg_cost":"45","comments":"helloworld","id":1},{"name":"name","num":6,"vend_info":"vending","pkg_size":"345lbs","pkg_cost":"45","comments":"helloworld","id":1},{"name":"name","num":6,"vend_info":"vending","pkg_size":"345lbs","pkg_cost":"45","comments":"helloworld","id":1},{"name":"name6969","num":12,"vend_info":null,"pkg_size":"55 gallons","pkg_cost":"10","comments":null,"id":9},{"name":"nameanother","num":698,"vend_info":"someinfo please","pkg_size":"5lbs","pkg_cost":"45","comments":"heldddloworld","id":2},{"name":"namerino","num":5633,"vend_info":"waterinrterro","pkg_size":"266","pkg_cost":"5300","comments":null,"id":12}];
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
    let dataObj = {};
    
    for(let k in req.body) {
        dataObj[k] = req.body[k];
    }
    ing.update(dataObj, req.params.name)
    .then((result) => {
        res.status(200).json({
            rowCount: result.rowCount
        });
    })
    .catch((err) => {
        console.log(err);
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
