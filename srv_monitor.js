/**
 * Date : 2026-03-28
 * Desc : 期货实时行情可视化监控页面
 * Port : 3456
 **/

'use strict';

const http     = require("http");
const fs       = require("fs");
const path     = require("path");
const moment   = require("moment");
const url      = require("url");
const data_get   = require("./logic/data/data_get");
const data_parse = require("./logic/data/data_parse");

const config   = require("./config/qh.json");
const qh_plan  = require("./config/qh_plan.json");
const qh_price = require("./config/qh_price.json");

const PORT = 3456;

// 内部缓存
let cache_qh_data   = [];
let cache_timestamp = 0;
let klineLock = false; // SQLite 单例锁
let cache_ma_data = {};  // MA数据缓存 { code: maInfo }
let cache_ma_time  = 0;
const MA_REFRESH_INTERVAL = 60 * 1000; // MA 数据每分钟刷新

// MIME types
const MIME = {
    ".html" : "text/html; charset=utf-8",
    ".css"  : "text/css; charset=utf-8",
    ".js"   : "application/javascript; charset=utf-8",
    ".json" : "application/json; charset=utf-8",
    ".png"  : "image/png",
    ".ico"  : "image/x-icon",
    ".svg"  : "image/svg+xml",
};

// 带超时的 Promise
function withTimeout(promise, ms, fallback) {
    return Promise.race([
        promise,
        new Promise(resolve => setTimeout(() => resolve(fallback), ms))
    ]);
}

// 获取实时数据（带缓存兜底和超时）
async function fetchQHData() {
    try {
        let raw = await withTimeout(
            data_get(config.qh_info, config.monit_map),
            8000, // 8秒超时
            null
        );
        if (!raw) throw new Error("数据获取超时");
        let data = await data_parse(moment().startOf("minute").unix(), raw);
        if (data && data.length > 0) {
            cache_qh_data = data;
            cache_timestamp = Date.now();
        }
        return data || cache_qh_data;
    } catch (e) {
        console.log("[monitor] 数据获取失败，使用缓存:", e.message);
        return cache_qh_data;
    }
}

// 计算持仓盈亏
function calcPosition(qh_data) {
    let res = [];
    let totalPnL = 0;

    for (let info of qh_data) {
        let posInfo = qh_price[info["子名称"]];
        if (!posInfo) continue;

        let realName = info["子名称"].split("_")[0];
        let unitPrice = config.price_info[realName];
        if (!unitPrice) continue;

        let pnl = 0;
        if (posInfo.type === "多") {
            pnl = (info["最新价"] - posInfo.cost) * posInfo.count * unitPrice;
        } else if (posInfo.type === "空") {
            pnl = (posInfo.cost - info["最新价"]) * posInfo.count * unitPrice;
        }

        totalPnL += pnl;

        res.push({
            name: info["子名称"],
            type: posInfo.type,
            count: posInfo.count,
            cost: posInfo.cost,
            lastPrice: info["最新价"],
            pnl: pnl,
            unitPrice: unitPrice,
        });
    }

    return { positions: res, totalPnL: totalPnL };
}

// 构建计划区间数据（含已触发的标记）
function buildPlanData() {
    let result = {};
    for (let [name, limits] of Object.entries(qh_plan)) {
        result[name] = { ...limits, original: { ...limits } };
    }
    return result;
}

