const db = require("./db");
const CRUD = require("./CRUD");
const squel = require("squel").useFlavour('postgres');
const QueryGenerator = require("./query_generator");

class Ingredient extends CRUD {

    constructor() {
        super();
        this.tableName = "ingredients";
    }

    //override
    checkExisting(obj) {
        let num = obj.num;
        let name = obj.name;
        if(num && name) {
            return db.execSingleQuery("SELECT COUNT(*) FROM " + this.tableName + " WHERE name = $1 OR num = $2", [name, num]);
        }
        else if(name){
            return db.execSingleQuery("SELECT COUNT(*) FROM " + this.tableName + " WHERE name = $1", [name]);
        }
        else if(num) {
            return db.execSingleQuery("SELECT COUNT(*) FROM " + this.tableName + " WHERE num= $1", [num]);
        }
        
        return Promise.reject("No valid name or num provided.");
    }

    getSkus(id) {
        let query = "SELECT DISTINCT sku.* FROM sku INNER JOIN formula_ingredients ON sku.formula_id = formula_ingredients.formula_id where formula_ingredients.ingredients_id = $1";
        return db.execSingleQuery(query, [id]);
    }

    search(names, skus, filter) {
        let q = squel.select()
        .from(this.tableName)
        .field("ingredients.*, COUNT(*) OVER() as row_count")
        .left_join("formula_ingredients", null, "formula_ingredients.ingredients_id = ingredients.id")
        .left_join("sku", null, "formula_ingredients.formula_id = sku.formula_id");
        const queryGen = new QueryGenerator(q);
        names = QueryGenerator.transformQueryArr(names);
        queryGen.chainAndFilter(names, "ingredients.name LIKE ?")
        .chainOrFilter(skus, "sku.id = ?")
        .makeDistinct();
        let queryStr = filter.applyFilter(queryGen.getQuery()).toString();
        //logger.debug(queryStr);
        //console.log(queryStr);
        return db.execSingleQuery(queryStr, []);
    }


    /**
     * Object should be in the form of
     * {
     *  name: ...
     *  num: ...
     *  vend_info: ...
     *  pkg_size: ...
     *  pkg_cost: ...
     *  comments: ...
     * }
     *
     */
    create(dataObj) {
        if(!dataObj.name || !dataObj.pkg_size || !dataObj.pkg_cost || !dataObj.unit)
            return Promise.reject("Not all required fields are present.");
        if(dataObj.num === null || dataObj.num === undefined)
            delete dataObj.num;

        let query = QueryGenerator.genInsQuery(dataObj, this.tableName).returning("*").toString();
        return super.insert(query, dataObj, "Entry with name or num exists already.");
    }

    update(dataObj, id) {
        return super.change(dataObj, id, "id");
    }
    conflictUpdate(dataObj) {
        let q = super.getUpdateQueryObj(dataObj);
        let expr = squel.expr();
        expr = expr.or("name = ?", dataObj.name);
        if(dataObj.num) {
            expr = expr.or("num = ?", dataObj.num);
        }
        q = q.where(expr);
        q = q.toString();
        return q;
    }

    duplicateObjs(jsonList) {
        let b = super.checkDuplicateInObject('num', jsonList); 
        let c = super.checkDuplicateInObject('name', jsonList); 
        return b || c;
    }

    remove(id) {
        if(!id) {
            return Promise.reject("Bad id.");
        }
        return db.execSingleQuery("DELETE FROM " + this.tableName + " WHERE id = $1", [id]);
    }
}

module.exports = Ingredient;
