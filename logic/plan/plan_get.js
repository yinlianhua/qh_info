/**
 * Date : 2024-10-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _      = require("underscore");
const moment = require("moment");
const mysql  = require("../../libs/mysql_conn");

const plan_get = async function(std_time) {
    // let fn_get_qh_main_info = require("./fn_get_qh_main_info");

    global.data_plan = {};

    let plan = await mysql.connect("plan").query(`SELECT name, up_val, down_val FROM t_price_plan;`);

    if (!plan.err || plan.res.retObject.results.length) {
        for (let elem of plan.res.retObject.results) {
            if (global.data_plan[elem.name] == undefined) {
                global.data_plan[elem.name] = {
                    "上限" : {},
                    "下限" : {},
                };
            }

            global.data_plan[elem.name]["上限"][elem.up_val]   = 1;
            global.data_plan[elem.name]["下限"][elem.down_val] = 1;
        }
    }

    console.log(global.data_plan)
}

module.exports = plan_get;