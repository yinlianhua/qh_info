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
                raw: data,
            }));
        } catch (e) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: e.message }));
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
    console.log(`   行情刷新周期: 自动\n`);
});
