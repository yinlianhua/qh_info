/**
 * Date : 2024-09-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const Logger = require("./libs/logger");
const price  = require("./libs/price");
const check  = require("./libs/trading_hours");
const config = require("./config.json");

global.logger = new Logger();

(async function() {
    do {
        if (await check()) {
            await price(config);
        }
    } while(true);
})()
