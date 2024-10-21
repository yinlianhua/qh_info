/**
 * Date : 2024-10-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _      = require("underscore");
const moment = require("moment");

// 计算区间异常变化
const policy_change = async function(std_time) {
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

    // console.log(data_map)
}


module.exports = policy_change;