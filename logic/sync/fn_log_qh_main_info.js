/**
 * Date : 2025-03-25
 * By   : yinlianhua@sina.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let chalk  = require("chalk");
let config = require("../../config/basic.json");
let http   = require("../../libs/http");
let db     = require('../../libs/sqlite3');

const fn_log_qh_main_info = async (codes=[]) => {
    let fn_get_qh_main_info = require("./fn_get_qh_main_info");

    let logs = [];
    let no   = 0;

    // TODO: 添加 MAX-MIN 比例
    logs.push("+----+--------+-------+----------+------------------------------+------------------------------+------------------------------+------------------------------+------------------------------+------------------------------+----------+");
    logs.push(`|    |  Code  | Score |  Latest  |   15MIN_120(AVG, MIN, MAX)   |   15MIN_240(AVG, MIN, MAX)   |     4H_20(AVG, MIN, MAX)     |      Day_10(AVG, MIN, MAX)   |      Day_30(AVG, MIN, MAX)   |      Day_60(AVG, MIN, MAX)   |   Name   |`);
    logs.push("+----+--------+-------+----------+------------------------------+------------------------------+------------------------------+------------------------------+------------------------------+------------------------------+----------+");

    for (let code of codes) {
        no++;
        let data = await fn_get_qh_main_info(code);

        let score = 0;

        score += data.latest >= data.avg_15_120 ? 1 : -1;
        score += data.latest >= data.avg_15_240 ? 1 : -1;
        score += data.latest >= data.avg_240_12 ? 1 : -1;

        score *= data.latest > data.avg_day_30 ? -1 : 1;

        /*
        if (data.latest >= data.avg_15_120) { score += 1;};
        if (data.latest >= data.avg_15_240) { score += 2;};
        if (data.latest >= data.avg_240_12) { score += 3;};
        */

        let c_score = "white";
        if (score >=  2) {c_score = "red";};
        if (score <= -2) {c_score = "green";};

        let c_avg_15_120 = data.latest >= data.avg_15_120 ? "red" : "green";
        let c_avg_15_240 = data.latest >= data.avg_15_240 ? "red" : "green";
        let c_avg_240_12 = data.latest >= data.avg_240_12 ? "red" : "green";
        let c_avg_day_10 = data.latest >= data.avg_day_10 ? "red" : "green";
        let c_avg_day_30 = data.latest >= data.avg_day_30 ? "red" : "green";
        let c_avg_day_60 = data.latest >= data.avg_day_60 ? "red" : "green";

        let c_min_15_120 = data.latest <= data.min_15_120 ? "red" : "green";
        let c_min_15_240 = data.latest <= data.min_15_240 ? "red" : "green";
        let c_min_240_12 = data.latest <= data.min_240_12 ? "red" : "green";
        let c_min_day_10 = data.latest <= data.min_day_10 ? "red" : "green";
        let c_min_day_30 = data.latest <= data.min_day_30 ? "red" : "green";
        let c_min_day_60 = data.latest <= data.min_day_60 ? "red" : "green";

        let c_max_15_120 = data.latest >= data.max_15_120 ? "red" : "green";
        let c_max_15_240 = data.latest >= data.max_15_240 ? "red" : "green";
        let c_max_240_12 = data.latest >= data.max_240_12 ? "red" : "green";
        let c_max_day_10 = data.latest >= data.max_day_10 ? "red" : "green";
        let c_max_day_30 = data.latest >= data.max_day_30 ? "red" : "green";
        let c_max_day_60 = data.latest >= data.max_day_60 ? "red" : "green";

        let f_score      = chalk[c_score](score.toString().padStart(2));
        let f_code       = chalk["yellow"](data.code.padStart(6));
        let f_latest     = chalk["yellow"](data.latest.toString().padStart(8));
        let f_name       = chalk["yellow"](data.name);
        let f_avg_15_120 = chalk[c_avg_15_120](data.avg_15_120.toString().padStart(8));
        let f_avg_15_240 = chalk[c_avg_15_240](data.avg_15_240.toString().padStart(8));
        let f_avg_240_12 = chalk[c_avg_240_12](data.avg_240_12.toString().padStart(8));
        let f_avg_day_10 = chalk[c_avg_day_10](data.avg_day_10.toString().padStart(8));
        let f_avg_day_30 = chalk[c_avg_day_30](data.avg_day_30.toString().padStart(8));
        let f_avg_day_60 = chalk[c_avg_day_60](data.avg_day_60.toString().padStart(8));
        let f_min_15_120 = chalk[c_min_15_120](data.min_15_120.toString().padStart(8));
        let f_min_15_240 = chalk[c_min_15_240](data.min_15_240.toString().padStart(8));
        let f_min_240_12 = chalk[c_min_240_12](data.min_240_12.toString().padStart(8));
        let f_min_day_10 = chalk[c_min_day_10](data.min_day_10.toString().padStart(8));
        let f_min_day_30 = chalk[c_min_day_30](data.min_day_30.toString().padStart(8));
        let f_min_day_60 = chalk[c_min_day_60](data.min_day_60.toString().padStart(8));
        let f_max_15_120 = chalk[c_max_15_120](data.max_15_120.toString().padStart(8));
        let f_max_15_240 = chalk[c_max_15_240](data.max_15_240.toString().padStart(8));
        let f_max_240_12 = chalk[c_max_240_12](data.max_240_12.toString().padStart(8));
        let f_max_day_10 = chalk[c_max_day_10](data.max_day_10.toString().padStart(8));
        let f_max_day_30 = chalk[c_max_day_30](data.max_day_30.toString().padStart(8));
        let f_max_day_60 = chalk[c_max_day_60](data.max_day_60.toString().padStart(8));


        logs.push(`| ${no.toString().padStart(2)} | ${f_code} |   ${f_score}  | ${f_latest} | ${f_avg_15_120}, ${f_min_15_120}, ${f_max_15_120} | ${f_avg_15_240}, ${f_min_15_240}, ${f_max_15_240} | ${f_avg_240_12}, ${f_min_240_12}, ${f_max_240_12} | ${f_avg_day_10}, ${f_min_day_10}, ${f_max_day_10} | ${f_avg_day_30}, ${f_min_day_30}, ${f_max_day_30} | ${f_avg_day_60}, ${f_min_day_60}, ${f_max_day_60} | ${f_name}`);
        logs.push("+----+--------+-------+----------+------------------------------+------------------------------+------------------------------+------------------------------+------------------------------+------------------------------+----------+");
    }

    return {
        "err" : false,
        "res" : logs,
    };
};

module.exports = fn_log_qh_main_info;
