
var HomeStyleTurkeyMeal = {
    "name": "Homestyle Turkey Meal",
    "case_upc": 12311345,
    "num": 12113456,
    "unit_upc": 6561153,
    "unit_size": "12 lbs",
    "count_per_case": 998,
    "prd_line": "Jerkin Turkin Meaty Burkins",
    "comments": "keep at 45 deg. storage temperature",
    "cases_needed": 545,
    "mfg_rate": 782.1,
    "start_time": "2019-02-19 09:00:00",
    "end_time": "2019-02-19 10:00:00",
    "man_line_num": "BMP1"
}
var HeartyApplePie = {
    "name": "Hearty Apple Pie",
    "case_upc": 12311245,
    "unit_upc": 6561113,
    "num": 12113457,
    "unit_size": "2 lbs",
    "count_per_case": 12,
    "prd_line": "Aunt Jemina Bakery",
    "comments": "smells wierd on Tuesdays",
    "cases_needed": 525,
    "mfg_rate": 21.4,
    "start_time": null,
    "end_time": null,
    "man_line_num": null
}
// goals and deadlines list
// completion time
// start and end time

var ChocolatePudding = {
    "name": "Chocolate Pudding",
    "case_upc": 12111245,
    "unit_upc": 6561133,
    "num": 12113458,
    "unit_size": "4 lbs",
    "count_per_case": 100,
    "prd_line": "Jell-O",
    "comments": "Contains Gellatine",
    "cases_needed": 2000,
    "mfg_rate": 100,
    "start_time": null,
    "end_time": null,
    "man_line_num": null
}
var VitaminWater = {
    "name": "Vitamin Water",
    "case_upc": 12113345,
    "num": 12311459,
    "unit_upc": 6511253,
    "unit_size": "50 fl. oz",
    "count_per_case": 98,
    "prd_line": "Vitamint",
    "comments": "never expires",
    "cases_needed": 5115,
    "mfg_rate": 782.1,
    "start_time": null,
    "end_time": null,
    "man_line_num": null
}
var ProteinPowder = {
    "name": "Isohydrolzed Whey Protein",
    "case_upc": 11311345,
    "num": 12113460,
    "unit_upc": 6125113,
    "unit_size": "2 kilograms",
    "count_per_case": 8998,
    "prd_line": "Gold",
    "comments": "keep dry- this one is partially past the line",
    "cases_needed": 515,
    "mfg_rate": 78,
    "start_time": "2019-02-19 15:00:00",
    "end_time": "2019-02-20 12:00:00",
    "man_line_num": "BMF2"
}
var ProteinBar = {
    "name": "Bananna Protein Bar",
    "case_upc": 12331141,
    "num": 12311461,
    "unit_upc": 65112153,
    "unit_size": "5 packets",
    "count_per_case": 918,
    "prd_line": "Vitamint",
    "comments": "never expires",
    "cases_needed": 5115,
    "mfg_rate": 5115,
    "start_time": "2019-02-20 13:00:00",
    "end_time": "2019-02-20 14:00:00",
    "man_line_num": "BMF2"
}
var OrangeBoost = {
    "name": "Orange Boost",
    "case_upc": 123311211,
    "num": 7911918,
    "unit_upc": 6511253,
    "unit_size": "5 sachets",
    "count_per_case": 98,
    "prd_line": "Vitamint",
    "comments": "never expires",
    "cases_needed": 5115,
    "mfg_rate": 5115,
    "start_time": "2019-02-18 13:00:00",
    "end_time": "2019-02-18 15:00:00",
    "man_line_num": "BMF1"
}
var RainbowPowder = {
    "name": "Rainbow Powder",
    "case_upc": 123113111,
    "num": 7991138,
    "unit_upc": 65252113,
    "unit_size": "10 bags",
    "count_per_case": 918,
    "prd_line": "Cherry Farms",
    "comments": "never expires",
    "cases_needed": 100,
    "mfg_rate": 10,
    "start_time": "2019-02-18 8:00:00",
    "end_time": "2019-02-18 18:00:00",
    "man_line_num": "BMF3"
}
var SchezuanChicken = {
    "name": "Schezuan Chicken",
    "case_upc": 12111345,
    "num": 12311466,
    "unit_upc": 6511613,
    "unit_size": "12 lbs",
    "count_per_case": 998,
    "prd_line": "Mama Chous",
    "comments": "keep at 45 deg. storage temperature",
    "cases_needed": 200,
    "mfg_rate": 100,
    "start_time": "2019-03-04 8:00:00",
    "end_time": "2019-03-04 10:00:00",
    "man_line_num": "DMF1"
}
var MonsterBoost = {
    "name": "Monster Boost",
    "case_upc": 123111145,
    "num": 78111,
    "unit_upc": 653211153,
    "unit_size": "50 fl. oz",
    "count_per_case": 98,
    "prd_line": "Vitamint",
    "comments": "never expires",
    "cases_needed": 20,
    "mfg_rate": 10,
    "start_time": null,
    "end_time": null,
    "man_line_num": null
}