// 获取单个合约的均线方向数据（从 SQLite）
async function fetchMAData(code) {
    // 反查合约代码
    let dbCode = config.monit_map[code] || code;

    const sqlite3Module = require('sqlite3').verbose();
    let dbPath = path.join(__dirname, "db", "qh.db3");

    const rows = await new Promise((resolve, reject) => {
        const db = new sqlite3Module.Database(dbPath, sqlite3Module.OPEN_READONLY, (err) => {
            if (err) return reject(err);
        });

        let sqls = {
            latest    : `SELECT v_c FROM t_qh_data_1_min WHERE code = ? ORDER BY date DESC LIMIT 1`,
            avg_01_240: `SELECT AVG(v_c) as avg FROM (SELECT v_c FROM t_qh_data_1_min WHERE code = ? ORDER BY date DESC LIMIT 240)`,
            avg_05_120: `SELECT AVG(v_c) as avg FROM (SELECT v_c FROM t_qh_data_5_min WHERE code = ? ORDER BY date DESC LIMIT 120)`,
            avg_05_240: `SELECT AVG(v_c) as avg FROM (SELECT v_c FROM t_qh_data_5_min WHERE code = ? ORDER BY date DESC LIMIT 240)`,
            avg_15_60 : `SELECT AVG(v_c) as avg FROM (SELECT v_c FROM t_qh_data_15_min WHERE code = ? ORDER BY date DESC LIMIT 60)`,
            avg_15_240: `SELECT AVG(v_c) as avg FROM (SELECT v_c FROM t_qh_data_15_min WHERE code = ? ORDER BY date DESC LIMIT 240)`,
            avg_60_60 : `SELECT AVG(v_c) as avg FROM (SELECT v_c FROM t_qh_data_60_min WHERE code = ? ORDER BY date DESC LIMIT 60)`,
            avg_240_15: `SELECT AVG(v_c) as avg FROM (SELECT v_c FROM t_qh_data_240_min WHERE code = ? ORDER BY date DESC LIMIT 15)`,
            avg_240_30: `SELECT AVG(v_c) as avg FROM (SELECT v_c FROM t_qh_data_240_min WHERE code = ? ORDER BY date DESC LIMIT 30)`,
            avg_day_20: `SELECT AVG(v_c) as avg FROM (SELECT v_c FROM t_qh_data_day WHERE code = ? ORDER BY date DESC LIMIT 20)`,
        };

        let keys = Object.keys(sqls);
        let results = {};
        let pending = keys.length;

        for (let key of keys) {
            db.get(sqls[key], [dbCode], (err, row) => {
                results[key] = row ? (row.avg || row.v_c) : null;
                pending--;
                if (pending === 0) {
                    db.close();
                    resolve(results);
                }
            });
        }
    });

    let latest = rows.latest || 0;

    // 计算方向：🍒(多) / 🍀(空)
    let dir = (val) => val ? (latest >= val ? "🍒" : "🍀") : "—";

    // 短线方向
    let short_term = `${dir(rows.avg_01_240)}${dir(rows.avg_05_120)}${dir(rows.avg_15_60)}`;
    // 中线方向
    let mid_term = `${dir(rows.avg_15_240)}${dir(rows.avg_60_60)}${dir(rows.avg_240_15)}`;
    // 长线方向
    let long_term = `${dir(rows.avg_240_30)}${dir(rows.avg_day_20)}`;

    // 信号判断
    let signal = 0;
    let signalText = "";
    if (short_term === "🍀🍒🍒") {
        let m = 0;
        if (rows.avg_15_240 && latest < rows.avg_15_240) m++;
        if (rows.avg_60_60 && latest < rows.avg_60_60) m++;
        if (rows.avg_240_15 && latest < rows.avg_240_15) m++;
        signal = 1; signalText = `🔻多→空${'🔻'.repeat(m)}`;
    } else if (short_term === "🍀🍀🍒") {
        let m = 0;
        if (rows.avg_15_240 && latest < rows.avg_15_240) m++;
        if (rows.avg_60_60 && latest < rows.avg_60_60) m++;
        if (rows.avg_240_15 && latest < rows.avg_240_15) m++;
        signal = 2; signalText = `🔻🔻多→空${'🔻'.repeat(m)}`;
    } else if (short_term === "🍒🍀🍀") {
        let m = 0;
        if (rows.avg_15_240 && latest >= rows.avg_15_240) m++;
        if (rows.avg_60_60 && latest >= rows.avg_60_60) m++;
        if (rows.avg_240_15 && latest >= rows.avg_240_15) m++;
        signal = 3; signalText = `🔺空→多${'🔺'.repeat(m)}`;
    } else if (short_term === "🍒🍒🍀") {
        let m = 0;
        if (rows.avg_15_240 && latest >= rows.avg_15_240) m++;
        if (rows.avg_60_60 && latest >= rows.avg_60_60) m++;
        if (rows.avg_240_15 && latest >= rows.avg_240_15) m++;
        signal = 4; signalText = `🔺🔺空→多${'🔺'.repeat(m)}`;
    }

    return {
        code,
        latest,
        short_term,
        mid_term,
        long_term,
        signal,
        signalText,
        // 原始均值数据
        avg: {
            "1分240": rows.avg_01_240,
            "5分120": rows.avg_05_120,
            "5分240": rows.avg_05_240,
            "15分60": rows.avg_15_60,
            "15分240": rows.avg_15_240,
            "60分60": rows.avg_60_60,
            "240分15": rows.avg_240_15,
            "240分30": rows.avg_240_30,
            "日线20": rows.avg_day_20,
        }
    };
}

// 批量刷新所有合约的 MA 数据（后台任务）
async function refreshAllMA() {
    if (!cache_qh_data || cache_qh_data.length === 0) return;

    let codes = cache_qh_data.map(item => item["子名称"]);
    let startTime = Date.now();

    for (let code of codes) {
        try {
            cache_ma_data[code] = await withTimeout(fetchMAData(code), 3000, null);
        } catch (e) {
            // 静默失败，保留旧缓存
        }
    }

    cache_ma_time = Date.now();
    console.log(`[monitor] MA数据已刷新 ${codes.length}个合约，耗时${(Date.now()-startTime)/1000}s`);
}

