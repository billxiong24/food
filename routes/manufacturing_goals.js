let express = require('express');
const ManufacturingGoals = require('../app/manufacturing_goal');
const error_controller = require('../app/controller/error_controller');
let router = express.Router();


router.get('/', function(req, res, next) {
    if(!req.query.user_id || isNaN(req.query.user_id)) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }
    const mg = new ManufacturingGoals();
    mg.search(req.query.user_id)
    .then((result) => {
        res.status(200).json(result.rows);
    })
    .catch((err) => {
        res.status(400).json({
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
    const mg = new ManufacturingGoals();
    mg.getSkus(req.params.id)
    .then((result) => {
        res.status(200).json(result.rows);
    })
    .catch((err) => {
        res.status(400).json({
            error: error_controller.getErrMsg(err)
        });
    });
});

router.post('/:id/skus', function(req, res, next) {
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }

    if(!req.body.skus || req.body.skus.length == 0) {
        return res.status(200).json({
            rowCount: 0
        });
    }
    const mg = new ManufacturingGoals();
    mg.addSkus(req.params.id, req.body.skus)
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

router.delete('/:id/skus', function(req, res, next) {
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }
    const mg = new ManufacturingGoals();
    mg.removeSkus(req.params.id, req.body.skus)
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

router.get('/:id/calculations', function(req, res, next) {
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }
    const mg = new ManufacturingGoals();
    mg.calculateQuantities(req.params.id)
    .then((result) => {
        res.status(200).json(result.rows);
    })
    .catch((err) => {
        res.status(400).json({
            error: error_controller.getErrMsg(err)
        });
    });
});

router.post('/exported_file', function(req, res, next) {
    let format = (req.body.format) ? req.body.format : "csv";
    let jsonList = req.body.data;
    if(!Array.isArray(jsonList)) {
        return res.status(400).json({
            error: "Parameter must be a list."
        });
    }

    res.setHeader('Content-disposition', 'attachment; filename=file.csv');
    res.set('Content-Type', 'text/csv');

    if(!jsonList || jsonList.length === 0) {
        let csv = "";
        return res.status(200).send(csv);
    }

    const mg = new ManufacturingGoals();
    let csv = mg.exportFile(jsonList, format);
    res.status(200).send(csv);
});

router.post('/', function(req, res, next) {
    const mg = new ManufacturingGoals();
    mg.create(req.body)
    .then((result) => {
        res.status(201).json(result.rows[0]);
    })
    .catch((err) => {
        res.status(409).json({
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
    const mg = new ManufacturingGoals();
    mg.update(req.body, req.params.id)
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
    const mg = new ManufacturingGoals();
    mg.remove(req.params.id)
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
