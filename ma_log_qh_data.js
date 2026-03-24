/**
 * Date : 2025-03-25
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require("underscore");
let moment = require("moment");

async function fn_log_ma_info(codes) {
    let fn_get_qh_ma_info = require("./logic/sync/fn_get_qh_ma_info");

    let logs1   = [];
    let logs2_1 = [];
    let logs2_2 = [];
    let logs3_1 = [];
    let logs3_2 = [];

    // ▲ 🔺 ▼ 🔻  🍀 🍒
    for (let code of codes) {
        let data = await fn_get_qh_ma_info(code);

        data.m_01_120 = data.latest >= data.avg_01_120 ? "🍒" : "🍀"; // 短线
        data.m_01_240 = data.latest >= data.avg_01_240 ? "🍒" : "🍀"; // 短线
        data.m_05_120 = data.latest >= data.avg_05_120 ? "🍒" : "🍀"; // 短线
        data.m_05_240 = data.latest >= data.avg_05_240 ? "🍒" : "🍀"; // 短线
        data.m_15_60  = data.latest >= data.avg_15_60  ? "🍒" : "🍀"; // 短线

        data.m_15_120 = data.latest >= data.avg_15_120 ? "🍒" : "🍀"; // 中线
        data.m_15_240 = data.latest >= data.avg_15_240 ? "🍒" : "🍀"; // 中线
        data.m_60_30  = data.latest >= data.avg_60_30  ? "🍒" : "🍀"; // 中线
        data.m_60_60  = data.latest >= data.avg_60_60  ? "🍒" : "🍀"; // 中线
        data.m_240_15 = data.latest >= data.avg_240_15 ? "🍒" : "🍀"; // 中线

        data.m_240_30 = data.latest >= data.avg_240_30 ? "🍒" : "🍀"; // 长线
        data.m_day_10 = data.latest >= data.avg_day_10 ? "🍒" : "🍀"; // 长线
        data.m_day_20 = data.latest >= data.avg_day_20 ? "🍒" : "🍀"; // 长线
        data.signal   = 0;
        data.m_mark   = "";

        let info = `| ${String(data.code).padStart(6)} | ${String(data.name).padStart(8)} | ${String(data.latest).padStart(8)} |`;

        // 短线
        info += `   ${data.m_01_240}    `;
        info += `   ${data.m_05_120}    `;
        info += `   ${data.m_15_60}     |`;
        // info += `   ${data.m_60_30}   |`;

        // 中线
        info += `   ${data.m_15_240}    `;
        info += `   ${data.m_60_60}    `;
        info += `   ${data.m_240_15}   |`;

        // 长线
        info += `   ${data.m_240_30}    `;
        info += `   ${data.m_day_20}   |`;

        if (`${data.m_01_240}${data.m_05_120}${data.m_15_60}` == "🍀🍒🍒") {
            let mark = "";
            if (data.m_15_240 == "🍀") { mark += "🔻"; }
            if (data.m_60_60  == "🍀") { mark += "🔻"; }
            if (data.m_240_15 == "🍀") { mark += "🔻"; }
            if (mark == "") { mark = "      "; }
            if (mark == "🔻") { mark = " 🔻    "; }
            if (mark == "🔻🔻") { mark = " 🔻🔻  "; }
            data.m_mark = `  🔻  多 -> 空 ${mark} |`;
            data.signal = 1;
        }

        if (`${data.m_01_240}${data.m_05_120}${data.m_15_60}` == "🍀🍀🍒") {
            let mark = "";
            if (data.m_15_240 == "🍀") { mark += "🔻"; }
            if (data.m_60_60  == "🍀") { mark += "🔻"; }
            if (data.m_240_15 == "🍀") { mark += "🔻"; }
            if (mark == "") { mark = "      "; }
            if (mark == "🔻") { mark = " 🔻    "; }
            if (mark == "🔻🔻") { mark = " 🔻🔻  "; }
            data.m_mark = ` 🔻🔻 多 -> 空 ${mark} |`;
            data.signal = 2;
        }

        if (`${data.m_01_240}${data.m_05_120}${data.m_15_60}` == "🍒🍀🍀") {
            let mark = "";
            if (data.m_15_240 == "🍒") { mark += "🔺"; }
            if (data.m_60_60  == "🍒") { mark += "🔺"; }
            if (data.m_240_15 == "🍒") { mark += "🔺"; }
            if (mark == "") { mark = "      "; }
            if (mark == "🔺") { mark = " 🔺    "; }
            if (mark == "🔺🔺") { mark = " 🔺🔺 "; }
            data.m_mark = `  🔺  空 -> 多 ${mark} |`;
            data.signal = 3;
        }

        if (`${data.m_01_240}${data.m_05_120}${data.m_15_60}` == "🍒🍒🍀") {
            console.log(data)
            let mark = "";
            if (data.m_15_240 == "🍒") { mark += "🔺"; }
            if (data.m_60_60  == "🍒") { mark += "🔺"; }
            if (data.m_240_15 == "🍒") { mark += "🔺"; }
            if (mark == "") { mark = "      "; }
            if (mark == "🔺") { mark = " 🔺    "; }
            if (mark == "🔺🔺") { mark = " 🔺🔺 "; }
            data.m_mark = ` 🔺🔺 空 -> 多 ${mark} |`;
            data.signal = 4;
        }

        // if (data.signal == 0) { data.m_mark += "   "; }

        info += data.m_mark;

        if (data.signal == 1) {
            logs2_1.push(info);
            continue;
        }

        if (data.signal == 2) {
            logs2_2.push(info);
            continue;
        }

        if (data.signal == 3) {
            logs3_1.push(info);
            continue;
        }

        if (data.signal == 4) {
            logs3_2.push(info);
            continue;
        }

        logs1.push(info)
    }

    /*
    console.log(`+--------+------------+----------+--------+--------+--------+--------+--------+--------+`);
    console.log(`|  Code  |    Name    |  Latest  | 01_240 | 05_120 |  15_60 |  60_30 | 240_15 | day_10 |`);
    console.log(`+--------+------------+----------+--------+--------+--------+--------+--------+--------+`);
    for (let log of logs1) {
        console.log(log);
    }
    console.log(`+--------+------------+----------+--------+--------+--------+--------+--------+--------+`);
    */

    console.log(`+---------------------------------------------------------------------------------------------------------------------------------+`);
    console.log(`|                                                  ${moment().format("YYYY-MM-DD HH:mm:ss")}                                                            |`);
    console.log(`+--------+------------+----------+----------------------------+--------------------------+-----------------+----------------------+`);
    console.log(`|  Code  |    Name    |  Latest  | 01_240   05_120    15_60   | 15_240    60_60   240_15 | 240_30  day_20  | 短期    方向    中期 |`);
    console.log(`+--------+------------+----------+----------------------------+--------------------------+-----------------+----------------------+`);
    for (let log of [].concat(logs2_1, logs2_2, logs3_1, logs3_2)) {
        console.log(log);
    }
    console.log(`+--------+------------+----------+----------------------------+--------------------------+-----------------+----------------------+`);
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

