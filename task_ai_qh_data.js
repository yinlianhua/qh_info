/**
 * Date : 2025-03-25
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let mail = require("./libs/email");

(async function() {
    let codes = [
        "AG2604",
        "AO2601",
        "BU2601",
        "C2601",
        "CF2601",
        "CJ2601",
        "FG2601",
        "FU2601",
        "JM2601",
        "L2601",
        "MA2601",
        "PS2601",
        "RB2601",
        "SA2601",
        "SF2601",
        "SH2601",
        "SI2601",
        "SM2601",
        "SP2601",
        "SR2601",
        "UR2601",
        "V2601",
    ]

    let fn_log_qh_main_info = require("./logic/sync/fn_log_qh_main_info");

    await fn_log_qh_main_info(codes);

    console.log("根据给出的数据，分析下各个期货商品的短期支撑和压力位，表格输出")
})()
