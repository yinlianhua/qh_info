/**
 * Date : 2025-03-25
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';
let sleep  = require('./libs/sleep');

(async function() {
    let codes = [
        "AG2602",
        "AG2604",
        "AO2601",
        "AO2605",
        "FG2601",
        "FG2605",
        "JM2601",
        "JM2605",
        "L2601",
        "L2605",
        "MA2601",
        "MA2605",
        "RB2601",
        "RB2605",
        "SA2601",
        "SA2605",
        "SH2601",
        "SH2605",
        "SP2601",
        "SP2605",
        "SR2601",
        "SR2605",
        "UR2601",
        "UR2605"
    ]

    let fn_log_qh_main_info = require("./logic/sync/fn_log_qh_main_info");
    let logs = await fn_log_qh_main_info(codes);

    for (let log of logs.res) {
        console.log(log)

        if (log == "") {
            await sleep(500);
        }
    }
})()
