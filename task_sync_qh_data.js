/**
 * Date : 2025-03-25
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';
let sleep  = require('./libs/sleep');

(async function() {
    let sync_qh_data = require("./logic/sync/sync_qh_data");
    await sync_qh_data();
})()
