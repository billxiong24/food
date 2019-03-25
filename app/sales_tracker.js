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

    total(skuNum, start) {
      let skuCost = this.getSKUCost(skuNum);
      return {}
    }

    getSKUCost(skuNum) {
      let query = squel.select()
       .from("sku")
       .field("sku.man_setup_cost", "setup_cost")
       .field("sku.man_run_cost", "run_cost")
       .field("SUM(CEILING(sku.formula_scale * formula_ingredients.quantity/ingredients.pkg_size) * ingredients.pkg_cost)", "case_cost")
       .join("formula_ingredients", null, "sku.formula_id = formula_ingredients.formula_id")
       .join("ingredients", null, "ingredients.id = formula_ingredients.ingredients_id")
       .where("sku.num = ?", skuNum)
       .distinct()
       .toString();
       console.log(query);
    }

    search(skuNum, numYears, prdlines, customers) {
        //escape single quotes
        for (var i = 0, len = customers.length; i < len; i++) {
            customers[i] = customers[i].replace(/'/g, "''");
        }
        let currYear = new Date().getFullYear();
        let res = [];
        let prom = Promise.resolve(null);
        let that = this;
        for(let i = 0; i < numYears; i++) {
            let yr = currYear - i;
            prom = prom.then(function(r) {
                return that.fetchIfNotExist(skuNum, yr, prdlines, customers)
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

    fetchIfNotExist(skuNum, currYear, prdlines, customers) {
        let that = this;
        let query = squel.select()
        .from('sales')
        .field('sales.*')
        .join("sku", null, "sales.sku_num = sku.num")
        .where('sku_num = ?', skuNum)
        .where('year = ?', currYear);
        
        const queryGen = new QueryGenerator(query);
        queryGen.chainOrFilter(prdlines, "prd_line = ?")
        .chainOrFilter(customers, "customer_name = ?")
        const q = queryGen.getQuery().toString();
        console.log(q);
        return db.execSingleQuery(q, [])
        .then(function(res) {
            if(res.rows.length > 0) {
                console.log("already exists");
                return res.rows;
            }
            else {
                console.log("didnt exist");
                //have to execute query again because pulled in a bunch of new data
                return that.scrapeAndInsert(skuNum, currYear)
                .then(function(rows) {
                    return db.execSingleQuery(q, [])
                    .then(function(res) {
                        return res.rows;
                    });
                }).then(sleeper(that.interval))
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
