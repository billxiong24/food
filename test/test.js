const execSync = require('child_process').execSync;
execSync("./cleandb.sh");
require('./test_sku');
require('./test_product_lines');
require('./test_manufacturing_goals');
require('./test_ingredients');
