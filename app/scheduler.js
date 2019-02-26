const db = require("./db");
const squel = require("squel").useFlavour("postgres");
const CRUD = require("./CRUD");
const Sku = require('./sku');
const Formatter = require('./formatter');
const QueryGenerator = require("./query_generator");


class Scheduler extends CRUD {
    constructor() {
        super();
        this.tableName = "manufacturing_goal";
        this.manufacturing_goal_sku = "manufacturing_goal_sku"
        this.sku = "sku"
        this.manufacturing_line = "manufacturing_line"
        this.manufacturing_line_sku = "manufacturing_line_sku"
        this.productline = "productline"
        this.manufacturing_goal = "manufacturing_goal"
    }

    search_username(user_id) {
        let query = "SELECT * FROM " + this.tableName + " WHERE user_id=$1";
        return db.execSingleQuery(query, [user_id]);
    }

    set_enable(id, enable_status){
        let success = false
        return success
    }

    get_goal_names(filter){
        let goal_names = []
        return goal_names
    }

    get_goal_usernames(filter){
        let goal_usernames = []
        return goal_usernames
    }

    get_filtered_goals(filter, filter_type_index){
        let filtered_goals = []
        return filtered_goals
    }

    set_schedule(id, start_time, end_time, man_line_num){
        let success = false
        return success
    }

    get_goals(){
        let goals = []
        let query = `SELECT
        manufacturing_goal_sku.mg_id,
        manufacturing_goal_sku.sku_id,
        manufacturing_goal_sku.quantity,
        manufacturing_goal_sku.start_time,
        manufacturing_goal_sku.end_time,
        manufacturing_goal_sku.man_line_id,
        manufacturing_goal.name,
        manufacturing_goal.user_id,
        manufacturing_goal.deadline,
        enabled,
        manufacturing_goal.name,
        sku.num,
        sku.case_upc,
        sku.unit_upc,
        sku.unit_size,
        sku.count_per_case,
        sku.prd_line,
        sku.comments,
        sku.formula_id,
        sku.formula_scale,
        sku.man_rate
        FROM manufacturing_goal_sku 
        INNER JOIN manufacturing_goal on manufacturing_goal_sku.mg_id= manufacturing_goal.id  
        INNER JOIN sku ON manufacturing_goal_sku.sku_id=sku.id 
        WHERE mg_id IN
        (
        SELECT mg_id
        FROM manufacturing_goal_sku
        WHERE start_time!=0 AND end_time!=0 AND man_line_id!=0
        )`
        db.execSingleQuery(query, [])
        .then(function(res){
            console.log(res)
            return res
        })
    }

    get_man_lines(){
        let man_lines = []
        return man_lines
    }

  
}

module.exports = Scheduler;
