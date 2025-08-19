/**
 * Date : 2025-03-25
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let moment = require('moment');
let sleep  = require('./libs/sleep');

(async function() {
    // 调用同步函数
    async function fn_sync_data() {
        let sync_qh_data = require("./logic/sync/sync_qh_data");
        await sync_qh_data();
    }

    // 调用日志函数
    async function fn_log_info(codes) {
        let fn_log_qh_main_info = require("./logic/sync/fn_log_qh_main_info");
        let logs = await fn_log_qh_main_info(codes);

        for (let log of logs.res) {
            console.log(log)

            if (log == "") {
                await sleep(500);
            }
        }
    }

    let codes = [
        "AO2601",
        "AO2605",
    ]

    setInterval(async function() {
        let now    = moment().format("YYYY-MM-DD HH:mm:ss");
        let minute = moment().minute();

        console.log(now);

        if (minute%5 == 0) {
            await fn_sync_data();
        }

        await fn_log_info(codes);
    }, 1000 * 5);
})()
