/**
 * for Perl version
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.wsp.models.FilterSettings", {
    extend: qx.core.Object,

    construct: function () {
        this.setClass('DHCPMGR.FilterSettings');
        this.set({
            offset          : 0,
            count           : 0,
            orderType       : null,
            orderFields     : null
        }, null);
    },
    properties: {
        'class'             : {},
        offset              : {},
        count               : {},
        orderType           : {},
        orderFields         : {}

    }
});


