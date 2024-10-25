/**
 * Date : 2024-10-15
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _            = require("underscore");
const moment       = require("moment");
const log_data     = require("./log/jj_log_data");
const data_get     = require("./data/jj_data_get");
const data_parse   = require("./data/jj_data_parse");
const policy_posit = require("./policy/jj_policy_posit");

async function price(config, std_time) {
    // 获取数据
    let jj_data = await data_get(config.jj_info, config.jj_map);

    // 处理数据
    jj_data = await data_parse(std_time, jj_data);

    // 计算盈亏
    let jj_pos = await policy_posit(config.jj_pos, config.jj_cost, jj_data);

    // 打印日志
    await log_data(std_time, jj_pos)
};

module.exports = price;
