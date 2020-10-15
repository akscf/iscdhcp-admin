/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("dhcpadm.sdk.models.LeaseEntry", {
    extend: qx.core.Object,
    construct: function () {
        this.setClass('DHCPADM.Models.LeaseEntry');
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

