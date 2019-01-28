const db = require("./db");
const squel = require("squel").useFlavour("postgres");
const CRUD = require("./CRUD");
const Sku = require('./sku');

class ManufacturingGoals extends CRUD {
    constructor() {
        super();
        this.tableName = "manufacturing_goals";
    }

    checkExisting(dataObj) {
        let query = "SELECT * FROM " + this.tableName + " WHERE user_id = $1 AND sku_id = $2";
        return db.execSingleQuery(query, [dataObj.user_id, dataObj.sku_id]);
    }

    create(dataObj) {
        if(!dataObj.user_id || !dataObj.sku_id || !dataObj.case_quantity) {
            return Promise.reject("Not all required fields are present");
        }
        let query = squel.insert()
        .into(this.tableName)
        .setFieldsRows([dataObj]).toString();
        return super.insert(query, dataObj, "This goal exists already.");
    }

    update(dataObj, id) {
        return super.change(dataObj, id, "id");
    }

    remove(id) {
        return db.execSingleQuery("DELETE FROM " + this.tableName + " WHERE id = $1", [id]);
    }

    search(user_id) {
        let query = "SELECT * FROM " + this.tableName + " WHERE user_id=$1";
        return db.execSingleQuery(query, [user_id]);
    }

   calculateQuantities(user_id, sku_id) {
        let query = "SELECT sku_num, ingredients.*, quantity * (SELECT case_quantity FROM manufacturing_goals WHERE user_id=$1 AND sku_id=$2) AS result FROM sku_ingred INNER JOIN ingredients ON ingredients.num=ingred_num WHERE sku_num=(SELECT num FROM sku WHERE id=$2)";

        return db.execSingleQuery(query, [user_id, sku_id]);
    }
}

//const mg = new ManufacturingGoals();
//mg.calculateQuantities(6, 5)
//.then(function(res) {
    //console.log(res.rows);
//})
//.catch(function(err) {
    //console.log(err);
//});
//mg.search(43)
//.then(function(res) {
    //console.log(res.rows);

//})
//.catch(function(err) {
    //console.log(err);

//});
//mg.remove(6)
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//});

//mg.update({
    //sku_id: 9,
    //user_id: 7
//}, 6)
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//});

//mg.create({
    //sku_id: 8,
    //user_id: 6,
    //case_quantity: 21
//})
//.then(function(res) {
    //console.log(res);

//})
//.catch(function(err) {
    //console.log(err);

//});

module.exports = ManufacturingGoals;
