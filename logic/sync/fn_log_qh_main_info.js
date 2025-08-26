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

    let data_list = [];
    let logs      = [];
    let no        = 0;

    // TODO: 添加 MAX-MIN 比例
    logs.push("+----+--------+----------+----------+------------------------------------+------------------------------------+------------------------------------+------------------------------------+------------------------------------+------------------------------------+-----------+");
    logs.push(`|    |  Code  |   Score  |  Latest  |   05MIN_120(AVG, MIN, MAX, PCT)    |   05MIN_240(AVG, MIN, MAX, PCT)    |   15MIN_120(AVG, MIN, MAX, PCT)    |   15MIN_240(AVG, MIN, MAX, PCT)    |     4H_20(AVG, MIN, MAX, PCT)      |      Day_10(AVG, MIN, MAX, PCT)    |   Name    |`);
    logs.push("+----+--------+----------+----------+------------------------------------+------------------------------------+------------------------------------+------------------------------------+------------------------------------+------------------------------------+-----------+");

    for (let code of codes) {
        let data = await fn_get_qh_main_info(code);

        // 计算分数
        let score = 0;

        score += data.latest >= data.avg_05_120 ? 1.0 : -1.0;
        score += data.latest >= data.avg_05_240 ? 1.2 : -1.2;
        score += data.latest >= data.avg_15_120 ? 1.4 : -1.4;
        score += data.latest >= data.avg_15_240 ? 1.6 : -1.6;
        score += data.latest >= data.avg_240_12 ? 1.8 : -1.8;
        score += data.latest >= data.avg_day_30 ? 2.0 : -2.0;
        score += data.latest >= data.avg_day_60 ? 3.0 : -3.0;

        // score *= data.latest > data.avg_day_30 ? -1 : 1;

        /*
        if (data.latest >= data.avg_15_120) { score += 1;};
        if (data.latest >= data.avg_15_240) { score += 2;};
        if (data.latest >= data.avg_240_12) { score += 3;};
        */

        score *= data.pct_05_120 <= 0.5 ? (1-data.pct_05_120) : data.pct_05_120;

        data.score = +score.toFixed(2);

        data_list.push(data);
    }

    data_list = _.sortBy(data_list, "score");

    for (let data of data_list) {
        no++;

        let score = data.score.toFixed(2);

        let c_score = "white";
        if (score >=   6) {c_score = "yellow";};
        if (score >=  10) {c_score = "magenta";};
        if (score <=  -6) {c_score = "blue";};
        if (score <= -10) {c_score = "green";};

        let c_avg_05_120 = data.latest >= data.avg_05_120 ? "red" : "white";
        let c_avg_05_240 = data.latest >= data.avg_05_240 ? "red" : "white";
        let c_avg_15_120 = data.latest >= data.avg_15_120 ? "red" : "white";
        let c_avg_15_240 = data.latest >= data.avg_15_240 ? "red" : "white";
        let c_avg_240_12 = data.latest >= data.avg_240_12 ? "red" : "white";
        let c_avg_day_10 = data.latest >= data.avg_day_10 ? "red" : "white";
        let c_avg_day_30 = data.latest >= data.avg_day_30 ? "red" : "white";
        let c_avg_day_60 = data.latest >= data.avg_day_60 ? "red" : "white";

        let c_min_05_120 = data.latest <= data.min_05_120 ? "red" : "white";
        let c_min_05_240 = data.latest <= data.min_05_240 ? "red" : "white";
        let c_min_15_120 = data.latest <= data.min_15_120 ? "red" : "white";
        let c_min_15_240 = data.latest <= data.min_15_240 ? "red" : "white";
        let c_min_240_12 = data.latest <= data.min_240_12 ? "red" : "white";
        let c_min_day_10 = data.latest <= data.min_day_10 ? "red" : "white";
        let c_min_day_30 = data.latest <= data.min_day_30 ? "red" : "white";
        let c_min_day_60 = data.latest <= data.min_day_60 ? "red" : "white";

        let c_max_05_120 = data.latest >= data.max_05_120 ? "red" : "white";
        let c_max_05_240 = data.latest >= data.max_05_240 ? "red" : "white";
        let c_max_15_120 = data.latest >= data.max_15_120 ? "red" : "white";
        let c_max_15_240 = data.latest >= data.max_15_240 ? "red" : "white";
        let c_max_240_12 = data.latest >= data.max_240_12 ? "red" : "white";
        let c_max_day_10 = data.latest >= data.max_day_10 ? "red" : "white";
        let c_max_day_30 = data.latest >= data.max_day_30 ? "red" : "white";
        let c_max_day_60 = data.latest >= data.max_day_60 ? "red" : "white";

        let c_pct_05_120 = data.pct_05_120 >= 0.8 ? "red" : (data.pct_05_120 <= 0.2 ? "green" : "white");
        let c_pct_05_240 = data.pct_05_240 >= 0.8 ? "red" : (data.pct_05_240 <= 0.2 ? "green" : "white");
        let c_pct_15_120 = data.pct_15_120 >= 0.8 ? "red" : (data.pct_15_120 <= 0.2 ? "green" : "white");
        let c_pct_15_240 = data.pct_15_240 >= 0.8 ? "red" : (data.pct_15_240 <= 0.2 ? "green" : "white");
        let c_pct_240_12 = data.pct_240_12 >= 0.8 ? "red" : (data.pct_240_12 <= 0.2 ? "green" : "white");
        let c_pct_day_10 = data.pct_day_10 >= 0.8 ? "red" : (data.pct_day_10 <= 0.2 ? "green" : "white");
        let c_pct_day_30 = data.pct_day_30 >= 0.8 ? "red" : (data.pct_day_30 <= 0.2 ? "green" : "white");
        let c_pct_day_60 = data.pct_day_60 >= 0.8 ? "red" : (data.pct_day_60 <= 0.2 ? "green" : "white");

        let f_score      = chalk[c_score](score.toString().padStart(6));
        let f_code       = chalk["yellow"](data.code.padStart(6));
        let f_latest     = chalk["yellow"](data.latest.toString().padStart(8));
        let f_name       = chalk["yellow"](data.name);

        let f_avg_05_120 = chalk[c_avg_05_120](data.avg_05_120.toString().padStart(8));
        let f_avg_05_240 = chalk[c_avg_05_240](data.avg_05_240.toString().padStart(8));
        let f_avg_15_120 = chalk[c_avg_15_120](data.avg_15_120.toString().padStart(8));
        let f_avg_15_240 = chalk[c_avg_15_240](data.avg_15_240.toString().padStart(8));
        let f_avg_240_12 = chalk[c_avg_240_12](data.avg_240_12.toString().padStart(8));
        let f_avg_day_10 = chalk[c_avg_day_10](data.avg_day_10.toString().padStart(8));
        let f_avg_day_30 = chalk[c_avg_day_30](data.avg_day_30.toString().padStart(8));
        let f_avg_day_60 = chalk[c_avg_day_60](data.avg_day_60.toString().padStart(8));

        let f_min_05_120 = chalk[c_min_05_120](data.min_05_120.toString().padStart(8));
        let f_min_05_240 = chalk[c_min_05_240](data.min_05_240.toString().padStart(8));
        let f_min_15_120 = chalk[c_min_15_120](data.min_15_120.toString().padStart(8));
        let f_min_15_240 = chalk[c_min_15_240](data.min_15_240.toString().padStart(8));
        let f_min_240_12 = chalk[c_min_240_12](data.min_240_12.toString().padStart(8));
        let f_min_day_10 = chalk[c_min_day_10](data.min_day_10.toString().padStart(8));
        let f_min_day_30 = chalk[c_min_day_30](data.min_day_30.toString().padStart(8));
        let f_min_day_60 = chalk[c_min_day_60](data.min_day_60.toString().padStart(8));

        let f_max_05_120 = chalk[c_max_05_120](data.max_05_120.toString().padStart(8));
        let f_max_05_240 = chalk[c_max_05_240](data.max_05_240.toString().padStart(8));
        let f_max_15_120 = chalk[c_max_15_120](data.max_15_120.toString().padStart(8));
        let f_max_15_240 = chalk[c_max_15_240](data.max_15_240.toString().padStart(8));
        let f_max_240_12 = chalk[c_max_240_12](data.max_240_12.toString().padStart(8));
        let f_max_day_10 = chalk[c_max_day_10](data.max_day_10.toString().padStart(8));
        let f_max_day_30 = chalk[c_max_day_30](data.max_day_30.toString().padStart(8));
        let f_max_day_60 = chalk[c_max_day_60](data.max_day_60.toString().padStart(8));

        let f_pct_05_120 = chalk[c_pct_05_120](data.pct_05_120.toString().padStart(4));
        let f_pct_05_240 = chalk[c_pct_05_240](data.pct_05_240.toString().padStart(4));
        let f_pct_15_120 = chalk[c_pct_15_120](data.pct_15_120.toString().padStart(4));
        let f_pct_15_240 = chalk[c_pct_15_240](data.pct_15_240.toString().padStart(4));
        let f_pct_240_12 = chalk[c_pct_240_12](data.pct_240_12.toString().padStart(4));
        let f_pct_day_10 = chalk[c_pct_day_10](data.pct_day_10.toString().padStart(4));
        let f_pct_day_30 = chalk[c_pct_day_30](data.pct_day_30.toString().padStart(4));
        let f_pct_day_60 = chalk[c_pct_day_60](data.pct_day_60.toString().padStart(4));


        logs.push(`| ${no.toString().padStart(2)} | ${f_code} |   ${f_score} | ${f_latest} | ${f_avg_05_120}, ${f_min_05_120}, ${f_max_05_120}, ${f_pct_05_120} | ${f_avg_05_240}, ${f_min_05_240}, ${f_max_05_240}, ${f_pct_05_240} | ${f_avg_15_120}, ${f_min_15_120}, ${f_max_15_120}, ${f_pct_15_120} | ${f_avg_15_240}, ${f_min_15_240}, ${f_max_15_240}, ${f_pct_15_240} | ${f_avg_240_12}, ${f_min_240_12}, ${f_max_240_12}, ${f_pct_240_12} | ${f_avg_day_10}, ${f_min_day_10}, ${f_max_day_10}, ${f_pct_day_10} | ${f_name} |`);
        logs.push("+----+--------+----------+----------+------------------------------------+------------------------------------+------------------------------------+------------------------------------+------------------------------------+------------------------------------+-----------+");
    }

    for (let log of logs) {
        console.log(log)

        if (log == "") {
            await sleep(500);
        }
    }

    return {
        "err" : false,
        "res" : data_list,
    };
};

module.exports = fn_log_qh_main_info;
