/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.dhcpmgr.models.SystemStatus", {
    extend: qx.core.Object,
    construct: function () {
        this.setClass('DHCPMGR.SystemStatus');
        this.set({
            productName     : null,
            productVersion  : null,
            instanceName    : null,
            uptime          : null,
            vmInfo         : null,
            osInfo          : null
        }, null);
    },
    //--------------------------------------------------------------------------------------
    properties: {
        'class'             : {},
        productName         : {},
        productVersion      : {},
        instanceName        : {},
        uptime              : {},
        vmInfo             : {},
        osInfo              : {}
    }
});

