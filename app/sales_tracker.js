const CRUD = require('./CRUD');
const db = require("./db");
const squel = require("squel").useFlavour("postgres");
const QueryGenerator = require("./query_generator");
const Filter = require("./filter");;
const rp = require('request-promise');
const cheerio = require('cheerio');
const getYear = require('date-fns/get_year');
const getISOWeek = require('date-fns/get_iso_week');
const Formatter = require('./formatter');
const weekNum = require('current-week-number');


function sleeper(ms) {
    return function(x) {
        return new Promise(resolve => setTimeout(() => resolve(x), ms));
    };
}
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function standardDeviation(values){
  var avg = average(values);
  
  var squareDiffs = values.map(function(value){
      var diff = value - avg;
      var sqrDiff = diff * diff;
      return sqrDiff;
    });
  
  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data){
  var sum = data.reduce(function(sum, value){
      return sum + value;
    }, 0);

  var avg = sum / data.length;
  return avg;
}

class SalesTracker {

    constructor() {
        this.interval = 200;
    } 

    exportFile(jsonList, format, cb=null) {
        console.log("EXPORTING BABY");
        const formatter = new Formatter(format);
        return formatter.generateFormat(jsonList);
    }

    getSKUCost(skuNum) {
      let query = squel.select()
       .from("sku")
       .field("sku.man_setup_cost", "setup_cost")
       .field("sku.man_run_cost", "run_cost")
       .field("sku.man_rate", "man_rate")
       .field("SUM(CEILING(sku.formula_scale * formula_ingredients.quantity/ingredients.pkg_size) * ingredients.pkg_cost)", "case_cost")
       .join("formula_ingredients", null, "sku.formula_id = formula_ingredients.formula_id")
       .join("ingredients", null, "ingredients.id = formula_ingredients.ingredients_id")
       .where("sku.num = ?", skuNum)
       .distinct()
       .group("setup_cost")
       .group("run_cost")
       .group("man_rate")
       .toString();
       return db.execSingleQuery(query, [])
    }

    getActivityCount(skuNum, start) {
      let query = squel.select()
      .from("manufacturing_goal_sku")
      .where("manufacturing_goal_sku.sku_id = ?", skuNum)
      .where("manufacturing_goal_sku.start_time > ?", start)
      .toString();
      return db.execSingleQuery(query, [])
    }

    searchTimeSpan(skuNum, fromDate, toDate) {

        let yr = new Date(toDate).getFullYear();

        //some weeks numbers are 53
        fromDate = weekNum(fromDate) % 52;
        toDate = weekNum(toDate) % 52;

        let that = this;
        return this.search(skuNum, 4, [], [], false, yr)
        .then(function(res) {
            let newList = that.groupByKey(res.rows, 'year');
            let slicedList = {};
            for(let year in newList) {
                newList[year] = sortByKey(newList[year], 'week');
                let fromInd = newList[year].length - 1;
                let toInd = newList[year].length - 1;
                //find out which dates to start from
                for(let i = 0; i < newList[year].length; i++) {
                    if(newList[year][i].week >= fromDate) {
                        fromInd = i;
                        break;
                    }
                }

                for(let i = 0; i < newList[year].length; i++) {
                    if(newList[year][i].week > toDate) {
                        toInd = i - 1;
                        break;
                    }
                }
                slicedList[year] = newList[year].slice(fromInd, toInd + 1);
                //console.log(slicedList[year]);
                //slicedList[year] = that.calculateRevAndProf(slicedList[year]);
                let numSales = 0;
                for (let i = 0; i < slicedList[year].length; i++) {
                    numSales += slicedList[year][i].sales;
                }
                slicedList[year] = JSON.parse(JSON.stringify(slicedList[year][0]));
                console.log(year + " " + numSales);
                slicedList[year].numSales = numSales;
            }

            let avg = 0;
            let sales = [];
            for(let year in slicedList) {
                avg += slicedList[year].numSales;
                sales.push(slicedList[year].numSales);
            }

            let len = Object.keys(slicedList).length;
            avg = len > 0 ? avg / len : 0;
            slicedList.average = avg;
            slicedList.stddev = standardDeviation(sales);

            return {
                rows: slicedList 
            };
        });
    }

