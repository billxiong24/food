let express = require('express');
const Sku = require('../app/sku');
let router = express.Router();


router.get('/search', function(req, res, next) {
    let name = req.query.name;
    let ingredients = req.query.ingreds;
    let prodlines = req.query.prodlines;

    if(!ingredients) {
        ingredients = [];
    }
    else if(!Array.isArray(ingredients)) {
        ingredients = [ingredients];
    }

    if(!prodlines) {
        prodlines = [];
    }
    else if(!Array.isArray(prodlines)) {
        prodlines = [prodlines];
    }
    const sku = new Sku();

    sku.search(name, ingredients, prodlines)
    .then((result) => {
        res.status(200).json(result.rows);
    })
    .catch((err) => {
        res.status(400).json({
            error: "There was an error. Make sure request is formatted correctly."
        });
    });
});

router.post('/', function(req, res, next) {

});

router.put('/:sku_num', function(req, res, next) {

});

router.delete('/:sku_num', function(req, res, next) {

});

module.exports = router;
