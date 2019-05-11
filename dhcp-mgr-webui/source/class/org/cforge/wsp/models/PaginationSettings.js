/**
 * for Java version
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.wsp.models.PaginationSettings", {
    extend: qx.core.Object,
    
    construct: function () {
        this.setClass('org.cforge.wsp.framework.core.models.PaginationSettings');
        this.set({
            offset  : 0,
            count   : 0
        }, null);
    },
    properties: {
        'class'     : {},
        offset      : {},
        count       : {}
    }
});

