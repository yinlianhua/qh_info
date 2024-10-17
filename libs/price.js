/**
 * Date : 2024-10-15
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _      = require("underscore");
const moment = require("moment");
const http   = require("./http");

async function data_parser(str="") {
    // 00 玻璃连续
    // 01 113000      可能是编号
    // 02 1304.000    开盘价
    // 03 1336.000    最高价
    // 04 1301.000    最低价
    // 05 0.000
    // 06 1313.000    买入价
    // 07 1314.000    卖出价
    // 08 1313.000    最新价
    // 09 1323.000    结算价
    // 10 1271.000    昨结算
    // 11 444,         买入量
    // 12 29,          卖出量
    // 13 1077814.000, 持仓量
    // 14 2682359,     成交量
    str = str.split("=");
    str = str[1].split(",");

    return {
        "子编号" : str[1],
        "开盘价" : String(str[2]).padStart(10),
        "最高价" : String(str[3]).padStart(10),
        "最低价" : String(str[4]).padStart(10),
        "买入价" : str[6],
        "卖出价" : str[7],
        "最新价" : String(str[8]).padStart(10),
        "结算价" : String(str[9]).padStart(10),
        "昨结算" : String(str[10]).padStart(10),
        "买入量" : str[11],
        "卖出量" : str[12],
        "持仓量" : str[13],
        "成交量" : str[14],
    }
};

async function data_position(info, price, position) {
    let res = {
        "持仓类型" : "-",
        "持仓数量" : "-",
        "持仓点位" : "-",
        "持仓盈亏" : "-",
    }

    if (price == undefined || position == undefined) {
        return res;
    }

    res["持仓类型"] = position.type;
    res["持仓数量"] = position.count;
    res["持仓点位"] = position.cost;

    if (position.type == "多") {
        res["持仓盈亏"] = (info["买入价"] - position.cost) * position.count * price;
    }

    if (position.type == "空") {
        res["持仓盈亏"] = (position.cost - info["卖出价"]) * position.count * price;
    }

    if (res["持仓盈亏"] > 0) {
        res["持仓盈亏"] = `+${String(res["持仓盈亏"])}`
    }

    return res;
}

async function price(config) {
    logger.info("");
    logger.info(`最新价格 ${moment().format("YYYY-MM-DD HH:mm:ss")}`);

    for (let [name, code] of Object.entries(config.monit_map)) {
        let data_api = await http.get(`${config.url}${code}`, {}, false, config.header);
        let data_qh  = await data_parser(data_api.res);
        let data_pos = await data_position(data_qh, config.price_info[name], config.price_pos[name]);
        let data_log = `${name} - 开盘价:${data_qh["开盘价"]} 范围价:[${data_qh["最低价"]} -${data_qh["最高价"]} ] 最新价:${data_qh["最新价"]}`;
        if (data_pos["持仓盈亏"] != "-") {
            data_log += ` ${data_pos["持仓类型"]},${data_pos["持仓数量"]}手,${data_pos["持仓点位"]},${data_pos["持仓盈亏"]}`;
        }

        logger.info(data_log);
    }
};

module.exports = price;
