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

// 获取期货信息
const fn_get_qh_main_info = async (code="") => {
    let get_sql_map = require("./fn_get_sql_map");

    let sql_map = await get_sql_map(code);

    await db.connect(config.db_path);

    let [
        data_latest,
        data_min_01_120,
        data_min_01_240,
        data_min_05_120,
        data_min_05_240,
        data_min_15_60,
        data_min_15_120,
        data_min_15_240,
        data_min_60_30,
        data_min_60_60,
        data_min_240_15,
        data_min_240_30,
        data_min_day_10,
        data_min_day_20,
    ] = await Promise.all([
        db.get(sql_map.sql_t_qh_data_latest),
        db.get(sql_map.sql_t_qh_data_1_min_120),
        db.get(sql_map.sql_t_qh_data_1_min_240),
        db.get(sql_map.sql_t_qh_data_5_min_120),
        db.get(sql_map.sql_t_qh_data_5_min_240),
        db.get(sql_map.sql_t_qh_data_15_min_60),
        db.get(sql_map.sql_t_qh_data_15_min_120),
        db.get(sql_map.sql_t_qh_data_15_min_240),
        db.get(sql_map.sql_t_qh_data_60_min_30),
        db.get(sql_map.sql_t_qh_data_60_min_60),
        db.get(sql_map.sql_t_qh_data_240_min_15),
        db.get(sql_map.sql_t_qh_data_240_min_30),
        db.get(sql_map.sql_t_qh_data_day_10),
        db.get(sql_map.sql_t_qh_data_day_20),
    ]);

    data_latest     = data_latest.res[0];
    data_min_01_120 = data_min_01_120.res[0];
    data_min_01_240 = data_min_01_240.res[0];
    data_min_05_120 = data_min_05_120.res[0];
    data_min_05_240 = data_min_05_240.res[0];
    data_min_15_60  = data_min_15_60.res[0];
    data_min_15_120 = data_min_15_120.res[0];
    data_min_15_240 = data_min_15_240.res[0];
    data_min_60_30  = data_min_60_30.res[0];
    data_min_60_60  = data_min_60_60.res[0];
    data_min_240_15 = data_min_240_15.res[0];
    data_min_240_30 = data_min_240_30.res[0];
    data_min_day_10 = data_min_day_10.res[0];
    data_min_day_20 = data_min_day_20.res[0];

    await db.close();

    return {
        "code"       : data_latest.code,
        "name"       : data_latest.name,
        "latest"     : +data_latest.v_c.toFixed(2),
        "avg_01_120" : +data_min_01_120.avg.toFixed(2),
        "avg_01_240" : +data_min_01_240.avg.toFixed(2),
        "avg_05_120" : +data_min_05_120.avg.toFixed(2),
        "avg_05_240" : +data_min_05_240.avg.toFixed(2),
        "avg_15_60"  : +data_min_15_60.avg.toFixed(2),
        "avg_15_120" : +data_min_15_120.avg.toFixed(2),
        "avg_15_240" : +data_min_15_240.avg.toFixed(2),
        "avg_60_30"  : +data_min_60_30.avg.toFixed(2),
        "avg_60_60"  : +data_min_60_60.avg.toFixed(2),
        "avg_240_15" : +data_min_240_15.avg.toFixed(2),
        "avg_240_30" : +data_min_240_30.avg.toFixed(2),
        "avg_day_10" : +data_min_day_10.avg.toFixed(2),
        "avg_day_20" : +data_min_day_20.avg.toFixed(2),
    };
};

module.exports = fn_get_qh_main_info;
