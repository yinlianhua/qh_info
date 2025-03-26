/**
 * Date : 2025-03-25
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let config = require("../../config/basic.json");
let http   = require("../../libs/http");
let db     = require('../../libs/sqlite3');

// 同步期货净值
const sync_qh_data = async (new_list=[]) => {
    await db.connect(config.db_path);

    // {
    //     "db_path"      : "/Users/yinlianhua/WorkSpace/GitProjects/prj_free/qh_service/db/qh.db3",
    //     "qh_url_daily" : "https://stock2.finance.sina.com.cn/futures/api/jsonp.php//InnerFuturesNewService.getDailyKLine?symbol=CODE",
    //     "qh_url_min"   : "https://stock2.finance.sina.com.cn/futures/api/jsonp.php//InnerFuturesNewService.getFewMinLine?symbol=CODE&type=TIME"
    // }

    let res = {
        "err" : false,
        "res" : "success",
    }

    // 获取待同步列表
    let to_sync_list = await db.get(`SELECT * FROM t_qh_list WHERE type != "历史";`);

    if (to_sync_list.err) {
        await db.close();

        res.err = true;
        res.res = to_sync_list.res;

        return res;
    }

    console.log(to_sync_list.res);

    let times = [ 1, 5, 15, 60, 240, "day" ];

    sync_data: for (let time of times) {
        for (let data of to_sync_list.res) {
            let table = time == "day" ? "t_qh_data_day" : `t_qh_data_${time}_min`;
            let url   = time == "day" ? config.qh_url_daily : config.qh_url_min;

            url = url.replace("CODE", data.code);
            url = url.replace("TIME", time);

            let data_str = await http.get(url, {}, false);

            if (data_str.err) {
                res.err = true;
                res.res = data_str.res;
                break sync_data;
            }

            let values = JSON.parse(data_str.res.split("(")[1].split(")")[0]);

            for (let elem of values) {
                let sql = `INSERT INTO ${table} (code, name, date, v_o, v_c, v_h, v_l) VALUES (?,?,?,?,?,?,?)`;
                let val = [ data.code, data.name, elem.d, elem.o, elem.c, elem.h, elem.l ];
                await db.set(sql, val);
            }

        } 
    }

    await db.close();

    return res;
};

module.exports = sync_qh_data;
