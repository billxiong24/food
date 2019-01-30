const Json2csvParser = require('json2csv').Parser;


class Formatter {

    constructor(format) {
        this.format = format;
    }

    generateFormat(jsonList) {
        if(this.format === 'csv') {
            return this.generateCSV(jsonList);
        }
        else if(this.format === 'pdf'){
            return null;
        }
        
        return null;
    }

    generateCSV(jsonList) {
        if(jsonList.length === 0)
            return "";
        let fields = [];
        let obj = jsonList[0];
        for(let key in obj) {
            fields.push(key);
        }

        const opts = { fields };
        let csv = null;

        try {
          const parser = new Json2csvParser(opts);
          csv = parser.parse(jsonList);
        } 
        catch (err) {
            throw err;
        }
        return csv;
    }

    formatHeaders() {

    }
}

module.exports = Formatter;
