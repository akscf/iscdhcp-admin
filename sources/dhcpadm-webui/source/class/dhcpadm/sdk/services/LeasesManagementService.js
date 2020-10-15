/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("dhcpadm.sdk.services.LeasesManagementService", {
        type : "static",
        statics:{
            add:function (entity, callback) {
                fw.core.qooxdoo.commons.RpcWrapper.getInstance().doCall({
                    callback        : callback,
                    service         : 'LeasesManagementService',
                    method          : 'add',
                    args            : [fw.core.qooxdoo.commons.EntityHelper.toNative(entity)],
                    message         : qx.locale.Manager.tr('Adding...'),
                    showMessage     : true,
                    catchException  : true
                });
            },
            update:function (entity, callback) {
                fw.core.qooxdoo.commons.RpcWrapper.getInstance().doCall({
                    callback        : callback,
                    service         : 'LeasesManagementService',
                    method          : 'update',
                    args            : [fw.core.qooxdoo.commons.EntityHelper.toNative(entity)],
                    message         : qx.locale.Manager.tr('Updating...'),
                    showMessage     : true,
                    catchException  : true
                });
            },
            remove:function (entityId, callback) {
                fw.core.qooxdoo.commons.RpcWrapper.getInstance().doCall({
                    callback        : callback,
                    service         : 'LeasesManagementService',
                    method          : 'delete',
                    args            : [entityId],
                    message         : qx.locale.Manager.tr('Deleting...'),
                    showMessage     : true,
                    catchException  : true
                });
            },
            fetch:function (entityId, callback) {
                fw.core.qooxdoo.commons.RpcWrapper.getInstance().doCall({
                    callback        : callback,
                    service         : 'LeasesManagementService',
                    method          : 'get',
                    args            : [entityId],
                    message         : qx.locale.Manager.tr('Fetching...'),
                    showMessage     : true,
                    catchException  : true
                });
            },
            explore:function (searchFilter, callback) {
                fw.core.qooxdoo.commons.RpcWrapper.getInstance().doCall({
                    callback        : callback,
                    service         : 'LeasesManagementService',
                    method          : 'explore',
                    args            : [fw.core.qooxdoo.commons.EntityHelper.toNative(searchFilter)],
                    message         : qx.locale.Manager.tr('Fetching objects...'),
                    showMessage     : true,
                    catchException  : true
                });
            }
        }
    }
);
