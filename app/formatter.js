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
        let fields = {};
        for(let i = 0; i < jsonList.length; i++) {
            let obj = jsonList[i];
            for(let key in obj) {
                fields.key = true;
            }
        }
        let header = [];
        for(let k in fields) {
            header.push(fields[k]);
        }

        const opts = { header };
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
