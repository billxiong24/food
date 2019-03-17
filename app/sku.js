const db = require("./db");
const fs = require('fs')
const CRUD = require("./CRUD");
const squel = require("squel").useFlavour('postgres');
const QueryGenerator = require("./query_generator");
const Filter = require('./filter');
const Ingredient = require('./ingredient');
const csv=require('csvtojson');
const Formatter = require('./formatter');

class SKU extends CRUD {

    constructor() {
        super();
        this.tableName = "sku";
        this.headerToDB = {
            "SKU#": "num",
            "Name": "name",
            "Case UPC": "case_upc",
            "Unit UPC": "unit_upc",
            "Unit size": "unit_size",
            "Count per case": "count_per_case",
            "PL Name": "prd_line",
            "Comment": "comments",
            "Formula#": "formula_num", //TODO FIX THIS
            "FormulaID": "formula_id",
            "ML Shortnames": "shortname", 
            "Formula factor": "formula_scale",
            "Rate": "man_rate",
            "SkuID": "id"
        };
        this.dbToHeader = this.reverseKeys(this.headerToDB);
    }

    //override
    checkExisting(obj) {
        let num = obj.num;
        let case_upc = obj.case_upc;
        if(num && case_upc) {
            return db.execSingleQuery("SELECT COUNT(*) FROM " + this.tableName + " WHERE case_upc = $1 OR num = $2", [case_upc, num]);
        }
        else if(case_upc){
            return db.execSingleQuery("SELECT COUNT(*) FROM " + this.tableName + " WHERE case_upc = $1", [case_upc]);
        }
        else if(num) {
            return db.execSingleQuery("SELECT COUNT(*) FROM " + this.tableName + " WHERE num= $1", [num]);
        }
        
        return Promise.reject("No valid name or num provided.");
    }

    deleteManLines(id, manlines) {
        //let arr = [];
        //for(let i = 0; i < manlines.length; i++) {
            //let obj = {};
            //arr.push({
                //manufacturing_line_id: manlines[i],
                //sku_id: id
            //});
        //}

        let delQuery = squel.delete()
        .from('manufacturing_line_sku');
        let expr = squel.expr();
        for(let i = 0; i < manlines.length; i++) {
            expr = expr.or("sku_id = ? AND manufacturing_line_id = ?", id, manlines[i]);
        }


        delQuery = delQuery.where(expr).toString();
        console.log(delQuery);
        return db.execSingleQuery(delQuery, []);
    }
    addManLines(id, manlines) {
        let arr = [];
        for(let i = 0; i < manlines.length; i++) {
            let obj = {};
            arr.push({
                manufacturing_line_id: manlines[i],
                sku_id: id
            });
        }

        let query = QueryGenerator.genInsConflictQuery(arr, 'manufacturing_line_sku', 'ON CONFLICT DO NOTHING').toString();
        console.log(query);
        return db.execSingleQuery(query, []);
    }

    getIngredients(id) {
        const ing = new Ingredient();
        return ing.search([], [id], new Filter());
    }

    search(names, ingredients, productlines, filter) {
        let q = squel.select()
        .from(this.tableName)
        .field("sku.*, COUNT(*) OVER() as row_count")
        .left_join("formula_ingredients", null, "sku.formula_id = formula_ingredients.formula_id")
        .left_join("ingredients", null, "ingredients.id=formula_ingredients.ingredients_id");

        const queryGen = new QueryGenerator(q);
        names = QueryGenerator.transformQueryArr(names);
        queryGen.chainAndFilter(names, "sku::TEXT LIKE ?")
        .chainOrFilter(ingredients, "ingredients.name = ?")
        .chainOrFilter(productlines, "sku.prd_line=?")
        .makeDistinct();
        let queryStr = filter.applyFilter(queryGen.getQuery()).toString();
        console.log(queryStr);
        return db.execSingleQuery(queryStr, []);
    }

    getManufacturingLines(id) {
        let query = squel.select()
        .from("manufacturing_line")
        .field("manufacturing_line.*")
        .join("manufacturing_line_sku", null, "manufacturing_line_id = manufacturing_line.id")
        .where("sku_id= ? ", id)
        .distinct()
        .toString();
        return db.execSingleQuery(query, []);
    }
    checkProductLineExists(name) {
        return db.execSingleQuery("SELECT * FROM productline WHERE productline.name = $1", [name]).then((res) => {
            if(res.rows.length == 0) {
                return Promise.reject("Product line does not exist.");
            }
            return res;
        });
    }

