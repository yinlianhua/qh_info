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

    for (let info of qh_pos) {
        let name = info["子名称"];
        let last = info["最新价"];

        if (global.data_plan[name] == undefined) {
            continue;
        }

        let plan = global.data_plan[name];

        for (let [type, obj] of Object.entries(plan)) {
            for (let [val, t] of Object.entries(obj)) {
                console.log(name, type, last, val)
                let msg = "";
                if (type == "上限" && last > val) {
                    msg = `☆ ${name} 最新价 ${last} 高于 ${val}`;
                    delete global.data_plan[name][type][val];
                }
                if (type == "下限" && last < val) {
                    msg = `☆ ${name} 最新价 ${last} 低于 ${val}`;
                    delete global.data_plan[name][type][val];
                }
                if (msg == "") {
                    continue;
                }
                await http.get(encodeURI(`${url}${msg}`), {}, false);
            }
        }
    }
}

module.exports = alarm_between;
