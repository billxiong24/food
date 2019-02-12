const db = require("./db");
const squel = require("squel").useFlavour("postgres");
const csv=require('csvtojson');
const QueryGenerator = require("./query_generator");

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
        return this.checkExisting(dataObj).then(function(res) {
            let count = parseInt(res.rows[0].count);
            //already exists
            //logger.debug(count);
            if(count > 0) {
                //logger.debug("entry exists already.");
                return Promise.reject(errMsg);
            }
            return res;
        })
        .then(function(res) {
            return db.execSingleQuery(query, []);
        });
    }

    getUpdateQueryObj(dataObj) {
        let q = squel.update()
        .table(this.tableName)
        for(let k in dataObj) {
            q = q.set(k, dataObj[k]);
        }
        return q; 
    }

    change(dataObj, oldPrimaryKey, primaryKeyName) {
        let q = squel.update()
        .table(this.tableName)
        for(let k in dataObj) {
            q = q.set(k, dataObj[k]);
        }
        q = q.where(primaryKeyName + "='" + oldPrimaryKey+"'");
        q = q.toString();
        //logger.debug(q);
        return db.execSingleQuery(q, []);
    }

    checkDuplicateInObject(propertyName, inputArray) {
      let seenDuplicate = false;
      let testObject = {};
    
      inputArray.map(function(item) {
          var itemPropertyName = item[propertyName];    
          if (itemPropertyName in testObject) {
                testObject[itemPropertyName].duplicate = true;
                item.duplicate = true;
                seenDuplicate = true;
              }
          else {
                testObject[itemPropertyName] = item;
                delete item.duplicate;
              }
        });
    
      return seenDuplicate;
    }

    bulkCleanData(jsonList) {
        for(let i = 0; i < jsonList.length; i++) {
            let obj = jsonList[i];
            for(let key in obj) {
                if(obj[key].length === 0) {
                    delete obj[key];
                }
            }
        }
    }

    generateErrorResult(errMsgs) {
        let errObj = {};
        errObj.abort = false;
        errObj.errors = [];
        for(let i = 0; i < errMsgs.length; i++) {
            let tempObj = errMsgs[i];
            let code = errMsgs[i].code;
            if(code === "22P02") {
                tempObj.detail = "Syntax error at record " + i;
            }
            errObj.errors.push({
                code: tempObj.code,
                detail: tempObj.detail
            });
            //syntax error, not null violation, foreign key violation
            if(code === "22P02" || code === "23502" || code === "23503") {
                errObj.abort = true;
            }
        }
        return errObj;
    }

    bulkAcceptInsert(rows, cb) {
        let table = this.tableName;
        let that = this;
        db.getSingleClient()
        .then(function(client) {
            let error = false;
            let errMsgs = [];
            let prom = client.query("BEGIN");
            let updates = 0;
            let inserts = 0;
            for(let i = 0; i < rows.length; i++) {
                let update = rows[i].update;
                delete rows[i].update;
                let query = "";
                if(update) {
                    updates++;
                    query = that.conflictUpdate(rows[i]);
                }
                else {
                    inserts++;
                    query = QueryGenerator.genInsQuery(rows[i], table).toString();
                }
                //logger.debug("QUERY: " + query);
                prom = prom.then(function(r) {
                    return client.query(query).catch(function(err) {
                        error = true;
                        errMsgs.push(err);
                        //logger.debug("found error.");
                        client.query("ROLLBACK");
                    });
                });
            }

            prom.then(function(r) {
                if(error) {
                    //logger.debug("there's an error, rolling back");
                    client.query("ROLLBACK");
                    client.query("ABORT");
                    cb(that.generateErrorResult(errMsgs));
                }
                else {
                    //logger.debug("No errors, committing transaction");
                    client.query("COMMIT");
                    cb({
                        updates: updates,
                        inserts: inserts
                    });
                }
            });
        });
    }

    bulkImport(csv_str, cb) {
        let table = this.tableName;
        let that = this;
        csv().fromString(csv_str)
        .then(function(rows) {
            that.bulkCleanData(rows);
            return rows;
        })
        .then(function(rows) {
            if(that.duplicateObjs(rows)) {
                return cb({ errors: [ 
                            { 
                                detail: "Duplicate rows in file."
                            }
                        ]
                    });
            }

            return db.getSingleClient()
            .then(function(client) {
                let abort = false;
                let error = false;
                let errMsgs = [];
                let prom = client.query("BEGIN");
                for(let i = 0; i < rows.length; i++) {
                    let query = QueryGenerator.genInsQuery(rows[i], table).toString();
                    prom = prom.then(function(r) {
                        return that.checkExisting(rows[i])
                        .then(function(row_nums) {
                            let count = parseInt(row_nums.rows[0].count);
                            if(count > 1) {
                                rows[i].ambiguous = true;
                                errMsgs.push({
                                    code: "23505",
                                    detail: "Ambiguous record in row " + i
                                });
                                error = true;
                                abort = true;
                                return false;
                            }
                            return true;
                        })
                        .then(function(quer) {
                            if(!quer)
                                return false;
                            return client.query("SAVEPOINT point" + i).then(function(res) {
                                return client.query(query).catch(function(err) {
                                    error = true;
                                    errMsgs.push(err);
                                    rows[i].update = true;
                                    client.query("ROLLBACK TO SAVEPOINT point" + i);
                                });
                            });
                        });
                    })
                }
                prom.then(function(res) {
                    let errObj = null;
                    if(error) {
                        errObj = that.generateErrorResult(errMsgs)
                        if(abort)
                            errObj.abort = true;
                        errObj.rows = errObj.abort ? [] : rows;
                        //logger.debug("There was an error, rolling back");
                        client.query("ROLLBACK");
                        client.query("ABORT");
                    }
                    else {
                        //logger.debug("No errors, committing transaction");
                        client.query("COMMIT");
                    }

                    cb(errObj);
                });
            });
        });
    }


    //abstract methods
    create(dataObj) {

    }

    update(dataObj, oldPrimaryKey) {

    }

    remove(pKey) {

    }

    search(name) {

    }

    conflictUpdate(dataObj) {

    }

    duplicateObjs(jsonList) {

    }
}

module.exports = CRUD;
