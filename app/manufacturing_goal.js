const db = require("./db");
const squel = require("squel").useFlavour("postgres");
const CRUD = require("./CRUD");
const Sku = require('./sku');
const Formatter = require('./formatter');
const QueryGenerator = require("./query_generator");

class ManufacturingGoals extends CRUD {
    constructor() {
        super();
        this.tableName = "manufacturing_goal";
    }

    checkExisting(dataObj) {
        let query = "SELECT COUNT(*) FROM " + this.tableName + " WHERE user_id = $1 AND name = $2";
        return db.execSingleQuery(query, [dataObj.user_id, dataObj.name]);
    }

    create(dataObj) {
        if(!dataObj.user_id || !dataObj.name) {
            return Promise.reject("Not all required fields are present");
        }
        let query = QueryGenerator.genInsQuery(dataObj, this.tableName).returning("*").toString();
        //logger.debug(query);
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
        let query = "SELECT sku.*, manufacturing_goal_sku.quantity FROM manufacturing_goal_sku INNER JOIN sku ON sku.id = manufacturing_goal_sku.sku_id WHERE manufacturing_goal_sku.mg_id = $1";
        return db.execSingleQuery(query, [manufacturing_id]);
    }

    addSkus(manufacturing_id, skus) {
        for(let i = 0; i < skus.length; i++) {
            let obj = skus[i];
            if(!obj.sku_id || !obj.quantity)
                return Promise.reject("SKU does not have id or quantity");
            obj.mg_id = manufacturing_id;
        }
        let query = QueryGenerator.genInsConflictQuery(skus, 'manufacturing_goal_sku',  'ON CONFLICT (mg_id, sku_id) DO UPDATE SET quantity = EXCLUDED.quantity');
        query = query.toString();
        //logger.debug(query);
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

   calculateQuantities(manufacturing_id, useUnits = true) {
       let field = "";
       if(useUnits)
           field = "ingredients.*, formula_ingredients.unit as formula_unit, SUM((manufacturing_goal_sku.quantity * sku.formula_scale * formula_ingredients.quantity)) AS calc_res";
       else
           field = "ingredients.*, formula_ingredients.unit as formula_unit, SUM((manufacturing_goal_sku.quantity * sku.formula_scale * formula_ingredients.quantity/ingredients.pkg_size)) AS calc_res";
true 
       //TODO perform unit conversions
       let query = squel.select()
       .from("manufacturing_goal_sku")
       .field(field)
       .join("sku", null, "sku.id = manufacturing_goal_sku.sku_id")
       .join("formula_ingredients", null, "sku.formula_id = formula_ingredients.formula_id")
       .join("ingredients", null, "ingredients.id = formula_ingredients.ingredients_id")
       .where("mg_id = ?", manufacturing_id)
       .group("ingredients.id")
       .group("formula_ingredients.unit")
       .toString();
       return db.execSingleQuery(query, []);
   }
}


module.exports = ManufacturingGoals;
