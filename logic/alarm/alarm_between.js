/**
 * Date : 2024-10-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _      = require("underscore");
const moment = require("moment");
const http   = require("../../libs/http");

// 发送上下限突破告警
const alarm_between = async function(config={}, qh_pos=[]) {
    let key = config.key;
    let url = config.url.replace("real_key", key);

    let new_date = moment().format("YYYY-MM-DD");

    for (let info of qh_pos) {
        let name = info["子名称"];
        let last = info["最新价"];
        let min  = info["最低价"];
        let max  = info["最高价"];

        if (global.data_plan[name] == undefined) {
            continue;
        }

        // 自动使用每日最高/最低
        // if (global.data_plan[name] == undefined || global.data_date != new_date) {
        //     global.data_plan[name] = { "下限" : min, "上限" : max };
        // }

        for (let [type, val] of Object.entries(global.data_plan[name])) {
            // console.log(name, type, last, val);
            let msg = "";

            if (type == "上限" && last > val) {
                msg = `☆ ${name} 最新价 ${last} 高于 ${val}`;
                // 基准值 * 1.005
                // global.data_plan[name][type] = last * 1.005;
                // 2.触发后清除
                delete global.data_plan[name][type];
                // 3.使用最新价
                // global.data_plan[name][type] = last;
            }

            if (type == "下限" && last < val) {
                msg = `☆ ${name} 最新价 ${last} 低于 ${val}`;
                // 1.基准值 * 0.995
                // global.data_plan[name][type] = last * 0.995;
                // 2.触发后清除
                delete global.data_plan[name][type];
                // 3.使用最新价
                // global.data_plan[name][type] = last;
            }

            if (msg == "") {
                continue;
            }

            await http.get(encodeURI(`${url}${msg}`), {}, false);
        }
    }

    global.data_date = new_date;
}

module.exports = alarm_between;
