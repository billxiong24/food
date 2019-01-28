const db = require("./db");
const squel = require("squel").useFlavour("postgres");
const CRUD = require("./CRUD");

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
}

//const mg = new ManufacturingGoals();
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
