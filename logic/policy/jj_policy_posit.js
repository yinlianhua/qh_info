/**
 * Date : 2024-10-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _      = require("underscore");
const moment = require("moment");

// 计算持仓盈亏
const policy_posit = async function (pos_info, cost_info, jj_data) {
    let res = []


    for (let elem of jj_data) {
        if (cost_info[elem["基金码"]] == undefined) {
            continue;
        }

        elem["成本额"] = cost_info[elem["基金码"]];
        elem["持仓额"] = parseFloat((pos_info[elem["基金码"]] * elem["最新价"]).toFixed(2));
        elem["总盈亏"] = elem["持仓额"] - elem["成本额"];
        elem["日盈亏"] = parseFloat((pos_info[elem["基金码"]] * elem["变化值"]).toFixed(2));
        elem["盈亏值"] = parseFloat((elem["持仓额"] - elem["成本额"]).toFixed(2));
        elem["总盈亏"] = elem["总盈亏"] > 0 ? `+${String(elem["总盈亏"].toFixed(2))}` : `${String(elem["总盈亏"].toFixed(2))}`;
        elem["日盈亏"] = elem["日盈亏"] > 0 ? `+${String(elem["日盈亏"].toFixed(2))}` : `${String(elem["日盈亏"].toFixed(2))}`;

        res.push(elem);
    }

    res = _.sortBy(res, "持仓额").reverse();

    return res;
}



module.exports = policy_posit;
