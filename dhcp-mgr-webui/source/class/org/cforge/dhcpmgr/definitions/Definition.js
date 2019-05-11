/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.dhcpmgr.definitions.Definition", {
    extend: qx.core.Object,
    statics: {
        PAGE_SIZE         : 100,
        TIMESTAMP_FORMAT  : 'dd-MM-yyyy HH:mm:ss',
        TIMESTAMP_FORMAT2 : 'dd-MM-yyyy HH:mm',
        DATE_FORMAT       : 'dd-MM-yyyy',
        //=====================================================================================================================================================================================================================================================
        WORKPLACE_LIST: {
            'ADMIN':        {clazz: webapp.workplaces.AdministratorWorkplace},
            'VIEWER':       {clazz: webapp.workplaces.ViewerWorkplace}
        },
        SYSTEM_ROLES: function () {
            var res = qx.core.Init.getApplication().resourceGet('SYSTEM_ROLES');
            if (res) return res;
            return qx.core.Init.getApplication().resourceSet('SYSTEM_ROLES', [
                {description: qx.core.Init.getApplication().tr('Viewer'),           id: 'VIEWER', enableWorkplace: false},
                {description: qx.core.Init.getApplication().tr('Administrator'),    id: 'ADMIN', enableWorkplace: false}
            ]);
        },

        //=====================================================================================================================================================================================================================================================
        getSystemRoleDescription: function (id) {
            var res = org.cforge.dhcpmgr.definitions.Definition.SYSTEM_ROLES();
            switch (id) {
                case res[0].id:
                    return res[0].description;
                case res[1].id:
                    return res[1].description;
            }
            return id;
        }
    }
});


