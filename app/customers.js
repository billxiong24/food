const CRUD = require('./CRUD');
const db = require("./db");
const squel = require("squel").useFlavour("postgres");
const QueryGenerator = require("./query_generator");
const Filter = require("./filter");;

const rp = require('request-promise');
const cheerio = require('cheerio');

class Customer {

    scrapeAndInsert() {
        return this.scrape().then(this.create); 
    }

    search(name) {
        let q = null;
        if(name && name.length > 0) {
            q = "SELECT * FROM customers WHERE name = $1";
            return db.execSingleQuery(q, [name]);
        }
        else {
            q = "SELECT * FROM customers";
            return db.execSingleQuery(q, []);
        }
    }

    create(arr) {
        let insQuery = QueryGenerator.genInsConflictQuery(arr, 'customers', 'ON CONFLICT DO NOTHING').toString();
        //console.log(insQuery);
        return db.execSingleQuery(insQuery, []);
    }

    scrape() {
        return rp("http://hypomeals-sales.colab.duke.edu:8080/customers")
        .then(function(html) {
            let table = cheerio('tbody > tr', html);
            //start at 1 to skip header
            let arr = [];
            for(let i = 1; i < table.length; i++) {
                let obj = {
                    num: table[i].children[0].children[0].data,
                    name: table[i].children[1].children[0].data.replace(/(\r\n|\n|\r)/gm, "").replace(/'/g, "''")
                }
                arr.push(obj);
            }

            return arr;
        });
    }
}

module.exports = Customer;
//new Customer().scrapeAndInsert();
