/**
 * Date : 2024-09-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const moment = require("moment");
const Logger = require("./libs/logger");
const check  = require("./libs/check");
const price  = require("./logic/price_jj");
const config = require("./config/jj.json");

global.logger = new Logger();

(async function() {
    do {
        let std_time = moment().startOf("minute").unix();
        if (await check(std_time, "jj")) {
            await price(config, std_time);
        }
    } while(true);
})()
