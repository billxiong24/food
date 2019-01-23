const db = require("./db");
const squel = require("squel").useFlavour("postgres");

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
            //already exists
            if(res.rows.length > 0) {
                return Promise.reject(errMsg);
            }
            return res;
        })
        .then(function(res) {
            return db.execSingleQuery(query, [], (err) => {
                throw "There was an error. Please try again."
            });
        });
    }

    change(dataObj, oldPrimaryKey, primaryKeyName) {
        let q = squel.update()
        .table(this.tableName)
        for(let k in dataObj) {
            q = q.set(k, dataObj[k]);
        }
        q = q.where(primaryKeyName + "='" + oldPrimaryKey+"'");
        q = q.toString();
        return db.execSingleQuery(q, [], (err) => {
            //return Promise.reject("There was an error. Please try again.");
            throw "There was an error. Please try again."
        });
    }


    //abstract methods
    create(dataObj) {

    }

    update(dataObj, oldPrimaryKey) {

    }

    read(dataObj) {

    }

    remove(pKey) {

    }

    search(name) {

    }
}

module.exports = CRUD;
