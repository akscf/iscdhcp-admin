/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.dhcpmgr.services.SystemInformationService",
    {
        extend:qx.core.Object,
        statics:{

            systemStatus:function (callback) {
                qx.core.Init.getApplication().rpcManager().registerCall({
                    callback        : callback,
                    service         : 'SystemInformationService',
                    method          : 'getStatus',
                    args            : null,
                    message         : qx.core.Init.getApplication().tr('Loading...'),
                    catchException  : true
                });
            }
        }
    }
);

