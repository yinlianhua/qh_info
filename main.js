/**
 * Date : 2024-09-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const moment = require("moment");
const Logger = require("./libs/logger");
const price  = require("./libs/price");
const check  = require("./libs/check");
const config = require("./config.json");

global.logger  = new Logger();
global.data_ts = {};

(async function() {
    do {
        let std_time = moment().startOf("minute").unix();
        if (await check(std_time)) {
            await price(config, std_time);
        }
    } while(true);
})()
