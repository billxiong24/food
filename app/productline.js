const db = require('./db');
const CRUD = require("./CRUD");

class ProductLine extends CRUD {

    constructor() {
        super();
        this.tableName = "productline";
    }

    checkExisting(dataObj) {
        if(!dataObj.name) {
            return Promise.reject("Bad productline name.");
        }

        let query = "SELECT * FROM " + this.tableName + " WHERE name=$1";
        return db.execSingleQuery(query, [dataObj.name]);
    }

    create(dataObj) {
        let query = "INSERT INTO " + this.tableName + " (name) VALUES ($1)";
        return super.insert(query, dataObj, "Error creating product line: product line exists.");
    }

    update(dataObj, oldPrimaryKey) {
        return super.change(dataObj, oldPrimaryKey, "name");
    }

    search(name) {
        name = "%" + name + "%";
        return db.execSingleQuery("SELECT * FROM " + this.tableName + " WHERE name LIKE $1", [name]);
    }

    remove(name) {
        //if SKUs have this product line, we should not be able to remove it
        return db.execSingleQuery("SELECT * FROM sku  WHERE sku.prd_line=$1 LIMIT 1", [name])
        .then((res)=> {
            if(res.rows.length > 0) {
                return Promise.reject("Cannot remove " + name + ": SKU's are assigned to this product line.");
            }
            return res;
        })
        .then((res)=> {
            //verify that no SKUs depend on this product line
            return db.execSingleQuery("DELETE FROM " + this.tableName + " WHERE name=$1", [name]);
        });
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
    //name: "prod4"
//})
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//});
module.exports = ProductLine;
