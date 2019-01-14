const db = require("./db");

class Ingredient {

    constructor() {
        this.tableName = "ingredients";
    }

    makeParamList(obj) {
        let list = [];
        for(let key in obj) {
            list.push(obj[key]);
        }
        return list;
    }

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
    create(ingredObj) {
        let params = this.makeParamList(ingredObj)
        let query = "";
        if(ingredObj.hasOwnProperty('num')) {
            query = "INSERT INTO " + this.tableName + " (name, num, vend_info, pkg_size, pkg_cost, comments) VALUES ($1, $2, $3, $4, $5, $6)"
        }
        else {
            query = "INSERT INTO " + this.tableName + " (name, vend_info, pkg_size, pkg_cost, comments) VALUES ($1, $2, $3, $4, $5)"
        }

        return this.checkExisting(ingredObj).then(function(res) {
            //ingredient exists
            if(res.rows.length > 0) {
                return Promise.reject("Ingredient exists.");
            }
            return res;
        })
        .then(function(res) {
            return db.execSingleQuery(query, params);
        });
    }

    update(ingredObj, oldName) {
        let params = this.makeParamList(ingredObj);
        params.push(oldName);

        let query = "UPDATE " + this.tableName + " SET "
        let keys = Object.keys(ingredObj);

        for(let i = 0; i < keys.length; i++) {
            let k = keys[i];
            query += (k + " = " + "$" + (i + 1));

            if(i != keys.length - 1) {
                query += ", ";
            }
            else {
                query += " ";
            }
        }

        query += "WHERE name = $" + (keys.length + 1);

        //if we are updating name and/or num
        if(ingredObj.name || ingredObj.num) {
            return this.checkExisting(ingredObj).then(function(res) {
                if(res.rows.length > 0) {
                    return Promise.reject("Attempting to update to existing entry for " + JSON.stringify(ingredObj));
                }
                return res;
            })
            .then(function(res) {
                db.execSingleQuery(query, params);
            })
        }
        else {
            return db.execSingleQuery(query, params);
        }
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
    //name: "ing35", 
    //num: 47, 
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
//});


//ing.update({
    //vend_info: "some vending", 
    //pkg_size: "11 gallons", 
    //pkg_cost: 15,
    //comments: "a comment"
//}, "ing35")
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//});

module.exports = Ingredient;
