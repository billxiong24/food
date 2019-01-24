const db = require('./db');
const CRUD = require("./CRUD");
const squel = require("squel").useFlavour("postgres");
const bcrypt = require("bcrypt");

const saltRounds = 10;

class Users extends CRUD {
    constructor() {
        super();
        this.tableName = "users";
    }

    checkExisting(dataObj) {
        if(!dataObj.uname) {
            return Promise.reject("Bad Username.");
        }

        let query = "SELECT uname FROM " + this.tableName + " WHERE uname=$1";
        return db.execSingleQuery(query, [dataObj.uname]);
    }

    create(dataObj) {
        if(!dataObj.uname) {
            return Promise.reject("Must include valid username.");
        }

        bcrypt.hash(dataObj.password, saltRounds).then((hash) => {
            const hashedDataObj = Object.assign({},dataObj);
            hashedDataObj.password = hash;
            let query = squel.insert()
            .into(this.tableName)
            .setFieldsRows([dataObj]).toString();
            return super.insert(query, dataObj, "Error creating user: user already exists.");
        });
    }

    verify(dataObj) {
        if(!dataObj.uname) {
            return Promise.reject("Bad username");
        }
        
        let query = "SELECT uname, password FROM " + this.tableName + " WHERE uname=$1";
        let storedCreds = db.execSingleQuery(query, [dataObj.uname]).rows;

        if(storedCreds.length!=1) {
          return Promise.reject("User Doesn't Exist");
        }
        storedCreds = storedCreds[0];

        bcrypt.compare(dataObj.password, storedCreds.password).then((res) => {
            if(res) {
                return {uname:dataObj.uname};
            }
            else
                return Promise.reject("Incorrect Password");
      });
    }

    update(dataObj, oldPrimaryKey) {
        bcrypt.hash(dataObj.password, saltRounds).then((hash) => {
            const hashedDataObj = Object.assign({},dataObj);
            hashedDataObj.password = hash;
            return super.change(dataObj, oldPrimaryKey, "id");
        });
    }

    remove(uname) {
        if(!uname) {
            return Promise.reject("Bad Username.");
        }
        return db.execSingleQuery("DELETE FROM " + this.tableName + " WHERE uname = $1", [uname]);
    }
}

module.exports = Users;
