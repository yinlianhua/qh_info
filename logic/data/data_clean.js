/**
 * Date : 2024-10-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _      = require("underscore");
const moment = require("moment");

// 清理过期的QH数据
const data_clean = async function(std_time) {
    let min_time = std_time - 60 * 60;
    for (let [k, v] of Object.entries(global.data_ts)) {
        for (let [sk, sv] of Object.entries(v)) {
            if (sk < min_time) {
                delete global.data_ts[k][sk];
            }
        }
    }
}

module.exports = data_clean;
