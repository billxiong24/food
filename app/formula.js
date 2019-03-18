const CRUD = require('./CRUD');
const db = require("./db");
const squel = require("squel").useFlavour("postgres");
const QueryGenerator = require("./query_generator");
const Filter = require("./filter");;

class Formula extends CRUD {

    constructor() {
        super();
        this.tableName = "formula";
        //this.unitMap = {
            //"ounce": "oz",
            //"oz": "oz",
            //"lb": "lb",
            //"pound": "lb",
            //"t": "t",
            //"ton", "ton"
            //"g": "g",
            //"gram": "g",
            //"fl-oz": "fl-oz",
            //"fluidounce": "fl-oz",
            //"pt": "pnt",
            //"pint": "pnt",
            //"qt": "qt",
            //"quart": "qt",
            //"gal": "gal",
            //"gallon": "gal",
            //"milliliter": "ml",
            //"ml": "ml",
            //"l": "l",
            //"liter": "l",
            //"count": "count",
            //"ct": "count"
        //}
    }

    generateRandomNum(){
        return Math.floor(Math.random() * (9999999999 - 0));
    }

    validNum(num){
        if(num < 1){
            return false
        }
        let query = "SELECT num FROM formula"
        let that = this
        return db.execSingleQuery(query, [])
        .then(function(res){
            console.log(res.rows)
            const numSet = new Set()
            for(var i = 0; i < res.rows.length; i++){
                numSet.add(res.rows[i].num)
            }
            return !numSet.has(num)
        })
    }

    formulaAutocomplete(prefix){
        let query = `SELECT name, id FROM formula WHERE name LIKE \'${prefix}%\'`
        let that = this
        return db.execSingleQuery(query, [])
        .then(function(res){
            console.log(res.rows)
            return res.rows.map(item => {
                return {
                    label: item.name,
                    id: item.id
                }
            })
        })
    }

    initializeFormula(){
        let numQuery = "SELECT num FROM formula"
        let ingredientQuery = "SELECT name, id FROM ingredients"
        let ingredients = []
        let num = this.generateRandomNum()
        let that = this
        return db.execSingleQuery(numQuery, [])
        .then(function(res){
            console.log(res.rows)
            const numSet = new Set()
            for(var i = 0; i < res.rows.length; i++){
                numSet.add(res.rows[i].num)
            }
            while(true){
                if(!numSet.has(num)){
                    break
                }
                num = that.generateRandomNum()
            }
            console.log(num)
        })
        .then(function(){
            return db.execSingleQuery(ingredientQuery, [])
                .then(function(res){
                console.log(res.rows)
                ingredients = res.rows.map(item => {
                    return {
                        label: item.name,
                        id: item.id
                    }
                })
            })
        })
        .then(function(){
            return {
                num: num,
                ingredients: ingredients
            }
        })


    }

    checkExisting(dataObj) {
        if(dataObj.num)
            return db.execSingleQuery("SELECT COUNT(*) FROM " + this.tableName + " WHERE num = $1", [dataObj.num]);

        else
            return Promise.resolve({
                rows: [
                    { count : 0 }
                ]
            });
    }

    create(dataObj) {
        if(!dataObj.name) {
            return Promise.reject("Not all required fields are present.");
        }

        let query = QueryGenerator.genInsQuery(dataObj, this.tableName).returning("*").toString();
        return super.insert(query, dataObj, "That formula entry exists already.");
    }

    update(dataObj, id) {
        return super.change(dataObj, id, "id");
    }

    remove(id) {
        return db.execSingleQuery("DELETE FROM " + this.tableName + " WHERE id = $1", [id]);
    }

    read(id) {
        let q = squel.select()
        .from(this.tableName)
        .field("*")
        .where("id = ?", id).toString();
        return db.execSingleQuery(q, []);
    }

    search(names, ingredients, filter) {
        let q = squel.select()
        .from(this.tableName)
        .field("formula.*")
        .left_join("formula_ingredients", null, "formula.id=formula_ingredients.formula_id")
        //have to search by ingerdients name because stupid ass front end autocomplete
        .left_join("ingredients", null, "ingredients.id=formula_ingredients.ingredients_id");

        //TODO search by number
        const queryGen = new QueryGenerator(q);
        names = QueryGenerator.transformQueryArr(names);
        queryGen.chainAndFilter(names, "formula.name LIKE ?")
        .chainOrFilter(ingredients, "ingredients.name = ?")
        .makeDistinct();
        let queryStr = filter.applyFilter(queryGen.getQuery()).toString();
        return db.execSingleQuery(queryStr, []);
    }
    addIngredients(id, ingredients) {
        let query = "";
        for(let i = 0; i < ingredients.length; i++) {
            let obj = ingredients[i];
            if(!obj.ingredients_id || !obj.quantity || !obj.unit)
                return Promise.reject("ingredient does not have id, quantity, or unit ");
            obj.formula_id = id;
        }

        query = QueryGenerator.genInsConflictQuery(ingredients, 'formula_ingredients',  'ON CONFLICT (formula_id, ingredients_id) DO UPDATE SET quantity = EXCLUDED.quantity, unit = EXCLUDED.unit');
        query = query.toString();
        return db.execSingleQuery(query, []);
    }

    removeIngredients(id, ingreds) {
        let query = squel.delete()
        .from("formula_ingredients")
        .where("formula_id=?", id);
        const queryGen = new QueryGenerator(query);
        queryGen.chainOrFilter(ingreds, "ingredients_id = ?");
        let queryStr = queryGen.getQuery().toString();
        console.log(queryStr);
        //logger.debug(queryStr);
        return db.execSingleQuery(queryStr, []);
    }

    getIngredients(id) {
        let query = "SELECT DISTINCT ingredients.*, formula_ingredients.quantity, formula_ingredients.unit AS formula_unit FROM formula_ingredients INNER JOIN ingredients ON ingredients_id = ingredients.id WHERE formula_ingredients.formula_id = $1";
        return db.execSingleQuery(query, [id]);
    }

    getSkus(id) {
        let query = "SELECT * FROM sku WHERE formula_id = $1";
        return db.execSingleQuery(query, [id]);
    }

}

//const f = new Formula();
//f.search(['form', '1'], [14, 16], new Filter())
//.then(function(res) {
    //console.log(res.rows);
//})
//.catch((err) => {
    //console.log(err);

//});
//f.getIngredients(1)
//.then(function(res) {
    //console.log(res.rows);
//})
//f.removeIngredients(2, [16, 19, 13])
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//});

//f.addIngredients(2, [
    //{
        //ingredients_id: 16,
        //quantity: 0.6,
        //unit: "lbs"
    //}, 
    //{
        //ingredients_id: 19,
        //quantity: 9.9,
        //unit: "lbs"
    //},
    //{
        //ingredients_id: 13,
        //quantity: 9.5,
        //unit: "lbs"
    //}
//])
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//});
//f.update({
    //name: "newform28"
//}, 7)
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//});
//f.create({
    //name: "a formula"
//})
//.then(function(res) {
    //console.log(res);
//})
//.catch(function(err) {
    //console.log(err);
//});


module.exports = Formula;
