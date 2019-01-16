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
        let params = this.makeParamList(dataObj)
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

const ing = new Ingredient();
//ing.create({
    //name: "459ff\\c", 
    //num: 49, 
    //vend_info: "some vending", 
    //pkg_size: "11 gallons", 
    //pkg_cost: 15,
    //comments: "a comment"
//})
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//})


ing.update({
    name: "ing35",
    num: 47,
    vend_info: "watwtaawtat", 
    pkg_size: "3587 gallons", 
    pkg_cost: 15,
    comments: "a comment"
}, "ing35")
.then(function(res) {
    console.log(res);
})
.catch(function(err) {
    console.log(err);
    console.log("ERRRROR");
});

module.exports = Ingredient;
