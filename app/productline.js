const db = require('./db');
const CRUD = require("./CRUD");
const squel = require("squel").useFlavour("postgres");
const QueryGenerator = require("./query_generator");
const Filter = require('./filter');

class ProductLine extends CRUD {

    constructor() {
        super();
        this.tableName = "productline";
    }

    checkExisting(dataObj) {
        if(!dataObj.name) {
            return Promise.reject("Bad productline name.");
        }

        let query = "SELECT COUNT(*) FROM " + this.tableName + " WHERE name=$1";
        return db.execSingleQuery(query, [dataObj.name]);
    }

    create(dataObj) {
        if(!dataObj.name) {
            return Promise.reject("Must include valid name for product line.");
        }

        let query = QueryGenerator.genInsQuery(dataObj, this.tableName).toString();
        return super.insert(query, dataObj, "Error creating product line: product line exists.");
    }

    update(dataObj, id) {
        return super.change(dataObj, id, "id");
    }

    search(names, filter) {
        names = QueryGenerator.transformQueryArr(names);
        let query = squel.select()
        .from(this.tableName)
        .field("*, COUNT(*) OVER() as row_count");

        const queryGen = new QueryGenerator(query);
        queryGen.chainAndFilter(names, "name LIKE ?");
        let queryStr = filter.applyFilter(queryGen.getQuery()).toString();
        console.log(queryStr);
        return db.execSingleQuery(queryStr, []);
    }

    remove(id) {
        //if SKUs have this product line, we should not be able to remove it
        return db.execSingleQuery("SELECT * FROM sku WHERE prd_line=(SELECT name FROM productline WHERE id=$1) LIMIT 1", [id])
        .then((res)=> {
            if(res.rows.length > 0) {
                return Promise.reject("Cannot remove " + id + ": SKU's are assigned to this product line.");
            }
            return res;
        })
        .then((res)=> {
            //verify that no SKUs depend on this product line
            return db.execSingleQuery("DELETE FROM " + this.tableName + " WHERE id=$1", [id]);
        });
    }

    duplicateObjs(jsonList) {
        return super.checkDuplicateInObject('name', jsonList); 
    }

    conflictUpdate(dataObj) {
        let q = super.getUpdateQueryObj(dataObj);
        let expr = squel.expr();
        expr = expr.or("name= ?", dataObj.name);
        q = q.where(expr);
        q = q.toString();
        return q;
    }
}

//const p = new ProductLine();

//p.update({
    //name: "wagdfivby"
//}, "prod188")
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//});

//p.remove("prod6")
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//});

//p.create({
    //name: "prod44"
//})
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//});
module.exports = ProductLine;
