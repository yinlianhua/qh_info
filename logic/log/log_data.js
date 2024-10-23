/**
 * Date : 2024-10-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _      = require("underscore");
const moment = require("moment");

// 打印QH数据
const data_log = async function(std_time, info_list, qh_pos) {
    let logs = [];

    let time = moment().format("YYYY-MM-DD HH:mm:ss");
    logs.push("+-------------------------------------------------------------------------------------------+---------------------|");
    logs.push(`|                               ${time}                                         |         盈亏        |`);
    logs.push("+-------------------------------------------------------------------------------------------+---------------------|");

    let pos_map = _.indexBy(qh_pos, "持仓名称");

    for (let info of info_list) {
        info["低位差"] = String(info["最新价"]-info["最低价"]).padStart(3);
        info["高位差"] = String(info["最高价"]-info["最新价"]).padStart(3);
        info["开盘价"] = String(info["开盘价"]).padStart(5);
        info["最高价"] = String(info["最高价"]).padStart(5);
        info["最低价"] = String(info["最低价"]).padStart(5);
        info["最新价"] = String(info["最新价"]).padStart(5);
        info["结算价"] = String(info["结算价"]).padStart(5);
        info["昨结算"] = String(info["昨结算"]).padStart(5);
        info["波动量"] = String(info["波动量"]).padStart(4);
        info["回撤比"] = String(info["回撤比"]).padStart(3);

        let qh_log = `| ${info["子名称"]} - 开盘价:${info["开盘价"]} 最新价:${info["最新价"]} [${info["低位差"]}:${info["高位差"]}] [${info["最低价"]} ~${info["最高价"]} ] ${info["多空态"]} ${info["强度比"]} 波动:${info["波动量"]} 回撤:${info["回撤比"]}% |`;

        if (pos_map[info["子名称"]] != undefined) {
            let pos_info = pos_map[info["子名称"]];
            // 添加持仓信息
            qh_log += ` ${pos_info["持仓类型"]}${String(pos_info["持仓数量"]).padStart(2)} 手 ${String(pos_info["持仓点位"]).padStart(5)} ${String(pos_info["持仓盈亏"]).padStart(5)} |`;
        } else {
            qh_log += "                     |";
        }

        logs.push(qh_log);
    }

    logs.push("+-------------------------------------------------------------------------------------------+---------------------|");
    logs.push("");

    for (let log of logs) {
        global.logger.info(log);
    }
}



module.exports = data_log;
