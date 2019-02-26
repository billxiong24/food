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
        return goals
    }

    get_man_lines(){
        let man_lines = []
        return man_lines
    }

  


module.exports = Scheduler;
