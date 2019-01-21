const db = require("./db");
const CRUD = require("./CRUD");

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

    //when creating sku, we want to add ingredients.
    addIngredients(case_upc, ingredients) {
        let query = "INSERT INTO sku_ingred (sku_num, ingred_num) VALUES";
        for(let i = 0; i < ingredients.length; i++) {
            query += "($1, $"+ (i + 2) + ")";
            if(i != ingredients.length - 1) {
                query += ","
            }
        }
        return db.execSingleQuery("SELECT num FROM sku WHERE case_upc=$1", [case_upc]).then(function(res) {
            if(res.rows.length == 0)
                return Promise.reject("This SKU does not exist.");
            return res.rows[0].num;
        })
        .then(function(sku_num) {
            ingredients.unshift(sku_num);
        })
        .then(function(res) {
            return db.execSingleQuery(query, ingredients);
        });
    }

    removeIngredient(case_upc, ingred_num) {
        let query = "DELETE FROM sku_ingred WHERE sku_num=$1 AND ingred_num=$2";

        return db.execSingleQuery("SELECT num FROM sku WHERE case_upc=$1", [case_upc]).then(function(res) {
            if(res.rows.length == 0)
                return Promise.reject("This SKU does not exist.");
            return res.rows[0].num;
        })
        .then(function(res) {
            return db.execSingleQuery(query, [res, ingred_num]);
        });
    }

    searchByName(name) {
        name = "%" + name + "%";
        let query = "SELECT * FROM sku WHERE sku.name LIKE $1";
        return db.execSingleQuery(query, [name]);
    }

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

    create(dataObj) {
        let query = "";
        if(dataObj.hasOwnProperty('num')) {
            query = "INSERT INTO " + this.tableName + " (name, num, case_upc, unit_upc, unit_size, count_per_case, prd_line, comments) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"

        }
        else {
            query = "INSERT INTO " + this.tableName + " (name, case_upc, unit_upc, unit_size, count_per_case, prd_line, comments) VALUES ($1, $2, $3, $4, $5, $6, $7)"
        }

        return db.execSingleQuery("SELECT * FROM productline WHERE productline.name = $1", [dataObj.prd_line]).then((res) => {
            if(res.rows.length == 0) {
                return Promise.reject("Product line does not exist.");
            }
            return res;
        })
        .then((res) => {
            return super.insert(query, dataObj, "That SKU entry exists already.");
        });
    }

    update(dataObj, oldName) {
        return super.change(dataObj, oldName, "num");
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
//sku.addIngredients(5043, [1414, 44, 6])
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//})

sku.create({
    name: "sku690", 
    case_upc: 43434, 
    unit_upc: 65345, 
    unit_size: "12 lbs sy98vv", 
    count_per_case: 98,
    prd_line: "prod4",
    comments: "commentingg"
})
.then(function(res) {
    console.log(res);
})
.catch(function(err) {
    console.log(err);
});

//sku.update({
    //name: "sku1", 
    //num: 12, 
    //case_upc: 2449, 
    //unit_upc: 112553, 
    //unit_size: "10 lbs", 
    //count_per_case: 4,
    //prd_line: "prod3",
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
