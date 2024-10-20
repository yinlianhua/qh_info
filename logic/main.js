/**
 * Date : 2024-09-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const moment = require("moment");
const Logger = require("./libs/logger");
const check  = require("./libs/check");
const price  = require("./logic/price");
const plan   = require("./logic/plan/plan_get");
const config = require("./config.json");
const secret = require("./secret.json");

global.mysql     = secret;
global.logger    = new Logger();
global.data_ts   = {};
global.data_plan = {};

(async function() {
    do {
        let std_time = moment().startOf("minute").unix();
        await plan(std_time);
        if (await check(std_time)) {
            await price(config, std_time);
        }
    } while(true);
})()
