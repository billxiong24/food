
var HomeStyleTurkeyMeal = {
    "name": "Homestyle Turkey Meal",
    "case_upc": 123345,
    "num": 123456,
    "unit_upc": 65653,
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
    "case_upc": 123245,
    "unit_upc": 65613,
    "num": 123457,
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
    "case_upc": 121245,
    "unit_upc": 65633,
    "num": 123458,
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
    "case_upc": 123345,
    "num": 123459,
    "unit_upc": 65253,
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
    "case_upc": 113345,
    "num": 123460,
    "unit_upc": 61253,
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
    "case_upc": 123341,
    "num": 123461,
    "unit_upc": 652153,
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
    "case_upc": 1233211,
    "num": 79918,
    "unit_upc": 65253,
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
    "case_upc": 1233111,
    "num": 79938,
    "unit_upc": 652523,
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
    "case_upc": 121345,
    "num": 123466,
    "unit_upc": 65613,
    "unit_size": "12 lbs",
    "count_per_case": 998,
    "prd_line": "Mama Chou's",
    "comments": "keep at 45 deg. storage temperature",
    "cases_needed": 200,
    "mfg_rate": 100,
    "start_time": "2019-03-04 8:00:00",
    "end_time": "2019-03-04 10:00:00",
    "man_line_num": "DMF1"
}
var MonsterBoost = {
    "name": "Monster Boost",
    "case_upc": 1231145,
    "num": 781,
    "unit_upc": 6532153,
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
            "author": "Yami Sugehiro",
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
            "author": "Zion Williamson",
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
            "author": "Santa Claus",
            "id": 34567
        },
        {
            "name": "Lunar New Year",
            "activities": [
                SchezuanChicken
            ],
            "enabled": false,
            "deadline": "2019-02-21",
            "author": "Yami Sugehiro",
            "id": 45678
        },
        {
            "name": "Empty Bundle",
            "activities": [],
            "enabled": true,
            "deadline": "2019-02-19",
            "author": "Ulqiorra Cifer",
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
            "author": "Robert Parr",
            "id": 67890
        }
    ],
    "man_lines": [
        {
            "name": "Boise Manufacturing Plant line number 1",
            "shrt_name": "BMP1",
            "comment": "smells bad",
            "id":1234
        },
        {
            "name": "Boise Manufacturing Plant line number 2",
            "shrt_name": "BMP2",
            "comment": "smells bad",
            "id":1235
        },
        {
            "name": "Boise Manufacturing Plant line number 3",
            "shrt_name": "BMP3",
            "comment": "smells bad",
            "id":1236
        },
        {
            "name": "Dannafall Manufacturing Factory line number 1",
            "shrt_name": "DMF1",
            "comment": null,
            "id":1237
        },
        {
            "name": "Dannafall Manufacturing Factory line number 2",
            "shrt_name": "DMF2",
            "comment": null,
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
  activies.forEach(activity => {
    let goals = activity.goals
    goals.forEach(goal => {
      console.log(`${goal.id} ${activity.num} ${activity.cases_needed} ${(new Date(activity.start_time)).getTime()} ${(new Date(activity.end_time)).getTime()} ${getManLine(activity.man_line_num)}`)
    })
  })
}

function sql_sku(skus){
    skus.forEach(sku => {
        console.log(`${sku.name} ${sku.num} ${sku.case_upc} ${sku.unit_upc} ${sku.unit_size} ${sku.count_per_case} ${sku.prd_line} ${sku.comments} ${sku.num} ${(1 + Math.floor(Math.random() * 5))} ${(1.5 + Math.floor(Math.random() * 2))} ${sku.mfg_rate}`)
    })
}

function sql_manufacturing_goals(goals){
    goals.forEach(goal => {
        
    })
}

// sql_manufacturing_goals_sku(getActivities(dummySchedulerData.goals))
sql_sku(skus)
