/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.dhcpmgr.services.DhcpServerManagementService",
    {
        extend:qx.core.Object,
        statics:{

            serverStart:function (callback) {
                qx.core.Init.getApplication().rpcManager().registerCall({
                    callback        : callback,
                    service         : 'DhcpServerManagementService',
                    method          : 'serverStart',
                    args            : null,
                    message         : qx.core.Init.getApplication().tr('Starting...'),
                    catchException  : true
                });
            },

            serverStop:function (callback) {
                qx.core.Init.getApplication().rpcManager().registerCall({
                    callback        : callback,
                    service         : 'DhcpServerManagementService',
                    method          : 'serverStop',
                    args            : null,
                    message         : qx.core.Init.getApplication().tr('Stopping...'),
                    catchException  : true
                });
            },

            serverReload:function (callback) {
                qx.core.Init.getApplication().rpcManager().registerCall({
                    callback        : callback,
                    service         : 'DhcpServerManagementService',
                    method          : 'serverReload',
                    args            : null,
                    message         : qx.core.Init.getApplication().tr('Reloading...'),
                    catchException  : true
                });
            },

            serverGetStatus:function (callback) {
                qx.core.Init.getApplication().rpcManager().registerCall({
                    callback        : callback,
                    service         : 'DhcpServerManagementService',
                    method          : 'serverGetStatus',
                    args            : null,
                    message         : qx.core.Init.getApplication().tr('Loading...'),
                    catchException  : true
                });
            },

            listenInterfacesGet:function (callback) {
                qx.core.Init.getApplication().rpcManager().registerCall({
                    callback        : callback,
                    service         : 'DhcpServerManagementService',
                    method          : 'listenInterfacesGet',
                    args            : null,
                    message         : qx.core.Init.getApplication().tr('Loading...'),
                    catchException  : true
                });
            },

            listenInterfacesSet:function (iface, callback) {
                qx.core.Init.getApplication().rpcManager().registerCall({
                    callback        : callback,
                    service         : 'DhcpServerManagementService',
                    method          : 'listenInterfacesSet',
                    args            : [iface],
                    message         : qx.core.Init.getApplication().tr('Saving...'),
                    catchException  : true
                });
            },

            configRead:function (callback) {
                qx.core.Init.getApplication().rpcManager().registerCall({
                    callback        : callback,
                    service         : 'DhcpServerManagementService',
                    method          : 'configRead',
                    args            : null,
                    message         : qx.core.Init.getApplication().tr('Loading...'),
                    catchException  : true
                });
            },

            configWrite:function (txt, callback) {
                qx.core.Init.getApplication().rpcManager().registerCall({
                    callback        : callback,
                    service         : 'DhcpServerManagementService',
                    method          : 'configWrite',
                    args            : [txt],
                    message         : qx.core.Init.getApplication().tr('Saving...'),
                    catchException  : true
                });
            },

            logRead:function (filter, filterSettings, callback) {
                qx.core.Init.getApplication().rpcManager().registerCall({
                    callback        : callback,
                    service         : 'DhcpServerManagementService',
                    method          : 'logRead',
                    args            : [filter, org.cforge.wsp.toolkit.EntityConverter.toNative(filterSettings)],
                    message         : qx.core.Init.getApplication().tr('Loading...'),
                    catchException  : true
                });
            }
        }
    }
);

