/**
 * Date : 2025-03-25
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';
let sleep  = require('./libs/sleep');

(async function() {
    let sync_qh_data = require("./logic/sync/sync_qh_data");

    setInterval(async function() {
        await sync_qh_data();
    }, 120 * 1000);
})()
