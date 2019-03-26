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
        var that = this;
        // // console.log(filter)
        let query = `UPDATE manufacturing_goal
        SET enabled = ${enable_status}
        WHERE id = ${id}
        `
        // console.log(query)
        return db.execSingleQuery(query, [])
        .then(function(res){
            return true
        })
        .catch(function(error){
            return error
        })
    }

    get_goal_names(filter){
        var that = this;
        let goal_names = []
        let query = `SELECT DISTINCT
        manufacturing_goal.name
        FROM manufacturing_goal 
        WHERE name LIKE \'%${filter}%\'
        `
        return db.execSingleQuery(query, [])
        .then(function(res){
            res.rows.forEach(function(row){
                goal_names.push(row.name)
            })
            return goal_names
        })
    }

    get_goal_usernames(filter){
        var that = this;
        // // console.log(filter)
        let goal_user_names = []
        let query = `SELECT DISTINCT
        *
                FROM (
                    SELECT 
                    users.uname as name
                    FROM
                    manufacturing_goal
                    INNER JOIN users on manufacturing_goal.user_id = users.id
                ) AS foo
        WHERE name LIKE \'%${filter}%\'
        `
        return db.execSingleQuery(query, [])
        .then(function(res){
            res.rows.forEach(function(row){
                goal_user_names.push(row.name)
            })
            return goal_user_names
        })
    }

    get_report(id, raw_start_time, raw_end_time){
        var that = this;
        let query = `
        SELECT
            mg_id as activity_mg_id,
            sku_id,
            case_quantity as activity_case_quantity,
            start_time as activity_start_time,
            end_time as activity_end_time,
            man_line_id as activity_man_line_id,
            sku_name,
            sku_num,
            sku_case_upc,
            sku_unit_upc,
            sku_unit_size,
            sku_count_per_case,
            sku_prd_line,
            form_id,
            sku_formula_scale,
            sku_man_rate,
            sku_man_setup_cost,
            sku_man_run_cost,
            formula_id,
            ingredients_id,
            quantity as ingredients_quantity,
            bar.unit as ingredients_unit,
            formula.name as formula_name,
            formula.num as formula_num,
            ingredients.name as ingredients_name,
            ingredients.num as ingredients_num,
            vend_info as ingredients_vend_info,
            pkg_cost as ingredients_pkg_cost,
            pkg_size as ingredients_pkg_size
        FROM (
            SELECT * FROM (
                SELECT 
                    mg_id,
                    sku_id,
                    quantity as case_quantity,
                    start_time,
                    end_time,
                    man_line_id,
                    name as sku_name, 
                    num as sku_num,
                    case_upc as sku_case_upc,
                    unit_upc as sku_unit_upc,
                    unit_size as sku_unit_size,
                    count_per_case as sku_count_per_case,
                    prd_line as sku_prd_line,
                    formula_id as form_id,
                    formula_scale as sku_formula_scale,
                    man_rate as sku_man_rate,
                    man_setup_cost as sku_man_setup_cost,
                    man_run_cost as sku_man_run_cost
                FROM manufacturing_goal_sku 
                    INNER JOIN sku ON manufacturing_goal_sku.sku_id = sku.id 
                    WHERE man_line_id = ${id} and((start_time > ${raw_start_time} and start_time < ${raw_end_time}) or (end_time > ${raw_start_time} and end_time < ${raw_end_time}) or (start_time < ${raw_start_time} and end_time > ${raw_end_time}))
                ) AS foo 
                INNER JOIN formula_ingredients on foo.form_id = formula_ingredients.formula_id
            ) AS bar 
        INNER JOIN formula ON formula.id = bar.form_id
        INNER JOIN ingredients ON bar.ingredients_id = ingredients.id
        `
        return db.execSingleQuery(query, [])
        .then(function(res){
            let sku_map = {}
            let ing_map = {}
            let form_map = {}
            let act_map = {}
            let form_ing_map ={}
            res.rows.forEach(function(row){
                console.log(row)
                let ingredient = {}
                let formula = {}
                let activity = {}
                let sku = {}
                for (var property in row) {
                    if (row.hasOwnProperty(property)) {
                        if(property.startsWith("activity_")){
                            activity[property.replace("activity_", "")] = row[property]
                        }else if(property.startsWith("formula_")){
                            formula[property.replace("formula_", "")] = row[property]
                        }else if(property.startsWith("ingredients_")){
                            ingredient[property.replace("ingredients_", "")] = row[property]
                        }else if(property.startsWith("sku_")){
                            sku[property.replace("sku_", "")] = row[property]
                        }
                    }
                }
                console.log(ingredient)
                console.log(formula)
                console.log(activity)
                console.log(sku)
                act_key = String(sku.id) + " " + String(activity.mg_id) 
                if(!act_map.hasOwnProperty(act_key)){ 
                    act_map[act_key] = {...activity,...sku}
                    act_map[act_key].formula = formula
                    act_map[act_key].formula.ingredients = []
                }
                act_map[act_key].formula.ingredients.push(ingredient)
            })
            let activities = []
            for (var property in act_map){
                activities.push(act_map[property])
            }
            return activities
        })
    }

    get_filtered_goals(filter, filter_type_index){
        var that = this;
        let filtered_goals = []
        let field = "name"
        if(filter_type_index == 1){
            field = "uname"
        }
        let query = `
        SELECT
        *,
        users.uname
        FROM ( 
        SELECT
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
        ) AS foo
        INNER JOIN users ON foo.user_id = users.id
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
                    "author": row.uname,
                    author_id:row.user_id,
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
                    filtered_goals.push(goals_id_map[id])
                }
            }
            if(filter_type_index==0){
                return filtered_goals.filter(goal => goal.name.indexOf(filter) != -1)
            }
            return filtered_goals.filter(goal => goal.author.indexOf(filter) != -1)
        })
    }

    set_schedule(id, raw_start_time, raw_end_time, raw_man_line_shrt_name){
        var that = this;
        // // console.log(filter)
        let start_time
        let end_time
        let man_line_shrt_name
        let query
        // console.log(raw_start_time)
        // console.log(raw_end_time)
        // console.log(raw_man_line_shrt_name)
        if(raw_start_time === null){
            start_time = 0
        }else{
            start_time = new Date(raw_start_time).getTime()
        }
        if(raw_end_time === null){
            end_time = 0
        }else{
            end_time = new Date(raw_end_time).getTime()
        }
        if(raw_man_line_shrt_name === null){
            man_line_shrt_name = "empty"
        }else{
            man_line_shrt_name = raw_man_line_shrt_name
        }
        // console.log(start_time)
        // console.log(end_time)
        // console.log(man_line_shrt_name)
        // let query = `UPDATE 
        // manufacturing_goal_sku 
        // (
        //     SELECT
        //     id as man_line_id
        //     FROM manufacturing_line
        //     WHERE 
        //     manufacturing_line.shortname = ${man_line_shrt_name}
        // ) AS foo
        // SET 
        // manufacturing_goal_sku.start_time = ${start_time},
        // end_time = ${end_time}
        // man_line_id = foo.man_line_id
        // WHERE 
        // manufacturing_goal_sku.sku_id = ${id}
        // `
        query = `UPDATE 
        manufacturing_goal_sku
        SET 
        start_time = ${start_time},
        end_time = ${end_time},
        man_line_id = foo.id
        FROM
        (
            SELECT
            manufacturing_line.id
            FROM 
            manufacturing_line
            WHERE manufacturing_line.shortname LIKE \'${man_line_shrt_name}\'
        ) AS foo
        WHERE 
        manufacturing_goal_sku.sku_id = ${id}
        `
        return db.execSingleQuery(query, [])
        .then(function(res){
            return true
        })
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
        //// console.log(time)
        let date = new Date(time)
        //// console.log(date.toString())
        return `${date.getUTCFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${( "0" +date.getDate()).slice(-2)} ${( "0" +date.getHours()).slice(-2)}:${("0" +date.getMinutes()).slice(-2)}:${("0" +date.getSeconds()).slice(-2)}`
    }

    get_date_string_day(raw_time){
        let time = parseInt(raw_time)
        if(time == 0){
            return null
        }
        //// console.log(time)
        let date = new Date(time)
        //// console.log(date.toString())
        return `${date.getUTCFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${( "0" +date.getDate()).slice(-2)}`
    }

    get_goals(){
        var that = this;
        let filtered_goals = []
        let query = `
        SELECT
        *,
        users.uname
        FROM ( 
        SELECT
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
        ) AS foo
        INNER JOIN users ON foo.user_id = users.id
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
                    "man_line_num": that.get_zero_null(row.shortname)
                }
                let goal = {
                    "name": row.mg_name,
                    "activities": [
                       activity
                    ],
                    "enabled": row.enabled,
                    "deadline": that.get_date_string_day(row.deadline),
                    "author": row.uname,
                    author_id:row.user_id,
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
                    filtered_goals.push(goals_id_map[id])
                }
            }
            return filtered_goals
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
                    "possible_skus":[row.sku_id]
                }
                
                if(typeof(man_line_id_map[man_line.id]) === "undefined"){
                    man_line_id_map[man_line.id] = man_line
                }else{
                    man_line_id_map[man_line.id].possible_skus.push(row.sku_id)
                }
            })
            for (var id in man_line_id_map) {
                if (man_line_id_map.hasOwnProperty(id)) {
                    man_lines.push(man_line_id_map[id])
                }
            }
            // console.log(man_lines)
            return man_lines
        })
    }

  
}

module.exports = Scheduler;
