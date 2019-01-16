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

    create(dataObj) {
        let params = this.makeParamList(dataObj)
        let query = "";
        if(dataObj.hasOwnProperty('num')) {
            query = "INSERT INTO " + this.tableName + " (name, num, case_upc, unit_upc, unit_size, count_per_case, prd_line, comments) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"

        }
        else {
            query = "INSERT INTO " + this.tableName + " (name, case_upc, unit_upc, unit_size, count_per_case, prd_line, comments) VALUES ($1, $2, $3, $4, $5, $6, $7)"
        }
        return super.insert(query, dataObj, "That SKU entry exists already.");
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
sku.create({
    name: "sku1", 
    num: 54, 
    case_upc: 2477, 
    unit_upc: 1123, 
    unit_size: "5 lbs", 
    count_per_case: 4,
    prd_line: "prod1",
    comments: "a comment"
})
.then(function(res) {
    console.log(res);
})
.catch(function(err) {
    console.log(err);
});

sku.update({
    name: "sku1", 
    num: 12, 
    case_upc: 2449, 
    unit_upc: 112553, 
    unit_size: "10 lbs", 
    count_per_case: 4,
    prd_line: "prod1",
    comments: "a comment"
}, 12)
.then(function(res) {
    console.log(res);
    console.log("this is a result");
})
.catch(function(err) {
    console.log(err);
});

module.exports = SKU;
