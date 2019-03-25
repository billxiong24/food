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
                rows: that.performCalculations(res)
            };
        });
    }

    groupByKey(list, key) {
        let result = list.reduce(function (r, a) {
            r[a[key]] = r[a[key]] || [];
            r[a[key]].push(a);
            return r;
        }, Object.create(null));

        return result;
    }
    performCalculations(rows) {
        //group everything by year
        let groupedList = this.groupByKey(rows, 'year');
        let ret = [];
        //calculate averages per year
        for(let key in groupedList) {
            let list = groupedList[key];
            let revenue = 0;
            let numSales = 0;
            for (let i = 0; i < list.length; i++) {
                numSales += list[i].sales;
                revenue += (list[i].price_per_case * list[i].sales);
            }
            let avgRevenue = 0;

            if(numSales !== 0)
                avgRevenue = revenue / numSales;
            
            let obj = JSON.parse(JSON.stringify(list[0]));
            obj.revenue = revenue;
            obj.avgRevenue = parseFloat(avgRevenue.toFixed(2));
            ret.push(obj);
        }
        return ret;
    }

    fetchIfNotExist(skuNum, currYear, prdlines, customers) {
        let that = this;
        let query = squel.select()
        .from('sales')
        .field('sales.*, sku.*')
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
