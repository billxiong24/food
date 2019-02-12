const db = require("./db");
const CRUD = require("./CRUD");
const csv = require('csvtojson');
const squel = require("squel").useFlavour("postgres");
const QueryGenerator = require("./query_generator");

class SKUIngred extends CRUD {
    constructor() {
        super();
        this.tableName = "sku_ingred";
    }

    bulkImport(csv_str, cb) {
        let table = this.tableName;
        let that = this;
        let errMsg = null; 
        csv().fromString(csv_str)
        .then(function(rows) {
            that.bulkCleanData(rows);
            return rows;
        })
        .then(function(rows) {
            db.getSingleClient().then(function(client) {
                let prom = client.query("BEGIN");
                let i;
                for(let i = 0; i < rows.length; i++) {
                    let query = QueryGenerator.genInsConflictQuery([rows[i]], table,  'ON CONFLICT (sku_num, ingred_num) DO UPDATE SET quantity = EXCLUDED.quantity').toString();
                    prom = prom.then(function(r) {
                        return client.query(query);
                    });
                }
                
                prom = prom.then(function(res) {
                    //logger.debug("no errors in formulas, commiting");
                    client.query("COMMIT");
                    cb({
                        inserts: rows.length,
                        updates: 0
                    });
                })
                .catch(function(err) {
                    errMsg = {
                        errors: [ 
                            { 
                                code: err.code,
                                detail: err.detail ? err.detail : "Bad input in csv file - double check that you are inputting sku_num,ingred_num,quantity"
                            }
                        ]
                    };
                    //logger.debug("Error, aborting formulas");
                    client.query("ABORT");
                    cb(errMsg);
                });
            });
        });
    }
}

module.exports = SKUIngred;