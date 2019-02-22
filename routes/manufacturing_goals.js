let express = require('express');
const ManufacturingGoals = require('../app/manufacturing_goal');
const error_controller = require('../app/controller/error_controller');
let router = express.Router();
const Controller = require('../app/controller/controller');
const CRUD = require('../app/CRUD');
const SKU = require('../app/sku');
const Ingredient = require('../app/ingredient');
const SKUIngred = require("../app/sku_ingred");
const ProdLine = require("../app/productline");

function getCRUD(type) {
    let crud = null;
    if(type === "sku") {
        console.log("creating a SKU");
        crud = new SKU();
    }
    else if(type === 'ingredient') {
        console.log("creating an ingredient");
        crud = new Ingredient();
    }
    else if(type === 'formula') {
        crud = new SKUIngred();
    }
    else if(type === 'productline') {
        crud = new ProdLine();
    }
    else {
        return null;
    }

    return crud;

}

function checkUser(req, res, next) {
  let userID = req.params.id;
  if(!userID) userID = req.body.user_id;
  if(userID !== req.session.id) {
    res.status(401).json({
      error: "You are not authorized to edit this manufacturing goal"
    });
  }
  else {
    next();
  }
}

const checkTokenUser = process.env.NODE_ENV === 'test' ? (req, res, next) => { next(); } : checkUser;

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

router.post('/:id/skus', checkTokenUser, function(req, res, next) {
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

router.delete('/:id/skus', checkTokenUser, function(req, res, next) {
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
    let useUnits = (req.query.units) ? true : false;
    let id = req.params.id;
    if(isNaN((id))) {
        return res.status(400).json({
            error: "Malformed URL."
        });
    }
    const mg = new ManufacturingGoals();
    const controller = new Controller();
    controller.constructGetResponse(res, mg.calculateQuantities(req.params.id, useUnits));
});

router.post('/exported_file', checkTokenUser, function(req, res, next) {
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
    const crud = getCRUD(req.body.type);
    let csv = crud.exportFile(jsonList, format);
    res.status(200).send(csv);
});

router.post('/', checkTokenUser, function(req, res, next) {
    const mg = new ManufacturingGoals();
    const controller = new Controller();
    controller.constructPostResponse(res, mg.create(req.body));
});

router.put('/:id', checkTokenUser, function(req, res, next) {
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

router.delete('/:id', checkTokenUser, function(req, res, next) {
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
