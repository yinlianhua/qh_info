/**
 * Date : 2024-10-15
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const moment = require("moment");
const sleep = require("./sleep");

async function check_time(std_time) {
    // await sleep(1000);
    // return true;

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

    let res  = false;
    let wait = 60000;
    let day  = moment().day();
    let now  = std_time;
    let st1  = moment().startOf("day").add(9, "hours").unix();
    let et1  = st1 +  75 * 60;
    let st2  = et1 +  15 * 60;
    let et2  = st2 +  60 * 60;
    let st3  = et2 + 120 * 60;
    let et3  = st3 + 390 * 60;
    let st4  = et3 + 360 * 60;
    let et4  = st4 + 120 * 60;

    if (day >= 1 && day <= 5) {
        // 时间段1
        if (now >= st1 && now <= et1) { res = true; wait = 5000; }
        // 时间段2
        if (now >= st2 && now <= et2) { res = true; wait = 5000; }
        // 时间段3
        if (now >= st3 && now <= et3) { res = true; wait = 5000; }
        // 时间段4
        if (now >= st4 && now <= et4) { res = true; wait = 5000; }
    }

    if (res == false) {
        logger.info(`不在交易时间内 ${moment().format("YYYY-MM-DD HH:mm:ss")}`);
    }

    await sleep(wait);

    return res;
};

module.exports = check_time;