var activities = [
    HomeStyleTurkeyMeal,
    HeartyApplePie,
    ChocolatePudding,
    VitaminWater,
    ProteinPowder,
    ProteinBar,
    OrangeBoost,
    RainbowPowder,
    SchezuanChicken,
    MonsterBoost
]

var skus = [
    HomeStyleTurkeyMeal,
    HeartyApplePie,
    ChocolatePudding,
    VitaminWater,
    ProteinPowder,
    ProteinBar,
    OrangeBoost,
    RainbowPowder,
    SchezuanChicken,
    MonsterBoost
]


var dummySchedulerData = {
    "goals": [
        {
            "name": "Thanksgiving Bundle",
            "activities": [
                HomeStyleTurkeyMeal,
                HeartyApplePie,
                ChocolatePudding
            ],
            "enabled": true,
            "deadline": "2019-02-19",
            "author": 12,
            "id": 12345
        },
        {
            "name": "Sports Pack",
            "activities": [
                VitaminWater,
                ProteinPowder,
                ProteinBar,
                OrangeBoost,
                RainbowPowder
            ],
            "enabled": true,
            "deadline": "2019-02-19",
            "author": 13,
            "id": 23456
        },
        {
            "name": "Christmas Bag",
            "activities": [
                HomeStyleTurkeyMeal,
                HeartyApplePie,
                ChocolatePudding,
                VitaminWater
            ],
            "enabled": false,
            "deadline": "2019-02-21",
            "author": 14,
            "id": 34567
        },
        {
            "name": "Lunar New Year",
            "activities": [
                SchezuanChicken
            ],
            "enabled": false,
            "deadline": "2019-02-21",
            "author": 12,
            "id": 45678
        },
        {
            "name": "Empty Bundle",
            "activities": [],
            "enabled": true,
            "deadline": "2019-02-19",
            "author": 15,
            "id": 56789
        },
        {
            "name": "Super Pack",
            "activities": [
                VitaminWater,
                MonsterBoost
            ],
            "enabled": true,
            "deadline": "2019-02-22",
            "author": 16,
            "id": 67890
        }
    ],
    "man_lines": [
        {
            "name": "Boise Manufacturing Plant 1",
            "shrt_name": "BMP1",
            "comment": "smells bad",
            "id":1234
        },
        {
            "name": "Boise Manufacturing Plant 2",
            "shrt_name": "BMP2",
            "comment": "smells bad",
            "id":1235
        },
        {
            "name": "Boise Manufacturing Plant 3",
            "shrt_name": "BMP3",
            "comment": "smells bad",
            "id":1236
        },
        {
            "name": "Dub Manufacturing Factory 1",
            "shrt_name": "DMF1",
            "comment": "located in Marca, Venuzuela",
            "id":1237
        },
        {
            "name": "Dub Manufacturing Factory 2",
            "shrt_name": "DMF2",
            "comment": "Located in St. George, Alabama",
            "id":1238
        }
    ],
    count: 0
}
function getActivities(goals){
  var activities_map = {}
  for(var i = 0; i < goals.length; i++){
    let {activities, ...goal} = goals[i]
    for(var j = 0; j < activities.length; j++){
      let activity = activities[j]
      if(typeof(activities_map[activity.num]) === "undefined"){
          activities_map[activity.num] = {
            ...activity,
            goals:[goal],
            completion_time:Math.ceil(activity.cases_needed/activity.mfg_rate)
          }
      }else{
          activities_map[activity.num].goals.push(goal)
      }
    }
  }
  var activities = []
  for (var num in activities_map) {
    if (activities_map.hasOwnProperty(num)) {
        activities.push(activities_map[num])
    }
  }
  return activities
}

function filterScheduledActivities(activities){
  return activities.filter(activity => activity.start_time != null && activity.end_time != null && activity.man_line_num != null)
}

function getManLine(man_line_shrt_name){
    if(man_line_shrt_name == null){
        return 0
    }
    // console.log(man_line_shrt_name)
    // console.log(dummySchedulerData.man_lines.filter(man_line => man_line.shrt_name = man_line_shrt_name).map(man_line => man_line.id))
    return dummySchedulerData.man_lines.filter(man_line => man_line.shrt_name = man_line_shrt_name).map(man_line => man_line.id)[0]
}

