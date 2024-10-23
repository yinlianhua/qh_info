/**
 * Date : 2024-09-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const moment = require("moment");
const Logger = require("./libs/logger");
const check  = require("./libs/check");
const price  = require("./logic/price");
const config = require("./config.json");
const secret = require("./secret.json");

global.mysql     = secret;
global.logger    = new Logger();
global.data_ts   = {};
global.data_plan = config.price_plan;
global.data_pos  = config.price_pos;

(async function() {
    /*
    const plan_get = require("./logic/plan/plan_get");
    const pos_get  = require("./logic/pos/pos_get");

    // 获取计划
    await plan_get();

    // 获取持仓
    await pos_get();
    */

    do {
        let std_time = moment().startOf("minute").unix();
        if (await check(std_time)) {
            await price(config, std_time);
        }
    } while(true);
})()
