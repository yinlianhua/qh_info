/**
 * Date : 2024-10-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _      = require("underscore");
const moment = require("moment");
const http   = require("../../libs/http");

// 每天10:15分获取计划数据
const plan_get = async function(std_time) {
    let key = config.key;
    let url = config.url.replace("real_key", key);

    for (let info of qh_pos) {
        let msg = "";

        if (info["盈亏金额"] > 100) {
            msg = `☆ ${info["持仓名称"]} 盈利: ${info["持仓盈亏"]}`;
        }

        if (info["盈亏金额"] < -100) {
            msg = `☆ ${info["持仓名称"]} 亏损: ${info["持仓盈亏"]}`;
        }

        if (msg != "") {
            await http.get(encodeURI(`${url}${msg}`), {}, false);
        }
    }
}

module.exports = plan_get;