/**
 * Date : 2024-10-15
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const moment = require("moment");
const sleep = require("./sleep");

async function trading_hours() {
    // 国内期货交易时间
    // 周一至周五，分为日盘和夜盘，具体交易时间如下：
    //     股指期货 09:30-11:30, 13:00-15:00
    //     国债期货 09:15-11:30, 13:00-15:15
    //     1、日盘交易时间：
    //         09:00 - 10:15
    //         10:30 - 11:30
    //         13:30 - 15:00
    //     2、夜盘交易时间：
    //         无夜盘 股指、国债、线材、锰硅、硅铁、纤板、胶板、尿素、花生、生猪、小麦、稻类、菜籽、鸡蛋、苹果、红枣。
    //         21:00 - 01:00 铜、铝、镍、铅、锌、锡、不锈钢
    //         21:00 - 02:30 黄金、白银、原油
    //         21:00 - 23:00 其他

    let res  = true;
    let time = 5000;
    let day  = moment().day();
    let now  = moment().unix();
    let st   = moment().startOf("day").add(9,  "hours").unix();
    let et   = moment().startOf("day").add(15, "hours").unix();

    if (day < 1 || day > 5) {
        res  = false;
        time = 60000;
    }

    if (now < st || now > et) {
        res  = false;
        time = 60000;
    }

    if (res == false) {
        logger.info(`不在交易时间内`);
    }

    await sleep(time);

    return res;
};

module.exports = trading_hours;
