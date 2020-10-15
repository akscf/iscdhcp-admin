/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.commons.TaskHelper", {
    type : "static",
    statics: {
        spawn: function (ctx, callback, udata) {
            var xtimer = setTimeout(function () {
                try {
                    callback.call(ctx, udata);
                } catch (exc) {
                    console.log("err: " + exc);
                }
            }, 100);
        }
    }
});
