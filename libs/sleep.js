/**
 * Date : 2020-07-03
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const sleep = async (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};

module.exports = sleep;
