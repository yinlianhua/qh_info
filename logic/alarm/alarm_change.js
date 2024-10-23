/**
 * Date : 2024-10-22
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _      = require("underscore");
const moment = require("moment");
const http   = require("../../libs/http");

// 发送波动告警
const alarm_change = async function(config={}, qh_change=[]) {
    /*
    {
        "白银" {
            "1"  : {"max" : xxx, "min" : xxx, "chg" : xxx}
            "5"  : {"max" : xxx, "min" : xxx, "chg" : xxx}
            "15" : {"max" : xxx, "min" : xxx, "chg" : xxx}
        }
    }
    */

    const RATE = {
        "1"  : 0.007,
        "5"  : 0.010,
        "15" : 0.015,
    }

    let key = config.key;
    let url = config.url.replace("real_key", key);
    let alarm = [];

    for (let [name, info] of Object.entries(qh_change)) {
        for (let [t, v] of Object.entries(info)) {
            if (RATE[t] == undefined) {
                continue;
            }

            let limit = parseInt(RATE[t] * v.min);

            if (v.chg >= limit) {
                alarm.push(`${name}: ${t} 分钟内发生 ${v.chg}点 大幅波动.`);
            }
        }
    }

    for (let msg of alarm) {
        await http.get(encodeURI(`${url}${msg}`), {}, false);
    }
}

module.exports = alarm_change;
