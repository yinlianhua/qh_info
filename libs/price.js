/**
 * Date : 2024-10-15
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _      = require("underscore");
const moment = require("moment");
const http   = require("./http");

async function data_log(logs=[]) {
    logger.info("+---------------------------------------------------------------------------------+");
    logger.info(`|                               ${moment().format("YYYY-MM-DD HH:mm:ss")}                               |`);
    logger.info("+---------------------------------------------------------------------------------+");
    for (let log of logs) {
        logger.info("| " + log + " |");
    }
}

async function data_alarm(config={}, msgs=[]) {
    let key = config.key;
    let url = config.url.replace("real_key", key);

    for (let msg of msgs) {
        await http.get(encodeURI(`${url}${msg}`), {}, false);
    }
}

async function data_save(std_time, info={}) {
    let name = info["子名称"];

    if (global.data_ts[name] == undefined) {
        global.data_ts[name] = {};
    }

    if (global.data_ts[name][std_time] == undefined) {
        global.data_ts[name][std_time] = [];
    }

    global.data_ts[name][std_time].push(info["最新价"]);
}

async function data_calc(std_time) {
    let alarm_list = [];

    // 计算 1,5,15,30,60 最大值,最小值,波动量
    // let min = [1,5,15,30,60];
    let data_min = [1];
    let data_map = {}

    for (let [name, val_map] of Object.entries(global.data_ts)) {
        if (data_map[name] == undefined) {
            data_map[name] = {};
        }

        for (let l of data_min) {
            let all_val  = _.sortBy(_.keys(val_map));
            let start    = all_val.length - l >= 0 ? all_val.length - l : 0;
            let end      = all_val.length;
            let need_val = all_val.slice(start, end);

            // TODO: 计算最大值，最小值
            let calc_list = [];
            for (let ts of need_val) {
                calc_list = calc_list.concat(val_map[ts]);
            }
            let max = _.max(calc_list);
            let min = _.min(calc_list);
            let chg = max - min;

            data_map[name][l] = {
                "max" : max,
                "min" : min,
                "chg" : chg,
            };
        }
    }

    console.log(data_map)
}

async function data_clean(std_time) {
    let min_time = std_time - 60 * 60;
    for (let [k, v] of Object.entries(global.data_ts)) {
        for (let [sk, sv] of Object.entries(v)) {
            if (sk < min_time) {
                delete global.data_ts[k][sk];
            }
        }
    }
}

async function data_parser(name, str="", std_time) {
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
    // 11 444         买入量
    // 12 29          卖出量
    // 13 1077814.000 持仓量
    // 14 2682359     成交量
    str = str.split("=");
    str = str[1].split(",");

    let info = {
        "子名称" : name,
        "子编号" : parseInt(str[1]),
        "开盘价" : parseInt(str[2]),
        "最高价" : parseInt(str[3]),
        "最低价" : parseInt(str[4]),
        "买入价" : parseInt(str[6]),
        "卖出价" : parseInt(str[7]),
        "最新价" : parseInt(str[8]),
        "结算价" : parseInt(str[9]),
        "昨结算" : parseInt(str[10]),
        "买入量" : parseInt(str[11]),
        "卖出量" : parseInt(str[12]),
        "持仓量" : parseInt(str[13]),
        "成交量" : parseInt(str[14]),
        "波动量" : parseInt(str[3]-str[4]),
        "多空态" : (str[8] - str[4]) >= (str[3] - str[8]) ? "多" : "空",
        "强度比" : "",
        "回撤值" : 0,
        "回撤比" : "-"
    }

    info["回撤比"] = info["多空态"] == "多" ? parseInt((str[3]-str[8])/(str[3]-str[4])*100) : parseInt((str[8]-str[4])/(str[3]-str[4])*100);
    info["回撤值"] = info["多空态"] == "多" ? parseInt((str[3]-str[8])) : parseInt((str[8]-str[4]));

    if (info["回撤比"] < 50) { info["强度比"] += "★"; }
    if (info["回撤比"] < 40) { info["强度比"] += "★"; }
    if (info["回撤比"] < 30) { info["强度比"] += "★"; }
    if (info["回撤比"] < 20) { info["强度比"] += "★"; }
    if (info["回撤比"] < 10) { info["强度比"] += "★"; }

    info["强度比"] = String(info["强度比"]).padEnd(5, "☆");

    await data_save(std_time, info);

    info["开盘价"] = String(info["开盘价"]).padStart(5);
    info["最高价"] = String(info["最高价"]).padStart(5);
    info["最低价"] = String(info["最低价"]).padStart(5);
    info["最新价"] = String(info["最新价"]).padStart(5);
    info["结算价"] = String(info["结算价"]).padStart(5);
    info["昨结算"] = String(info["昨结算"]).padStart(5);
    info["波动量"] = String(info["波动量"]).padStart(4);
    info["回撤比"] = String(info["回撤比"]).padStart(3);

    return info;
};

async function data_posit(name="", info={}, price, position) {
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

async function price(config, std_time) {
    let msg_list = [];
    let list_qh  = [];
    let list_pos = [];

    for (let [name, code] of Object.entries(config.monit_map)) {
        let data_api = await http.get(`${config.qh_info.url}${code}`, {}, false, config.qh_info.header);
        let data_qh  = await data_parser(name, data_api.res, std_time);
        let data_pos = await data_posit(name, data_qh, config.price_info[name], config.price_pos[name]);

        list_qh.push(data_qh);
        list_pos.push(data_pos);

        let data_log = `${name} - 开盘价:${data_qh["开盘价"]} 最新价:${data_qh["最新价"]} [${data_qh["最低价"]} ~${data_qh["最高价"]} ] ${data_qh["多空态"]}头 ${data_qh["强度比"]} 波动:${data_qh["波动量"]} 回撤:${data_qh["回撤比"]}%`;

        if (data_pos["持仓盈亏"] != "-") { data_log += ` ${data_pos["持仓类型"]},${data_pos["持仓数量"]}手,${data_pos["持仓点位"]},${data_pos["持仓盈亏"]}`; }

        msg_list.push(data_log);
    }

    // 打印日志
    await data_log(msg_list);

    // 计算数据
    await data_calc(std_time);

    // TODO: 发送告警
    // await data_alarm(config.push_deer, msg_list);

    // 清理内存
    await data_clean(std_time);
};

module.exports = price;
