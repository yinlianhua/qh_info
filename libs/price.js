/**
 * Date : 2024-10-15
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _      = require("underscore");
const moment = require("moment");
const http   = require("./http");

async function data_get(qh_info, monit_map) {
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

async function data_parser(std_time, str_list) {
    let res = []

    for (let elem of str_list) {
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

        let name = elem.name;
        let str  = elem.str;
        str      = str.split("=");
        str      = str[1].split(",");

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

        res.push(info);
    }

    return res;
};

async function data_save(std_time, info_list) {
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

async function data_log(std_time, info_list, qh_pos) {
    let logs = [];

    let time = moment().format("YYYY-MM-DD HH:mm:ss");
    logs.push("+---------------------------------------------------------------------------------+---------------------|");
    logs.push(`|                               ${time}                               |         盈亏        |`);
    logs.push("+---------------------------------------------------------------------------------+---------------------|");

    let pos_map = _.indexBy(qh_pos, "持仓名称");

    for (let info of info_list) {
        info["开盘价"] = String(info["开盘价"]).padStart(5);
        info["最高价"] = String(info["最高价"]).padStart(5);
        info["最低价"] = String(info["最低价"]).padStart(5);
        info["最新价"] = String(info["最新价"]).padStart(5);
        info["结算价"] = String(info["结算价"]).padStart(5);
        info["昨结算"] = String(info["昨结算"]).padStart(5);
        info["波动量"] = String(info["波动量"]).padStart(4);
        info["回撤比"] = String(info["回撤比"]).padStart(3);

        let qh_log = `| ${info["子名称"]} - 开盘价:${info["开盘价"]} 最新价:${info["最新价"]} [${info["最低价"]} ~${info["最高价"]} ] ${info["多空态"]}头 ${info["强度比"]} 波动:${info["波动量"]} 回撤:${info["回撤比"]}% |`;

        if (pos_map[info["子名称"]] != undefined) {
            let pos_info = pos_map[info["子名称"]];
            // 添加持仓信息
            qh_log += ` ${pos_info["持仓类型"]}${String(pos_info["持仓数量"]).padStart(2)} 手 ${String(pos_info["持仓点位"]).padStart(5)} ${String(pos_info["持仓盈亏"]).padStart(5)} |`;
        } else {
            qh_log += "                     |";
        }

        logs.push(qh_log);
    }

    logs.push("+---------------------------------------------------------------------------------+---------------------|");
    logs.push("");

    for (let log of logs) {
        global.logger.info(log);
    }
}

async function data_posit(price_info, price_pos, qh_data) {
    let res = []

    for (let info of qh_data) {
        // 无持仓,跳过
        if (price_pos[info["子名称"]] == undefined || _.isEmpty(price_pos[info["子名称"]])) {
            continue;
        }

        // 无配价,跳过
        if (price_info[info["子名称"]] == undefined) {
            continue;
        }

        let pos_info   = price_pos[info["子名称"]];
        let unit_price = price_info[info["子名称"]];

        let pos_price = {
            "持仓名称" : info["子名称"],
            "持仓类型" : pos_info.type,
            "持仓数量" : pos_info.count,
            "持仓点位" : pos_info.cost,
            "持仓盈亏" : "-",
            "盈亏金额" : 0.00
        }

        if (pos_info.type == "多") { pos_price["盈亏金额"] = (info["买入价"] - pos_info.cost) * pos_info.count * unit_price; }
        if (pos_info.type == "空") { pos_price["盈亏金额"] = (pos_info.cost - info["卖出价"]) * pos_info.count * unit_price; }

        pos_price["持仓盈亏"] = pos_price["盈亏金额"] > 0 ? `+${String(pos_price["盈亏金额"])}` : `${String(pos_price["盈亏金额"])}`;

        res.push(pos_price);
    }

    return res;
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

async function data_alarm(config={}, qh_pos=[]) {
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



async function price(config, std_time) {
    // 获取数据
    let qh_data = await data_get(config.qh_info, config.monit_map);

    // 处理数据
    qh_data = await data_parser(std_time, qh_data);

    // 保存数据
    await data_save(std_time, qh_data);

    // 计算盈亏
    let qh_pos = await data_posit(config.price_info, config.price_pos, qh_data);

    // TODO: 计算数据
    // let qh_calc = await data_calc(std_time);

    // TODO: 发送告警
    // await data_alarm(config.push_deer, qh_pos);

    // 打印日志
    await data_log(std_time, qh_data, qh_pos);

    // 清理内存
    await data_clean(std_time);
};

module.exports = price;