function sql_manufacturing_goals_sku(activies){
  console.log("INSERT INTO manufacturing_goal_sku (mg_id,sku_id,quantity,start_time,end_time,man_line_id)")
  console.log("VALUES")
  activies.forEach(function(activity, index1, array1){
    let goals = activity.goals
    goals.forEach(function(goal, index, array){
      console.log(`(${goal.id},${activity.num},${activity.cases_needed},${(new Date(activity.start_time)).getTime()},${(new Date(activity.end_time)).getTime()},${getManLine(activity.man_line_num)})`)
      if((index1 < array1.length - 1) || (index < array.length -1)){console.log(",")}
    })
  })
  console.log(";")
}

function sql_sku(skus){
    console.log("INSERT INTO sku (name,num,case_upc,unit_upc,unit_size,count_per_case,prd_line,comments,id,formula_id,formula_scale,man_rate)")
    console.log("VALUES")
    skus.forEach(function(sku, index, array){
        console.log(`(\'${sku.name}\',${sku.num},${sku.case_upc},${sku.unit_upc},\'${sku.unit_size}\',${sku.count_per_case},\'${sku.prd_line}\',\'${sku.comments}\',${sku.num},${(1 + 2* Math.floor(Math.random() * 2))},${(1.5 + Math.floor(Math.random() * 2))},${sku.mfg_rate})`)
        if(index < array.length - 1){console.log(",")}
    })
    console.log(";")
}
/*

2
3
4
INSERT INTO table (column1, column2, …)
VALUES
 (value1, value2, …),
 (value1, value2, …) ,...;
*/
function sql_manufacturing_goals(goals){
    console.log("INSERT INTO manufacturing_goal (id,name,user_id,deadline,enabled)")
    console.log("VALUES")
    goals.forEach(function(goal, index, array){
        console.log(`(${goal.id},\'${goal.name}\',${goal.author},${(new Date(goal.deadline)).getTime()},${goal.enabled})`)
        if(index < array.length - 1){console.log(",")}
    })
    console.log(";")
}

function get_user_names(goals){
    return Array.from(new Set(goals.map(goal => goal.author)))
} 

function get_prod_lines(skus){
    let prod_lines = Array.from(new Set(skus.map(sku => sku.prd_line)))
    console.log("INSERT INTO productline (name, id)")
    console.log("VALUES")
    prod_lines.forEach(function(prod_line, index, array){
        console.log(`(\'${prod_line}\',${100 + Math.round(Math.random() * 1000)})`)
        if(index < array.length - 1){console.log(",")}
    })
    console.log(";")
}

function sql_get_man_lines(man_lines){
    console.log("INSERT INTO manufacturing_line (id,name,shortname,comment)")
    console.log("VALUES")
    man_lines.forEach(function(man_line, index, array){
        console.log(`(${man_line.id},\'${man_line.name}\',\'${man_line.shrt_name}\',\'${man_line.comment}\')`)
        if(index < array.length - 1){console.log(",")}
    })
    console.log(";")
}

function sql_empty_man_line(){
    console.log("INSERT INTO manufacturing_line (id,name,shortname,comment)")
    console.log("VALUES")
    console.log(`(${0},\'${"empty"}\',\'${"empty"}\',\'${"empty"}\')`)
    console.log(";")
}

function sql_get_man_line_sku(man_lines, skus){
    sku_ids = skus.map(sku => sku.num)
    console.log("INSERT INTO manufacturing_line_sku (sku_id,manufacturing_line_id)")
    console.log("VALUES")
    man_lines.forEach(function(man_line, index1, array1){
        sku_ids.forEach(function(sku_id, index2, array2){
            console.log(`(${sku_id},${man_line.id})`)
            if((index1 < array1.length - 1) || (index2 < array2.length -1)){console.log(",")}
        })
        
    })
    console.log(";")

}



sql_manufacturing_goals_sku(getActivities(dummySchedulerData.goals))
// sql_sku(skus)
//get_prod_lines(skus)
//sql_get_man_lines(dummySchedulerData.man_lines)
//sql_get_man_line_sku(dummySchedulerData.man_lines, skus)
//sql_empty_man_line()

function get_date_string(date){
    return `${date.getUTCFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${( "0" +date.getDate()).slice(-2)} ${( "0" +date.getHours()).slice(-2)}:${("0" +date.getMinutes()).slice(-2)}:${("0" +date.getSeconds()).slice(-2)}`
}

function get_date_string_day(date){
    return `${date.getUTCFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${( "0" +date.getDate()).slice(-2)}`
}

a = (new Date("2019-02-22")).getTime()
console.log(a)
date = new Date(a)
console.log(date.toString())
console.log(get_date_string_day(new Date(a)))