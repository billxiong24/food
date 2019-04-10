let express = require('express');
let router = express.Router();
const error_controller = require('../app/controller/error_controller');
const multer = require('multer');
const CRUD = require('../app/CRUD');
const SKU = require('../app/sku');
const Ingredient = require('../app/ingredient');
const SKUIngred = require("../app/sku_ingred");
const ProdLine = require("../app/productline");
const upload = multer({
    storage: multer.memoryStorage()
}).single('csvfile')

const { checkCoreWrite } = require('./guard');

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

router.post('/bulk_import', checkCoreWrite, function(req, res, next) {

    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                error: err
            });
        }
        let crud = getCRUD(req.body.type);
        if(!crud) {
            return res.status(400).json({
                error: "Bad format type."
            });
        }
        const buf = req.file.buffer.toString();
        crud.bulkImport(buf, function(errObj) {
            res.status(200).json(errObj);
        });
    });

});
router.post('/accept_bulk_import', checkCoreWrite, function(req, res, next) {
    let crud = getCRUD(req.body.type);
    if(!crud) {
        return res.status(400).json({
            error: "Bad format type."
        });
    }
    let rows = req.body.rows;
    crud.bulkAcceptInsert(rows, function(errObj) {
        res.status(200).json(errObj);
    });
});

module.exports = router;
