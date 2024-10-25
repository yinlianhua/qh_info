/**
 * Date : 2024-10-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _      = require("underscore");
const moment = require("moment");

// 打印QH数据
const data_log = async function(std_time, jj_pos) {
    let logs  = [];
    let time = moment().subtract(1, "day").format("YYYY-MM-DD");
    let total = _.reduce(jj_pos, (prev, elem) => { return elem["盈亏值"] + prev; }, 0.00);

    total = total > 0 ? `+${String(total.toFixed(2))}` : String(total.toFixed(2));

    logs.push("+--------------------------------------------------------------------------------------------------|");
    logs.push(`|                               ${time} 盈亏(${total.padStart(9)})                                         |`);
    logs.push("+--------------------------------------------------------------------------------------------------|");

    for (let elem of jj_pos) {
        let info = `| 最新价: ${String(elem["最新价"].toFixed(4)).padEnd(6)} 成本额: ${String(elem["成本额"].toFixed(2)).padStart(8)} 持仓额: ${String(elem["持仓额"].toFixed(2)).padStart(8)}  盈亏额: ${elem["盈亏额"].padStart(8)} ${elem["基金名"]}`;
        logs.push(info);
    }

    logs.push("+--------------------------------------------------------------------------------------------------|");

    for (let log of logs) {
        global.logger.info(log);
    }
}



module.exports = data_log;
