require('dotenv').config()
const pg = require('pg');

class DB {

    constructor() {
        if(!DB.instance) {
            this.pool = new pg.Pool();
            DB.instance = this;
        }

        return DB.instance;

    }
    
    //query is of the form "SELECT * FROM table WHERE col = $1 AND col2 = $2"
    //params is an array of form [param1, param2], corresponding to $1, $2
    //returns promise
    
    execSingleQuery(query, params=[], errFn=function(err){ throw err; }) {
        return this.pool.connect().then(function(client) {
            return client.query(query, params).then(function(res) {
                client.release();
                return res;
            })
            .catch((err) => {
                errFn(err);
            });
        });
    }

    getSingleClient() {
        return this.pool.connect();
    }

    closePool() {
        this.pool.end();
    
    }
}

const db = new DB();
Object.freeze(db);

//db.execSingleQuery("SELECT NOW()", []).then(function(res) {
    //console.log(res.rows);
//}).then(function(res) {

    //db.execSingleQuery("SELECT NOW()", [])
    //.then(function(res) {
        //console.log(res.rows);
    //})
//})

module.exports = db;
