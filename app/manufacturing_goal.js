const db = require("./db");
const squel = require("squel").useFlavour("postgres");
const CRUD = require("./CRUD");
const Sku = require('./sku');
const Formatter = require('./formatter');

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

    addSkus(manufacturing_id, skus) {
        for(let i = 0; i < skus.length; i++) {
            let obj = skus[i];
            if(!obj.sku_id || !obj.quantity)
                return promise.reject("sku does not have id or quantity");
            obj.mg_id = manufacturing_id;
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
        .setFieldsRows(skus)
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

   calculateQuantities(manufacturing_id, format='json') {
       //let query = "SELECT ingredients.* (sku_ingred.quantity * manufacturing_goal_sku.quantity) AS calc_res FROM manufacturing_goal_sku INNER JOIN sku ON sku.id = manufacturing_goal_sku.sku_id INNER JOIN sku_ingred ON sku.num=sku_ingred.sku_num INNER JOIN ingredients ON sku_ingred.ingred_num=ingredients.num WHERE mg_id = $1";
       let query = squel.select()
       .from("manufacturing_goal_sku")
       .field("ingredients.*, SUM((sku_ingred.quantity * manufacturing_goal_sku.quantity)) AS calc_res")
       .join("sku", null, "sku.id = manufacturing_goal_sku.sku_id")
       .join("sku_ingred", null, "sku.num = sku_ingred.sku_num")
       .join("ingredients", null, "sku_ingred.ingred_num = ingredients.num")
       .where("mg_id = ?", manufacturing_id)
       .group("ingredients.id")
       .toString();
       //console.log(query);
       return db.execSingleQuery(query, []);
   }

    exportFile(jsonList, format) {
        const formatter = new Formatter(format);
        return formatter.generateFormat(jsonList);
    }
}


//const mg = new ManufacturingGoals();
//mg.calculateQuantities(7)
//.then(function(res) {
    ////console.log(res.rows);
    //const formatter = new Formatter('csv');
    //formatter.generateFormat(res.rows);
//})
//.catch(function(er) {
    //console.log(er);
//});
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
