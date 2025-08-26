/**
 * Date : 2025-03-25
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let mail = require("./libs/email");

(async function() {
    let codes = [
        "AG2602",
        "AG2604",
        "AO2601",
        "AO2605",
        "BU2601",
        "BU2605",
        "C2601",
        "C2605",
        "CF2601",
        "CF2605",
        "CJ2601",
        "CJ2605",
        "FG2601",
        "FG2605",
        "FU2601",
        "FU2605",
        "JM2601",
        "JM2605",
        "L2601",
        "L2605",
        "MA2601",
        "MA2605",
        "PS2601",
        "PS2605",
        "RB2601",
        "RB2605",
        "SA2601",
        "SA2605",
        "SF2601",
        "SF2605",
        "SH2601",
        "SH2605",
        "SI2601",
        "SI2605",
        "SM2601",
        "SM2605",
        "SP2601",
        "SP2605",
        "SR2601",
        "SR2605",
        "UR2601",
        "UR2605",
        "V2601",
        "V2605"
    ]

    let fn_log_qh_main_info = require("./logic/sync/fn_log_qh_main_info");
    let fn_make_qh_ejs_v1   = require("./logic/sync/fn_make_qh_ejs_v1");

    let data = await fn_log_qh_main_info(codes);
    let html = await fn_make_qh_ejs_v1(data.res);

    for (let elem of data.res) {
        console.log(`${elem.name} score: ${elem.score.toFixed(2).padStart(6)} latest: ${elem.latest.toFixed(2).padStart(8)} 短:  ${elem.target_short} 中: ${elem.target_medium} 长: ${elem.target_long}`)
    }

    /*
    for (let elem of data.res) {
        console.log(`
            code : ${elem.code}
            name : ${elem.name}
            score: ${elem.score}
            latest: ${elem.latest}
            avg_05_120: ${elem.avg_05_120.toFixed(2)}, max_05_120: ${elem.max_05_120.toFixed(2)}, min_05_120: ${elem.min_05_120.toFixed(2)}, pct_05_120: ${elem.pct_05_120.toFixed(2)}
            avg_05_240: ${elem.avg_05_240.toFixed(2)}, max_05_240: ${elem.max_05_240.toFixed(2)}, min_05_240: ${elem.min_05_240.toFixed(2)}, pct_05_240: ${elem.pct_05_240.toFixed(2)}
            avg_15_120: ${elem.avg_15_120.toFixed(2)}, max_15_120: ${elem.max_15_120.toFixed(2)}, min_15_120: ${elem.min_15_120.toFixed(2)}, pct_15_120: ${elem.pct_15_120.toFixed(2)}
            avg_15_240: ${elem.avg_15_240.toFixed(2)}, max_15_240: ${elem.max_15_240.toFixed(2)}, min_15_240: ${elem.min_15_240.toFixed(2)}, pct_15_240: ${elem.pct_15_240.toFixed(2)}
            avg_240_12: ${elem.avg_240_12.toFixed(2)}, max_240_12: ${elem.max_240_12.toFixed(2)}, min_240_12: ${elem.min_240_12.toFixed(2)}, pct_240_12: ${elem.pct_240_12.toFixed(2)}
            avg_day_10: ${elem.avg_day_10.toFixed(2)}, max_day_10: ${elem.max_day_10.toFixed(2)}, min_day_10: ${elem.min_day_10.toFixed(2)}, pct_day_10: ${elem.pct_day_10.toFixed(2)}
            avg_day_30: ${elem.avg_day_30.toFixed(2)}, max_day_30: ${elem.max_day_30.toFixed(2)}, min_day_30: ${elem.min_day_30.toFixed(2)}, pct_day_30: ${elem.pct_day_30.toFixed(2)}
            avg_day_60: ${elem.avg_day_60.toFixed(2)}, max_day_60: ${elem.max_day_60.toFixed(2)}, min_day_60: ${elem.min_day_60.toFixed(2)}, pct_day_60: ${elem.pct_day_60.toFixed(2)}
            target_short:  ${((elem.min_05_120+elem.min_05_240)/2).toFixed(2)} ~ ${((elem.max_05_120+elem.max_05_240)/2).toFixed(2)}
            target_medium: ${((elem.min_15_120+elem.min_15_240+elem.min_240_12)/3).toFixed(2)} ~ ${((elem.max_15_120+elem.max_15_240+elem.max_240_12)/3).toFixed(2)}
            target_long:   ${((elem.min_day_10+elem.min_day_30+elem.min_day_60)/3).toFixed(2)} ~ ${((elem.max_day_10+elem.max_day_30+elem.max_day_60)/3).toFixed(2)}
        `)
    }

    let params = {
        "to"      : "yinlianhua@sina.cn",
        "subject" : "最新期货信息",
        "html"    : html
    }

    let send_res = await mail(params);

    console.log(send_res)
    */
})()
