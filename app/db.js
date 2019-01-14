require('dotenv').config()
const pg = require('pg');

let pool = new pg.Pool();

//query is of the form "SELECT * FROM table WHERE col = $1 AND col2 = $2"
//params is an array of form [param1, param2], corresponding to $1, $2
//returns promise
function execSingleQuery(query, params) {
    return pool.connect().then(function(client) {
        return client.query(query, params).then(function(res) {
            client.release();
            return res;
        });
    });
}

//execSingleQuery("SELECT NOW()", []).then(function(res) {
    //console.log(res.rows);
//}).then(function(res) {

    //execSingleQuery("SELECT NOW()", [])
    //.then(function(res) {
        //console.log(res.rows);
    //});
//})

module.exports = {
    execSingleQuery
};
