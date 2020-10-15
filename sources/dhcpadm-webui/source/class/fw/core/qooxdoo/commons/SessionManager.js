/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.commons.SessionManager", {
    type    : "singleton",
    extend  : qx.core.Object,

    construct: function () {
        this.base(arguments);
    },

    members: {
        __session: null,

        /**
         * through LoginSrvc
         */
        updateSession: function (session) {
            this.__session = session;
        },


        getSessionId: function () {
            return (this.__session ? this.__session['sessionId'] : null);
        },

        hasSessionProperties: function() {
            return (this.__session && this.__session['properties']);
        },

        getSessionProperty: function(propName, defaultValue) {
            if(this.hasSessionProperties()) {
                var x = this.__session.properties[propName];
                return (x == null ? defaultValue : x);
            }
            return defaultValue;
        }
    }
});

