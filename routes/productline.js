let express = require('express');
const ProductLine = require('../app/productline');
let router = express.Router();


router.get('/search', function(req, res, next) {
    let name = req.query.name;
    const prdline = new ProductLine();

    prdline.search(name)
    .then((result) => {
        res.status(200).json(result.rows);
    })
    .catch((err) => {
        res.json({
            error: err
        });
    });
});


router.post('/', function(req, res, next) {
    const prdline = new ProductLine();
    prdline.create(req.body)
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

    const prdline = new ProductLine();
    
    prdline.update(req.body, req.params.id)
    .then((result) => {
        res.status(200).json({
            rowCount: result.rowCount
        });
    })
    .catch((err) => {
        res.status(400).json({
            error: err
        });
    });
});

router.delete('/:id', function(req, res, next) {
    const prdline = new ProductLine();

    prdline.remove(req.params.id)
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
