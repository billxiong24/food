let express = require('express');
const ManufacturingGoals = require('../app/manufacturing_goal');
const error_controller = require('../app/controller/error_controller');
let router = express.Router();
const Controller = require('../app/controller/controller');


router.get('/', function(req, res, next) {
    if(!req.query.user_id || isNaN(req.query.user_id)) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }
    const mg = new ManufacturingGoals();
    const controller = new Controller();
    controller.constructGetResponse(res, mg.search(req.query.user_id));
});

router.get('/:id/skus', function(req, res, next) {
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }
    const mg = new ManufacturingGoals();
    const controller = new Controller();
    controller.constructGetResponse(res, mg.getSkus(req.params.id));
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
    const controller = new Controller();
    controller.constructRowCountPostResponse(res, mg.addSkus(req.params.id, req.body.skus));
});

router.delete('/:id/skus', function(req, res, next) {
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }
    const mg = new ManufacturingGoals();
    const controller = new Controller();
    controller.constructDeleteResponse(res, mg.removeSkus(req.params.id, req.body.skus));
});

router.get('/:id/calculations', function(req, res, next) {
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }
    const mg = new ManufacturingGoals();
    const controller = new Controller();
    controller.constructGetResponse(res, mg.calculateQuantities(req.params.id));
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
    const controller = new Controller();
    controller.constructPostResponse(res, mg.create(req.body));
});

router.put('/:id', function(req, res, next) {
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }
    const mg = new ManufacturingGoals();
    const controller = new Controller();
    controller.constructUpdateResponse(res, mg.update(req.body, req.params.id));
});

router.delete('/:id', function(req, res, next) {
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }
    const mg = new ManufacturingGoals();
    const controller = new Controller();
    controller.constructUpdateResponse(res, mg.remove(req.params.id));
});

module.exports = router;