    create(dataObj) {
        if(!dataObj.name || !dataObj.case_upc || !dataObj.unit_upc || !dataObj.unit_size || !dataObj.count_per_case || !dataObj.prd_line || !dataObj.formula_id || !dataObj.man_rate || !dataObj.man_lines) {
            return Promise.reject("Not all required fields are present.");
        }
        if(dataObj.num === null || dataObj.num === undefined)
            delete dataObj.num;

        let man_lines = dataObj.man_lines;
        delete dataObj.man_lines;

        let query = QueryGenerator.genInsQuery(dataObj, this.tableName).returning("*").toString();
        //must do transaction to insert sku first, then if valid, insert manufacture lines
        return (async () => {
            const client = await db.getSingleClient();

            try {
                await client.query('BEGIN');
                const { rows } = await client.query(query, []);

                //construct man_line id and sku id list to insert
                if(man_lines.length > 0) {
                    let arr = [];
                    for(let i = 0; i < man_lines.length; i++) {
                        arr.push({
                            sku_id: rows[0].id,
                            manufacturing_line_id: man_lines[i]
                        });
                    }

                    let q = squel.insert()
                    .into("manufacturing_line_sku")
                    .setFieldsRows(arr).toString();

                    await client.query(q, [])
                }
                await client.query('COMMIT')
                return rows;
            } catch (e) {
                await client.query('ROLLBACK')
                throw e
            } finally {
                client.release()
            }
        })()
        .then(function(rows) {
            return {
                rows: rows
            };
        });
    }

    update(dataObj, id) {
        if(!dataObj.prd_line) {
            return super.change(dataObj, id, "id");
        }
        else {
            return this.checkProductLineExists(dataObj.prd_line)
            .then((res) => {
                return super.change(dataObj, id, "id");
            });
        }
    }

    conflictUpdate(dataObj) {
        let q = super.getUpdateQueryObj(dataObj);
        let expr = squel.expr();
        expr = expr.or("case_upc = ?", dataObj.case_upc);
        if(dataObj.num) {
            expr = expr.or("num = ?", dataObj.num);
        }
        q = q.where(expr);
        q = q.returning("*").toString();
        return q;
    }

    duplicateObjs(jsonList) {
        let b = super.checkDuplicateInObject('num', jsonList); 
        let c = super.checkDuplicateInObject('case_upc', jsonList); 
        return b || c;
    }

    remove(id) {
        if(!id) {
            return Promise.reject("Bad num.");
        }
        return db.execSingleQuery("DELETE FROM " + this.tableName + " WHERE id = $1", [id]);
    }

    //override
    exportFile(jsonList, format, cb=null) {
        const formatter = new Formatter(format);
        jsonList = super.convertDBToHeader(jsonList);

        let promise = Promise.resolve(null);
        for(let i = 0; i < jsonList.length; i++) {
            promise = promise.then(function(res) {
                return db.execSingleQuery("SELECT num FROM formula WHERE id = $1", [jsonList[i]['FormulaID']])
                .then(function(result) {
                    jsonList[i]["Formula#"] = result.rows[0].num;
                    delete jsonList[i]['FormulaID'];
                });
            })
            .then(function(res) {
                return db.execSingleQuery("select shortname from manufacturing_line_sku inner join manufacturing_line on id = manufacturing_line_id where sku_id = $1", [jsonList[i].SkuID])
                .then(function(res) {
                    let shortnames = "";
                    for(let j = 0; j < res.rows.length; j++) {
                        shortnames += res.rows[j].shortname;
                        if(j !== res.rows.length - 1)
                            shortnames +=  ",";
                    }
                    jsonList[i]["ML Shortnames"] = shortnames;
                    delete jsonList[i].SkuID;
                });
            });
        }

        //console.log(jsonList);
        return promise.then(function(res) {
            cb(formatter.generateFormat(jsonList));
        });
    }

