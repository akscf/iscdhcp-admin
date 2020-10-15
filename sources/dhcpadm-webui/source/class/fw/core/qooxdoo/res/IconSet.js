/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.res.IconSet", {
    type : "static",
    statics: {
        ISET: {
            'stdLoginDialog'           : 'stdicons/16x16/admin-white-line.png',
            'stdErrorDialog'           : 'stdicons/16x16/alert-line-white.png',
            'stdInformationDialog'     : 'stdicons/16x16/information-white-line.png',
            'stdQuestionDialog'        : 'stdicons/16x16/question-white-line.png',
            'stdAppMenu'               : 'stdicons/16x16/menu.png',
            'stdCheck'                 : 'stdicons/16x16/check-line.png',
            'stdLogin'                 : 'stdicons/16x16/login-circle-line.png',
            'stdFilter'                : 'stdicons/16x16/filter-line.png',
            'stdSettings'              : 'stdicons/16x16/settings-5-fill.png',
            'stdEnable'                : 'stdicons/16x16/check-line.png',
            'stdDisable'               : 'stdicons/16x16/close-line.png',
            'stdLoginLocale'           : 'stdicons/22x13/translate-white2.png',
            'stdAxajIndicator'         : 'stdicons/anim/ajax-loader.gif',
            // -------------------------------------------------------------------------------------------
            // applicatin icons
            'server48'                  : 'dhcpadm/48x48/servers2-line.png',
            'logout48'                  : 'dhcpadm/48x48/poweron.png',
            'server64'                  : 'dhcpadm/64x64/server_r.png',
            'serverRunning64'           : 'dhcpadm/64x64/server_run.png',
            'serverStopped64'           : 'dhcpadm/64x64/server_stop.png',

            'refresh'                   : 'dhcpadm/16x16/refresh-line.png',
            'check'                     : 'dhcpadm/16x16/check-line.png',
            'add'                       : 'dhcpadm/16x16/add-line.png',
            'delete'                    : 'dhcpadm/16x16/delete-bin-2-line.png',
            'edit'                      : 'dhcpadm/16x16/edit-line.png',
            'undo'                      : 'dhcpadm/16x16/arrow-go-back-line.png',
            'search'                    : 'dhcpadm/16x16/search-2-line.png',
            'mediaPlay'                 : 'dhcpadm/16x16/play-mini-fill.png',
            'mediaStop'                 : 'dhcpadm/16x16/stop-mini-fill.png',
            'mediaRepeat'               : 'dhcpadm/16x16/repeat-2-fill.png',
            'mediaRestart'              : 'dhcpadm/16x16/eject-fill.png',
            'settings'                  : 'dhcpadm/16x16/settings-5-fill.png',
            'servers'                   : 'dhcpadm/16x16/server-fill.png',
            'magicWand'                 : 'dhcpadm/16x16/magic-fill.png',
            'info'                      : 'dhcpadm/16x16/information-line.png',
            'save'                      : 'dhcpadm/16x16/save2-3-fill.png',
            'restart'                   : 'dhcpadm/16x16/restart-line.png'
        },

        ICON: function (id) {
            var iset = this.ISET;
            if(iset.hasOwnProperty(id)) {
                return iset[id];
            }
            return null;
        },

        ADD: function (id, data) {
            this.ISET[id]= data;
            return data;
        }
    }
});
