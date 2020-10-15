/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.commons.DialogsManager", {
    type    : "singleton",
    extend  : qx.core.Object,

    construct: function () {
        this.base(arguments);
    },
    members: {
        __dialogs: {},

        openDialog: function(clazz, callback, arg1, arg2, arg3) {
            var dlg = this.__dialogs[clazz];
            if(!dlg) {
                dlg = new clazz();
                dlg.addListener("approved", function (dataEvent) {
                    var data = dataEvent.getData().data;
                    var cb = dataEvent.getData().callback;
                    if (cb) cb(data);
                }, this, false);
                this.__dialogs[clazz] = dlg;
            }
            if(callback) dlg.setUserCallback(callback);
            dlg.open(arg1, arg2, arg3);
        }
    }
});

