/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.commons.PasswordGenerator", {
    type : "static",
    statics: {
            genPassword: function (length) {
                var _a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                var result = '';
                for (var i = 0; i < length; i++) {
                    result += _a.charAt(Math.floor(Math.random() * _a.length));
                }
                return result;
            },
            genPincode: function (length) {
                var _a = "0123456789";
                var result = '';
                for (var i = 0; i < length; i++) {
                    result += _a.charAt(Math.floor(Math.random() * _a.length));
                }
                return result;
            }
    }
});