    bulkAcceptInsert(rows, cb) {
        let table = this.tableName;
        let that = this;
        db.getSingleClient()
        .then(function(client) {
            let error = false;
            let errMsgs = [];
            let prom = client.query("BEGIN");
            let updates = 0;
            let inserts = 0;
            let line_sku = [];
            for(let i = 0; i < rows.length; i++) {
                let update = rows[i].update;
                delete rows[i].update;
                let ids = rows[i].manufacturing_line_id;
                delete rows[i].manufacturing_line_id;
                let query = "";
                if(update) {
                    updates++;
                    query = that.conflictUpdate(rows[i]);
                }
                else {
                    inserts++;
                    query = QueryGenerator.genInsQuery(rows[i], table).returning("*").toString();
                }
                //logger.debug("QUERY: " + query);
                prom = prom.then(function(r) {
                    return client.query(query).
                        then(function(res) {
                            for(let j = 0; j < ids.length; j++) {
                                line_sku.push({
                                    sku_id: res.rows[0].id,
                                    manufacturing_line_id: ids[j]
                                });
                            }
                        }).catch(function(err) {
                        error = true;
                        errMsgs.push(err);
                        //logger.debug("found error.");
                        client.query("ROLLBACK");
                    });
                });
            }

            prom.then(function(r) {
                if(error) {
                    //logger.debug("there's an error, rolling back");
                    client.query("ROLLBACK");
                    client.query("ABORT");
                    client.release();
                    cb(that.generateErrorResult(errMsgs));
                }
                else {
                    if(line_sku.length === 0) {
                        client.query("COMMIT")
                        .then(function(res) {
                            client.release();
                            cb({
                                updates: updates,
                                inserts: inserts
                            });
                        });
                       return; 
                    }
                    //logger.debug("No errors, committing transaction");
                    let query = QueryGenerator.genInsConflictQuery(line_sku, 'manufacturing_line_sku', 'ON CONFLICT DO NOTHING').toString();
                    client.query(query)
                    .then(function(res) {
                        client.query("COMMIT")
                        .then(function(res) {
                            client.release();
                            cb({
                                updates: updates,
                                inserts: inserts
                            });
                        });
                    })

                }
            });
        });
    }

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    generateRandomUPC(){
        let randomElevenDigit = 10000000000 + Math.random() * (9999999999 - 1000000000) + 1000000000;
        return Math.floor(randomElevenDigit*10 + this.generateUPCCheckDigit(randomElevenDigit))
    }

    generateUPCCheckDigit(num){
        let numString = String(num)
        let total = (parseInt(numString[0]) + parseInt(numString[2]) + parseInt(numString[4]) + parseInt(numString[6]) + parseInt(numString[8]) + parseInt(numString[10]))*3 + (parseInt(numString[1]) + parseInt(numString[3]) + parseInt(numString[5])  + parseInt(numString[7]) + parseInt(numString[9]))
        return 10 - (total % 10)
    }

    generateRandomNum(){
        return Math.floor(Math.random() * (9999999999 - 0));
    }


