const error_controller = require('../app/controller/error_controller');
const Controller = require('../app/controller/controller');
const SalesTracker = require('../app/sales_tracker');


function retrieveSalesRecords(years, prodlines, customers) {
    let st = new SalesTracker();
    return st.search(null, years, prodlines, customers, true)
}
// receive message from master process
process.on('message', (message) => {
    retrieveSalesRecords(message.years, message.prodlines, message.customers)
    .then(function(result) {
        process.send({ rows: result.rows });
    });
});

