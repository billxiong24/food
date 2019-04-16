const db = require("./db"); const squel = require("squel").useFlavour("postgres");
const CRUD = require("./CRUD");
const Sku = require('./sku');
const Formatter = require('./formatter');
const QueryGenerator = require("./query_generator");
const convert = require('convert-units');
const Filter = require('./filter');


class ManufacturingGoals extends CRUD {
    constructor() {
        super();
        this.tableName = "manufacturing_goal";
        this.dbToHeader = {"name": "name"};
        this.headerToDB = {"name": "name"};
        this.unitMap = {
            "ounce": "oz",
            "oz": "oz",
            "lb": "lb",
            "pound": "lb",
            "t": "t",
            "ton": "ton",
            "g": "g",
            "gram": "g",
            "fl-oz": "fl-oz",
            "fluidounce": "fl-oz",
            "pt": "pnt",
            "pint": "pnt",
            "qt": "qt",
            "quart": "qt",
            "gal": "gal",
            "gallon": "gal",
            "milliliter": "ml",
            "ml": "ml",
            "l": "l",
            "liter": "l",
            "count": "count",
            "ct": "count"
        }
    }
    
    //override
    exportFile(jsonList, format, cb=null) {
        console.log(format);
        console.log(jsonList);
        const formatter = new Formatter(format);
        return formatter.generateFormat(jsonList);
    }

    checkExisting(dataObj) {
        let query = "SELECT COUNT(*) FROM " + this.tableName + " WHERE user_id = $1 AND name = $2";
        return db.execSingleQuery(query, [dataObj.user_id, dataObj.name]);
    }



    create(dataObj) {
        if(!dataObj.user_id || !dataObj.name || !dataObj.deadline) {
            return Promise.reject("Not all required fields are present");
        }

        let timestamp = Date.parse(dataObj.deadline);
        if(isNaN(timestamp)) {
            return Promise.reject("Bad date format.");
        }
        dataObj.deadline = timestamp;
        let query = QueryGenerator.genInsQuery(dataObj, this.tableName).returning("*").toString();
        //logger.debug(query);
        return super.insert(query, dataObj, "This goal exists already.");
    }

    update(dataObj, id) {
        dataObj.last_edit = 'NOW()';
        return super.change(dataObj, id, "id");
    }

    remove(id) {
        return db.execSingleQuery("DELETE FROM " + this.tableName + " WHERE id = $1", [id]);
    }

    fetch(filter) {
        let q = squel.select()
        .from(this.tableName)
        .field("manufacturing_goal.*, users.uname")
        .join("users", null, "users.id = user_id")
        const queryGen = new QueryGenerator(q);
        let queryStr = filter.applyFilter(queryGen.getQuery()).toString();
        console.log(queryStr);
        return db.execSingleQuery(queryStr, []);
    }

    

    search(user_id) {
        let query = "SELECT * FROM " + this.tableName + " WHERE user_id=$1";
        return db.execSingleQuery(query, [user_id]);
    }

    searchAll() {
        let query = "SELECT * FROM " + this.tableName;
        return db.execSingleQuery(query, []);
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
        console.log(query);
        //logger.debug(query);
        return db.execSingleQuery(query, [])
        .then(function(res) {
            return db.execSingleQuery("UPDATE manufacturing_goal SET last_edit = NOW() WHERE id = $1", [manufacturing_id])
            .then(function(x) {
                return res;
            })
        });
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

        return db.execSingleQuery(query, [])
        .then(function(res) {
            return db.execSingleQuery("UPDATE manufacturing_goal SET last_edit = NOW() WHERE id = $1", [manufacturing_id])
            .then(function(x) {
                return res;
            })
        });
    }

   calculateQuantities(manufacturing_id, useUnits = true) {
       let field = "";
       //quantity in gallons, lbs, etc
       if(useUnits)
           field = "ingredients.*, formula_ingredients.unit as formula_unit, SUM((manufacturing_goal_sku.quantity * sku.formula_scale * formula_ingredients.quantity)) AS calc_res";
       else  //number of package sizes
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
       let that = this;
       return db.execSingleQuery(query, [])
       .then(function(res) {
           if(useUnits)
               return res;
           //TODO unit conversion
           for(let i = 0; i < res.rows.length; i++) {
               let num = parseFloat(res.rows[i].calc_res);
               if(!useUnits) {
                   let conversion = null;
                   try {
                       conversion = convert(1).from(res.rows[i].formula_unit).to(res.rows[i].unit);
                   }
                   catch(err) {
                       conversion = 1;
                   }
                   num *= conversion;
               }
               res.rows[i].calc_res = num;
           }
           return res;
       })
   }
}


module.exports = ManufacturingGoals;
