let express = require('express');
const Sku = require('../app/sku');
const Filter = require("../app/filter");
let router = express.Router();
const error_controller = require('../app/controller/error_controller');
const Formula = require('../app/formula');
const Controller = require('../app/controller/controller');


router.get('/search', function(req, res, next) {

});

router.get('/:id/ingredients', function(req, res, next) {
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }

    const formula = new Formula();
    const controller = new Controller();
    controller.constructGetResponse(res, formula.getIngredients(id));

});

router.post('/', function(req, res, next) {
    const formula = new Formula();
    const controller = new Controller();
    controller.constructGetResponse(res, formula.create(req.body));
});

router.post('/:id/ingredients', function(req, res, next) {
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });

    }
    if(!req.body.ingredients || req.body.ingredients.length == 0) {
        return res.status(200).json({
            rowCount: 0
        });
    }
    const formula = new Formula();
    const controller = new Controller();
    controller.constructRowCountPostResponse(res, formula.addIngredients(id, req.body.ingredients));

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

    const formula = new Formula();
    const controller = new Controller();
    controller.constructUpdateResponse(res, formula.update(req.body, req.params.id));
});

router.delete('/:id/ingredients', function(req, res, next) {
    if(!req.params.id) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }

    let ingredients = req.body.ingredients;
    if(!ingredients || ingredients.length === 0) {
        return res.status(200).json({
            rowCount: 0
        });
    }
    const formula = new Formula();
    const controller = new Controller();
    controller.constructDeleteResponse(res, formula.removeIngredients(req.params.id, ingredients));
});

router.delete('/:id', function(req, res, next) {
    if(isNaN((req.params.id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }
    const formula = new Formula();
    const controller = new Controller();
    controller.constructDeleteResponse(res, formula.remove(req.params.id));
});

module.exports = router;