// 处理 API 请求
async function handleAPI(req, res) {
    let pathname = url.parse(req.url).pathname;

    // 获取实时行情
    if (pathname === "/api/quote") {
        try {
            let data = await fetchQHData();
            cache_qh_data = data;
            cache_timestamp = Date.now();

            let groups = {
                "强多": [], "偏多": [], "震荡": [],
                "偏空": [], "强空": []
            };

            for (let item of data) {
                let state = item["多空态"];
                if (state === "震荡偏多" || state === "震荡偏空") state = "震荡";
                if (!groups[state]) groups[state] = [];
                groups[state].push(item);
            }

            let posResult = calcPosition(data);
            let planData = buildPlanData();

            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({
                time: moment().format("YYYY-MM-DD HH:mm:ss"),
                groups: groups,
                position: posResult,
                plan: planData,
                ma: cache_ma_data,
                maCachedAt: cache_ma_time ? new Date(cache_ma_time).toLocaleString("zh-CN") : null,
                raw: data,
            }));
        } catch (e) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: e.message }));
        }
        return;
    }

    // 获取均线数据（单个或全部）
    if (pathname === "/api/ma") {
        const params = new URLSearchParams(req.url.split("?")[1] || "");
        let code = params.get("code");

        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });

        if (code) {
            // 单个合约：如果没有缓存就实时取
            if (!cache_ma_data[code]) {
                try {
                    cache_ma_data[code] = await withTimeout(fetchMAData(code), 5000, null);
                } catch (e) {}
            }
            res.end(JSON.stringify({
                code,
                ma: cache_ma_data[code] || null,
                cachedAt: cache_ma_time ? new Date(cache_ma_time).toLocaleString("zh-CN") : "未缓存",
            }));
        } else {
            // 返回全部缓存
            res.end(JSON.stringify({
                time: moment().format("YYYY-MM-DD HH:mm:ss"),
                count: Object.keys(cache_ma_data).length,
                data: cache_ma_data,
                cachedAt: cache_ma_time ? new Date(cache_ma_time).toLocaleString("zh-CN") : "未缓存",
            }));
        }
        return;
    }

    // 获取历史K线数据
    if (pathname === "/api/kline") {
        if (klineLock) {
            res.writeHead(503, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "K线查询繁忙，请稍后重试" }));
            return;
        }
        klineLock = true;
        const params = new URLSearchParams(req.url.split("?")[1] || "");
        let code = params.get("code");
        let period = params.get("period") || "5_min";
        let limit = parseInt(params.get("limit")) || 100;

        if (!code) {
            klineLock = false;
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "缺少 code 参数" }));
            return;
        }

        // 反查合约代码 (monit_map: 螺纹_2605 -> RB2605)
        let dbCode = code;
        if (config.monit_map[code]) {
            dbCode = config.monit_map[code];
        }

        try {
            const sqlite3Module = require('sqlite3').verbose();
            let dbPath = path.join(__dirname, "db", "qh.db3");

            const rows = await new Promise((resolve, reject) => {
                const db = new sqlite3Module.Database(dbPath, sqlite3Module.OPEN_READONLY, (err) => {
                    if (err) return reject(err);
                });

                let table = `t_qh_data_${period}`;
                db.all(
                    `SELECT date, v_o as open, v_h as high, v_l as low, v_c as close FROM ${table} WHERE code = ? ORDER BY date DESC LIMIT ?`,
                    [dbCode, limit],
                    (err, rows) => {
                        db.close();
                        if (err) reject(err);
                        else resolve(rows || []);
                    }
                );
            });

            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ code, period, data: rows.reverse() }));
        } catch (e) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: e.message }));
        } finally {
            klineLock = false;
        }
        return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
}

// 静态文件服务
function handleStatic(req, res) {
    let pathname = url.parse(req.url).pathname;
    if (pathname === "/") pathname = "/index.html";

    let filePath = path.join(__dirname, "public", pathname);
    let ext = path.extname(filePath);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("Not Found");
            return;
        }
        res.writeHead(200, { "Content-Type": MIME[ext] || "text/plain" });
        res.end(data);
    });
}

// 主服务
const server = http.createServer(async (req, res) => {
    if (req.url.startsWith("/api/")) {
        await handleAPI(req, res);
    } else {
        handleStatic(req, res);
    }
});

server.listen(PORT, () => {
    console.log(`\n🎯 期货监控面板已启动: http://localhost:${PORT}`);
    console.log(`   行情刷新周期: 自动`);
    console.log(`   均线刷新周期: ${MA_REFRESH_INTERVAL/1000}s\n`);

    // 首次加载行情后启动 MA 刷新
    setTimeout(async () => {
        await fetchQHData();
        refreshAllMA();
    }, 3000);

    // 定时刷新 MA
    setInterval(refreshAllMA, MA_REFRESH_INTERVAL);
});