    initializeSKU(){
        let numQuery = "SELECT num, case_upc, unit_upc FROM sku"
        let formulaQuery = "SELECT name, id FROM formula"
        let manLineQuery = "SELECT id, shortname FROM manufacturing_line"
        let prodLineQuery = "SELECT name, id FROM productline"
        let formulas = []
        let manlines = []
        let prodlines = []
        let num = this.generateRandomNum()
        let case_upc = this.generateRandomUPC()
        let unit_upc = this.generateRandomUPC()
        this.generateRandomUPC()
        let that = this
        return db.execSingleQuery(numQuery, [])
        .then(function(res){
            console.log(res.rows)
            const numSet = new Set()
            const caseUPCSet = new Set()
            const unitUPCSet = new Set()
            for(var i = 0; i < res.rows.length; i++){
                numSet.add(res.rows[i].num)
                caseUPCSet.add(res.rows[i].case_upc)
                unitUPCSet.add(res.rows[i].unit_upc)
            }
            while(true){
                if(!numSet.has(num)){
                    break
                }
                num = that.generateRandomNum()
            }
            while(true){
                if(!caseUPCSet.has(case_upc)){
                    break
                }
                case_upc = that.generateRandomUPC()
            }
            while(true){
                if(!unitUPCSet.has(unit_upc)){
                    break
                }
                unit_upc = that.generateRandomUPC()
            }
            console.log(num)
            console.log(case_upc)
            console.log(unit_upc)
        })
        .then(function(){
            return db.execSingleQuery(formulaQuery, [])
                .then(function(res){
                console.log(res.rows)
                formulas = res.rows.map(item => {
                    return {
                        label: item.name,
                        id: item.id
                    }
                })
            })
        })
        .then(function(){
            return db.execSingleQuery(manLineQuery, [])
                .then(function(res){
                console.log(res.rows)
                manlines = res.rows.map(item => {
                    return {
                        label: item.shortname,
                        id: item.id
                    }
                })
            })
        })
        .then(function(){
            return db.execSingleQuery(prodLineQuery, [])
                .then(function(res){
                console.log(res.rows)
                prodlines = res.rows.map(item => {
                    return {
                        label: item.name,
                        id: item.id
                    }
                })
            })
        })
        .then(function(){
            return {
                num: num,
                case_upc: case_upc,
                unit_upc: unit_upc,
                formulas: formulas,
                prod_lines:prodlines,
                man_lines:manlines
            }
        })


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
            if(that.duplicateObjs(rows)) {
                return cb({ errors: [ 
                            { 
                                detail: "Duplicate rows in file."
                            }
                        ]
                    });
            }

            return db.getSingleClient()
            .then(function(client) {
                let abort = false;
                let error = false;
                let errMsgs = [];
                let prom = client.query("BEGIN");
                let line_sku = [];
                let rowsCopy = JSON.parse(JSON.stringify(rows));
                console.log(rows);
                for(let i = 0; i < rows.length; i++) {
                    delete rowsCopy[i].formula_num;
                    delete rowsCopy[i].shortname;
                    rowsCopy[i].manufacturing_line_id = [];
                    prom = prom.then(function(r) {
                        return that.checkExisting(rows[i])
                        .then(function(row_nums) {
                            let count = parseInt(row_nums.rows[0].count);
                            if(count > 1) {
                                rows[i].ambiguous = true;
                                errMsgs.push({
                                    code: "23505",
                                    detail: "Ambiguous record in row " + i
                                });
                                error = true;
                                abort = true;
                                return false;
                            }
                            return true;
                        })
                        .then(function(quer) {

                            if(!quer)
                                return false;
                            return client.query("SELECT id FROM formula WHERE formula.num = $1 ", [rows[i].formula_num])
                            .then(function(res) {
                                if(res.rows.length === 0) {
                                    rows[i].formula_id = null;
                                    error = true;
                                    abort = true;
                                    errMsgs.push({
                                        code: "23503",
                                        detail: "formula number " + rows[i].formula_num + " doesnt exist"
                                    });
                                    return false;
                                }
                                rows[i].formula_id = res.rows[0].id;
                                rowsCopy[i].formula_id = res.rows[0].id;
                                return true;
                            })
                            .then(function(res) {
                                console.log(rows[i]);
                                let shortnames = (rows[i].shortname) ? rows[i].shortname.split(/[ ,]+/) : [];
                                if(shortnames.length === 1 && shortnames[0].length === 0)
                                    shortnames = [];
                                let shortPromises = Promise.resolve(null);
                                for(let j = 0; j < shortnames.length; j++) {
                                    shortPromises = shortPromises.then(function(res) {
                                        return client.query("SELECT id FROM manufacturing_line WHERE shortname = $1", [shortnames[j]])
                                        .then(function(res) {
                                            if(res.rows.length === 0) {
                                                error = true;
                                                abort = true;
                                                errMsgs.push({
                                                    code: "23503",
                                                    detail: "manufacturing shortname " + shortnames[j] + " doesnt exist"
                                                });
                                                return false;
                                            }
                                            rowsCopy[i].manufacturing_line_id.push(res.rows[0].id);
                                            return res.rows[0].id;
                                        })
                                    });
                                }
                                return shortPromises.then(function(id) {
                                delete rows[i].formula_num;
                                delete rows[i].shortname;
                                let query = QueryGenerator.genInsQuery(rows[i], table).returning("*").toString();
                                console.log(query);
                                            return client.query("SAVEPOINT point" + i).then(function(res) {
                                                return client.query(query).then(function(res) {
                                                    let sku_id = res.rows[0].id;
                                                    for(let x = 0; x < rowsCopy[i].manufacturing_line_id.length; x++) {
                                                        line_sku.push({
                                                            sku_id: sku_id,
                                                            manufacturing_line_id: rowsCopy[i].manufacturing_line_id[x]
                                                        });
                                                    }

                                                }).catch(function(err) {
                                                    error = true;
                                                    errMsgs.push(err);
                                                    rowsCopy[i].update = true;
                                                    client.query("ROLLBACK TO SAVEPOINT point" + i);
                                                });
                                            });
                                        })
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
                        if(line_sku.length === 0) {
                            client.query("COMMIT")
                            .then(function(res) {
                                client.release();
                            });
                           return; 
                        }
                        let query = QueryGenerator.genInsConflictQuery(line_sku, 'manufacturing_line_sku', 'ON CONFLICT DO NOTHING').toString();
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

module.exports = SKU;
