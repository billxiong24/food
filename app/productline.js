const db = require('./db');
const CRUD = require("./CRUD");
const squel = require("squel").useFlavour("postgres");

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
        if(!dataObj.name) {
            return Promise.reject("Must include valid name for product line.");
        }

        let query = squel.insert()
        .into(this.tableName)
        .setFieldsRows([dataObj]).toString();
        return super.insert(query, dataObj, "Error creating product line: product line exists.");
    }

    update(dataObj, id) {
        return super.change(dataObj, id, "id");
    }

    search(name) {
        name = "%" + name + "%";
        return db.execSingleQuery("SELECT * FROM " + this.tableName + " WHERE name LIKE $1", [name]);
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
}

const p = new ProductLine();

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
