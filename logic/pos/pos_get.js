/**
 * Date : 2024-10-19
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const _      = require("underscore");
const moment = require("moment");
const mysql  = require("../../libs/mysql_conn");

const pos_get = async function(std_time) {
    global.data_pos = {}

    let pos = await mysql.connect("plan").query(`SELECT name, type, count, cost FROM t_price_pos WHERE state = 1;`);

    if (!pos.err || pos.res.retObject.results.length) {
        for (let elem of pos.res.retObject.results) {
            global.data_pos[elem.name] = {
                "type"  : elem.type,
                "count" : elem.count,
                "cost"  : elem.cost,
            }
        }
    }

    console.log(global.data_pos);
}

module.exports = pos_get;