/**
 * Date : 2025-03-25
 * By   : yinlianhua@sina.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let config = require("../../config/basic.json");
let http   = require("../../libs/http");
let db     = require('../../libs/sqlite3');

// 获取 SQL 列表
const fn_get_sql_map = async (code) => {
    let duration = [ 10, 12, 20, 30, 60, 90, 120, 150, 180, 210, 240];
    let table_list = [
        "t_qh_data_1_min",   // 期货1分钟值
        "t_qh_data_5_min",   // 期货5分钟值
        "t_qh_data_15_min",  // 期货15分钟值
        "t_qh_data_60_min",  // 期货1H值
        "t_qh_data_240_min", // 期货4H值
        "t_qh_data_day",     // 期货日值
    ]

    let res = {};

    // 获取 最大，最小，均值
    for (let table of table_list) {
        for (let time of duration) {
            let key = `sql_${table}_${time}`;
            let val = `SELECT code, name, AVG(v_c) AS avg, MAX(v_h) AS max, MIN(v_l) AS min FROM ( SELECT * FROM ${table} WHERE code = "${code}" ORDER BY date DESC LIMIT ${time});`;
            res[key] = val;
        }
    }

    // 获取最新值
    res["sql_t_qh_data_latest"] = `SELECT * FROM t_qh_data_1_min WHERE code = "${code}" ORDER BY date DESC LIMIT 1;`;

    return res;
};

module.exports = fn_get_sql_map;