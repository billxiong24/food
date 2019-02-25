const db = require("./db");
const CRUD = require("./CRUD");
const csv = require('csvtojson');
const squel = require("squel").useFlavour("postgres");
const QueryGenerator = require("./query_generator");
const Formatter = require('./formatter');

class SKUIngred extends CRUD {
    constructor() {
        super();
        this.tableName = "formula_ingredients";
        this.headerToDB = {
            "FormulaID": "id",
            "Formula#": "num",
            "Name": "name", 
            "Ingr#": "ingredient_num", 
            "Quantity": "quantity", 
            "Comment": "comment"
        };
        this.dbToHeader = this.reverseKeys(this.headerToDB);

    }
    bulkCleanData(jsonList) {
        jsonList = this.convertHeaderToDB(jsonList);
        for(let i = 0; i < jsonList.length; i++) {
            let obj = jsonList[i];
            for(let key in obj) {
                if(obj[key].length === 0) {
                    delete obj[key];
                }
            }
            let quantity = obj.quantity;
            let arr = quantity.split(/\s+/);
            obj.quantity = arr[0];
            obj.unit = arr[1];
            console.log(obj);
        }
    }

    exportFile(jsonList, format, cb = null) {
        const formatter = new Formatter(format);
        jsonList = super.convertDBToHeader(jsonList);
        let promise = Promise.resolve(null);
        let form_ingred = [];
        for(let i = 0; i < jsonList.length; i++) {
            //get ingredients
            promise = promise.then(function(res) {
                return db.execSingleQuery("select num, quantity, formula_ingredients.unit from formula_ingredients inner join ingredients on ingredients_id = id where formula_id = $1", [jsonList[i]['FormulaID']]);
            })
            .then(function(res) {
                console.log(res.rows);
                for(let j = 0; j < res.rows.length; j++) {
                    form_ingred.push({
                        "Formula#": jsonList[i]["Formula#"],
                        "Name": jsonList[i]["Name"],
                        "Ingr#": res.rows[j].num,
                        "Quantity": res.rows[j].quantity,
                        "Comment": jsonList[i]["Comment"]
                    });
                }
            });
        }

        console.log(form_ingred);
        return promise.then(function(res) {
            cb(formatter.generateFormat(form_ingred));
        });
    }

    bulkImport(csv_str, cb) {
        let table = this.tableName;
        let that = this;
        csv().fromString(csv_str)
        .then(function(rows) {
            that.bulkCleanData(rows);
            return rows;
        })
        .then(function(rows) {
            return db.getSingleClient()
            .then(function(client) {
                let abort = false;
                let error = false;
                let errMsgs = [];
                let prom = client.query("BEGIN");
                let line_sku = [];
                let rowsCopy = JSON.parse(JSON.stringify(rows));
                let form_ingred = [];
                for(let i = 0; i < rows.length; i++) {
                    delete rowsCopy[i].ingredient_num;

                    prom = prom.then(function(r) {
                        return client.query("SELECT id FROM ingredients WHERE ingredients.num = $1 ", [rows[i].ingredient_num])
                            .then(function(res) {
                                if(res.rows.length === 0) {
                                    rowsCopy[i].ingredients_id = null;
                                    rowsCopy[i].insert = false;
                                    error = true;
                                    abort = true;
                                    errMsgs.push({
                                        code: "23503",
                                        detail: "Ingredient number " + rows[i].ingredient_num + " doesnt exist"
                                    });
                                    return false;
                                }
                                rowsCopy.insert = true;
                                rowsCopy[i].ingredients_id = res.rows[0].id;
                                return true;
                            })
                            .then(function(res) {
                                delete rows[i].ingredient_num;
                                delete rows[i].quantity;
                                delete rows[i].unit;
                                if(!rowsCopy.insert)
                                    return Promise.resolve(false);
                                let query = QueryGenerator.genInsConflictQuery([rows[i]], 'formula',  'ON CONFLICT (num) DO UPDATE SET name = EXCLUDED.name').toString();
                                query += " RETURNING id";
                                console.log(query);
                                return client.query("SAVEPOINT point" + i).then(function(res) {
                                    return client.query(query).then(function(res) {
                                        let formula_id = res.rows[0].id;
                                        form_ingred.push({
                                            formula_id: formula_id,
                                            ingredients_id: rowsCopy[i].ingredients_id, 
                                            quantity: rowsCopy[i].quantity, 
                                            unit: rowsCopy[i].unit
                                        })

                                    }).catch(function(err) {
                                        console.log(err);
                                        error = true;
                                        errMsgs.push(err);
                                        rowsCopy[i].update = true;
                                        client.query("ROLLBACK TO SAVEPOINT point" + i);
                                    });
                                });
                            });

                    });
                }
                prom.then(function(res) {
                    let errObj = null;
                    if(error) {
                        errObj = that.generateErrorResult(errMsgs)
                        if(abort)
                            errObj.abort = true;
                        errObj.rows = errObj.abort ? [] : rowsCopy;
                        //logger.debug("There was an error, rolling back");
                        client.query("ROLLBACK");
                        client.query("ABORT");
                        client.release();
                    }
                    else {
                        console.log(form_ingred);
                        let query = QueryGenerator.genInsConflictQuery(form_ingred, 'formula_ingredients', 'ON CONFLICT (formula_id, ingredients_id) DO UPDATE SET quantity = EXCLUDED.quantity, unit = EXCLUDED.unit').toString();
                        console.log(query);
                        client.query(query)
                        .then(function(res) {
                            client.query("COMMIT")
                            .then(function(res) {
                                client.release();
                            });
                        })
                        .catch(function(r) {
                            client.release();
                        });
                    }

                    cb(errObj);
                });
            });
        });
    }


}

module.exports = SKUIngred;
