const db = require("./db");
const CRUD = require("./CRUD");
const squel = require("squel").useFlavour('postgres');
const QueryGenerator = require("./query_generator");
const Filter = require('./filter');
const Ingredient = require('./ingredient');

class ManufacturingLine extends CRUD {

    constructor() {
        super();
        this.tableName = "manufacturing_line";
    }

    search(name, filter) {
        name = '%' + name + '%';
        let query = squel.select()
        .from(this.tableName)
        .field("*");
        let expr = squel.expr();
        expr = expr.or("name LIKE ?", name);
        expr = expr.or("shortname LIKE ?", name);
        query = query.where(expr);
        let queryStr = filter.applyFilter(query).toString();
        return db.execSingleQuery(queryStr, []);
    }

    getSkus(id) {
        let query = squel.select()
        .from("sku")
        .field("sku.*")
        .join("manufacturing_line_sku", null, "sku_id = id")
        .where("manufacturing_line_id = ? ", id)
        .distinct()
        .toString();
        return db.execSingleQuery(query, []);
    }

    addSkus(id, skus) {
        let arr = [];
        for(let i = 0; i < skus.length; i++) {
            let obj = {};
            arr.push({
                manufacturing_line_id: id, 
                sku_id: skus[i]
            });
        }

        let query = QueryGenerator.genInsConflictQuery(arr, 'manufacturing_line_sku', 'ON CONFLICT DO NOTHING').toString();
        console.log(query);
        return db.execSingleQuery(query, []);
    }

    checkExisting(dataObj) {
        return db.execSingleQuery("SELECT COUNT(*) FROM " + this.tableName + " WHERE shortname = $1", [dataObj.shortname]);
    }

    create(dataObj) {
        if(!dataObj.name || !dataObj.shortname)
            return Promise.reject("Not all required fields are present.");

        let query = QueryGenerator.genInsQuery(dataObj, this.tableName).returning("*").toString();
        return super.insert(query, dataObj, "That entry exists already.");
    }

    update(dataObj, id) {
        return super.change(dataObj, id, "id");
    }

    remove(id) {
        return db.execSingleQuery("DELETE FROM " + this.tableName + " WHERE id = $1", [id]);
    }

    getSKUMapping(skus) {
        let query = squel.select()
        .from("manufacturing_line_sku")
        .field('*')
        .join(this.tableName, null, "manufacturing_line_id = manufacturing_line.id")

        const queryGen = new QueryGenerator(query);
        queryGen.chainOrFilter(skus, "sku_id = ?");
        const queryStr = queryGen.getQuery().toString();
        let getAllLinesQuery = squel.select().from(this.tableName).field("*").toString();

        let that = this;

        return db.execSingleQuery(getAllLinesQuery, [])
        .then(function(res) {
            let obj = {
                manufacturing_lines: res.rows
            }
            return db.execSingleQuery(queryStr, [])
            .then(function(t) {
                obj.mapping = t.rows;
                return that.generateSkuMapping(skus, obj.manufacturing_lines, obj.mapping);
            });
        });
    }

    generateSkuMapping(skus, lines, mappings) {
        let counts = {};

        for (let i = 0; i < mappings.length; i++) {
            let man_id = mappings[i].manufacturing_line_id;
            let sku_id = mappings[i].sku_id;
            if(!counts[man_id])
                counts[man_id] = [];
            counts[man_id].push(sku_id);
        }

        let skuMapping = {};
        skuMapping.none = [];
        skuMapping.all = [];
        skuMapping.some = [];

        for (let i = 0, len = lines.length; i < len; i++) {
            let man_id = lines[i].id;
            if(!counts[man_id]) {
                skuMapping.none.push(lines[i]);
                continue;
            }
            if(counts[man_id].length !== skus.length) {
                skuMapping.some.push(lines[i]);
            }
            else if(counts[man_id].length === skus.length){
                skuMapping.all.push(skuMapping.all.push(lines[i]));
            }
        }
        return skuMapping;
    }

    remapSkus(skus, all, none) {
        if(!none)
            none = [];
        if(!all)
            all = [];
        let allIns = this.genMapSkuDataObj(skus, all);
        let insQuery = QueryGenerator.genInsConflictQuery(allIns, "manufacturing_line_sku", "ON CONFLICT DO NOTHING").toString();

        let delQuery = squel.delete()
        .from('manufacturing_line_sku');
        let expr = squel.expr();
        for(let i = 0; i < skus.length; i++) {
            for(let j = 0; j < none.length; j++) {
                expr = expr.or("sku_id = ? AND manufacturing_line_id = ?", skus[i], none[j]);
            }
        }
        delQuery = delQuery.where(expr);
        delQuery = delQuery.toString();
        return (async () => {
            const client = await db.getSingleClient();

            try {
                await client.query('BEGIN');
                const insRows = await client.query(insQuery, []);
                const delRows = await client.query(delQuery, [])
                await client.query('COMMIT')
                return {
                    insertedRows: insRows.rowCount,
                    deletedRows: delRows.rowCount
                }
            } catch (e) {
                await client.query('ROLLBACK')
                throw e
            } finally {
                client.release()
            }
        })()
        .then(function(obj) {
            return obj;
        });
    }

    genMapSkuDataObj(skus, arr) {
        let dataObj = [];
        for(let j = 0; j < arr.length; j++) {
            for (let i = 0; i < skus.length; i++) {
                dataObj.push({
                    sku_id: skus[i],
                    manufacturing_line_id: arr[j]
                });
            }
        }

        return dataObj;
    }


};

module.exports = ManufacturingLine;
