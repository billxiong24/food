let express = require('express');
const Scheduler = require('../app/scheduler.js');
let router = express.Router();
const Controller = require('../app/controller/controller');

const { checkGoalsWrite, checkScheduleRead, checkScheduleWrite } = require('./guard');

var HomeStyleTurkeyMeal = {
    "name": "Homestyle Turkey Meal",
    "case_upc": 123345,
    "num": 1,
    "unit_upc": 65653,
    "unit_size": "12 lbs",
    "count_per_case": 998,
    "prd_line": "Jerkin Turkin Meaty Burkins",
    "comments": "keep at 45 deg. storage temperature",
    "cases_needed": 545,
    "mfg_rate": 782.1,
    "start_time": "2019-02-19 09:00",
    "end_time": "2019-02-19 10:00",
    "man_line_num": "BMP1"
}
var HeartyApplePie = {
    "name": "Hearty Apple Pie",
    "case_upc": 123245,
    "unit_upc": 65613,
    "num": 2,
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
    "num": 3,
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
    "num": 78,
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
    "num": 90,
    "unit_upc": 61253,
    "unit_size": "2 kilograms",
    "count_per_case": 8998,
    "prd_line": "Gold",
    "comments": "keep dry- this one is partially past the line",
    "cases_needed": 515,
    "mfg_rate": 78,
    "start_time": "2019-02-19 15:00",
    "end_time": "2019-02-20 12:00",
    "man_line_num": "BMP2"
}
var ProteinBar = {
    "name": "Bananna Protein Bar",
    "case_upc": 123341,
    "num": 7998,
    "unit_upc": 652153,
    "unit_size": "5 packets",
    "count_per_case": 918,
    "prd_line": "Vitamint",
    "comments": "never expires",
    "cases_needed": 5115,
    "mfg_rate": 5115,
    "start_time": "2019-02-20 13:00",
    "end_time": "2019-02-20 14:00",
    "man_line_num": "BMP2"
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
    "start_time": "2019-02-18 13:00",
    "end_time": "2019-02-18 15:00",
    "man_line_num": "BMP1"
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
    "start_time": "2019-02-18 08:00",
    "end_time": "2019-02-19 08:00",
    "man_line_num": "BMP3"
}
var SchezuanChicken = {
    "name": "Schezuan Chicken",
    "case_upc": 121345,
    "num": 5,
    "unit_upc": 65613,
    "unit_size": "12 lbs",
    "count_per_case": 998,
    "prd_line": "Mama Chou's",
    "comments": "keep at 45 deg. storage temperature",
    "cases_needed": 200,
    "mfg_rate": 100,
    "start_time": "2019-03-04 8:00",
    "end_time": "2019-03-04 10:00",
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
            "id": 5
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
            "id": 7
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
            "id": 13
        },
        {
            "name": "Lunar New Year",
            "activities": [
                SchezuanChicken
            ],
            "enabled": false,
            "deadline": "2019-02-21",
            "author": "Yami Sugehiro",
            "id": 99
        },
        {
            "name": "Empty Bundle",
            "activities": [],
            "enabled": true,
            "deadline": "2019-02-19",
            "author": "Ulqiorra Cifer",
            "id": 123
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
            "id": 678
        }
    ],
    "man_lines": [
        {
            "name": "Boise Manufacturing Plant line number 1",
            "shrt_name": "BMP1",
            "comment": "smells bad"
        },
        {
            "name": "Boise Manufacturing Plant line number 2",
            "shrt_name": "BMP2",
            "comment": "smells bad"
        },
        {
            "name": "Boise Manufacturing Plant line number 3",
            "shrt_name": "BMP3",
            "comment": "smells bad"
        },
        {
            "name": "Dannafall Manufacturing Factory line number 1",
            "shrt_name": "DMF1",
            "comment": null
        },
        {
            "name": "Dannafall Manufacturing Factory line number 2",
            "shrt_name": "DMF2",
            "comment": null
        }
    ],
    count: 0
}

router.put('/set_enable', checkGoalsWrite, function (req, res, next) {
    let rid = req.params.id
    //// console.log(rid)
    let id = req.body.id;
    // // console.log(id)
    // // console.log(req.body)
    let enable_status = req.body.enable_status
    // console.log(req.body)
    let scheduler = new Scheduler()
    scheduler.set_enable(id, enable_status).then((success) => {
        if(success){
            res.status(200).json({
            })
        }else{
            res.status(400).json({
                error:success
            }) 
        }
    })
});

// function setEnable(id, enableStatus) {
//     var enableCount = 0;
//     for (var i = 0; i < dummySchedulerData.goals.length; i++) {
//         if (dummySchedulerData.goals[i].id == id) {
//             dummySchedulerData.goals[i].enabled = enableStatus
//             enableCount = enableCount + 1
//         }
//         //Do something
//     }
//     if (enableCount == 0) {
//         // console.log("400 error - id doesnt exist")
//     }
//     if (enableCount > 1) {
//         // console.log("500 error - multiple goal with same id")
//     }
// }

