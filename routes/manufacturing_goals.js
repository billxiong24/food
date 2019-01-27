let express = require('express');
const ManufacturingGoals = require('../app/manufacturing_goal');
let router = express.Router();

router.get('/search', function(req, res, next) {
    const mg = new ManufacturingGoals()
    mg.search(req.query.user_id)
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
    const mg = new ManufacturingGoals();
    mg.create(req.body)
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
    const mg = new ManufacturingGoals();
    mg.update(req.body, req.params.id)
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
    const mg = new ManufacturingGoals();

    mg.remove(req.params.id)
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
