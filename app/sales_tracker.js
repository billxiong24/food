const CRUD = require('./CRUD');
const db = require("./db");
const squel = require("squel").useFlavour("postgres");
const QueryGenerator = require("./query_generator");
const Filter = require("./filter");;
const rp = require('request-promise');
const cheerio = require('cheerio');

class SalesTracker {

    constructor() {
        this.tableName = "sales_tracker";
    } 



    scrapeAndInsert(skuNum, year) {
        return this.scrape(skuNum, year).then(this.create);
    }

    create(arr) {
        let insQuery = QueryGenerator.genInsConflictQuery(arr, 'sales', 'ON CONFLICT DO NOTHING').toString();
        return db.execSingleQuery(insQuery, []);
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

new SalesTracker().scrapeAndInsert(4, 2014);
