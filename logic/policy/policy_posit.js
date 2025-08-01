/**
 * Date : 2024-10-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _      = require("underscore");
const moment = require("moment");

// 计算持仓盈亏
const policy_posit = async function (price_info, qh_data) {
    let res = []

    for (let info of qh_data) {
        // 无持仓,跳过
        if (global.data_pos[info["子名称"]] == undefined || _.isEmpty(global.data_pos[info["子名称"]])) {
            continue;
        }

        // 无配价,跳过
        let real_name = info["子名称"].split("_")[0];
        if (price_info[real_name] == undefined) {
            continue;
        }

        let pos_info   = global.data_pos[info["子名称"]];
        let unit_price = price_info[real_name];

        let pos_price = {
            "持仓名称" : info["子名称"],
            "持仓类型" : pos_info.type,
            "持仓数量" : pos_info.count,
            "持仓点位" : pos_info.cost,
            "持仓盈亏" : "-",
            "盈亏金额" : 0.00
        }

        // if (pos_info.type == "多") { pos_price["盈亏金额"] = (info["买入价"] - pos_info.cost) * pos_info.count * unit_price; }
        // if (pos_info.type == "空") { pos_price["盈亏金额"] = (pos_info.cost - info["卖出价"]) * pos_info.count * unit_price; }

        if (pos_info.type == "多") { pos_price["盈亏金额"] = (info["最新价"] - pos_info.cost) * pos_info.count * unit_price; }
        if (pos_info.type == "空") { pos_price["盈亏金额"] = (pos_info.cost - info["最新价"]) * pos_info.count * unit_price; }

        pos_price["持仓盈亏"] = pos_price["盈亏金额"] > 0 ? `+${String(pos_price["盈亏金额"])}` : `${String(pos_price["盈亏金额"])}`;

        res.push(pos_price);
    }

    let total = {
        "持仓名称" : "合计",
        "持仓类型" : "-",
        "持仓数量" : 0,
        "持仓点位" : 0,
        "持仓盈亏" : 0,
        "盈亏金额" : 0
    }

    for (let elem of res) {
        total["盈亏金额"] += elem["盈亏金额"];
    }

    total["持仓盈亏"] = total["盈亏金额"] > 0 ? `+${String(total["盈亏金额"])}` : `${String(total["盈亏金额"])}`;

    res.push(total);

    return res;
}



module.exports = policy_posit;
