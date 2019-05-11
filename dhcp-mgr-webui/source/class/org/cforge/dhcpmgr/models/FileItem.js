/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.dhcpmgr.models.FileItem", {
    extend: qx.core.Object,
    construct: function () {
        this.setClass('DHCPMGR.Models.FileItem');
        this.set({
            siteId      : null,
            name        : null,
            url         : null,
            path        : null,
            size        : null,
            date        : null,
            directory   : false
        }, null);
    },
    //--------------------------------------------------------------------------------------
    properties: {
        'class'         : {},
        siteId          : {},
        name            : {},
        url             : {},
        path            : {},
        size            : {},
        date            : {},
        directory       : {}
    }
});

