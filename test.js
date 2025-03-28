/**
 * Date : 2025-03-25
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';
let sleep  = require('./libs/sleep');

(async function() {
    // let sync_qh_data = require("./logic/sync/sync_qh_data");
    // await sync_qh_data();

    let codes = ["L2505","L2509","L2601"];
    let fn_log_qh_main_info = require("./logic/sync/fn_log_qh_main_info");
    let logs = await fn_log_qh_main_info(codes);

    for (let log of logs.res) {
        console.log(log)

        if (log == "") {
            await sleep(1000);
        }
    }


})()
