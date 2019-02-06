const db = require("./db");
const fs = require('fs')
const copyFrom = require('pg-copy-streams').from;
const CRUD = require("./CRUD");
const squel = require("squel").useFlavour('postgres');
const QueryGenerator = require("./query_generator");
const Filter = require('./filter');
const csv=require('csvtojson');

class SKU extends CRUD {

    constructor() {
        super();
        this.tableName = "sku";
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

    getSKUNumIfExists(id) {
        return db.execSingleQuery("SELECT num FROM sku WHERE id=$1", [id]).then(function(res) {
            if(res.rows.length == 0)
                return Promise.reject("This SKU does not exist.");
            return res.rows[0].num;
        });
    }

    //when creating sku, we want to add ingredients.
    addIngredients(id, ingredients) {
        let query = "";
        return this.getSKUNumIfExists(id)
        .then(function(sku_num) {
            for(let i = 0; i < ingredients.length; i++) {
                let obj = ingredients[i];
                if(!obj.ingred_num || !obj.quantity)
                    return Promise.reject("ingredient does not have number or quantity");
                obj.sku_num = sku_num;
            }

            query = QueryGenerator.genInsConflictQuery(ingredients, 'sku_ingred',  'ON CONFLICT (sku_num, ingred_num) DO UPDATE SET quantity = EXCLUDED.quantity');
            query = query.toString();
            console.log(query);
        })
        .then(function(res) {
            return db.execSingleQuery(query, []);
        });
    }

    removeIngredients(id, ingreds) {
        return this.getSKUNumIfExists(id)
        .then(function(res) {
            let query = squel.delete()
            .from("sku_ingred")
            .where("sku_num=?", res);
            const queryGen = new QueryGenerator(query);
            queryGen.chainOrFilter(ingreds, "ingred_num = ?");
            let queryStr = queryGen.getQuery().toString();
            console.log(queryStr);
            return db.execSingleQuery(queryStr, []);
        });
    }

    getIngredients(id) {
        let query = "SELECT DISTINCT ingredients.*, sku_ingred.quantity FROM sku INNER JOIN sku_ingred ON sku.num = sku_ingred.sku_num INNER JOIN ingredients ON sku_ingred.ingred_num=ingredients.num WHERE sku.id=$1";
        return db.execSingleQuery(query, [id]);
    }

    search(names, ingredients, productlines, filter) {
        let q = squel.select()
        .from(this.tableName)
        .field("sku.*, COUNT(*) OVER() as row_count")
        .left_join("sku_ingred", null, "sku.num=sku_ingred.sku_num")
        .left_join("ingredients", null, "sku_ingred.ingred_num=ingredients.num");

        const queryGen = new QueryGenerator(q);
        names = QueryGenerator.transformQueryArr(names);
        queryGen.chainAndFilter(names, "sku.name LIKE ?")
        .chainOrFilter(ingredients, "ingredients.name=?")
        .chainOrFilter(productlines, "sku.prd_line=?")
        .makeDistinct();
        let queryStr = filter.applyFilter(queryGen.getQuery()).toString();
        console.log(queryStr);
        return db.execSingleQuery(queryStr, []);
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
        if(!dataObj.name || !dataObj.case_upc || !dataObj.unit_upc || !dataObj.unit_size || !dataObj.count_per_case || !dataObj.prd_line) {
            return Promise.reject("Not all required fields are present.");
        }
        if(dataObj.num === null || dataObj.num === undefined)
            delete dataObj.num;

        let query = QueryGenerator.genInsQuery(dataObj, this.tableName).returning("id").toString();
        console.log(query);
        //product line must exist
        return this.checkProductLineExists(dataObj.prd_line)
        .then((res) => {
            return super.insert(query, dataObj, "That SKU entry exists already.");
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
        q = q.toString();
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
}
//const sku = new SKU();
//sku.bulkImport("./file.csv", function(err) {
    //if(err) {
        //console.log(err);
    //}
//});

//sku.removeIngredient(5043, 44).then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//});

//sku.search(["sku2"], [], ["prod69"]).then(function(res) {
    //console.log(res.rows);
//})
//.catch(function(err) {
    //console.log(err);
//});
//sku.addIngredients(23116, [
    //{
        //ingred_num: 49,
        //quantity: 12
    //},
    //{
        //ingred_num: 563,
        //quantity: 15.4
    //},
    //{
        //ingred_num: 56633,
        //quantity: 599.3
    //},
    //{
        //ingred_num: 1415,
        //quantity: 599.3
    //}
//])
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
//})

//sku.create({
    //name: "sku723", 
    //case_upc: 233, 
    //unit_upc: 65653, 
    //unit_size: "12 lbs", 
    //count_per_case: 998,
    //prd_line: "prod4",
    //comments: "commentingg"
//})
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//});

//sku.update({
    //name: "sku1", 
    //num: 12, 
    //case_upc: 2449, 
    //unit_upc: 112553, 
    //unit_size: "10 lbs", 
    //count_per_case: 4,
    //prd_line: "prod4",
    //comments: "a comment"
//}, 12)
//.then(function(res) {
    //console.log(res);
    //console.log("this is a result");
//})
//.catch(function(err) {
    //console.log(err);
//});


module.exports = SKU;
