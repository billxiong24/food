const db = require("./db");
const CRUD = require("./CRUD");
const squel = require("squel").useFlavour('postgres');
const QueryGenerator = require("./query_generator");
const Filter = require('./filter');
const Ingredient = require('./ingredient');

class ManufacturingLine extends CRUD {

    constructor() {
        super();
        this.tableName = "manufacturing_line";
    }

    search(name, filter) {
        name = '%' + name + '%';
        let query = squel.select()
        .from(this.tableName)
        .field("*");
        let expr = squel.expr();
        expr = expr.or("name LIKE ?", name);
        expr = expr.or("shortname LIKE ?", name);
        query = query.where(expr);
        let queryStr = filter.applyFilter(query).toString();
        return db.execSingleQuery(queryStr, []);
    }

    getSkus(id) {
        let query = squel.select()
        .from("sku")
        .field("sku.*")
        .join("manufacturing_line_sku", null, "sku_id = id")
        .where("manufacturing_line_id = ? ", id)
        .distinct()
        .toString();
        return db.execSingleQuery(query, []);
    }

    addSkus(id, skus) {
        let arr = [];
        for(let i = 0; i < skus.length; i++) {
            let obj = {};
            arr.push({
                manufacturing_line_id: id, 
                sku_id: skus[i]
            });
        }

        let query = QueryGenerator.genInsConflictQuery(arr, 'manufacturing_line_sku', 'ON CONFLICT DO NOTHING').toString();
        console.log(query);
        return db.execSingleQuery(query, []);
    }

    checkExisting(dataObj) {
        return db.execSingleQuery("SELECT COUNT(*) FROM " + this.tableName + " WHERE shortname = $1", [dataObj.shortname]);
    }

    create(dataObj) {
        if(!dataObj.name || !dataObj.shortname)
            return Promise.reject("Not all required fields are present.");

        let query = QueryGenerator.genInsQuery(dataObj, this.tableName).returning("*").toString();
        return super.insert(query, dataObj, "That entry exists already.");
    }

    update(dataObj, id) {
        return super.change(dataObj, id, "id");
    }

    remove(id) {
        return db.execSingleQuery("DELETE FROM " + this.tableName + " WHERE id = $1", [id]);
    }
};

module.exports = ManufacturingLine;
