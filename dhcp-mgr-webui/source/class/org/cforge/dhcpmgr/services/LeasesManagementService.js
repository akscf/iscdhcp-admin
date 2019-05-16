/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.dhcpmgr.services.LeasesManagementService",
    {
        extend:qx.core.Object,
        statics:{

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

