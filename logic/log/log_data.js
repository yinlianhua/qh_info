/**
 * Date : 2024-10-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _      = require("underscore");
const moment = require("moment");

// 打印QH数据
const data_log = async function(std_time, info_list, qh_pos) {
    // [system info]: +---------------------------------------------------------------------------+----------------------|
    // [system info]: |                        2025-07-25 15:09:41  [   581 秒后收盘 ]            |     盈亏(    0)      |
    // [system info]: +------------------------------------------- 强多 --------------------------+----------------------|
    // [system info]: | 焦煤 -  1259 [   54:    0] [ 1205 ~ 1259 ] 强多 ★★★★★ 波动:  53 回撤:  0% |                      |
    // [system info]: | 硅铁 -  6166 [  396:    0] [ 5770 ~ 6166 ] 强多 ★★★★★ 波动: 396 回撤:  0% |                      |
    // [system info]: | 锰硅 -  6414 [  460:    0] [ 5954 ~ 6414 ] 强多 ★★★★★ 波动: 460 回撤:  0% |                      |
    // [system info]: | 螺纹 -  3356 [   68:    2] [ 3288 ~ 3358 ] 强多 ★★★★★ 波动:  70 回撤:  2% |                      |
    // [system info]: | 乙烯 -  5373 [  147:   18] [ 5226 ~ 5391 ] 强多 ★★★★★ 波动: 165 回撤: 10% |                      |
    // [system info]: | 甲醇 -  2519 [   44:    6] [ 2475 ~ 2525 ] 强多 ★★★★☆ 波动:  50 回撤: 12% |                      |
    // [system info]: | 玻璃 -  1362 [   52:    8] [ 1310 ~ 1370 ] 强多 ★★★★☆ 波动:  60 回撤: 13% |                      |
    // [system info]: | 燃油 -  2915 [   48:   10] [ 2867 ~ 2925 ] 强多 ★★★★☆ 波动:  58 回撤: 17% |                      |
    // [system info]: +------------------------------------------- 偏多 --------------------------+----------------------|
    // [system info]: | 塑料 -  7456 [   69:   27] [ 7387 ~ 7483 ] 偏多 ★★★☆☆ 波动:  96 回撤: 28% |                      |
    // [system info]: | 沥青 -  3615 [   28:   13] [ 3587 ~ 3628 ] 偏多 ★★★☆☆ 波动:  41 回撤: 31% |                      |
    // [system info]: | 尿素 -  1803 [   22:   10] [ 1781 ~ 1813 ] 偏多 ★★★☆☆ 波动:  32 回撤: 31% |                      |
    // [system info]: | 纯碱 -  1440 [   35:   16] [ 1405 ~ 1456 ] 偏多 ★★★☆☆ 波动:  51 回撤: 31% |                      |
    // [system info]: | 工硅 -  9725 [  215:  105] [ 9510 ~ 9830 ] 偏多 ★★★☆☆ 波动: 320 回撤: 32% |                      |
    // [system info]: | 白银 -  9392 [  102:   55] [ 9290 ~ 9447 ] 偏多 ★★★☆☆ 波动: 157 回撤: 35% |                      |
    // [system info]: | 白糖 -  5876 [   13:   11] [ 5863 ~ 5887 ] 偏多 ★★★☆☆ 波动:  24 回撤: 45% |                      |
    // [system info]: +------------------------------------------- 偏空 --------------------------+----------------------|
    // [system info]: | 红枣 - 10445 [   35:   95] [10410 ~10540 ] 偏空 ★★☆☆☆ 波动: 130 回撤: 26% |                      |
    // [system info]: | 玉米 -  2311 [    5:   12] [ 2306 ~ 2323 ] 偏空 ★★☆☆☆ 波动:  17 回撤: 29% |                      |
    // [system info]: | 烧碱 -  2637 [   35:   60] [ 2602 ~ 2697 ] 偏空 ★★☆☆☆ 波动:  95 回撤: 36% |                      |
    // [system info]: | 氧铝 -  3428 [   79:  119] [ 3349 ~ 3547 ] 偏空 ★★☆☆☆ 波动: 198 回撤: 39% |                      |
    // [system info]: +------------------------------------------- 强空 --------------------------+----------------------|
    // [system info]: | 晶硅 - 51025 [  460: 3705] [50565 ~54730 ] 强空 ★☆☆☆☆ 波动:4165 回撤: 11% |                      |
    // [system info]: | 棉花 - 14170 [   35:  160] [14135 ~14330 ] 强空 ★☆☆☆☆ 波动: 195 回撤: 17% |                      |
    // [system info]: +---------------------------------------------------------------------------+----------------------|

    let logs = [];

    let pos_map = _.indexBy(qh_pos, "持仓名称");

    let time = moment().format("YYYY-MM-DD HH:mm:ss");
    let now = moment().unix();
    let end = moment(`${moment().format("YYYY-MM-DD")} 15:00:00`).unix();

    logs.push("+--------------------------------------------------------------------------------+----------------------|");
    logs.push(`|                        ${time}  [ ${(end - now).toString().padStart(5)} 秒后收盘 ]                 |     盈亏(${String(pos_map["合计"]["持仓盈亏"]).padStart(6)})    |`);
    // logs.push("+---------------------------------------------------------------------------+----------------------|");

    let data_list1 = _.sortBy(_.filter(info_list, (elem) => { return elem["多空态"] == "强多"; }), (elem) => {return elem["回撤比"];});
    let data_list2 = _.sortBy(_.filter(info_list, (elem) => { return elem["多空态"] == "偏多"; }), (elem) => {return elem["回撤比"];});
    let data_list3 = _.sortBy(_.filter(info_list, (elem) => { return elem["多空态"] == "偏空"; }), (elem) => {return elem["回撤比"];}).reverse();
    let data_list4 = _.sortBy(_.filter(info_list, (elem) => { return elem["多空态"] == "强空"; }), (elem) => {return elem["回撤比"];}).reverse();

    for (let data_list of [ data_list1, data_list2, data_list3, data_list4 ]) {
        if (data_list.length == 0) {
            continue;
        }

        logs.push(`+--------------------------------------------- ${data_list[0]["多空态"]} -----------------------------+----------------------|`);

        for (let info of data_list) {
            info["低位差"] = String(info["最新价"]-info["最低价"]).padStart(5);
            info["高位差"] = String(info["最高价"]-info["最新价"]).padStart(5);
            info["开盘价"] = String(info["开盘价"]).padStart(5);
            info["最高价"] = String(info["最高价"]).padStart(5);
            info["最低价"] = String(info["最低价"]).padStart(5);
            info["最新价"] = String(info["最新价"]).padStart(5);
            info["结算价"] = String(info["结算价"]).padStart(5);
            info["昨结算"] = String(info["昨结算"]).padStart(5);
            info["波动量"] = String(info["波动量"]).padStart(4);
            info["回撤比"] = String(info["回撤比"]).padStart(3);

            let qh_log = `| ${info["子名称"]} - ${info["最新价"]} [${info["低位差"]}:${info["高位差"]}] [${info["最低价"]} ~${info["最高价"]} ] ${info["多空态"]} ${info["强度比"]} 波动:${info["波动量"]} 回撤:${info["回撤比"]}% |`;

            if (pos_map[info["子名称"]] != undefined) {
                let pos_info = pos_map[info["子名称"]];
                // 添加持仓信息
                qh_log += ` ${pos_info["持仓类型"]}${String(pos_info["持仓数量"]).padStart(2)} 手 ${String(pos_info["持仓点位"]).padStart(6)} ${String(pos_info["持仓盈亏"]).padStart(5)} |`;
            } else {
                qh_log += "                      |";
            }

            logs.push(qh_log);
        }
    }

    logs.push("+--------------------------------------------------------------------------------+----------------------|");

    for (let log of logs) {
        global.logger.info(log);
    }
}



module.exports = data_log;
