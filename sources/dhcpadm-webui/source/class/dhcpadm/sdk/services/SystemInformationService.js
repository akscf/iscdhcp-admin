/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("dhcpadm.sdk.services.SystemInformationService", {
        type : "static",
        statics:{
            getStatus:function (entity, callback) {
                fw.core.qooxdoo.commons.RpcWrapper.getInstance().doCall({
                    callback        : callback,
                    service         : 'SystemInformationService',
                    method          : 'getStatus',
                    args            : null,
                    message         : qx.locale.Manager.tr('Loading...'),
                    showMessage     : true,
                    catchException  : true
                });
            }
        }
    }
);
