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

    get_zero_null(num){
        if(num == 0 || num == "empty"){
            return null
        }else{
            return num
        }
    }

    
    get_date_string(raw_time){
        let time = parseInt(raw_time)
        if(time == 0){
            return null
        }
        //console.log(time)
        let date = new Date(time)
        //console.log(date.toString())
        return `${date.getUTCFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${( "0" +date.getDate()).slice(-2)} ${( "0" +date.getHours()).slice(-2)}:${("0" +date.getMinutes()).slice(-2)}:${("0" +date.getSeconds()).slice(-2)}`
    }

    get_date_string_day(raw_time){
        let time = parseInt(raw_time)
        if(time == 0){
            return null
        }
        //console.log(time)
        let date = new Date(time)
        //console.log(date.toString())
        return `${date.getUTCFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${( "0" +date.getDate()).slice(-2)}`
    }

    get_goals(){
        var that = this;
        let goals = []
        let query = `SELECT
        manufacturing_goal_sku.mg_id,
        manufacturing_goal_sku.sku_id,
        manufacturing_goal_sku.quantity,
        manufacturing_goal_sku.start_time,
        manufacturing_goal_sku.end_time,
        manufacturing_goal_sku.man_line_id,
        manufacturing_goal.name as mg_name,
        manufacturing_goal.user_id,
        manufacturing_goal.deadline,
        enabled,
        manufacturing_goal.name,
        sku.name as sku_name,
        sku.num,
        sku.case_upc,
        sku.unit_upc,
        sku.unit_size,
        sku.count_per_case,
        sku.prd_line,
        sku.comments,
        sku.formula_id,
        sku.formula_scale,
        sku.man_rate,
        manufacturing_line.shortname
        FROM manufacturing_goal_sku 
        INNER JOIN manufacturing_goal on manufacturing_goal_sku.mg_id= manufacturing_goal.id  
        INNER JOIN sku ON manufacturing_goal_sku.sku_id=sku.id
        INNER JOIN manufacturing_line ON manufacturing_goal_sku.man_line_id=manufacturing_line.id 
        `
        return db.execSingleQuery(query, [])
        .then(function(res){
            let goals_id_map = {}
            let goals = []
            res.rows.forEach(function(row){
                let activity = {
                    "name": row.sku_name,
                    "case_upc": parseInt(row.case_upc),
                    "num": row.sku_id,
                    "unit_upc": parseInt(row.unit_upc),
                    "unit_size": row.unit_size,
                    "count_per_case": row.count_per_case,
                    "prd_line": row.prd_line,
                    "comments": row.comments,
                    "cases_needed": parseInt(row.quantity),
                    "mfg_rate": parseInt(row.man_rate),
                    "start_time": that.get_date_string(row.start_time),
                    "end_time": that.get_date_string(row.end_time),
                    "man_line_num": that.get_zero_null(row.man_line_id)
                }
                let goal = {
                    "name": row.mg_name,
                    "activities": [
                       activity
                    ],
                    "enabled": row.enabled,
                    "deadline": that.get_date_string_day(row.start_time),
                    "author": row.user_id,
                    "id": row.mg_id
                }
                if(typeof(goals_id_map[goal.id]) === "undefined"){
                    goals_id_map[goal.id] = goal
                }else{
                    goals_id_map[goal.id].activities.push(activity)
                }
            })
            for (var id in goals_id_map) {
                if (goals_id_map.hasOwnProperty(id)) {
                    goals.push(goals_id_map[id])
                }
            }
            console.log(goals)
            return goals
        })
    }

    get_man_lines(){
        var that = this;
        let man_lines = []
        let query = `SELECT
        manufacturing_line.id,
        manufacturing_line.shortname as shrt_name,
        manufacturing_line.comment,
        manufacturing_line.name,
        manufacturing_line_sku.sku_id
        FROM manufacturing_line 
        INNER JOIN manufacturing_line_sku on manufacturing_line.id= manufacturing_line_sku.manufacturing_line_id 
        `
        return db.execSingleQuery(query, [])
        .then(function(res){
            let man_line_id_map = {}
            res.rows.forEach(function(row){
                let man_line = {
                    "name": row.name,
                    "shrt_name": row.shrt_name,
                    "comment": row.comment,
                    "id":row.id,
                    "possible_skus":[sku_id]
                }
                
                if(typeof(man_line_id_map[man_line.id]) === "undefined"){
                    man_line_id_map[man_line.id] = man_line
                }else{
                    man_line_id_map[man_line.id].possible_skus.push(sku_id)
                }
            })
            for (var id in man_line_id_map) {
                if (man_line_id_map.hasOwnProperty(id)) {
                    man_lines.push(man_line_id_map[id])
                }
            }
            console.log(man_lines)
            return man_lines
        })
    }

  
}

module.exports = Scheduler;
