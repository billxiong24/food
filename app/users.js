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
    if (!dataObj.uname) {
      return Promise.reject("Bad Username.");
    }

    let query = "SELECT COUNT(*) FROM " + this.tableName + " WHERE uname=$1";
    return db.execSingleQuery(query, [dataObj.uname]);
  }

  create(dataObj) {
    if (!dataObj.uname) {
      return Promise.reject("Must include valid username.");
    }

    return bcrypt.hash(dataObj.password, saltRounds).then((hash) => {
      const hashedDataObj = Object.assign({}, dataObj);
      hashedDataObj.password = hash;
      let query = squel.insert()
        .into(this.tableName)
        .setFieldsRows([hashedDataObj]).toString();
      return super.insert(query, hashedDataObj, "Error creating user: user already exists.");
    });
  }

  verify(dataObj) {
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

      return bcrypt.compare(dataObj.password, result.password).then((res) => {
        if (res) {
          delete result.password;
          return this.getPlantsManagedBy(result.id).then((lines) => {
            lines = lines.rows;
            if (!lines) {
              return result;
            }
            lines = lines.reduce((ret, cur) => {
              ret.push(cur.manline_id);
              return ret;
            }, []);
            return {
              ...result,
              manlines: lines
            }
          })
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
    return db.execSingleQuery(queryStr, []).then((result) => {
      result = result.rows;
      if (!result) {
        return;
      }
      var promises = result.map((user) => {
        return this.getPlantsManagedBy(user.id).then((lines) => {
          lines = lines.rows;
          if (!lines) {
            return user;
          }
          lines = lines.reduce((ret, cur) => {
            ret.push(cur.manline_id);
            return ret;
          }, []);
          return {
            ...user,
            manlines: lines
          }
        });
      });
      return Promise.all(promises).then((results) => {
        return results;
      })
    });
  }

  getPlantsManagedBy(id) {
    let query = squel.select()
      .from("plant_mgr")
      .where("user_id = ?", id)
      .toString();
    return db.execSingleQuery(query, []);
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
      delete result.password;
      return this.getPlantsManagedBy(result.id).then((lines) => {
        lines = lines.rows;
        if (!lines) {
          return result;
        }
        lines = lines.reduce((ret, cur) => {
          ret.push(cur.manline_id);
          return ret;
        }, []);
        return {
          ...result,
          manlines: lines
        }
      });
    });
  }

  update(dataObj, oldPrimaryKey) {
    let manlines = dataObj.manlines;
    delete dataObj.manlines;
    if (dataObj.password) {
      return bcrypt.hash(dataObj.password, saltRounds).then((hash) => {
        const hashedDataObj = Object.assign({}, dataObj);
        hashedDataObj.password = hash;
        return super.change(hashedDataObj, oldPrimaryKey, "id")
          .then((res) => {
            if (!manlines) {
              return res;
            } else {
              let deletePlantOwnership = squel.delete()
                .from("plant_mgr")
                .where("user_id=" + dataObj.id)
                .toString();
              return db.execSingleQuery(deletePlantOwnership, [])
                .then((res) => {
                  let rowsToInsert = manlines.map((manline) => {
                    return {
                      user_id: dataObj.id,
                      manline_id: manline
                    };
                  });
                  let insertPlantOwnership = squel.insert()
                    .into("plant_mgr")
                    .setFields(rowsToInsert)
                    .toString();
                  return db.execSingleQuery(insertPlantOwnership, [])
                    .then((inserts) => {
                      inserts.rowCount += res.rowCount;
                      return inserts;
                    });
                })
            }
          });
      });
    } else {
      return super.change(dataObj, oldPrimaryKey, "id")
        .then((res) => {
          if (!manlines) {
            return res;
          } else {
            let deletePlantOwnership = squel.delete()
              .from("plant_mgr")
              .where("user_id=" + dataObj.id)
              .toString();
            return db.execSingleQuery(deletePlantOwnership, [])
              .then((res) => {
                let rowsToInsert = manlines.map((manline) => {
                  return {
                    user_id: dataObj.id,
                    manline_id: manline
                  };
                });
                console.log(rowsToInsert);
                let insertPlantOwnership = squel.insert()
                  .into("plant_mgr")
                  .setFieldsRows(rowsToInsert)
                  .toString();
                console.log(insertPlantOwnership);
                return db.execSingleQuery(insertPlantOwnership, [])
                  .then((inserts) => {
                    inserts.rowCount += res.rowCount;
                    return inserts;
                  });
              })
          }
        });
    }
  }

  remove(id) {
    // if(!id) {
    //     return Promise.reject("Bad User ID.");
    // }
    // return db.execSingleQuery("DELETE FROM " + this.tableName + " WHERE id = $1", [id]);
    //if SKUs have this product line, we should not be able to remove it
    return db.execSingleQuery("SELECT * FROM manufacturing_goal WHERE user_id=$1 LIMIT 1", [id])
      .then((res) => {
        if (res.rows.length > 0) {
          return Promise.reject("Cannot remove " + id + ": Manufacturing Goals are owned by user.");
        }
        return res;
      })
      .then((res) => {
        //verify that no SKUs depend on this product line
        return db.execSingleQuery("DELETE FROM " + this.tableName + " WHERE id=$1", [id]);
      });
  }
}

module.exports = Users;
