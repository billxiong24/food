const db = require("./db");
const CRUD = require("./CRUD");

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

    searchByName(name) {
        name = "%" + name + "%";
        let query = "SELECT * FROM ingredients WHERE ingredients.name LIKE $1";
        return db.execSingleQuery(query, [name]);
    }

    search(searchQuery, skus) {
        searchQuery = "%" + searchQuery + "%";
        let query = "SELECT sku.name as sku_name, ingredients.name as ingred_name, ingredients.num as ingred_num, sku.num as sku_num, * FROM sku INNER JOIN sku_ingred ON sku.num = sku_ingred.sku_num INNER JOIN ingredients ON sku_ingred.ingred_num=ingredients.num WHERE ingredients.name LIKE $1 AND (";

        for(let i = 0; i < skus.length; i++) {
        
            query += "sku.name=$" + (i + 2); 
            if(i == skus.length - 1) {
                query += ")";
            }
            else {
                query += " OR ";
            }
        }

        skus.unshift(searchQuery);
        return db.execSingleQuery(query, skus);
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
        let query = "";
        if(dataObj.hasOwnProperty('num')) {
            query = "INSERT INTO " + this.tableName + " (name, num, vend_info, pkg_size, pkg_cost, comments) VALUES ($1, $2, $3, $4, $5, $6)"
        }
        else {
            query = "INSERT INTO " + this.tableName + " (name, vend_info, pkg_size, pkg_cost, comments) VALUES ($1, $2, $3, $4, $5)"
        }
        return super.insert(query, dataObj, "Entry with name or num exists already.");
    }

    update(dataObj, oldName) {
        return super.change(dataObj, oldName, "name");
    }

    remove(name) {
        if(!name) {
            return Promise.reject("Bad name.");
        }
        return db.execSingleQuery("DELETE FROM " + this.tableName + " WHERE name = $1", [name]);
    }
}

//const ing = new Ingredient();
//ing.search("ing", ["sku1", "sku23"])
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
    //name: "ing24545", 
    //num: 1415, 
    //vend_info: "tnoerhr vending", 
    //pkg_size: "55 gallons", 
    //pkg_cost: 10,
    //comments: "a comment"
//})
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//});


//ing.update({
    //name: "ing35",
    //num: 47,
    //vend_info: "watwtaawtat", 
    //pkg_size: "3587 gallons", 
    //pkg_cost: 15,
    //comments: "a comment"
//}, "ing35")
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
    //console.log("ERRRROR");
//});

module.exports = Ingredient;
