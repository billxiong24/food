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

    getSKUNumIfExists(case_upc) {
        return db.execSingleQuery("SELECT num FROM sku WHERE case_upc=$1", [case_upc]).then(function(res) {
            if(res.rows.length == 0)
                return Promise.reject("This SKU does not exist.");
            return res.rows[0].num;
        });
    }

    //when creating sku, we want to add ingredients.
    //TODO use squel to generate this query
    addIngredients(case_upc, ingredients) {
        let query = "INSERT INTO sku_ingred (sku_num, ingred_num) VALUES";
        for(let i = 0; i < ingredients.length; i++) {
            query += "($1, $"+ (i + 2) + ")";
            if(i != ingredients.length - 1) {
                query += ","
            }
        }

        return this.getSKUNumIfExists(case_upc)
        .then(function(sku_num) {
            ingredients.unshift(sku_num);
        })
        .then(function(res) {
            return db.execSingleQuery(query, ingredients);
        });
    }

    removeIngredient(case_upc, ingred_num) {
        let query = "DELETE FROM sku_ingred WHERE sku_num=$1 AND ingred_num=$2";

        return this.getSKUNumIfExists(case_upc)
        .then(function(res) {
            return db.execSingleQuery(query, [res, ingred_num]);
        });
    }

    searchByName(name) {
        name = "%" + name + "%";
        let query = "SELECT * FROM sku WHERE sku.name LIKE $1";
        return db.execSingleQuery(query, [name]);
    }

    //TODO use squel to generate this query
    search(searchQuery, ingredients, productlines) {
        searchQuery = "%" + searchQuery + "%";

        let query = "SELECT sku.name as sku_name, ingredients.name as ingred_name, ingredients.num as ingred_num, sku.num as sku_num, * FROM sku INNER JOIN sku_ingred ON sku.num = sku_ingred.sku_num INNER JOIN ingredients ON sku_ingred.ingred_num=ingredients.num WHERE sku.name LIKE $1 AND (";

        let count = 1;

        for(let i = 0; i < ingredients.length; i++) {
        
            query += "ingredients.name=$" + (i + 2); 
            if(i == ingredients.length - 1) {
                query += ")";
            }
            else {
                query += " OR ";
            }

            count++;
        }

        query += " AND (";

        for(let i = 0; i < productlines.length; i++) {
            count++;
            query += "sku.prd_line=$" + (count); 
            if(i == productlines.length - 1) {
                query += ")";
            }
            else {
                query += " OR ";
            }
        }
        ingredients.unshift(searchQuery);
        let arr = ingredients.concat(productlines);
        return db.execSingleQuery(query, arr);
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
        let query = squel.insert()
        .into(this.tableName)
        .setFieldsRows([dataObj]).toString();

        //product line must exist
        return this.checkProductLineExists(dataObj.prd_line)
        .then((res) => {
            return super.insert(query, dataObj, "That SKU entry exists already.");
        });
    }

    update(dataObj, oldName) {
        return this.checkProductLineExists(dataObj.prd_line)
        .then((res) => {
            return super.change(dataObj, oldName, "num");
        })
    }

    remove(num) {
        if(!num) {
            return Promise.reject("Bad num.");
        }
        return db.execSingleQuery("DELETE FROM " + this.tableName + " WHERE num = $1", [num]);
    }
}

const sku = new SKU();

//sku.removeIngredient(5043, 44).then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//});

//sku.search("sku", ["ing35", "ing4545", "name"], ["prod1", "prod2", "prod3", "prod5"]).then(function(res) {
    //console.log(res.rows);
//})
//.catch(function(err) {

    //console.log(err);
//});
//sku.addIngredients(1001, [2, 47, 6, 49])
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//})

//sku.create({
    //name: "sku720", 
    //case_upc: 12345, 
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

sku.update({
    name: "sku1", 
    num: 12, 
    case_upc: 2449, 
    unit_upc: 112553, 
    unit_size: "10 lbs", 
    count_per_case: 4,
    prd_line: "prod4",
    comments: "a comment"
}, 12)
//.then(function(res) {
    //console.log(res);
    //console.log("this is a result");
//})
//.catch(function(err) {
    //console.log(err);
//});

module.exports = SKU;
