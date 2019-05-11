/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.dhcpmgr.models.ServerStatus", {
    extend: qx.core.Object,
    construct: function () {
        this.setClass('DHCPMGR.Models.ServerStatus');
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

