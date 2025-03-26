/**
 * Date : 2025-03-25
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

(async function() {
    // let sync_qh_data = require("./logic/sync/sync_qh_data");

     // await sync_qh_data();

    let fn_get_qh_main_info = require("./logic/sync/fn_get_qh_main_info");

    await fn_get_qh_main_info();

})()
