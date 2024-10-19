/**
 * Date : 2024-10-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _      = require("underscore");
const moment = require("moment");

// 将数据保存到 global.data_ts
const data_save = async function (std_time, info_list) {
    for (let info of info_list) {
        let name = info["子名称"];

        if (global.data_ts[name] == undefined) {
            global.data_ts[name] = {};
        }

        if (global.data_ts[name][std_time] == undefined) {
            global.data_ts[name][std_time] = [];
        }

        global.data_ts[name][std_time].push(info["最新价"]);
    }
}

module.exports = data_save;
