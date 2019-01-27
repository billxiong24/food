const db = require("./db");
const CRUD = require("./CRUD");
const squel = require("squel").useFlavour('postgres');

class SKU extends CRUD {

    constructor() {
        super();
        this.tableName = "sku";
    
    }

    //override
    checkExisting(obj) {
        let num = obj.num;
        let case_upc = obj.case_upc;
        if(num && case_upc) {
            return db.execSingleQuery("SELECT case_upc FROM " + this.tableName + " WHERE case_upc = $1 OR num = $2", [case_upc, num]);
        }
        else if(case_upc){
            return db.execSingleQuery("SELECT case_upc FROM " + this.tableName + " WHERE case_upc = $1", [case_upc]);
        }
        else if(num) {
            return db.execSingleQuery("SELECT case_upc FROM " + this.tableName + " WHERE num= $1", [num]);
        }
        
        return Promise.reject("No valid name or num provided.");
    } 

    getSKUNumIfExists(id) {
        return db.execSingleQuery("SELECT num FROM sku WHERE id=$1", [id]).then(function(res) {
            if(res.rows.length == 0)
                return Promise.reject("This SKU does not exist.");
            return res.rows[0].num;
        });
    }

    //when creating sku, we want to add ingredients.
    addIngredients(id, ingredients) {
        let query = "";
        return this.getSKUNumIfExists(id)
        .then(function(sku_num) {
            for(let i = 0; i < ingredients.length; i++) {
                let obj = ingredients[i];
                if(!obj.ingred_num || !obj.quantity)
                    return Promise.reject("Ingredient does not have number or quantity");
                obj.sku_num = sku_num;
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

            query = squel.onConflictInsert()
            .into('sku_ingred')
            .setFieldsRows(ingredients)
            .toString();
        })
        .then(function(res) {
            return db.execSingleQuery(query, []);
        });
    }

    removeIngredients(id, ingreds) {
        //let query = "DELETE FROM sku_ingred WHERE case_upc=$1 AND ingred_num=$2";
        return this.getSKUNumIfExists(id)
        .then(function(res) {
            let expr = squel.expr();
            for(let i = 0; i < ingreds.length; i++) {
                expr = expr.or("ingred_num = ?", ingreds[i]);
            }
            let query = squel.delete()
            .from("sku_ingred")
            .where("sku_num=?", res)
            .where(
                expr
            ).toString();
            return db.execSingleQuery(query, []);
        });
    }

    getIngredients(id) {
        let query = "SELECT DISTINCT ingredients.* FROM sku INNER JOIN sku_ingred ON sku.num = sku_ingred.sku_num INNER JOIN ingredients ON sku_ingred.ingred_num=ingredients.num WHERE sku.id=$1";
        return db.execSingleQuery(query, [id]);
    }

    //TODO use squel to generate this query
    search(searchQuery, ingredients, productlines) {
        searchQuery = "%" + searchQuery + "%";
        //let query = "SELECT DISTINCT sku.* FROM sku LEFT JOIN sku_ingred ON sku.num = sku_ingred.sku_num LEFT JOIN ingredients ON sku_ingred.ingred_num=ingredients.num WHERE sku.name LIKE $1";

        let q = squel.select()
        .from(this.tableName)
        .field("sku.*")
        .left_join("sku_ingred", null, "sku.num=sku_ingred.sku_num")
        .left_join("ingredients", null, "sku_ingred.ingred_num=ingredients.num")
        .where("sku.name LIKE ? ", searchQuery);
        if(ingredients.length > 0) {
            let expr = squel.expr();
            for(let i = 0; i < ingredients.length; i++) {
                expr = expr.or("ingredients.name=?",ingredients[i]);
            }
            q = q.where(
                expr
            );
        }
        if(productlines.length > 0) {
            let expr = squel.expr();
            for(let i = 0; i < productlines.length; i++) {
                expr = expr.or("sku.prd_line=?",productlines[i]);
            }
            q = q.where(
                expr
            );
        }
        q = q.distinct().toString();

        //if(ingredients.length > 0)
            //query += " AND ("
        //let count = 1;

        //for(let i = 0; i < ingredients.length; i++) {
        
            //query += "ingredients.name=$" + (i + 2); 
            //if(i == ingredients.length - 1) {
                //query += ")";
            //}
            //else {
                //query += " OR ";
            //}

            //count++;
        //}

        //if(productlines.length > 0)
            //query += " AND (";

        //for(let i = 0; i < productlines.length; i++) {
            //count++;
            //query += "sku.prd_line=$" + (count); 
            //if(i == productlines.length - 1) {
                //query += ")";
            //}
            //else {
                //query += " OR ";
            //}
        //}
        //ingredients.unshift(searchQuery);
        //let arr = ingredients.concat(productlines);
        return db.execSingleQuery(q);
    }

    checkProductLineExists(name) {
        return db.execSingleQuery("SELECT * FROM productline WHERE productline.name = $1", [name]).then((res) => {
            if(res.rows.length == 0) {
                return Promise.reject("Product line does not exist.");
            }
            return res;
        });
    }

    create(dataObj) {
        if(!dataObj.name || !dataObj.case_upc || !dataObj.unit_upc || !dataObj.unit_size || !dataObj.count_per_case || !dataObj.prd_line) {
            return Promise.reject("Not all required fields are present.");
        }

        let query = squel.insert()
        .into(this.tableName)
        .setFieldsRows([dataObj]).toString();

        //product line must exist
        return this.checkProductLineExists(dataObj.prd_line)
        .then((res) => {
            return super.insert(query, dataObj, "That SKU entry exists already.");
        });
    }

    update(dataObj, id) {
        if(!dataObj.prd_line) {
            return super.change(dataObj, id, "id");
        }
        else {
            return this.checkProductLineExists(dataObj.prd_line)
            .then((res) => {
                return super.change(dataObj, id, "id");
            });
        }
    }

    remove(id) {
        if(!id) {
            return Promise.reject("Bad num.");
        }
        return db.execSingleQuery("DELETE FROM " + this.tableName + " WHERE id = $1", [id]);
    }
}

//const sku = new SKU();

//sku.removeIngredient(5043, 44).then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//});

//sku.search("sku2", [], ["prod69"]).then(function(res) {
    //console.log(res.rows);
//})
//.catch(function(err) {
    //console.log(err);
//});
//sku.addIngredients(23116, [
    //{
        //ingred_num: 49,
        //quantity: 12
    //},
    //{
        //ingred_num: 563,
        //quantity: 15.4
    //},
    //{
        //ingred_num: 56633,
        //quantity: 599.3
    //},
    //{
        //ingred_num: 1415,
        //quantity: 599.3
    //}
//])
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
//})

//sku.create({
    //name: "sku723", 
    //case_upc: 233, 
    //unit_upc: 65653, 
    //unit_size: "12 lbs", 
    //count_per_case: 998,
    //prd_line: "prod4",
    //comments: "commentingg"
//})
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//});

//sku.update({
    //name: "sku1", 
    //num: 12, 
    //case_upc: 2449, 
    //unit_upc: 112553, 
    //unit_size: "10 lbs", 
    //count_per_case: 4,
    //prd_line: "prod4",
    //comments: "a comment"
//}, 12)
//.then(function(res) {
    //console.log(res);
    //console.log("this is a result");
//})
//.catch(function(err) {
    //console.log(err);
//});


module.exports = SKU;
