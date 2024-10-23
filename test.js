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

global.val_fix = 1;

(async function() {
    let add_minute = 0;
    let add_count  = 0;
    let start_ts   = moment().startOf("minute").unix();

    do {
        add_count++

        let std_time = start_ts + add_minute * 60;
        // let std_time = moment().startOf("minute").unix();
        if (await check(std_time)) {
            await price(config, std_time);
        }

        if (add_count % 6 == 0) {
            add_count = 0;
            add_minute++;
        }

    } while(true);
})()
