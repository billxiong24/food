let express = require('express');
const Sku = require('../app/sku');
const Filter = require("../app/filter");
let router = express.Router();
const error_controller = require('../app/controller/error_controller');
const Formula = require('../app/formula');
const Controller = require('../app/controller/controller');

const { checkCoreRead, checkCoreWrite } = require('./guard');

router.get('/search', checkCoreRead, function(req, res, next) {
    let names = req.query.names;
    let ingredients = req.query.ingredients;
    let orderKey = req.query.orderKey;
    let asc = (!req.query.asc) || req.query.asc == "1"; 
    let limit = parseInt(req.query.limit) || 0;
    let offset = parseInt(req.query.offset) || 0;

    const filter = new Filter();
    filter.setOrderKey(orderKey).setAsc(asc).setOffset(offset).setLimit(limit);

    names = Controller.convertParamToArray(names) 
    ingredients = Controller.convertParamToArray(ingredients) 
    const formula = new Formula();
    const controller = new Controller();
    controller.constructGetResponse(res, formula.search(names, ingredients, filter));

});



router.get('/init_formula', function(req, res, next) {
    const formula = new Formula();
    formula.initializeFormula().then((b) => {
        res.status(200).json(b)
    })
});
router.get('/:id', checkCoreRead, function(req, res, next) {
    const formula = new Formula();
    const controller = new Controller();
    controller.constructGetResponse(res, formula.read(req.params.id));
});

router.put('/valid_num', checkCoreRead, function(req, res, next) {
    const formula = new Formula();
    let num = req.body.num
    formula.validNum(num).then((valid) => {
        res.status(200).json({
            valid
        })
    })
});






router.put('/formula_autocomplete', checkCoreRead, function(req, res, next) {
    const formula = new Formula();
    let prefix = req.body.prefix
    formula.formulaAutocomplete(prefix).then((list) => {
        res.status(200).json({
            formulas: list
        })
    })
});

router.get('/:id/ingredients', checkCoreRead, function(req, res, next) {
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

router.get('/:id/skus', checkCoreRead, function(req, res, next) {
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }

    const formula = new Formula();
    const controller = new Controller();
    controller.constructGetResponse(res, formula.getSkus(id));
});

router.post('/', checkCoreWrite, function(req, res, next) {
    const formula = new Formula();
    const controller = new Controller();
    controller.constructPostResponse(res, formula.create(req.body));
});

router.post('/:id/ingredients', checkCoreWrite, function(req, res, next) {
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

router.put('/:id', checkCoreWrite, function(req, res, next) {
    console.log(req.body);
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

router.delete('/:id/ingredients', checkCoreWrite, function(req, res, next) {
    if(!req.params.id) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }

    console.log(req.body);
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

router.delete('/:id', checkCoreWrite, function(req, res, next) {
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
