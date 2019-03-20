const CRUD = require('./CRUD');
const db = require("./db");
const squel = require("squel").useFlavour("postgres");
const QueryGenerator = require("./query_generator");
const Filter = require("./filter");;

const rp = require('request-promise');
const cheerio = require('cheerio');

class Customer {
    scrape() {
        return rp("http://hypomeals-sales.colab.duke.edu:8080/customers")
        .then(function(html) {
            let table = cheerio('tbody > tr', html);
            //start at 1 to skip header
            let arr = [];
            for(let i = 1; i < table.length; i++) {
                let obj = {
                    customer_num: table[i].children[0].children[0].data,
                    customer_name: table[i].children[1].children[0].data,
                }
                arr.push(obj);
            }

            return arr;
        });
    }
}

//new Customer().scrape().then(function(e){});
