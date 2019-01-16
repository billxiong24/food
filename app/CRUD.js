const db = require("./db");

class CRUD {

    constructor() {
        this.tableName = null;
    }

    makeParamList(obj) {
        let list = [];
        for(let key in obj) {
            list.push(obj[key]);
        }
        return list;
    }

    // should be overriden by subclass
    checkExisting(dataObj) {
        return Promise.resolve(null);
    }
    
    insert(query, dataObj, errMsg="Primary/unique key exists already.") {
        let params = this.makeParamList(dataObj);
        return this.checkExisting(dataObj).then(function(res) {
            //ingredient exists
            if(res.rows.length > 0) {
                return Promise.reject(errMsg);
            }
            return res;
        })
        .then(function(res) {
            return db.execSingleQuery(query, params);
        });
    }

    change(dataObj, oldPrimaryKey, primaryKeyName) {
        let params = this.makeParamList(dataObj);
        params.push(oldPrimaryKey);

        let query = "UPDATE " + this.tableName + " SET "
        let keys = Object.keys(dataObj);

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

        query += "WHERE " + primaryKeyName + "= $" + (keys.length + 1);
        return db.execSingleQuery(query, params);

        //if we are updating a primary or unique key
        //if(false) {
            //return this.checkExisting(dataObj).then(function(res) {
                //if(res.rows.length > 0) {
                    //return Promise.reject("Attempting to update to existing entry for " + JSON.stringify(dataObj));
                //}
                //return res;
            //})
            //.then(function(res) {
                //db.execSingleQuery(query, params);
            //})
        //}
        //else {
        //}
    }


    //abstract methods
    create(dataObj) {

    }

    update(dataObj, oldPrimaryKey) {

    }

    read(dataObj) {

    }


}

module.exports = CRUD;
