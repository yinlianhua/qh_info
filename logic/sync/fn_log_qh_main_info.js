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
    logs.push(`|    |  Code  | Score |  Latest  |    1MIN_180(AVG, MIN, MAX)   |    5MIN_120(AVG, MIN, MAX)   |    15MIN_90(AVG, MIN, MAX)   |    60MIN_60(AVG, MIN, MAX)   |    240MIN_20(AVG, MIN, MAX)  |      Day_10(AVG, MIN, MAX)   |   Name   |`);
    logs.push("+----+--------+-------+----------+------------------------------+------------------------------+------------------------------+------------------------------+------------------------------+------------------------------+----------+");

    for (let code of codes) {
        no++;
        let data = await fn_get_qh_main_info(code);

        let score = 0;

        if (data.latest >= data.avg_1_180) { score += 1;};
        if (data.latest >= data.avg_5_120) { score += 1;};
        if (data.latest >= data.avg_15_90) { score += 1;};
        if (data.latest >= data.avg_60_60) { score += 1;};
        if (data.latest >= data.avg_240_20) { score += 1;};
        if (data.latest >= data.avg_day_10) { score += 1;};

        let c_score      = score >= 2 ? "red" : "green";
        let c_avg_1_180  = data.latest >= data.avg_1_180  ? "red" : "green";
        let c_avg_5_120  = data.latest >= data.avg_5_120  ? "red" : "green";
        let c_avg_15_90  = data.latest >= data.avg_15_90  ? "red" : "green";
        let c_avg_60_60  = data.latest >= data.avg_60_60  ? "red" : "green";
        let c_avg_240_20 = data.latest >= data.avg_240_20 ? "red" : "green";
        let c_avg_day_10 = data.latest >= data.avg_day_10 ? "red" : "green";
        let c_min_1_180  = data.latest <= data.min_1_180  ? "red" : "white";
        let c_min_5_120  = data.latest <= data.min_5_120  ? "red" : "white";
        let c_min_15_90  = data.latest <= data.min_15_90  ? "red" : "white";
        let c_min_60_60  = data.latest <= data.min_60_60  ? "red" : "white";
        let c_min_240_20 = data.latest <= data.min_240_20 ? "red" : "white";
        let c_min_day_10 = data.latest <= data.min_day_10 ? "red" : "white";
        let c_max_1_180  = data.latest >= data.max_1_180  ? "red" : "white";
        let c_max_5_120  = data.latest >= data.max_5_120  ? "red" : "white";
        let c_max_15_90  = data.latest >= data.max_15_90  ? "red" : "white";
        let c_max_60_60  = data.latest >= data.max_60_60  ? "red" : "white";
        let c_max_240_20 = data.latest >= data.max_240_20 ? "red" : "white";
        let c_max_day_10 = data.latest >= data.max_day_10 ? "red" : "white";

        let f_score      = chalk[c_score](score);
        let f_code       = chalk["yellow"](data.code.padStart(6));
        let f_latest     = chalk["yellow"](data.latest.toString().padStart(8));
        let f_name       = chalk["yellow"](data.name);
        let f_avg_1_180  = chalk[c_avg_1_180](data.avg_1_180.toString().padStart(8));
        let f_avg_5_120  = chalk[c_avg_5_120](data.avg_5_120.toString().padStart(8));
        let f_avg_15_90  = chalk[c_avg_15_90](data.avg_15_90.toString().padStart(8));
        let f_avg_60_60  = chalk[c_avg_60_60](data.avg_60_60.toString().padStart(8));
        let f_avg_240_20 = chalk[c_avg_240_20](data.avg_240_20.toString().padStart(8));
        let f_avg_day_10 = chalk[c_avg_day_10](data.avg_day_10.toString().padStart(8));
        let f_min_1_180  = chalk[c_min_1_180](data.min_1_180.toString().padStart(8));
        let f_min_5_120  = chalk[c_min_5_120](data.min_5_120.toString().padStart(8));
        let f_min_15_90  = chalk[c_min_15_90](data.min_15_90.toString().padStart(8));
        let f_min_60_60  = chalk[c_min_60_60](data.min_60_60.toString().padStart(8));
        let f_min_240_20 = chalk[c_min_240_20](data.min_240_20.toString().padStart(8));
        let f_min_day_10 = chalk[c_min_day_10](data.min_day_10.toString().padStart(8));
        let f_max_1_180  = chalk[c_max_1_180](data.max_1_180.toString().padStart(8));
        let f_max_5_120  = chalk[c_max_5_120](data.max_5_120.toString().padStart(8));
        let f_max_15_90  = chalk[c_max_15_90](data.max_15_90.toString().padStart(8));
        let f_max_60_60  = chalk[c_max_60_60](data.max_60_60.toString().padStart(8));
        let f_max_240_20 = chalk[c_max_240_20](data.max_240_20.toString().padStart(8));
        let f_max_day_10 = chalk[c_max_day_10](data.max_day_10.toString().padStart(8));

        logs.push(`| ${no.toString().padStart(2)} | ${f_code} |   ${f_score}   | ${f_latest} | ${f_avg_1_180}, ${f_min_1_180}, ${f_max_1_180} | ${f_avg_5_120}, ${f_min_5_120}, ${f_max_5_120} | ${f_avg_15_90}, ${f_min_15_90}, ${f_max_15_90} | ${f_avg_60_60}, ${f_min_60_60}, ${f_max_60_60} | ${f_avg_240_20}, ${f_min_240_20}, ${f_max_240_20} | ${f_avg_day_10}, ${f_min_day_10}, ${f_max_day_10} | ${f_name}`);
        logs.push("+----+--------+-------+----------+------------------------------+------------------------------+------------------------------+------------------------------+------------------------------+------------------------------+----------+");
    }

    return {
        "err" : false,
        "res" : logs,
    };
};

module.exports = fn_log_qh_main_info;
