/**
 * Date : 2024-10-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _      = require("underscore");
const moment = require("moment");

// 将QH数据解析成标准JSON
const data_parser = async function(std_time, str_list) {
    let res = []

    for (let elem of str_list) {
        // 0 180ETF,
        // 1.601, 最新价
        let str  = elem.str;
        str      = str.split("=");
        str      = str[1].split(",");

        let info = {
            "基金码" : elem.code,
            "基金名" : elem.name,
            "最新价" : +str[1],
            "昨日价" : +str[3],
            "变化值" : +(str[1]-str[3]),
        }

        res.push(info);
    }

    return res;
};

module.exports = data_parser;
