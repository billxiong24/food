const db = require("./db");
const squel = require("squel").useFlavour("postgres");
const CRUD = require("./CRUD");
const Sku = require('./sku');

class ManufacturingGoals extends CRUD {
    constructor() {
        super();
        this.tableName = "manufacturing_goal";
    }

    checkExisting(dataObj) {
        let query = "SELECT * FROM " + this.tableName + " WHERE user_id = $1 AND name = $2";
        return db.execSingleQuery(query, [dataObj.user_id, dataObj.name]);
    }

    create(dataObj) {
        if(!dataObj.user_id || !dataObj.name) {
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

    getSkus(manufacturing_id) {
        let query = "SELECT sku.* FROM manufacturing_goal_sku INNER JOIN sku ON sku.id = manufacturing_goal_sku.sku_id WHERE manufacturing_goal_sku.mg_id = $1";
        return db.execSingleQuery(query, [manufacturing_id]);
    }

    addSkus(manufacturing_id, sku_ids) {
        let arr = [];
        for(let i = 0; i < sku_ids.length; i++) {
            let obj = {};
            obj.mg_id = manufacturing_id;
            obj.sku_id = sku_ids[i];
            arr.push(obj);
        }
        squel.onConflictInsert = function(options) {
          return squel.insert(options, [
              new squel.cls.StringBlock(options, 'INSERT'),
              new squel.cls.IntoTableBlock(options),
              new squel.cls.InsertFieldValueBlock(options),
              new squel.cls.WhereBlock(options),
              new squel.cls.StringBlock(options, 'ON CONFLICT DO NOTHING')
            ]);
        };

        let query = squel.onConflictInsert()
        .into('manufacturing_goal_sku')
        .setFieldsRows(arr)
        .toString();
        return db.execSingleQuery(query, []);
    }

    removeSkus(manufacturing_id, sku_ids) {
        let expr = squel.expr();
        for(let i = 0; i < sku_ids.length; i++) {
            expr = expr.or("sku_id = ?", sku_ids[i]);
        }
        
        let query = squel.delete()
        .from("manufacturing_goal_sku")
        .where("mg_id =?", manufacturing_id)
        .where(
            expr
        ).toString();
        return db.execSingleQuery(query, []);
    }

   calculateQuantities(user_id, sku_id) {

   }
}


//const mg = new ManufacturingGoals();
//mg.removeSkus(4, [2, 3, 5])
//.then(function(res) {
    //console.log(res);
//});
//mg.getSkus(5)
//.then(function(res) {
    //console.log(res.rows);
//});
//mg.addSkus(4, [2, 3, 5, 6])
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//});
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
