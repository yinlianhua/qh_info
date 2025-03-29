/**
 * Date : 2025-03-25
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';
let sleep  = require('./libs/sleep');

(async function() {
    let codes = [
        "AG2506", "AG2508", "AG2510",
        "CF2505", "CF2509", "CF2601",
        "CJ2505", "CJ2509", "CJ2601",
        "FG2505", "FG2509", "FG2601",
        "JM2505", "JM2509", "JM2601",
        "L2505", "L2509", "L2601",
        "MA2505", "MA2509", "MA2601",
        "SA2505", "SA2509", "SA2601",
        "SR2505", "SR2509", "SR2601",
        "UR2505", "UR2509", "UR2601",
        "C2505", "C2509", "C2601",
        "RB2505", "RB2507", "RB2509",
        "FU2505", "FU2507", "FU2509",
        "BU2506", "BU2507", "BU2508",
        "SI2505", "SI2506", "SI2507",
        "AO2505", "AO2507", "AO2509",
        "SH2505", "SH2509", "SH2601",
        "SF2505", "SF2506", "SF2507",
        "V2505", "V2509", "V2601",
    ]

    let fn_log_qh_main_info = require("./logic/sync/fn_log_qh_main_info");
    let logs = await fn_log_qh_main_info(codes);

    for (let log of logs.res) {
        console.log(log)

        if (log == "") {
            await sleep(1000);
        }
    }


})()
