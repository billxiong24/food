let express = require('express');
const Sku = require('../app/sku');
let router = express.Router();

router.get('/search', function(req, res, next) {
    let name = req.query.name;
    let ingredients = req.query.ingredients;
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
            error: err
        });
    });
});

router.get('/:id/ingredients', function(req, res, next) {
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }

    const sku = new Sku();
    sku.getIngredients(id)
    .then((result) => {
        res.status(200).json(result.rows);
    })
    .catch((err) => {
        res.status(400).json({
            error: err
        });
    });
});


router.post('/:id/ingredients', function(req, res, next) {
    let ingredients = null;
    try {
        ingredients = JSON.parse(req.body.ingredients);
    }
    catch(err) {
        return res.status(400).json({
            error: "Malformed Request Body."
        });
    }

    let id = req.params.id;
    if(!id) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }
    const sku = new Sku();
    sku.addIngredients(id, ingredients)
    .then((result) => {
        res.status(201).json({
            rowCount: result.rowCount
        });
    })
    .catch((err) => {
        res.status(409).json({
            error: err
        });
    });
});

router.post('/', function(req, res, next) {
    const sku = new Sku();
    sku.create(req.body)
    .then((result) => {
        res.status(201).json({
            rowCount: result.rowCount
        });
    })
    .catch((err) => {
        res.status(409).json({
            error: err
        });
    });
});

router.put('/:id', function(req, res, next) {
    if(!req.params.id) {
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
    sku.update(req.body, req.params.id)
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
    if(!req.params.id) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }
    const sku = new Sku();
    sku.remove(req.params.id)
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

router.delete('/:id/ingredients', function(req, res, next) {
    if(!req.params.id) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }

    let ingredients = req.body.ingredients;
    if(!ingredients) {
        return res.status(200).json({
            rowCount: 0
        });
    }
    else if (!Array.isArray(ingredients)) {
        ingredients = [ingredients];
    }
    const sku = new Sku();
    sku.removeIngredients(req.params.id, ingredients)
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
