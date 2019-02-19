let express = require('express');
const error_controller = require('../app/controller/error_controller');
let router = express.Router();




router.get('/goals', function(req, res, next) {
    return res.status(200).json({
        goals: dummySchedulerData.goals
    })
});

router.get('/man_lines', function(req, res, next) {
    return res.status(200).json({
        goals: dummySchedulerData.man_lines
    })
});

let dummySchedulerData = {
    "goals": [
      {
        "name": "Thanksgiving Bundle",
        "activities": [
          {
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
          },
          {
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
          },
          {
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
        ],
        "enabled": true,
        "deadline": "2019-02-19",
        "author": "Yami Sugehiro"
      },
      {
        "name": "Sports Pack",
        "activities": [
          {
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
          },
          {
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
          },
          {
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
          },
          {
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
          },
          {
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
        ],
        "enabled": true,
        "deadline": "2019-02-19",
        "author": "Zion Williamson"
      },
      {
        "name": "Christmas Bag",
        "activities": [
          {
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
            "start_time": "2019-02-19 09:30:00",
            "end_time": "2019-02-19 10:30:00",
            "man_line_num": "BMF1"
          },
          {
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
          },
          {
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
          },
          {
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
        ],
        "enabled": false,
        "deadline": "2019-02-21",
        "author": "Santa Claus"
      },
      {
        "name": "Lunar New Year",
        "activities": [
          {
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
        ],
        "enabled": false,
        "deadline": "2019-02-21",
        "author": "Yami Sugehiro"
      },
      {
        "name": "Empty Bundle",
        "activities": [],
        "enabled": true,
        "deadline": "2019-02-19",
        "author": "Ulqiorra Cifer"
      },
      {
        "name": "Super Pack",
        "activities": [
          {
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
          },
          {
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
        ],
        "enabled": true,
        "deadline": "2019-02-22",
        "author": "Robert Parr"
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
    ]
  }


module.exports = router;
