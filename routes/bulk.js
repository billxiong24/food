let express = require('express');
let router = express.Router();
const error_controller = require('../app/controller/error_controller');
const multer = require('multer');
const upload = multer({ 
    storage: multer.memoryStorage() 
});
const CRUD = require('../app/CRUD');
const SKU = require('../app/sku');

router.post('/bulk_import', upload.single("csvfile"), function(req, res, next) {
    const sku = new SKU();
    const buf = req.file.buffer.toString();
    sku.bulkImport(buf, function(errObj) {
        res.status(200).json(errObj);
    });
});
router.post('/accept_bulk_import', function(req, res, next) {
    let rows = req.body.rows;
    const sku = new SKU();
    sku.bulkAcceptInsert(rows, function(errObj) {
        res.status(200).json(errObj);
    });
});

router.post('/bulk_export', function(req, res, next) {

});

module.exports = router;
