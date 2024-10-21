/**
 * Date : 2024-10-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _      = require("underscore");
const moment = require("moment");
const mysql  = require("../../libs/mysql_conn");

// 每天10:00分获取计划数据,22:59清空
const plan_get = async function(std_time) {
    let date = moment.unix(std_time).format("YYYY-MM-DD");
    let time = moment.unix(std_time).format("HH:mm");

    if (time == "22:59") {
        global.data_plan = {};
    }

    if (time != "10:00") {
        return;
    }

    let plan = await mysql.connect("plan").query(`SELECT date, name, type, value FROM t_price_plan WHERE date = "${date}"`);

    if (!plan.err || plan.res.retObject.results.length) {
        for (let elem of plan.res.retObject.results) {
            if (global.data_plan[elem.name] == undefined) {
                global.data_plan[elem.name] = {};
            }

            if (global.data_plan[elem.name][elem.type] == undefined) {
                global.data_plan[elem.name][elem.type] = {};
            }

            global.data_plan[elem.name][elem.type][elem.value] = 1;
        }
    }

    console.log(global.data_plan)
}

module.exports = plan_get;