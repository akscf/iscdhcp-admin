/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("dhcpadm.sdk.models.ServerStatus", {
    extend: qx.core.Object,
    construct: function () {
        this.setClass('DHCPADM.Models.ServerStatus');
        this.set({
            pid         : null,
            state       : null,
            version     : null
        }, null);
    },
    //--------------------------------------------------------------------------------------
    properties: {
        'class'         : {},
        pid             : {},
        state           : {},
        version         : {}
    }
});

