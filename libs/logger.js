/**
 * Date : 2024-09-20
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const chalk  = require("chalk");
const _      = require("underscore");
const moment = require("moment");
const t      = require("./types");

// 日志对象
class Logger {
    constructor() {
        this.__pad_type = 6;
        this.__pad_role = 8;

        // 颜色配置
        this.__color  = {
            "magenta" : 1,
            "white"   : 1,
            "gray"    : 1,
            "red"     : 1,
            "yellow"  : 1,
            "green"   : 1,
            "cyan"    : 1,
            "blue"    : 1,
        }
    }

    // 打印日志
    __print(info="", role="system", type="info", color="white") {
        let time = moment().format("YYYY-MM-DD HH:mm:ss");

        if (this.__color[color] == undefined) {
            color = "white";
        }

        info = t.is_object(info) ? JSON.stringify(info) : String(info);

        let dye = chalk[color];

        console.log(dye(`[${time}] ${role.padStart(this.__pad_role)} ${type.padStart(this.__pad_type)}: ${info}`));
    }

    warn(info="", role="system") {
        this.__print(info, role, "warn", "red");
    }

    info(info="", role="system") {
        this.__print(info, role, "info", "green");
    }
}

module.exports = Logger;