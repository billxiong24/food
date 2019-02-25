const db = require('./db');
const CRUD = require("./CRUD");
const squel = require("squel").useFlavour("postgres");
const bcrypt = require("bcrypt");
const QueryGenerator = require("./query_generator");

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

        let query = "SELECT COUNT(*) FROM " + this.tableName + " WHERE uname=$1";
        return db.execSingleQuery(query, [dataObj.uname]);
    }

    create(dataObj) {
        if(!dataObj.uname) {
            return Promise.reject("Must include valid username.");
        }

        return bcrypt.hash(dataObj.password, saltRounds).then((hash) => {
            const hashedDataObj = Object.assign({},dataObj);
            hashedDataObj.password = hash;
            let query = squel.insert()
            .into(this.tableName)
            .setFieldsRows([hashedDataObj]).toString();
            return super.insert(query, hashedDataObj, "Error creating user: user already exists.");
        });
    }

    verify(dataObj) {
        if(!dataObj.uname) {
            return Promise.reject("Bad username");
        }
        
        let query = "SELECT * FROM " + this.tableName + " WHERE uname=$1";
        return db.execSingleQuery(query, [dataObj.uname]).then((result) => {
        
        result = result.rows;
        if(result.length!=1) {
          return Promise.reject("User Doesn't Exist");
        }
        result = result[0];

        return bcrypt.compare(dataObj.password, result.password).then((res) => {
          if(res) {
                return {
                  uname:result.uname,
                  admin:result.admin,
                  id:result.id
                };
            }
            else
                return Promise.reject("Incorrect Password");
            });
        });
    }
    
    search(names, filter) {
      names = QueryGenerator.transformQueryArr(names);
      let query = squel.select()
      .from(this.tableName)
      .field("*, COUNT(*) OVER() as row_count");

      const queryGen = new QueryGenerator(query);
      queryGen.chainAndFilter(names, "uname LIKE ?");
      let queryStr = filter.applyFilter(queryGen.getQuery()).toString();
      //logger.debug(queryStr);
      return db.execSingleQuery(queryStr, []);
  }

    getUser(dataObj) {
      if (!dataObj.uname) {
        return Promise.reject("Bad username");
      }

      let query = "SELECT * FROM " + this.tableName + " WHERE uname=$1";
      return db.execSingleQuery(query, [dataObj.uname]).then((result) => {
        result = result.rows;
        if (result.length != 1) {
          return Promise.reject("User Doesn't Exist");
        }
        result = result[0];
        return result;
      });
    }

    update(dataObj, oldPrimaryKey) {
      if(dataObj.password){
        return bcrypt.hash(dataObj.password, saltRounds).then((hash) => {
            const hashedDataObj = Object.assign({},dataObj);
            hashedDataObj.password = hash;
            return super.change(hashedDataObj, oldPrimaryKey, "id");
        });
      } else {
        return super.change(dataObj, oldPrimaryKey, "id");
      }
    }

    remove(id) {
        if(!id) {
            return Promise.reject("Bad User ID.");
        }
        return db.execSingleQuery("DELETE FROM " + this.tableName + " WHERE id = $1", [id]);
    }
}

module.exports = Users;
