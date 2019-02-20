let express = require('express');
const error_controller = require('../app/controller/error_controller');
let router = express.Router();

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
    "start_time": "2019-02-19 09:00:00",
    "end_time": "2019-02-19 10:00:00",
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
    "start_time": "2019-02-19 15:00:00",
    "end_time": "2019-02-20 12:00:00",
    "man_line_num": "BMF2"
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
    "num": 5,
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

var activites = [
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
                HomeStyleTurkeyMeal.num,
                HeartyApplePie.num,
                ChocolatePudding.num
            ],
            "enabled": true,
            "deadline": "2019-02-19",
            "author": "Yami Sugehiro",
            "id": 5
        },
        {
            "name": "Sports Pack",
            "activities": [
                VitaminWater.num,
                ProteinPowder.num,
                ProteinBar.num,
                OrangeBoost.num,
                RainbowPowder.num
            ],
            "enabled": true,
            "deadline": "2019-02-19",
            "author": "Zion Williamson",
            "id": 7
        },
        {
            "name": "Christmas Bag",
            "activities": [
                HomeStyleTurkeyMeal.num,
                HeartyApplePie.num,
                ChocolatePudding.num,
                VitaminWater.num
            ],
            "enabled": false,
            "deadline": "2019-02-21",
            "author": "Santa Claus",
            "id": 13
        },
        {
            "name": "Lunar New Year",
            "activities": [
                SchezuanChicken.num
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
                VitaminWater.num,
                MonsterBoost.num
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

router.post('/set_enable', function (req, res, next) {
    let id = req.params.id;
    let enable_status = req.params.enable_status
    var enableCount = 0;
    for (var i = 0; i < dummySchedulerData.goals.length; i++) {
        if (dummySchedulerData.goals[i].id == id) {
            dummySchedulerData.goals[i].enabled = enable_status
            enableCount = enableCount + 1
        }
        //Do something
    }
    if (enableCount == 0) {
        return res.status(400).json({
            error: "id doest exist",
            count: enableCount
        })
    }
    if (enableCount > 1) {
        return res.status(500).json({
            error: "multiple goal with the same id",
            count: enableCount
        })
    }
    return res.status(200).json({
    
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
//         console.log("400 error - id doesnt exist")
//     }
//     if (enableCount > 1) {
//         console.log("500 error - multiple goal with same id")
//     }
// }

function printEnabledGoals() {
    for (var i = 0; i < dummySchedulerData.goals.length; i++) {
        if (dummySchedulerData.goals[i].enabled) {
            console.log(dummySchedulerData.goals[i].name)
        }
        //Do something
    }
}

function getGoalNames(filter) {
    return dummySchedulerData.goals.filter(goal => goal.name.includes(filter)).map(goal => goal.name);
}

router.get('/goal_names', function (req, res, next) {
    let filter = req.params.filter;
    return res.status(200).json({
        goal_names: dummySchedulerData.goals.filter(goal => goal.name.includes(filter)).map(goal => goal.name)
    })
});

function getGoalUserNames(filter) {
    return Array.from(new Set(dummySchedulerData.goals.filter(goal => goal.author.includes(filter)).map(goal => goal.author)));
}

router.get('/goal_user_names', function (req, res, next) {
    let filter = req.params.filter;
    return res.status(200).json({
        goal_user_names: Array.from(new Set(dummySchedulerData.goals.filter(goal => goal.author.includes(filter)).map(goal => goal.author)))
    })
});

router.post('/schedule', function (req, res, next) {
    let id = req.params.id;
    let start_time = req.params.start_time
    let end_time = req.params.end_time
    let man_line_num = req.params.man_line_num
    var foundCount = 0;
    for (var i = 0; i < activities.length; i++) {
        if (activities[i].id == id) {
            activities[i].start_time = start_time
            activities[i].end_time = end_time
            activities[i].man_line_num = man_line_num
        }
    }
    if (foundCount == 0) {
        // console.log("400 error - id doesnt exist")
        return res.status(400).json({
            error: "id doesnt exist"
        })
    }
    if (foundCount > 1) {
        return res.status(500).json({
            error: "multiple activities with the same id"
        })
    }
    return res.status(200).json({
        
    })
});

function scheduleActivity(id, start_time, end_time, man_line_num) {
    var foundCount = 0;
    for (var i = 0; i < activities.length; i++) {
        if (activities[i].id == id) {
            activities[i].start_time = start_time
            activities[i].end_time = end_time
            activities[i].man_line_num = man_line_num
        }
    }
    if (foundCount == 0) {
        console.log("400 error - id doesnt exist")
    }
    if (foundCount > 1) {
        console.log("500 error - multiple activities with same id")
    }
}


router.get('/goals', function (req, res, next) {
    return res.status(200).json({
        goals: dummySchedulerData.goals
    })
});

router.get('/man_lines', function (req, res, next) {
    return res.status(200).json({
        goals: dummySchedulerData.man_lines
    })
});


module.exports = router;
