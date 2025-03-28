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

    logs.push("+----+-------+---------+---------+-------------+-------------+-------------+-------------+-------------+-------------+-----------+");
    logs.push(`|    |  Code | Score   | Latest  | MA_1MIN_180 | MA_5MIN_120 | MA_15MIN_90 |   MA_1H_60  |   MA_4H_20  |  MA_Day_10  |    Name   |`);
    logs.push("+----+-------+---------+---------+-------------+-------------+-------------+-------------+-------------+-------------+-----------+");

    /*
    {
        code: 'L2505',
        name: '塑料2505',
        latest: '7662.00',
        avg_1_180: '7682.54', max_1_180: '7708.00', min_1_180: '7657.00',
        avg_5_120: '7701.45', max_5_120: '7735.00', min_5_120: '7657.00',
        avg_15_90: '7699.69', max_15_90: '7737.00', min_15_90: '7646.00',
        avg_60_60: '7700.33', max_60_60: '7775.00', min_60_60: '7635.00',
        avg_240_20: '7697.95', max_240_20: '7743.00', min_240_20: '7635.00',
        avg_day_10: '7693.50', max_day_10: '7743.00', min_day_10: '7634.00'
      }
      */

    for (let code of codes) {
        no++;
        let data = await fn_get_qh_main_info(code);
        logs.push(`| ${no.toString().padStart(2)} | ${data.code} |         | ${data.latest} |   ${data.avg_1_180}   |   ${data.avg_5_120}   |   ${data.avg_15_90}   |   ${data.avg_60_60}   |   ${data.avg_240_20}   |   ${data.avg_day_10}   | ${data.name}`);
    }

    /*
    for (let [key, infos] of Object.entries(main_list)) {
        if (codes.length != 0 && code_map[key] == undefined) {
            continue;
        }

        for (let elem of infos.reverse()) {
            // 当前值 大于等于 ma 值, 红色,否则绿色
            let c_avg005 = elem.latest >= elem.avg005 ? "red" : "green";
            let c_avg010 = elem.latest >= elem.avg010 ? "red" : "green";
            let c_avg015 = elem.latest >= elem.avg015 ? "red" : "green";
            let c_avg020 = elem.latest >= elem.avg020 ? "red" : "green";
            let c_avg025 = elem.latest >= elem.avg025 ? "red" : "green";
            let c_avg030 = elem.latest >= elem.avg030 ? "red" : "green";
            let c_avg060 = elem.latest >= elem.avg060 ? "red" : "green";
            let c_avg090 = elem.latest >= elem.avg090 ? "red" : "green";
            let c_avg120 = elem.latest >= elem.avg120 ? "red" : "green";
            let c_avg150 = elem.latest >= elem.avg150 ? "red" : "green";

            // 当前值 小于等于 min 值, 红色,否则绿色
            let c_min030 = elem.latest <= elem.min030 ? "red" : "green";
            let c_min060 = elem.latest <= elem.min060 ? "red" : "green";
            let c_min090 = elem.latest <= elem.min090 ? "red" : "green";
            let c_min120 = elem.latest <= elem.min120 ? "red" : "green";
            let c_min150 = elem.latest <= elem.min150 ? "red" : "green";

            // 当前值 大于等于 max 值, 红色,否则绿色
            let c_max030 = elem.latest >= elem.max030 ? "red" : "green";
            let c_max060 = elem.latest >= elem.max060 ? "red" : "green";
            let c_max090 = elem.latest >= elem.max090 ? "red" : "green";
            let c_max120 = elem.latest >= elem.max120 ? "red" : "green";
            let c_max150 = elem.latest >= elem.max150 ? "red" : "green";

            let r_005 = parseInt((elem.latest - elem.min005) / (elem.max005 - elem.min005) * 100);
            let r_010 = parseInt((elem.latest - elem.min010) / (elem.max010 - elem.min010) * 100);
            let r_015 = parseInt((elem.latest - elem.min015) / (elem.max015 - elem.min015) * 100);
            let r_020 = parseInt((elem.latest - elem.min020) / (elem.max020 - elem.min020) * 100);
            let r_025 = parseInt((elem.latest - elem.min025) / (elem.max025 - elem.min025) * 100);
            let r_030 = parseInt((elem.latest - elem.min030) / (elem.max030 - elem.min030) * 100);
            let r_060 = parseInt((elem.latest - elem.min060) / (elem.max060 - elem.min060) * 100);
            let r_090 = parseInt((elem.latest - elem.min090) / (elem.max090 - elem.min090) * 100);
            let r_120 = parseInt((elem.latest - elem.min120) / (elem.max120 - elem.min120) * 100);
            let r_150 = parseInt((elem.latest - elem.min150) / (elem.max150 - elem.min150) * 100);

            let c_005 = r_005 >= 70 ? "red" : (r_005 <= 30 ? "green" : "white");
            let c_010 = r_010 >= 70 ? "red" : (r_010 <= 30 ? "green" : "white");
            let c_015 = r_015 >= 70 ? "red" : (r_015 <= 30 ? "green" : "white");
            let c_020 = r_020 >= 70 ? "red" : (r_020 <= 30 ? "green" : "white");
            let c_025 = r_025 >= 70 ? "red" : (r_025 <= 30 ? "green" : "white");
            let c_030 = r_030 >= 70 ? "red" : (r_030 <= 30 ? "green" : "white");
            let c_060 = r_060 >= 70 ? "red" : (r_060 <= 30 ? "green" : "white");
            let c_090 = r_090 >= 70 ? "red" : (r_090 <= 30 ? "green" : "white");
            let c_120 = r_120 >= 70 ? "red" : (r_120 <= 30 ? "green" : "white");
            let c_150 = r_150 >= 70 ? "red" : (r_150 <= 30 ? "green" : "white");

            r_005 = (r_005+"%").padStart(4);
            r_010 = (r_010+"%").padStart(4);
            r_015 = (r_015+"%").padStart(4);
            r_020 = (r_020+"%").padStart(4);
            r_025 = (r_025+"%").padStart(4);
            r_030 = (r_030+"%").padStart(4);
            r_060 = (r_060+"%").padStart(4);
            r_090 = (r_090+"%").padStart(4);
            r_120 = (r_120+"%").padStart(4);
            r_150 = (r_150+"%").padStart(4);

            let c_score = elem.score > 0 ? "red" : "green";

            let f_score  = chalk[c_score]((elem.score.toFixed(2)+"").padStart(6));
            let f_code   = chalk["yellow"](elem.code);
            let f_latest = chalk["yellow"](elem.latest);
            let f_name   = chalk["yellow"](elem.name);
            let f_avg005 = chalk[c_avg005](elem.avg005);
            let f_avg010 = chalk[c_avg010](elem.avg010);
            let f_avg015 = chalk[c_avg015](elem.avg015);
            let f_avg020 = chalk[c_avg020](elem.avg020);
            let f_avg025 = chalk[c_avg025](elem.avg025);
            let f_avg030 = chalk[c_avg030](elem.avg030);
            let f_avg060 = chalk[c_avg060](elem.avg060);
            let f_avg090 = chalk[c_avg090](elem.avg090);
            let f_avg120 = chalk[c_avg120](elem.avg120);
            let f_avg150 = chalk[c_avg150](elem.avg150);

            let f_min030 = chalk[c_min030](elem.min030);
            let f_min060 = chalk[c_min060](elem.min060);
            let f_min090 = chalk[c_min090](elem.min090);
            let f_min120 = chalk[c_min120](elem.min120);
            let f_min150 = chalk[c_min150](elem.min150);

            let f_max030 = chalk[c_max030](elem.max030);
            let f_max060 = chalk[c_max060](elem.max060);
            let f_max090 = chalk[c_max090](elem.max090);
            let f_max120 = chalk[c_max120](elem.max120);
            let f_max150 = chalk[c_max150](elem.max150);

            let f_r030   = chalk[c_030](r_030);
            let f_r060   = chalk[c_060](r_060);
            let f_r090   = chalk[c_090](r_090);
            let f_r120   = chalk[c_120](r_120);
            let f_r150   = chalk[c_150](r_150);
            
            logs.push(`| ${elem.date} | ${f_code} | ${f_latest} | ${f_score} | ${f_avg005} | ${f_avg010} | ${f_avg015} | ${f_avg020} | ${f_avg025} | ${f_avg030} | ${f_avg060} | ${f_avg090} | ${f_avg120} | ${f_avg150} | ${f_min030}~${f_max030} ${f_r030} | ${f_min060}~${f_max060} ${f_r060} | ${f_min090}~${f_max090} ${f_r090} | ${f_min120}~${f_max120} ${f_r120} | ${f_min150}~${f_max150} ${f_r150} | ${f_name}`);
            logs.push("+------------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------------------+--------------------+--------------------+--------------------+--------------------+--------------------------------+");
        }
    }
    */

    return {
        "err" : false,
        "res" : logs,
    };
};

module.exports = fn_log_qh_main_info;
