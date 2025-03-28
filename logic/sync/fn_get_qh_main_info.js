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
        data_min_1_180,
        data_min_5_120,
        data_min_15_90,
        data_min_60_60,
        data_min_240_20,
        data_min_day_10,
    ] = await Promise.all([
        db.get(sql_map.sql_t_qh_data_latest),
        db.get(sql_map.sql_t_qh_data_1_min_180),
        db.get(sql_map.sql_t_qh_data_5_min_120),
        db.get(sql_map.sql_t_qh_data_15_min_90),
        db.get(sql_map.sql_t_qh_data_60_min_60),
        db.get(sql_map.sql_t_qh_data_240_min_20),
        db.get(sql_map.sql_t_qh_data_day_10),
    ]);

    data_latest     = data_latest.res[0];
    data_min_1_180  = data_min_1_180.res[0];
    data_min_5_120  = data_min_5_120.res[0];
    data_min_15_90  = data_min_15_90.res[0];
    data_min_60_60  = data_min_60_60.res[0];
    data_min_240_20 = data_min_240_20.res[0];
    data_min_day_10 = data_min_day_10.res[0];

    await db.close();

    return {
        "code"       : data_latest.code,
        "name"       : data_latest.name,
        "latest"     : data_latest.v_c.toFixed(2),
        "avg_1_180"  : data_min_1_180.avg.toFixed(2),
        "max_1_180"  : data_min_1_180.max.toFixed(2),
        "min_1_180"  : data_min_1_180.min.toFixed(2),
        "avg_5_120"  : data_min_5_120.avg.toFixed(2),
        "max_5_120"  : data_min_5_120.max.toFixed(2),
        "min_5_120"  : data_min_5_120.min.toFixed(2),
        "avg_15_90"  : data_min_15_90.avg.toFixed(2),
        "max_15_90"  : data_min_15_90.max.toFixed(2),
        "min_15_90"  : data_min_15_90.min.toFixed(2),
        "avg_60_60"  : data_min_60_60.avg.toFixed(2),
        "max_60_60"  : data_min_60_60.max.toFixed(2),
        "min_60_60"  : data_min_60_60.min.toFixed(2),
        "avg_240_20" : data_min_240_20.avg.toFixed(2),
        "max_240_20" : data_min_240_20.max.toFixed(2),
        "min_240_20" : data_min_240_20.min.toFixed(2),
        "avg_day_10" : data_min_day_10.avg.toFixed(2),
        "max_day_10" : data_min_day_10.max.toFixed(2),
        "min_day_10" : data_min_day_10.min.toFixed(2),
    };
};

module.exports = fn_get_qh_main_info;
