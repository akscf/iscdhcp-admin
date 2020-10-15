/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("dhcpadm.sdk.services.DhcpServerManagementService", {
        type : "static",
        statics:{
            serverStart:function (callback) {
                fw.core.qooxdoo.commons.RpcWrapper.getInstance().doCall({
                    callback        : callback,
                    service         : 'DhcpServerManagementService',
                    method          : 'serverStart',
                    args            : null,
                    message         : qx.locale.Manager.tr('Starting server...'),
                    showMessage     : true,
                    catchException  : true
                });
            },
            serverStop:function (callback) {
                fw.core.qooxdoo.commons.RpcWrapper.getInstance().doCall({
                    callback        : callback,
                    service         : 'DhcpServerManagementService',
                    method          : 'serverStop',
                    args            : null,
                    message         : qx.locale.Manager.tr('Stopping server...'),
                    showMessage     : true,
                    catchException  : true
                });
            },
            serverReload:function (callback) {
                fw.core.qooxdoo.commons.RpcWrapper.getInstance().doCall({
                    callback        : callback,
                    service         : 'DhcpServerManagementService',
                    method          : 'serverReload',
                    args            : null,
                    message         : qx.locale.Manager.tr('Reloading server configuration...'),
                    showMessage     : true,
                    catchException  : true
                });
            },
            serverGetStatus:function (callback) {
                fw.core.qooxdoo.commons.RpcWrapper.getInstance().doCall({
                    callback        : callback,
                    service         : 'DhcpServerManagementService',
                    method          : 'serverGetStatus',
                    args            : null,
                    message         : null,
                    showMessage     : false,
                    catchException  : true
                });
            },
            configRead:function (callback) {
                fw.core.qooxdoo.commons.RpcWrapper.getInstance().doCall({
                    callback        : callback,
                    service         : 'DhcpServerManagementService',
                    method          : 'configRead',
                    args            : null,
                    message         : qx.core.Init.getApplication().tr('Loading configuration...'),
                    showMessage     : true,
                    catchException  : true
                });
            },
            configWrite:function (data, callback) {
                fw.core.qooxdoo.commons.RpcWrapper.getInstance().doCall({
                    callback        : callback,
                    service         : 'DhcpServerManagementService',
                    method          : 'configWrite',
                    args            : [data],
                    message         : qx.core.Init.getApplication().tr('Writing configuration...'),
                    showMessage     : true,
                    catchException  : true
                });
            },
            logRead:function (searchFilter, callback) {
                fw.core.qooxdoo.commons.RpcWrapper.getInstance().doCall({
                    callback        : callback,
                    service         : 'DhcpServerManagementService',
                    method          : 'logRead',
                    args            : [fw.core.qooxdoo.commons.EntityHelper.toNative(searchFilter)],
                    message         : qx.core.Init.getApplication().tr('Loading...'),
                    showMessage     : true,
                    catchException  : true
                });
            }
        }
    }
);
