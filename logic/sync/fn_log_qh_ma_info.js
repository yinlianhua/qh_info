/**
 * Date : 2026-03-24
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require("underscore");
let moment = require("moment");

const fn_log_qh_ma_info = async (codes=[], last_info) => {
    let fn_get_qh_ma_info = require("./fn_get_qh_ma_info");

    let logs0     = []; // 异动信息
    let logs1     = []; // 普通信息
    let logs2_1   = []; // 多转空 1
    let logs2_2   = []; // 多转空 1
    let logs3_1   = []; // 空转多 1
    let logs3_2   = []; // 空转多 2

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
        data.m_signal = 0;
        data.m_mark   = "";
        data.m_last   = last_info[data.code] || "";
        data.m_this = `${data.m_01_240}${data.m_05_120}${data.m_15_60}${data.m_15_240}${data.m_60_60}${data.m_240_15}`;

        let info = `| ${String(data.code).padStart(6)} | ${String(data.name).padStart(8)} | ${String(data.latest).padStart(8)} |`;

        // 短线
        info += `   ${data.m_01_240}    `;
        info += `   ${data.m_05_120}    `;
        info += `   ${data.m_15_60}     |`;

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
            if (mark == "🔻") { mark = "  🔻  "; }
            if (mark == "🔻🔻") { mark = " 🔻🔻 "; }
            data.m_mark = `  🔻  多 -> 空 ${mark} |`;
            data.m_signal = 1;
        }

        if (`${data.m_01_240}${data.m_05_120}${data.m_15_60}` == "🍀🍀🍒") {
            let mark = "";
            if (data.m_15_240 == "🍀") { mark += "🔻"; }
            if (data.m_60_60  == "🍀") { mark += "🔻"; }
            if (data.m_240_15 == "🍀") { mark += "🔻"; }
            if (mark == "") { mark = "      "; }
            if (mark == "🔻") { mark = "  🔻  "; }
            if (mark == "🔻🔻") { mark = " 🔻🔻 "; }
            data.m_mark = ` 🔻🔻 多 -> 空 ${mark} |`;
            data.m_signal = 2;
        }

        if (`${data.m_01_240}${data.m_05_120}${data.m_15_60}` == "🍒🍀🍀") {
            let mark = "";
            if (data.m_15_240 == "🍒") { mark += "🔺"; }
            if (data.m_60_60  == "🍒") { mark += "🔺"; }
            if (data.m_240_15 == "🍒") { mark += "🔺"; }
            if (mark == "") { mark = "      "; }
            if (mark == "🔺") { mark = "  🔺  "; }
            if (mark == "🔺🔺") { mark = " 🔺🔺 "; }
            data.m_mark = `  🔺  空 -> 多 ${mark} |`;
            data.m_signal = 3;
        }

        if (`${data.m_01_240}${data.m_05_120}${data.m_15_60}` == "🍒🍒🍀") {
            let mark = "";
            if (data.m_15_240 == "🍒") { mark += "🔺"; }
            if (data.m_60_60  == "🍒") { mark += "🔺"; }
            if (data.m_240_15 == "🍒") { mark += "🔺"; }
            if (mark == "") { mark = "      "; }
            if (mark == "🔺") { mark = "  🔺  "; }
            if (mark == "🔺🔺") { mark = " 🔺🔺 "; }
            data.m_mark = ` 🔺🔺 空 -> 多 ${mark} |`;
            data.m_signal = 4;
        }

        // if (data.m_signal == 0) { data.m_mark += "   "; }

        info += data.m_mark;

        // 判断异动情况
        if (data.m_this != data.m_last) {
            last_info[data.code] = data.m_this;
            logs0.push(info);
        }

        if (data.m_signal == 1) {
            logs2_1.push(info);
            continue;
        }

        if (data.m_signal == 2) {
            logs2_2.push(info);
            continue;
        }

        if (data.m_signal == 3) {
            logs3_1.push(info);
            continue;
        }

        if (data.m_signal == 4) {
            logs3_2.push(info);
            continue;
        }

        logs1.push(info)
    }

    return {
        "last_info"        : last_info,
        "logs_change"      : logs0,
        "logs_common"      : logs1,
        "logs_up_to_down1" : logs2_1,
        "logs_up_to_down2" : logs2_2,
        "logs_down_up_to1" : logs3_1,
        "logs_down_up_to2" : logs3_2,
    }
}

module.exports = fn_log_qh_ma_info;

