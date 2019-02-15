const db = require("./db");
const fs = require('fs')
const copyFrom = require('pg-copy-streams').from;
const CRUD = require("./CRUD");
const squel = require("squel").useFlavour('postgres');
const QueryGenerator = require("./query_generator");
const Filter = require('./filter');
const Ingredient = require('./ingredient');

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
            "Formula#": "formula_id", //TODO FIX THIS
            "Formula factor": "formula_scale",
            "Rate": "man_rate"
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

    getSKUNumIfExists(id) {
        return db.execSingleQuery("SELECT num FROM sku WHERE id=$1", [id]).then(function(res) {
            if(res.rows.length == 0)
                return Promise.reject("This SKU does not exist.");
            return res.rows[0].num;
        });
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

        const queryGen = new QueryGenerator(q);
        names = QueryGenerator.transformQueryArr(names);
        queryGen.chainAndFilter(names, "sku.name LIKE ?")
        .chainOrFilter(ingredients, "formula_ingredients.ingredients_id=?")
        .chainOrFilter(productlines, "sku.prd_line=?")
        .makeDistinct();
        let queryStr = filter.applyFilter(queryGen.getQuery()).toString();
        console.log(queryStr);
        //logger.debug(queryStr);
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
        if(!dataObj.name || !dataObj.case_upc || !dataObj.unit_upc || !dataObj.unit_size || !dataObj.count_per_case || !dataObj.prd_line || !dataObj.formula_id || !dataObj.man_rate) {
            return Promise.reject("Not all required fields are present.");
        }
        if(dataObj.num === null || dataObj.num === undefined)
            delete dataObj.num;

        let query = QueryGenerator.genInsQuery(dataObj, this.tableName).returning("*").toString();
        //logger.debug(query);
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

const sku = new SKU();
console.log(sku.convertHeaderToDB([
    {
        "SKU#": "num",
        "Name": "name",
        "Case UPC": "case_upc",
        "Unit UPC": "unit_upc",
        "Unit size": "unit_size",
        "Count per case": "count_per_case",
        "PL Name": "prd_line",
        "Comment": "comments"
    },
    {
        "SKU#": "num",
        "Name": "name",
        "Case UPC": "case_upc",
        "Unit UPC": "unit_upc",
        "Unit size": "unit_size",
        "Count per case": "count_per_case",
        "PL Name": "prd_line",
        "Comment": "comments"
    }
]));
module.exports = SKU;