    search(skuNum, numYears, prdlines, customers, aggregate = false, currYear = new Date().getFullYear()) {
        //escape single quotes
        for (var i = 0, len = customers.length; i < len; i++) {
            customers[i] = customers[i].replace(/'/g, "''");
        }
        //let currYear = new Date().getFullYear();
        let res = [];
        let prom = Promise.resolve(null);
        let that = this;
        for(let i = 0; i < numYears; i++) {
            let yr = currYear - i;
            prom = prom.then(function(r) {
                if(aggregate) {
                    return that.fetchSKUByFilter(yr, prdlines, customers)
                    .then(function(rows) {
                        res = res.concat(rows);
                    })
                }
                return that.fetchIfNotExist(skuNum, yr, prdlines, customers)
                .then(function(rows) {
                    res = res.concat(rows);
                })
            });
        }

        return prom.then(function() {
            return {
                //rows: res
                rows: aggregate ? that.performCalculations(res) : res
            };
        });
    }

    fetchSKUByFilter(currYear, prdlines, customers) {
        let that = this;
        let query = squel.select()
        .from('sku')
        .field('*')
        //.join("sku", null, "sales.sku_num = sku.num")
        //.where('year = ?', currYear);
        
        const queryGen = new QueryGenerator(query);
        queryGen.chainOrFilter(prdlines, "prd_line = ?")
        //.chainOrFilter(customers, "customer_name = ?") second-round pick out of Duke, power forward Carlos Boozer was both an NBA All-Star and gold medal Olympian for the United States. He was a tremendous low-post scorer for the Utah Jazz and Chicago Bulls and averaged a double-double in five different seasons.
        //
        //
        const q = queryGen.getQuery().toString();
        //console.log(q);
        return db.execSingleQuery(q, [])
        .then(function(res) {
            let list = [];
            let prom = Promise.resolve(list);
            //populate database
            for(let i = 0; i < res.rows.length; i++) {
                prom = prom.then(function(x) {
                    return that.fetchIfNotExist(res.rows[i].num, currYear, prdlines, customers)
                    .then(function(rows) {
                        //console.log(rows);
                        list = list.concat(rows);
                        return list;
                    //have to execute query again because pulled in a bunch of new data
                    });
                })
            }

            //filter by customer
            prom = prom.then(function(x) {
                let query = squel.select()
                .from('sku')
                .field('*')
                .join("sales", null, "sales.sku_num = sku.num")
                .where('year = ?', currYear);

                const queryGen = new QueryGenerator(query);
                queryGen.chainOrFilter(prdlines, "prd_line = ?")
                .chainOrFilter(customers, "customer_name = ?")
                const q = queryGen.getQuery().toString();
                console.log("CUSTOMER QUERY: " + q);
                return db.execSingleQuery(q, [])
                .then(function(e) {
                    return e.rows;
                });
            });
            return prom;
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

    calculateRevAndProf(list) {
        //console.log(list);
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
        
        return obj;
    }
    performCalculations(rows) {
        //group everything by year
        let groupedList = this.groupByKey(rows, 'prd_line');
        let ret = [];
        //calculate averages per year

        let deepGroupList = {}; 
        //group by sku num
        for(let key in groupedList) {
            let newList = this.groupByKey(groupedList[key], 'sku_num');
            deepGroupList[key] = newList;

        }
        //console.log(deepGroupList);

        let deepYearGroup = {};
        //for each produt line
        for(let key in deepGroupList) {
            deepYearGroup[key] = deepGroupList[key];
            let trav = deepGroupList[key];
            //for each sku number in the product line, group by year
            for(let nums in trav) {
                let newList = this.groupByKey(trav[nums], 'year');
                deepYearGroup[key][nums] = newList;
                for (let year in newList) {
                    let calculations = this.calculateRevAndProf(newList[year]);
                    deepYearGroup[key][nums][year] = calculations;
                }
            }
        }
            //let newList = this.groupByKey(deepGroupList[key], 'year');
            //deepYearGroup[key] = newList;
        //return deepYearGroup;
        return deepYearGroup;
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
//new SalesTracker().searchTimeSpan(24, 2, 3);

//new SalesTracker().scrapeAndInsert(4, 2014);
