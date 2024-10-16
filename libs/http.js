/**
 * Date : 2024-09-29
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const axios = require("axios");

const get = async (url, params, timeout=60000, header=false) => {
    let optional = {
        "maxContentLength" : 838860800,
        "method"           : "get",
        "timeout"          : timeout,
        "params"           : params
    }

    if (header != false) {
        optional.headers = header;
    }

    return await axios(url, optional)
    .then((response) => {
        return {
            "err" : response.status == 200 ? false : true,
            "res" : response.data
        };
    }).catch(error => {
        return {
            "err" : true,
            "res" : error
        };
    });
};

const post = async (url, params, timeout=60000, header=false) => {
    let optional = {
        "maxContentLength" : 838860800,
        "method"           : "post",
        "timeout"          : timeout,
        "data"             : params
    }

    if (header != false) {
        optional.headers = header;
    }

    return await axios(url, optional)
    .then((response) => {
        return {
            "err" : response.status == 200 ? false : true,
            "res" : response.data
        };
    }).catch(error => {
        return {
            "err" : true,
            "res" : error
        };
    });
};

module.exports = {
    get,
    post
}