function printEnabledGoals() {
    for (var i = 0; i < dummySchedulerData.goals.length; i++) {
        if (dummySchedulerData.goals[i].enabled) {
            // console.log(dummySchedulerData.goals[i].name)
        }
        //Do something
    }
}

function getGoalNames(filter) {
    return dummySchedulerData.goals.filter(goal => goal.name.includes(filter)).map(goal => goal.name);
}

router.put('/goal_names', checkScheduleRead, function (req, res, next) {
    let filter = req.body.filter;
    // // console.log(req.body)
    let scheduler = new Scheduler()
    scheduler.get_goal_names(filter).then((goal_names) => {
        res.status(200).json({
            goal_names: goal_names
        })
    }) 
});

function getGoalUserNames(filter) {
    return Array.from(new Set(dummySchedulerData.goals.filter(goal => goal.author.includes(filter)).map(goal => goal.author)));
}

router.put('/goal_user_names', checkScheduleRead, function (req, res, next) {
    let filter = req.body.filter;
    let scheduler = new Scheduler()
    scheduler.get_goal_usernames(filter).then((goal_user_names) => {
        res.status(200).json({
            goal__user_names: goal_user_names
        })
    })
});

// write
router.put('/autoschedule', function (req, res, next) {
    let activities = req.body.activities;
    let start_time = req.body.start_time;
    let end_time = req.body.end_time;
    let man_lines = req.body.man_lines;
    let scheduler = new Scheduler();
    if(checkScheduleWrite(req, res, next, man_lines)) {
      scheduler.autoschedule(activities, start_time, end_time, man_lines).then((res2) => {
          // console.log(goals)
          res.status(200).json(res2)
      })
    }
})

router.put('/filtered_goals', checkScheduleRead, function (req, res, next) {
    let filter = req.body.filter;
    let filter_type_index = req.body.filter_type_index
    let scheduler = new Scheduler()
    scheduler.get_filtered_goals(filter, filter_type_index).then((filtered_goals) => {
        res.status(200).json({
            filtered_goals: filtered_goals
        })
    }) 
});

router.put('/get_report', checkScheduleRead, function(req, res, next){
    let id = req.body.id
    let start_time = req.body.start_time
    let end_time = req.body.end_time
    let scheduler = new Scheduler()
    scheduler.get_report(id,start_time,end_time).then((activities) => {
        res.status(200).json({
            activities
        })
    })
})

// write
router.put('/schedule', function (req, res, next) {
    let id = req.body.id;
    let start_time = req.body.start_time
    let end_time = req.body.end_time
    let man_line_num = req.body.man_line_num
    let mg_id = req.body.mg_id;

    // var foundCount = 0;
    // let success = scheduler.set_schedule(id, start_time, end_time, man_line_num)
    // // console.log(success)
    // for (var i = 0; i < activities.length; i++) {
    //     if (activities[i].num == id) {
    //         activities[i].start_time = start_time
    //         activities[i].end_time = end_time
    //         activities[i].man_line_num = man_line_num
    //         foundCount = foundCount + 1
    //     }
    // }
    // if (foundCount == 0) {
    //     // // console.log("400 error - id doesnt exist")
    //     return res.status(400).json({
    //         error: "id doesnt exist"
    //     })
    // }
    // if (foundCount > 1) {
    //     return res.status(500).json({
    //         error: "multiple activities with the same id"
    //     })
    // }
    // return res.status(200).json({
        
    // })
    console.log(mg_id)
    let scheduler = new Scheduler()

    // if(!man_line_num) {
      scheduler.set_schedule(id, start_time, end_time, man_line_num, mg_id).then((success) => {
        res.status(200).json({

        })
      })
    // } else {
    //   scheduler.getManlineId(man_line_num).then((manlineID) => {
    //     if(checkScheduleWrite(req, res, next, [manlineID])) {
    //       scheduler.set_schedule(id, start_time, end_time, man_line_num, mg_id).then((success) => {
    //         res.status(200).json({
  
    //         })
    //       })
    //     }
    //   })
    // }
});

function scheduleActivity(id, start_time, end_time, man_line_num) {
    var foundCount = 0;
    
    for (var i = 0; i < activities.length; i++) {
        if (activities[i].num == id) {
            activities[i].start_time = start_time
            activities[i].end_time = end_time
            activities[i].man_line_num = man_line_num
            foundCount += 1
            // // console.log(activities[i])
        }
    }
    if (foundCount == 0) {
        // console.log("400 error - id doesnt exist")
    }
    if (foundCount > 1) {
        // console.log("500 error - multiple activities with same id")
    }
}

router.get('/goals', checkScheduleRead, function (req, res, next) {
    let scheduler = new Scheduler()
    scheduler.get_goals().then((goals) => {
        // console.log(goals)
        res.status(200).json({
            goals: goals
        })
    }) 
});

router.get('/man_lines', checkScheduleRead, function (req, res, next) {
    let scheduler = new Scheduler()
    scheduler.get_man_lines().then((man_lines) => {
        res.status(200).json({
            man_lines: man_lines
        })
    }) 
});


module.exports = router;
