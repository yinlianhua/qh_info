/**
 * Date : 2024-10-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _      = require("underscore");
const moment = require("moment");
const mysql  = require("../../libs/mysql_conn");

// 每天10:20分获取计划数据
const plan_get = async function(std_time) {
    let date = moment.unix(std_time).format("YYYY-MM-DD");
    let time = moment.unix(std_time).format("HH:mm");

    if (time != "10:20") {
        return;
    }

    let plan = await mysql.connect("plan").query(`SELECT * FROM t_price_plan WHERE date = "${date}"`);

    if (!plan.err) {
        for (let elem of plan.res.retObject.results) {
            if (global.data_plan[elem.name] == undefined) {
                global.data_plan[elem.name] = {};
            }

            global.data_plan[elem.name][elem.id] = {
                "下限" : elem.down_value,
                "上限" : elem.upper_value,
            };
        }
    }
}

module.exports = plan_get;