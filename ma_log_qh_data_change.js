/**
 * Date : 2025-03-25
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _         = require("underscore");
let moment    = require("moment");
let check     = require("./libs/time_check");
let last_info = {};

async function fn_log_ma_info(codes) {
    let std_time = moment().startOf("minute").unix();
    if (!check(std_time)) { return; }

    let fn_log_qh_ma_info = require("./logic/sync/fn_log_qh_ma_info");

    let info = await fn_log_qh_ma_info(codes, last_info);

    // TODO: 引入告警

    last_info = info.last_info;

    if (info.logs_change.length) {
        console.log(`+---------------------------------------------------------------------------------------------------------------------------------+`);
        console.log(`|                                                  ${moment().format("YYYY-MM-DD HH:mm:ss")}                                                            |`);
        console.log(`+--------+------------+----------+----------------------------+--------------------------+-----------------+----------------------+`);
        console.log(`|  Code  |    Name    |  Latest  | 01_240   05_120    15_60   | 15_240    60_60   240_15 | 240_30  day_20  | 短期    方向    中期 |`);
        console.log(`+--------+------------+----------+----------------------------+--------------------------+-----------------+----------------------+`);
        for (let log of info.logs_change) { console.log(log); }
        console.log(`+--------+------------+----------+----------------------------+--------------------------+-----------------+----------------------+`);
    }
}

(async function() {
    let codes = [
        "AU2604",
        "AU2606",
        "AG2604",
        "AG2606",
        "AO2605",
        "AO2609",
        "BU2605",
        "BU2609",
        "C2605",
        "C2609",
        "CF2605",
        "CF2609",
        "CJ2605",
        "CJ2609",
        "FG2605",
        "FG2609",
        "FU2605",
        "FU2609",
        "JM2605",
        "JM2609",
        "L2605",
        "L2609",
        "MA2605",
        "MA2609",
        "PS2605",
        "PS2609",
        "RB2605",
        "RB2609",
        "SA2605",
        "SA2609",
        "SF2605",
        "SF2609",
        "SH2605",
        "SH2609",
        "SI2605",
        "SI2609",
        "SM2605",
        "SM2609",
        "SP2605",
        "SP2609",
        "SR2605",
        "SR2609",
        "UR2605",
        "UR2609",
        "V2605",
        "V2609"
    ]

    await fn_log_ma_info(codes)

    setInterval(async function() { await fn_log_ma_info(codes) }, 60 * 1000);
})()

