/**
 * Date : 2024-10-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _      = require("underscore");
const moment = require("moment");
const http   = require("../../libs/http");

// 获取QH数据
const data_get = async function (qh_info, monit_map) {
    let res = [];

    for (let [name, code] of Object.entries(monit_map)) {
        let info = await http.get(`${qh_info.url}${code}`, {}, false, qh_info.header);
        res.push({
            "name" : name,
            "str"  : info.res,
        });
    }

    return res;
}

module.exports = data_get;
