const CRUD = require('./CRUD');
const db = require("./db");
const squel = require("squel").useFlavour("postgres");
const QueryGenerator = require("./query_generator");
const Filter = require("./filter");;

class Formula extends CRUD {

    constructor() {
        super();
        this.tableName = "formula";
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

    search(names, ingredients, filter) {
        let q = squel.select()
        .from(this.tableName)
        .field("formula.*")
        .left_join("formula_ingredients", null, "formula.id=formula_ingredients.formula_id");

        //TODO search by number
        const queryGen = new QueryGenerator(q);
        names = QueryGenerator.transformQueryArr(names);
        queryGen.chainAndFilter(names, "formula.name LIKE ?")
        .chainOrFilter(ingredients, "ingredients_id=?")
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
        //logger.debug(queryStr);
        return db.execSingleQuery(queryStr, []);
    }

    getIngredients(id) {
        let query = "SELECT DISTINCT ingredients.*, formula_ingredients.quantity, formula_ingredients.unit AS formula_unit FROM formula_ingredients INNER JOIN ingredients ON ingredients_id = ingredients.id WHERE formula_ingredients.formula_id = $1";
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
