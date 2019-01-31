const squel = require("squel").useFlavour('postgres');

class QueryGenerator {

    constructor(query) {
        this.query = query;
    }

    static transformQueryArr(arr) {
        for(let i = 0; i < arr.length; i++) {
            arr[i] = "%" + arr[i] + "%";
        }
        return arr;
    }

    static genInsQuery(dataObj, tableName) {
        let query = squel.insert()
        .into(tableName)
        .setFieldsRows([dataObj]);
        return query;
    }

    static genInsConflictQuery(dataObj, tableName, conflictCause) {
        squel.onConflictInsert = function(options) {
          return squel.insert(options, [
              new squel.cls.StringBlock(options, 'INSERT'),
              new squel.cls.IntoTableBlock(options),
              new squel.cls.InsertFieldValueBlock(options),
              new squel.cls.WhereBlock(options),
              new squel.cls.StringBlock(options, conflictCause)
            ]);
        };

        return squel.onConflictInsert()
        .into(tableName)
        .setFieldsRows([dataObj])
    }

    getQuery() {
        return this.query;
    }
    
    orderDistinct(orderKey, asc) {
        if(orderKey) {
            this.query = this.query.order(orderKey, asc);
        }
        this.query = this.query.distinct();
        return this;
    }


    chainFilter(arr, field, or=true) {
        if(!Array.isArray(arr) || arr.length === 0)
            return;

        let expr = squel.expr();
        for(let i = 0; i < arr.length; i++) {
            if(or)
                expr = expr.or(field, arr[i]);
            else
                expr = expr.and(field, arr[i]);
        }
        this.query = this.query.where(
            expr
        );
    }

    chainOrFilter(arr, field) {
        this.chainFilter(arr, field, true);
        return this;
    }

    chainAndFilter(arr, field) {
        this.chainFilter(arr, field, false);
        return this;
    }
}

module.exports = QueryGenerator;
