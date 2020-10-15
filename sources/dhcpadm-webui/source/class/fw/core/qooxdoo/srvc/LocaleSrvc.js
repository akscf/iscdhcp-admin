/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.srvc.LocaleSrvc", {
    type : "singleton",
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],

    construct: function () {
        this.base(arguments);
        this.__initComponents();
    },
    members: {

        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // private
        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        __initComponents: function () {
            var lng = fw.core.qooxdoo.commons.LocalStorage.getInstance().readData('lc');
            if(!lng) { lng = qx.core.Environment.get("webapp.env.preferred_locale"); }
            this.__applyLocale(lng ? lng : 'EN');
            //
            qx.event.message.Bus.subscribe('msg-locale-set', function (dataEvent) {
                var lng = dataEvent.getData();
                if (lng) this.__applyLocale(lng);
            }, this);
        },

        __applyLocale: function (lng) {
            qx.locale.Manager.getInstance().setLocale(lng.toLowerCase());
            fw.core.qooxdoo.commons.LocalStorage.getInstance().writeData('lc', lng);
        }
    }
});

