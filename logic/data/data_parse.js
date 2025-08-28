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

        if (info["多空态"] == "多") {
            if (info["回撤比"] <= 50) { info["强度比"] += "★★★"; }
            if (info["回撤比"] <= 30) { info["强度比"] += "★";   }
            if (info["回撤比"] <= 15) { info["强度比"] += "★";   }
            info["强度比"] = String(info["强度比"]).padEnd(5, "☆");
        } else {
            if (info["回撤比"] <= 50) { info["强度比"] += "☆☆☆"; }
            if (info["回撤比"] <= 30) { info["强度比"] += "☆";   }
            if (info["回撤比"] <= 15) { info["强度比"] += "☆";   }
            info["强度比"] = String(info["强度比"]).padStart(5, "★");
        }

        if (info["强度比"] == "★★★★★") {
            info["多空态"] = "强多";
        }

        if (info["强度比"] == "★★★★☆") {
            info["多空态"] = "偏多";
        }

        if (info["强度比"] == "★★★☆☆") {
            info["多空态"] = "震荡偏多";
        }

        if (info["强度比"] == "★★☆☆☆") {
            info["多空态"] = "震荡偏空";
        }

        if (info["强度比"] == "★☆☆☆☆") {
            info["多空态"] = "偏空";
        }

        if (info["强度比"] == "☆☆☆☆☆") {
            info["多空态"] = "强空";
        }

        res.push(info);
    }

    return res;
};

module.exports = data_parser;
