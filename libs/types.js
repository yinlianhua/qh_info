/**
 * Date : 2023-03-29
 * By   : yinlianhua@ucloud.cn
 **/

'use strict';

const REAL_TYPE_MAP = {
    "[object String]"        : "string",
    "[object Number]"        : "number",
    "[object Boolean]"       : "boolean",
    "[object Null]"          : "null",
    "[object Undefined]"     : "undefined",
    "[object Symbol]"        : "symbol",
    "[object Object]"        : "object",
    "[object Array]"         : "array",
    "[object Function]"      : "function",
    "[object AsyncFunction]" : "async_function",
    "[object Date]"          : "date",
    "[object RegExp]"        : "regexp",
}

const get_real_type = (obj) => {
    return REAL_TYPE_MAP[Object.prototype.toString.call(obj)] || "other";
};

exports.get_real_type = get_real_type;

exports.is_string     = (obj) => { return get_real_type(obj) == "string";         };
exports.is_number     = (obj) => { return get_real_type(obj) == "number";         };
exports.is_boolean    = (obj) => { return get_real_type(obj) == "boolean";        };
exports.is_null       = (obj) => { return get_real_type(obj) == "null";           };
exports.is_undefined  = (obj) => { return get_real_type(obj) == "undefined";      };
exports.is_symbol     = (obj) => { return get_real_type(obj) == "symbol";         };
exports.is_object     = (obj) => { return get_real_type(obj) == "object";         };
exports.is_array      = (obj) => { return get_real_type(obj) == "array";          };
exports.is_function   = (obj) => { return get_real_type(obj) == "function";       };
exports.is_async      = (obj) => { return get_real_type(obj) == "async_function"; };
exports.is_date       = (obj) => { return get_real_type(obj) == "date";           };
exports.is_regexp     = (obj) => { return get_real_type(obj) == "regexp";         };