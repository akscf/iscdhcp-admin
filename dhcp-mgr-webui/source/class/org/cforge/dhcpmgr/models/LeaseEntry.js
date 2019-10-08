/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.dhcpmgr.models.LeaseEntry", {
    extend: qx.core.Object,
    construct: function () {
        this.setClass('DHCPMGR.Models.LeaseEntry');
        this.set({
            type        : null,
            name        : null,
            ip          : null,
            mac         : null,
            state       : null,
            startTime   : null,
            endTime     : null
        }, null);
    },
    //--------------------------------------------------------------------------------------
    properties: {
        'class'         : {},
        type            : {},
        name            : {},
        ip              : {},
        mac             : {},
        state           : {},
        startTime       : {},
        endTime         : {}
    }
});

