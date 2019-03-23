const CRUD = require('./CRUD');
const db = require("./db");
const squel = require("squel").useFlavour("postgres");
const QueryGenerator = require("./query_generator");
const Filter = require("./filter");;
const rp = require('request-promise');
const cheerio = require('cheerio');
function sleeper(ms) {
    return function(x) {
        return new Promise(resolve => setTimeout(() => resolve(x), ms));
    };
}

class SalesTracker {

    constructor() {
        this.interval = 200;
    } 

    search(skuNum, numYears) {
        let currYear = new Date().getFullYear();
        let res = [];
        let prom = Promise.resolve(null);
        let that = this;
        for(let i = 0; i < numYears; i++) {
            let yr = currYear - i;
            prom = prom.then(function(r) {
                return that.fetchIfNotExist(skuNum, yr)
                .then(function(rows) {
                    res = res.concat(rows);
                })
            });
        }

        return prom.then(function() {
            return {
                rows: res
            };
        });
    }

    fetchIfNotExist(skuNum, currYear) {
        let that = this;
        return db.execSingleQuery('SELECT * FROM sales WHERE sku_num = $1 AND year = $2', [skuNum, currYear])
        .then(function(res) {
            if(res.rows.length > 0) {
                console.log("already exists");
                return res.rows;
            }
            else {
                console.log("didnt exist");
                return that.scrapeAndInsert(skuNum, currYear).then(sleeper(that.interval));
            }
        });
    }

    scrapeAndInsert(skuNum, year) {
        return this.scrape(skuNum, year).then(this.create);
    }

    create(arr) {
        let insQuery = QueryGenerator.genInsConflictQuery(arr, 'sales', 'ON CONFLICT DO NOTHING').toString();
        return db.execSingleQuery(insQuery, [])
        .then(function(res) {
            return arr;
        });
    }

    scrape(skuNum, year) {
        return rp("http://hypomeals-sales.colab.duke.edu:8080/?sku=" + skuNum + "&year=" + year)
        .then(function(html) {
            let table = cheerio('tbody > tr', html);
            //start at 1 to skip header
            let arr = [];
            for(let i = 1; i < table.length; i++) {
                let obj = {
                    year: table[i].children[0].children[0].data,
                    sku_num: table[i].children[1].children[0].data,
                    week: table[i].children[2].children[0].data, 
                    customer_num: table[i].children[3].children[0].data, 
                    customer_name: table[i].children[4].children[0].data, 
                    customer_name: table[i].children[4].children[0].data.replace(/(\r\n|\n|\r)/gm, "").replace(/'/g, "''"),
                    sales: table[i].children[5].children[0].data, 
                    price_per_case: parseFloat(table[i].children[6].children[0].data)
                }
                arr.push(obj);
            }

            return arr;
        });
    }
}

module.exports = SalesTracker;
//new SalesTracker().search(24, 2)
//.then(function(rows) {
    //console.log(rows.rows);
//});

//new SalesTracker().scrapeAndInsert(4, 2014);
