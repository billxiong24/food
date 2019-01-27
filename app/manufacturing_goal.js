const db = require("./db");
const squel = require("squel").useFlavour("postgres");
const CRUD = require("./CRUD");

class ManufacturingGoals extends CRUD {

    constructor() {
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

    search(name) {

    }
}
