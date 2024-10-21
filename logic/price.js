/**
 * Date : 2024-10-15
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _              = require("underscore");
const moment         = require("moment");
const plan_get       = require("./plan/plan_get");
const pos_get        = require("./pos/pos_get");
const log_data       = require("./log/log_data");
const data_get       = require("./data/data_get");
const data_parse     = require("./data/data_parse");
const data_save      = require("./data/data_save");
const data_clean     = require("./data/data_clean");
const policy_posit   = require("./policy/policy_posit");
const policy_between = require("./policy/policy_between");
const policy_change  = require("./policy/policy_change");
const alarm_posit    = require("./alarm/alarm_posit");
const alarm_between  = require("./alarm/alarm_between");
const alarm_change   = require("./alarm/alarm_change");

async function price(config, std_time) {
    // 获取计划
    await plan_get(std_time);

    // 获取持仓
    await pos_get(std_time);

    // 获取数据
    let qh_data = await data_get(config.qh_info, config.monit_map);

    // 处理数据
    qh_data = await data_parse(std_time, qh_data);

    // 保存数据
    await data_save(std_time, qh_data);

    let [
        qh_pos,
        qh_change,
        // qh_between,
    ] = await Promise.all([
        // 计算盈亏
        policy_posit(config.price_info, qh_data),
        // 计算异动
        policy_change(std_time),
        // 计算突破
        // policy_between(qh_data),
    ]);

    await Promise.all([
        // 发送盈亏告警
        // alarm_posit(config.push_deer, qh_pos),
        // 发送异动告警
        // alarm_change(config.push_deer, qh_change),
        // 发送突破告警
        alarm_between(config.push_deer, qh_data),
    ]);

    // 打印日志
    await log_data(std_time, qh_data, qh_pos);

    // 清理内存
    await data_clean(std_time);
};

module.exports = price;
