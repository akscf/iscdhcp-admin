/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.dhcpmgr.services.LeasesManagementService",
    {
        extend:qx.core.Object,
        statics:{

            add:function (entity, callback) {
                qx.core.Init.getApplication().rpcManager().registerCall({
                    callback        : callback,
                    service         : 'LeasesManagementService',
                    method          : 'add',
                    args            : [org.cforge.wsp.toolkit.EntityConverter.toNative(entity)],
                    message         : qx.core.Init.getApplication().tr('Adding...'),
                    catchException  : true
                });
            },

            //===========================================================================================================================================================
            update:function (entity, callback) {
                qx.core.Init.getApplication().rpcManager().registerCall({
                    callback        : callback,
                    service         : 'LeasesManagementService',
                    method          : 'update',
                    args            : [org.cforge.wsp.toolkit.EntityConverter.toNative(entity)],
                    message         : qx.core.Init.getApplication().tr('Saving changes...'),
                    catchException  : true
                });
            },

            //===========================================================================================================================================================
            remove:function (entityId, callback) {
                qx.core.Init.getApplication().rpcManager().registerCall({
                    callback        : callback,
                    service         : 'LeasesManagementService',
                    method          : 'delete',
                    args            : [entityId],
                    message         : qx.core.Init.getApplication().tr('Deleting...'),
                    catchException  : true
                });
            },

            //===========================================================================================================================================================
            fetch:function (mac, callback) {
                qx.core.Init.getApplication().rpcManager().registerCall({
                    callback        : callback,
                    service         : 'LeasesManagementService',
                    method          : 'get',
                    args            : [mac],
                    message         : qx.core.Init.getApplication().tr('Loading...'),
                    catchException  : true
                });
            },

            //===========================================================================================================================================================
            search:function (filter, filterSettings, callback) {
                qx.core.Init.getApplication().rpcManager().registerCall({
                    callback        : callback,
                    service         : 'LeasesManagementService',
                    method          : 'search',
                    args            : [filter, org.cforge.wsp.toolkit.EntityConverter.toNative(filterSettings)],
                    message         : qx.core.Init.getApplication().tr('Searching...'),
                    catchException  : true
                });
            }
        }
    }
);

