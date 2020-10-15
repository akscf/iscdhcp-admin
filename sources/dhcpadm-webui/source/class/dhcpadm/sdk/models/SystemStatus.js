/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("dhcpadm.sdk.models.SystemStatus", {
    extend: qx.core.Object,
    construct: function () {
        this.setClass('DHCPADM.Models.SystemStatus');
        this.set({
            productName     : null,
            productVersion  : null,
            instanceName    : null,
            uptime          : null,
            vmInfo          : null,
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
        vmInfo              : {},
        osInfo              : {}
    }
});

