/**
 * Date : 2024-10-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _      = require("underscore");
const moment = require("moment");
const http   = require("../../libs/http");

// 获取JJ数据
const data_get = async function (jj_info, jj_map) {
    let res = [];

    for (let [code, name] of Object.entries(jj_map)) {
        let info = await http.get(`${jj_info.url}${code}`, {}, false, jj_info.header);
        res.push({
            "code" : code,
            "name" : name,
            "str"  : info.res,
        });
    }

    return res;
}

module.exports = data_get;
