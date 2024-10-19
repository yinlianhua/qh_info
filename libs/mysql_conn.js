/**
 * Date : 2017-03-24
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

let Mysql = require("./mysql_core");

//初始化数据库连接
global.mysql_pools = {};

exports.connect = function(db) {
    // 初始化数据库连接,优化为按需加载
    if (global.mysql_pools[db] == undefined) {
        let conf = global.mysql[db];

        conf.connectionLimit = conf.connectionLimit || 10;

        global.mysql_pools[db] = new Mysql(conf);
    }

    return global.mysql_pools[db];
};
