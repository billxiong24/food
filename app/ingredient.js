const db = require("./db");
const CRUD = require("./CRUD");
const squel = require("squel").useFlavour('postgres');

class Ingredient extends CRUD {

    constructor() {
        super();
        this.tableName = "ingredients";
    }

    //override
    checkExisting(obj) {
        let num = obj.num;
        let name = obj.name;
        if(num && name) {
            return db.execSingleQuery("SELECT name FROM " + this.tableName + " WHERE name = $1 OR num = $2", [name, num]);
        }
        else if(name){
            return db.execSingleQuery("SELECT name FROM " + this.tableName + " WHERE name = $1", [name]);
        }
        else if(num) {
            return db.execSingleQuery("SELECT name FROM " + this.tableName + " WHERE num= $1", [num]);
        }
        
        return Promise.reject("No valid name or num provided.");
    }

    getSkus(id) {
        let query =  "SELECT DISTINCT sku.* FROM sku INNER JOIN sku_ingred ON sku.num = sku_ingred.sku_num INNER JOIN ingredients ON sku_ingred.ingred_num=ingredients.num WHERE ingredients.id=$1";
        return db.execSingleQuery(query, [id]);
    }

    //TODO use squel to generate this query
    search(searchQuery, skus) {
        searchQuery = "%" + searchQuery + "%";
        //let query = "SELECT DISTINCT ingredients.* FROM sku LEFT JOIN sku_ingred ON sku.num = sku_ingred.sku_num LEFT JOIN ingredients ON sku_ingred.ingred_num=ingredients.num WHERE ingredients.name LIKE $1";

        //if(skus.length > 0)
            //query += " AND ("

        //for(let i = 0; i < skus.length; i++) {
        
            //query += "sku.name=$" + (i + 2); 
            //if(i == skus.length - 1) {
                //query += ")";
            //}
            //else {
                //query += " OR ";
            //}
        //}
        //"select DISTINCT ingredients.* from ingredients LEFT JOIN sku_ingred ON (ingredients.num=sku_ingred.ingred_num) LEFT JOIN sku ON (sku.num=sku_ingred.sku_num) WHERE ingredients.name LIKE '%ing%'"

        let q = squel.select()
        .from('ingredients')
        .field("ingredients.*")
        .left_join("sku_ingred", null, "ingredients.num=sku_ingred.ingred_num")
        .left_join("sku", null, "sku_ingred.sku_num=sku.num")
        .where("ingredients.name LIKE ? ", searchQuery);

        if(skus.length > 0) {
            let expr = squel.expr();
            for(let i = 0; i < skus.length; i++) {
                expr = expr.or("sku.case_upc=?",skus[i]);
            }
            q = q.where(
                expr
            );
        }
        q = q.distinct().toString();

        //skus.unshift(searchQuery);
        //return db.execSingleQuery(query, skus);
        return db.execSingleQuery(q);
    }


    /**
     * Object should be in the form of
     * {
     *  name: ...
     *  num: ...
     *  vend_info: ...
     *  pkg_size: ...
     *  pkg_cost: ...
     *  comments: ...
     * }
     *
     */
    create(dataObj) {
        if(!dataObj.name || !dataObj.pkg_size || !dataObj.pkg_cost)
            return Promise.reject("Not all required fields are present.");

        let query = squel.insert()
        .into(this.tableName)
        .setFieldsRows([dataObj]).toString();
        return super.insert(query, dataObj, "Entry with name or num exists already.");
    }

    update(dataObj, id) {
        return super.change(dataObj, id, "id");
    }

    remove(id) {
        if(!id) {
            return Promise.reject("Bad id.");
        }
        return db.execSingleQuery("DELETE FROM " + this.tableName + " WHERE id = $1", [id]);
    }
}

//const ing = new Ingredient();
//ing.search("ing", ["sku23", "sku690", "sku1", "sku2356"])
//.then(function(res) {
    //console.log(res.rows);
//})
//.catch(function(err) {
    //console.log(err);
//});

//ing.searchByName("ing")
//.then(function(res) {
    //console.log(res.rows);
//})
//.catch(function(err) {
    //console.log(err);
//});


//ing.create({
    //name: "name6969", 
    //num: 12, 
    ////vend_info: "tnoerhr vending", 
    //pkg_size: "55 gallons", 
    //pkg_cost: 10
    ////comments: "a comment"
//})
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//});


//ing.update({
    //name: "doesnteixt",
    //vend_info: "please", 
    //pkg_size: "3587 poundsss", 
    //pkg_cost: 15
//}, "fgiusfdgiuarereirud")
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
    //console.log("ERRRROR");
//});

module.exports = Ingredient;
